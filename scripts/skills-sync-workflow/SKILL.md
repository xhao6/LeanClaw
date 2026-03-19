---
name: skills-sync-workflow
description: 将英文 Skills 文档翻译并改写为中文格式。用于：1) 用户说"翻译 Skills"、"同步 Skills"、"处理 Skills 文档"时；2) 用户提供一个或多个 md 文件要求翻译为中文；3) 用户提到"skills 改写"或"skills 翻译"。此工作流会读取英文 md 文件，使用大模型翻译为流畅中文，按固定格式输出，保存到 output 目录，用户确认后上传到云存储并添加数据库记录。使用此 skill 时必须严格按照步骤执行，不要跳过任何步骤。
---

# Skills 同步工作流

将英文 Skills 文档翻译并改写为中文格式的完整操作流程。

## 核心思路

```
用户输入 md 文件 → 大模型翻译改写 → 固定格式输出 → 用户确认 → 云存储 → 数据库记录
```

目的：将英文 Skills 文档优雅地翻译为中文，按统一格式输出，供 LeanClaw 小程序使用。

## 触发条件

当用户提到以下内容时，必须使用此 skill：
- "翻译 Skills"、"同步 Skills"、"处理 Skills 文档"
- 提供 md 文件要求翻译为中文
- "skills 改写"、"skills 翻译"
- "导入 Skills 到小程序"

## 操作步骤

### 步骤 1：环境检查

首先检查项目根目录的 `.env` 文件，确保配置正确：

| 变量名 | 说明 | 状态 |
|--------|------|------|
| `MODELSCOPE_API_KEY` | AI 翻译 API | 必需 |
| `CLOUDBASE_ENV_ID` | 环境 ID | 必需 |

如果未配置，提示用户在 `.env` 文件中配置。

### 步骤 2：读取输入文件

1. 用户提供一个或多个 md 文件路径
2. 使用 Read 工具读取所有文件内容
3. 验证文件格式是否为 Markdown

### 步骤 3：AI 翻译和改写（使用脚本）

**使用 AI 处理脚本**：

```bash
cd D:/MyWork/LeanMind/LeanClaw
node scripts/skills-sync-workflow/ai-process.js <输入Markdown文件> [输出Markdown文件]
```

**脚本位置**：`scripts/skills-sync-workflow/ai-process.js`

该脚本会：
1. 读取输入的 Markdown 文件
2. 调用 ModelScope API 进行 AI 翻译
3. 按照固定格式输出中文版本
4. 保存到 output 目录（默认）或指定路径

**翻译角色**：全栈技术文档工程师

**改写要求**：
1. 将英文内容优雅地翻译为流畅中文
2. 按照固定格式输出：

```
（H1）🌐网页 & 前端 Skills 合集

正文：

（H2）一键安装任意技能

（H3）使用 ClawHub CLI 快速安装

（代码块）
npx clawhub@latest install <skill-name>

（H2）Skills 合集

（H3）xian-sdk-skill

（正文）基于 Xian 区块链，使用 xian-py Python SDK 构建应用
```

3. 保持原有技术术语（如 CLI 命令、代码片段）英文不变
4. 确保命令示例准确可用

### 步骤 4：保存输出文件

1. 输出目录：`D:\MyWork\LeanMind\LeanClaw\scripts\skills-sync-workflow\output\`
2. 文件命名：使用原文件名，保留 .md 后缀
3. 如果有多个文件，逐个处理并保存

### 步骤 5：用户确认

向用户展示翻译改写后的内容，确认是否符合要求。

- 如果有问题：根据用户反馈修改
- 如果确认无误：继续步骤 6

### 步骤 6：上传到云存储

> **云存储配置**：
> - 存储桶：`6c65-leanmind-1gjtoa502716c21d-1410913126`
> - 资源目录：`/content/skills`

1. **生成文件名**：使用原文标题的 MD5 哈希值或保留原文件名
   - 例如：`web-frontend-skills-collection.md`

2. **使用 MCP 工具 `uploadFiles`** 上传 Markdown 文件：
   - **cloudPath**: `content/skills/<filename>.md`
   - **localPath**: 步骤 4 生成的 Markdown 文件路径

3. **获取访问 URL**：上传后会返回云存储临时 URL
   - 正确格式：`https://6c65-leanmind-1gjtoa502716c21d-1410913126.tcb.qcloud.la/content/skills/<filename>.md`

### 步骤 7：添加到数据库

使用 MCP 工具 `writeNoSqlDatabaseContent` 将记录插入数据库：

**集合名**：`resources`

**必需字段**：

| 字段 | 来源 | 示例 |
|------|------|------|
| `title` | 从 Markdown 第一行提取（去掉 emoji） | "网页 & 前端 Skills 合集" |
| `url` | 固定占位符 | "skills://local" |
| `markdownUrl` | 从步骤 6 获取 | "https://...tcb.qcloud.la/content/skills/..." |
| `image` | 固定占位图或留空 | "" |
| `type` | 固定值 | "skill" |
| `tags` | 从内容提取 | ["网页", "前端", "CLI"] |
| `desc` | 从内容摘要提取 | "Collection of web and frontend skills..." |
| `heat` | 固定值 | 0 |
| `source` | 固定值 | "skills-local" |

### 步骤 8：验证

告知用户：
1. 打开小程序发现页
2. 点击刚导入的 Skills 文档
3. 确认内容正常显示

## 错误处理

| 步骤 | 失败处理 |
|------|----------|
| 步骤 2 读取失败 | 提示用户检查文件路径是否正确 |
| 步骤 3 AI 失败 | 记录错误，提示用户检查 API 配置 |
| 步骤 4 保存失败 | 检查目录权限，确保 output 目录存在 |
| 步骤 6 上传失败 | 保存到本地，提示手动上传 |
| 步骤 7 插入失败 | 检查数据库权限，记录错误 |

## 关键约束

1. **用户确认后才上传**：必须等待用户确认翻译质量后再进行上传
2. **格式统一**：严格按照示例格式输出，保持一致性
3. **术语保留**：CLI 命令、技术术语保持英文原文
4. **内容完整**：翻译必须保留原文所有内容，不得删减

## 相关文件

| 文件 | 作用 |
|------|------|
| `scripts/skills-sync-workflow/ai-process.js` | AI 翻译处理脚本 |
| `scripts/skills-sync-workflow/config.js` | 配置文件 |
| `scripts/skills-sync-workflow/output/` | 输出目录 |
| `.env` | 环境变量 |
