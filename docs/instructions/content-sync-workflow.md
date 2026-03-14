# 内容同步工作流

将外部网页内容导入到小程序数据库的完整操作指南。

## 核心思路

```
外部URL → 爬取 → AI转换Markdown → 静态托管 → 数据库记录
```

目的：避免小程序 webview 加载外部网页时的风险提示，实现流畅阅读体验。

---

## 操作步骤

### 第一步：环境准备

1. **进入脚本目录**
   ```bash
   cd scripts/sync-content
   ```

2. **确保依赖已安装**
   ```bash
   npm install
   ```

3. **配置环境变量**

   复制 `.env.example` 为 `.env`，填写以下内容：

   | 变量名 | 说明 | 获取方式 |
   |--------|------|----------|
   | `MODELSCOPE_API_KEY` | AI 转换 API | [ModelScope 官网](https://www.modelscope.cn/) → 个人中心 → API 密钥 |
   | `CLOUDBASE_ENV_ID` | 云开发环境 ID | CloudBase 控制台 → 环境概览 |
   | `CLOUDBASE_SECRET_ID` | Secret ID | CloudBase 控制台 → 环境设置 → API 密钥 |
   | `CLOUDBASE_SECRET_KEY` | Secret Key | 同上 |
   | `CRAWLER_COOKIE` | 爬虫 Cookie（可选） | 登录目标网站后，从开发者工具 Network 面板复制 |

---

### 第二步：获取要导入的 URL

在发现页点击任意资源卡片，获取原始 URL。

例如：
```
https://zhuanlan.zhihu.com/p/xxxxxxxx
```

---

### 第三步：运行同步脚本

```bash
npm run sync:content
```

脚本会依次执行：
1. 爬取网页内容
2. 下载并处理图片（压缩为 WebP）
3. 调用 AI 将 HTML 转换为 Markdown
   - 在标题后自动添加**导读区块**（约100字，介绍背景和主要观点）
   - 在文章末尾自动添加**转载出处**（原文链接 + 来源网站）
4. 上传到 CloudBase 静态托管

---

### 第四步：更新数据库记录

脚本执行完成后，会输出类似：

```json
{
  "id": "resource-xxx",
  "markdownUrl": "https://xxx.tcb.qcloud.com/content/xxx.md"
}
```

将返回的 `markdownUrl` 复制。

1. 打开 CloudBase 控制台 → 文档数据库 → resources 集合
2. 找到对应资源记录
3. 添加/更新 `markdownUrl` 字段，值为上一步复制的 URL
4. 保存

---

### 第五步：验证

重新打开小程序，发现页点击该资源，应该能流畅加载 Markdown 内容。

---

## 常见问题

### Q: 爬取失败怎么办？
- 检查目标网站是否需要登录
- 如需要，配置 `CRAWLER_COOKIE`
- 检查网络是否能访问目标网站

### Q: 图片显示不全怎么办？
- 检查图片 URL 是否正确
- 确认图片已上传到云存储

### Q: 转换质量不好怎么办？
- 可以调整 `aiConverter.js` 中的 prompt
- 或更换其他 AI 模型

### Q: 如何批量导入？
- 修改 `sync.js` 中的 URL 列表
- 或从数据库读取资源列表批量处理

---

## 相关文件

| 文件 | 作用 |
|------|------|
| `scripts/sync-content/` | 同步脚本目录 |
| `src/pages/webview/index.vue` | Markdown 渲染页面 |
| `src/pages/discover/index.vue` | 发现页（点击逻辑） |
