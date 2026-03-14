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

1. **进入项目根目录**（不是 scripts/sync-content 目录）
   ```bash
   cd D:/MyWork/LeanMind/LeanClaw
   ```

2. **确保依赖已安装**（固定使用项目根目录的 node_modules）
   ```bash
   npm install --prefix . openai axios cheerio puppeteer sharp dotenv turndown @cloudbase/node-sdk
   ```

   > **注意**：必须使用 `--prefix .` 参数，将依赖安装到项目根目录的 node_modules，而非 scripts/sync-content/node_modules。

3. **配置环境变量**

   项目根目录已有 `.env` 文件，确保配置正确：

   | 变量名 | 说明 | 获取方式 |
   |--------|------|----------|
   | `MODELSCOPE_API_KEY` | AI 转换 API（必需） | [ModelScope 官网](https://www.modelscope.cn/) → 个人中心 → API 密钥 |

   > **注意**：爬取或 AI 转换失败时，脚本会自动中断流程并退出。

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
cd D:/MyWork/LeanMind/LeanClaw
node scripts/sync-content/index.js
```

脚本会依次执行：
1. 爬取网页内容
2. 提取图片 URL → **暂停并提示手动上传**
3. 调用 AI 将 HTML 转换为 Markdown（失败则中断）
4. 上传 Markdown 到静态托管

**图片上传流程**：
- 脚本发现图片后，会显示需要上传的图片列表和目标路径
- 使用 MCP `uploadFiles` 工具手动上传图片到 `content/images/` 目录
- 上传完成后按回车继续

> **注意**：如果跳过图片上传，将使用原始图片 URL（小程序中可能无法显示外部图片）。

---

### 第四步：上传 Markdown 到 CloudBase

脚本会自动上传 Markdown 文件到静态托管。

> 脚本默认使用 MCP `uploadFiles` 工具上传，如果失败会保存到本地 `output/` 目录，需要手动上传。

---

### 第五步：更新数据库记录

将上传后的 Markdown URL 复制。

1. 打开 CloudBase 控制台 → 文档数据库 → resources 集合
2. 找到对应资源记录
3. 添加/更新 `markdownUrl` 字段，值为上传后的 URL
4. 保存

---

### 第六步：验证

重新打开小程序，发现页点击该资源，应该能流畅加载 Markdown 内容。

---

## 常见问题

### Q: 爬取失败怎么办？
- 检查目标网站是否需要登录
- 如需要，配置 `CRAWLER_COOKIE`
- 检查网络是否能访问目标网站

### Q: 图片显示不全怎么办？
- 图片使用原始 URL 可以正常显示
- 如需上传到云存储，使用 MCP `uploadFiles` 工具上传图片
- 上传后替换 Markdown 中的图片 URL 为云存储 URL

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
