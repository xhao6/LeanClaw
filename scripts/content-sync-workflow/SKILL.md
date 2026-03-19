---
name: content-sync-workflow
description: 将外部网页内容同步到 LeanClaw 小程序数据库。用于：1) 用户说"同步文章"、"导入内容"、"抓取网页"时；2) 用户说"运行内容同步脚本"；3) 用户提供 URL 要求转换为 Markdown 并导入小程序。此工作流会自动处理爬取→AI转换→云存储→数据库记录的全流程。使用此 skill 时必须严格按照步骤执行，不要跳过任何步骤。
---

# 内容同步工作流

将外部网页内容导入到 LeanClaw 小程序数据库的完整操作流程。

## 核心思路

```
外部URL → baoyu-url-to-markdown 抓取 → AI过滤无关内容 → 云存储 → 数据库记录
```

目的：避免小程序 webview 加载外部网页时的风险提示，实现流畅阅读体验。

## 触发条件

当用户提到以下内容时，必须使用此 skill：
- "同步文章"、"导入内容"、"抓取网页"
- "运行内容同步脚本"
- 提供 URL 要求转换为 Markdown
- "内容同步"

## 操作步骤

### 步骤 1：环境检查

首先检查项目根目录的 `.env` 文件，确保配置正确：

| 变量名 | 说明 | 状态 |
|--------|------|------|
| `MODELSCOPE_API_KEY` | AI 转换 API | 必需 |
| `CLOUDBASE_ENV_ID` | 环境 ID | 必需 |

如果未配置，提示用户在 `.env` 文件中配置。

### 步骤 2：抓取网页内容

**必须使用 baoyu-url-to-markdown skill 抓取网页**

使用 Skill 工具调用 `baoyu-url-to-markdown` skill：

1. **步骤 2.1**: 调用 `baoyu-url-to-markdown` skill，传入目标 URL
2. **步骤 2.2**: skill 会自动使用 Chrome CDP 抓取网页并转换为 Markdown
3. **步骤 2.3**: 获取输出的 Markdown 文件路径

> 参考命令：
> ```
> 使用 Skill 工具调用 baoyu-url-to-markdown，传入 URL 参数
> ```

### 步骤 3：AI 过滤无关内容

**运行 AI 处理脚本**：

```bash
cd D:/MyWork/LeanMind/LeanClaw
node scripts/content-sync-workflow/ai-process.js <输入Markdown文件> <输出Markdown文件>
```

**脚本位置**：`scripts/content-sync-workflow/ai-process.js`

该脚本会：
1. 读取步骤 2 生成的 Markdown 文件
2. 调用 ModelScope API 进行 AI 转换
3. 删除所有图片
4. 保留原文所有内容
5. 添加导读和转载信息
6. 保存到输出文件

### 步骤 4：上传到云存储

> **云存储配置**：
> - 存储桶：`6c65-leanmind-1gjtoa502716c21d-1410913126`
> - 资源目录：`/content/markdown`

1. **生成文件名**：使用 URL 的 MD5 哈希值作为文件名
   - 例如：`cloud-tencent-com-developer-article-2625147.md`

2. **使用 MCP 工具 `uploadFiles`** 上传 Markdown 文件：
   - **cloudPath**: `content/markdown/<文件名>.md`
   - **localPath**: 步骤 3 生成的 Markdown 文件路径

3. **获取访问 URL**：上传后会返回云存储临时 URL
   - 正确格式：`https://6c65-leanmind-1gjtoa502716c21d-1410913126.tcb.qcloud.la/content/markdown/<filename>.md`

### 步骤 5：添加到数据库

使用 MCP 工具 `writeNoSqlDatabaseContent` 将记录插入数据库：

**集合名**：`resources`

**必需字段**：

| 字段 | 来源 | 示例 |
|------|------|------|
| `title` | 从 Markdown 第一行提取 | "腾讯云 — OpenClaw 接入企业微信完全指南" |
| `url` | 用户提供的原始 URL | "https://cloud.tencent.com/..." |
| `markdownUrl` | 从步骤 4 获取 | "https://...tcb.qcloud.la/content/..." |
| `type` | 固定值 | "resource" |
| `tags` | 人工指定 | ["cloud-deploy", "wework"] |
| `desc` | 从文章摘要提取，AI 导读可用 | "详细讲解如何将 OpenClaw..." |
| `heat` | 固定值 | 0 |
| `source` | 从 URL 提取域名 | "cloud.tencent.com" |

### 步骤 6：验证

告知用户：
1. 打开小程序发现页
2. 点击刚导入的文章
3. 确认 Markdown 内容正常显示

## 错误处理

| 步骤 | 失败处理 |
|------|----------|
| 步骤 2 抓取失败 | 提示用户检查 URL 是否正确、是否需要登录 |
| 步骤 3 AI 失败 | 记录错误，人工处理或使用基础转换 |
| 步骤 4 上传失败 | 保存到本地 output/ 目录，提示手动上传 |
| 步骤 5 插入失败 | 检查数据库权限，记录错误 |

## 关键约束

1. **AI 转换失败则中断**：如果 AI 转换失败，工作流停止（除非配置降级处理）
2. **内容保留**：AI 转换必须保留原文所有内容，不得删减
3. **图片处理**：AI 转换时自动删除所有图片

## 相关文件

| 文件 | 作用 |
|------|------|
| `scripts/content-sync-workflow/ai-process.js` | AI 处理脚本 |
| `scripts/content-sync-workflow/config.js` | 配置文件 |
| `scripts/sync-content/aiConverter.js` | AI 转换核心逻辑（参考） |
| `.env` | 环境变量 |
