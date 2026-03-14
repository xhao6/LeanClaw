# 内容同步脚本

将外部网页内容转换为 Markdown 并上传到 CloudBase 静态托管。

## 功能

- 网页爬取：使用 cheerio 解析 HTML，Puppeteer 作为降级方案
- 图片处理：下载图片 → WebP 压缩 → 上传到 CloudBase 云存储
- AI 转换：调用魔搭（ModelScope）API 将 HTML 转换为 Markdown
- 自动部署：上传 Markdown 文件到 CloudBase 静态托管

## 前置要求

1. 安装依赖：
```bash
cd scripts/sync-content
npm install
```

2. 配置环境变量，复制并填写 `.env.example`：
```bash
cp .env.example .env
```

必需的配置项：
- `MODELSCOPE_API_KEY` - 魔搭 API Key（用于 AI 转换）
- `CLOUDBASE_ENV_ID` - CloudBase 环境 ID
- `CLOUDBASE_SECRET_ID` - CloudBase Secret ID
- `CLOUDBASE_SECRET_KEY` - CloudBase Secret Key

## 使用方法

### 同步所有内容
```bash
npm run sync:content
```

### 开发模式（调试输出）
```bash
npm run sync:content:dev
```

## 工作流程

```
1. 获取资源列表（从数据库或 API）
2. 爬取网页 HTML
3. 提取并处理图片（下载、压缩、上传）
4. 替换 HTML 中的图片 URL
5. 调用 AI 将 HTML 转换为 Markdown
6. 上传 Markdown 文件到静态托管
7. 返回转换后的 URL
```

## 输出结果

脚本执行完成后，会输出每个资源的转换结果：
```json
[
  {
    "id": "resource-001",
    "title": "示例文章",
    "markdownUrl": "https://xxx.tcb.qcloud.com/xxx/resource-001.md",
    "imagesProcessed": 5
  }
]
```

## 前端集成

在资源数据中添加 `markdownUrl` 字段，发现页会优先使用转换后的 Markdown 内容：

```typescript
interface ResourceItem {
  id: string;
  title: string;
  markdownUrl?: string;  // 转换后的 Markdown URL
  url?: string;         // 原始 URL（降级使用）
}
```

## 测试

```bash
# 运行爬虫模块测试
npm run sync:test
```
