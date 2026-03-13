# CloudBase 资源导入指南

本文档指导如何将新的学习资源导入到 LeanClaw 小程序，包括静态托管和数据库两个部分。

## 流程概览

```
1. 添加资源到原始数据源
2. 运行同步脚本生成 HTML
3. 部署到 CloudBase 静态托管
4. 导入数据到数据库
```

---

## 第一步：添加资源到原始数据源

资源定义文件位于：

```
D:\MyWork\resources\openclaw101\src\data\resources.ts
```

### 资源结构

```typescript
interface Resource {
  title: string      // 资源标题
  desc: string       // 资源描述
  url: string        // 资源原始 URL
  source: string     // 来源网站名称
  sourceIcon?: string // 来源图标（可选）
  lang: 'zh' | 'en'  // 语言：中文或英文
  category: string   // 分类：getting-started, tool, cloud-deploy, ai-edu 等
  featured?: boolean // 是否推荐
  tags?: string[]    // 标签数组
}
```

### 添加新资源示例

```typescript
{
  title: 'Git 教程',
  desc: '全面的 Git 学习教程',
  url: 'https://git-scm.com/book/zh/v2',
  source: 'Git官网',
  lang: 'zh',
  category: 'getting-started',
  featured: true,
  tags: ['git', '版本控制']
}
```

---

## 第二步：运行同步脚本生成 HTML

### 脚本位置

```
.worktrees/cloudbase-static-hosting/scripts/sync-resources/index.ts
```

### 运行命令

```bash
cd .worktrees/cloudbase-static-hosting
bun run scripts/sync-resources/index.ts
```

### 处理逻辑

1. **增量处理**：脚本使用 `content/manifest.json` 记录已处理资源，避免重复抓取
2. **状态跟踪**：
   - `pending` - 待处理
   - `processing` - 正在处理
   - `done` - 处理完成
   - `failed` - 处理失败

### 输出文件

处理后的 HTML 文件保存在：

```
.worktrees/cloudbase-static-hosting/content/processed/
```

文件命名规则：从原始 URL 生成 ID

```typescript
function generateId(url: string): string {
  return url
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .slice(0, 50)
}
```

例如：`https://git-scm.com/book/zh/v2` → `git-scm-com-book-zh-v2`

---

## 第三步：部署到 CloudBase 静态托管

### 部署 processed 目录

使用 `uploadFiles` 工具将 HTML 文件部署到 CloudBase：

```json
{
  "action": "upload",
  "localPath": "D:\\MyWork\\LeanClaw\\.worktrees\\cloudbase-static-hosting\\content\\processed",
  "cloudPath": "content/processed",
  "ignore": ["*.json", "*.txt"]
}
```

### 部署域名

静态托管访问地址：

```
https://leanmind-1gjtoa502716c21d-1410913126.tcloudbaseapp.com
```

### CDN 缓存说明

部署后 CDN 需要几分钟缓存时间。如需立即生效，可在 URL 后添加随机查询参数：

```
https://leanmind-1gjtoa502716c21d-1410913126.tcloudbaseapp.com/content/processed/xxx.html?_t=1234567890
```

---

## 第四步：导入数据到数据库

### 生成数据库记录

运行脚本生成数据库格式的数据：

```bash
bun run scripts/sync-resources/generate-db-data.ts
```

### 数据结构

```typescript
interface DbResource {
  id: string              // 资源唯一标识（从 URL 生成）
  url: string            // 原始 URL
  title: string          // 标题
  desc: string           // 描述
  source: string         // 来源
  tags: string[]         // 标签
  type: string           // 类型：video, tool, case, resource
  featured: boolean      // 是否推荐
  heat: number           // 热度值
}
```

### 类型映射规则

```typescript
function getType(url: string, category: string): string {
  const urlLower = url.toLowerCase()

  // 视频类：B站、YouTube
  if (urlLower.includes('bilibili.com') || urlLower.includes('youtube.com')) {
    return 'video'
  }

  // 工具类：GitHub
  if (urlLower.includes('github.com')) {
    return 'tool'
  }

  // 案例类：云部署服务商
  if (category === 'cloud-deploy' ||
      urlLower.includes('aliyun.com') ||
      urlLower.includes('tencent.com') ||
      urlLower.includes('aws.amazon.com')) {
    return 'case'
  }

  // 默认为资源
  return 'resource'
}
```

### 导入数据库

使用 `writeNoSqlDatabaseContent` 工具插入数据：

```json
{
  "action": "insert",
  "collectionName": "resources",
  "documents": [
    {
      "id": "git-scm-com-book-zh-v2",
      "url": "https://git-scm.com/book/zh/v2",
      "title": "Git 教程",
      "desc": "全面的 Git 学习教程",
      "source": "Git官网",
      "tags": ["getting-started"],
      "type": "resource",
      "featured": true,
      "heat": 0
    }
  ]
}
```

---

## 特别说明：外文资源导读

### 为什么要添加导读？

外文资源（如英文技术文章、教程）对于中文用户来说可能存在以下障碍：
- 语言理解困难
- 不知道文章核心内容是否值得阅读
- 缺乏背景知识

因此，对于 `lang: 'en'` 的资源，需要在 HTML 内容开头额外添加一篇 **200-500 字的中文导读**。

### 导读内容要求

1. **长度**：200-500 字
2. **内容应包含**：
   - 文章主题概述
   - 目标读者
   - 核心知识点
   - 学习建议
3. **风格**：客观、简洁、有帮助

### 实现方式

在 `index.ts` 脚本中，生成 HTML 时检测语言类型：

```typescript
function generateHtml(data: {
  title: string
  content: string
  source: string
  sourceUrl: string
  description?: string
  lang?: 'zh' | 'en'  // 新增语言字段
}): string {
  const { title, content, source, sourceUrl, description, lang } = data

  // 如果是外文资源，需要添加导读
  let introContent = ''
  if (lang === 'en') {
    introContent = generateIntro(title, content, sourceUrl)
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
...
<body>
  ${introContent ? `<div class="intro">${introContent}</div>` : ''}
  <div class="source-note">...</div>
  <div class="content">${content}</div>
</body>
</html>`
}
```

### 导读生成提示词

当 AI 运行时，可以使用以下提示词生成导读：

```
请阅读以下英文技术文章，生成一篇 200-500 字的中文导读，要求：
1. 概述文章主题和目标读者
2. 列出文章的核心知识点
3. 提供学习建议
4. 语言简洁、有帮助

文章标题：{title}
文章链接：{url}
文章内容：{content}
```

---

## 常见问题

### Q1: 如何只处理特定语言？

在 `index.ts` 中修改 `PROCESS_LANG` 变量：

```typescript
const PROCESS_LANG = 'zh'  // 只处理中文
// 或
const PROCESS_LANG = 'en'  // 只处理英文
```

### Q2: 如何重新处理失败的资源？

manifest.json 中状态为 `failed` 的资源会自动重新处理。也可以手动删除 manifest.json 重新处理所有资源。

### Q3: 如何查看已处理资源？

查看 `content/manifest.json` 文件，其中记录了所有资源的状态和处理时间。

### Q4: 资源 URL 变化了怎么办？

如果资源的原始 URL 发生变化，需要：
1. 删除旧的 HTML 文件
2. 删除 manifest.json 中对应的记录（或修改 URL 后重新处理）

---

## 相关文件索引

| 文件路径 | 说明 |
|---------|------|
| `D:\MyWork\resources\openclaw101\src\data\resources.ts` | 原始资源数据源 |
| `.worktrees/cloudbase-static-hosting/scripts/sync-resources/index.ts` | 主同步脚本 |
| `.worktrees/cloudbase-static-hosting/scripts/sync-resources/generate-db-data.ts` | 数据库数据生成脚本 |
| `.worktrees/cloudbase-static-hosting/content/manifest.json` | 处理状态清单 |
| `.worktrees/cloudbase-static-hosting/content/processed/` | 生成的 HTML 文件目录 |
| `LeanClaw/src/pages/webview/index.vue` | WebView 页面（加载静态托管内容） |
