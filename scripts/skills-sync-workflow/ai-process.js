/**
 * Skills 文档翻译改写脚本
 * 用于：读取英文 Markdown 文件 → AI 翻译改写 → 输出中文 Markdown（固定格式）
 *
 * 用法: node ai-process.js <输入文件> [输出文件]
 * 示例: node ai-process.js input.md
 *        node ai-process.js input.md output.md
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import OpenAI from 'openai'
import { config } from './config.js'

// ESM 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取 OpenAI 客户端
function getClient() {
  return new OpenAI({
    apiKey: config.modelscope.apiKey,
    baseURL: config.modelscope.baseURL
  })
}

/**
 * 从文件路径提取标题作为默认输出名
 */
function extractTitleFromFile(filePath) {
  const basename = path.basename(filePath, path.extname(filePath))
  // 移除非字母数字字符，用连字符分隔
  return basename
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
    .toLowerCase()
}

/**
 * 从 Markdown 内容中提取标题
 */
function extractTitle(content) {
  // 尝试从 frontmatter 提取
  const titleMatch = content.match(/title:\s*(.+)/)
  if (titleMatch) return titleMatch[1].trim()

  // 尝试从第一行 H1 提取
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) return h1Match[1].trim()

  return ''
}

/**
 * 从 Markdown 内容中提取描述/摘要
 */
function extractDesc(content) {
  // 跳过 frontmatter 和标题，从正文提取前几段作为描述
  let text = content

  // 移除 frontmatter
  text = text.replace(/^---[\s\S]*?^---/m, '')

  // 移除标题
  text = text.replace(/^#\s+.+$/m, '')

  // 移除代码块
  text = text.replace(/```[\s\S]*?```/g, '')

  // 移除链接格式
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  // 获取前 200 字符
  const firstText = text.replace(/^[\s\n]+/, '').substring(0, 200)

  return firstText.replace(/\n/g, ' ').trim()
}

/**
 * 从内容中提取标签
 */
function extractTags(content) {
  // 尝试从 frontmatter 的 tags 提取
  const tagsMatch = content.match(/tags:\s*\n((?:\s*-\s*.+\n?)+)/)
  if (tagsMatch && tagsMatch[1]) {
    return tagsMatch[1]
      .split('\n')
      .map(t => t.replace(/^-\s*/, '').trim())
      .filter(t => t)
  }

  // 或者从内容中出现的关键词提取
  const tagKeywords = [
    'web', 'frontend', 'javascript', 'typescript', 'react', 'vue',
    'api', 'database', 'cloud', 'ai', 'ml', 'mobile', 'backend',
    'python', 'node', 'rust', 'golang', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'cloudflare', 'vercel', 'netlify'
  ]

  const foundTags = []
  const lowerContent = content.toLowerCase()

  for (const keyword of tagKeywords) {
    if (lowerContent.includes(keyword) && !foundTags.includes(keyword)) {
      foundTags.push(keyword)
    }
    if (foundTags.length >= 3) break
  }

  return foundTags
}

// Skills 翻译改写的 System Prompt
const SYSTEM_PROMPT = `你是一位全栈技术文档工程师。你的任务是将英文 Skills 文档优雅地翻译为中文，并按照固定格式输出。

## 翻译要求

### 1. 标题格式
- 使用中文标题，但保留英文技术术语
- 保持标题简洁有信息量
- 标题前可添加适当的 emoji 图标增加可读性
- 示例：
  - "🧠 AI 与大模型 Skills"
  - "🌐 网页与前端 Skills"
  - "🛠️ 开发者工具 Skills"
- **禁止包含任何返回链接**，如 "[← 返回主列表](../README.md#table-of-contents)" 必须删除

### 2. 内容格式（必须严格遵守）

对于 Skills 列表，必须按照以下**层次结构**输出：

**每个技能的结构**：
1. **(H2) 技能名称** - 使用中文名称，如 "一键安装任意技能"
2. **(正文) 技能描述** - 翻译为流畅中文，描述技能功能
3. **(代码块) 安装命令** - 使用 npx clawhub@latest install <skill-name> 格式
4. **(H3) 技能名称** - 如果有子技能，列出子技能名称
5. **(正文) 子技能描述** - 子技能的描述

**示例格式**：
\`\`\`
## 🧠 AI 与大模型 Skills

### 一键安装任意技能
使用 ClawHub CLI 可以快速安装任意技能到你的项目中。

\`\`\`bash
npx clawhub@latest install <skill-name>
\`\`\`

### Skills 合集

#### xian-sdk-skill
基于 Xian 区块链，使用 xian-py Python SDK 构建应用。

\`\`\`bash
npx clawhub@latest install xian-sdk-skill
\`\`\`

#### agent-memory
面向 AI 代理的持久化记忆系统，让代理能够跨会话记住重要信息。

\`\`\`bash
npx clawhub@latest install agent-memory
\`\`\`
\`\`\`

### 3. 保留的内容
- **CLI 命令**：保持英文原文，如 npx clawhub@latest install <skill-name>
- **代码示例**：保持代码原文
- **技术术语**：如 SDK、API、CLI 等保持英文
- **仓库链接**：保持原文 URL

### 4. 翻译规则
- 技能描述翻译为流畅中文
- 命令和代码保持英文不变
- 确保命令格式正确可执行
- 保持原有目录结构

### 5. 禁止事项
- 不要添加原文没有的内容
- 不要删除任何技能信息
- 不要改变命令格式
- 不要添加个人解释

## 输出要求

直接输出 Markdown 内容，不要有任何前缀或解释。
输出必须是有效的 Markdown 格式。`

/**
 * AI 翻译改写
 */
async function aiTranslate(content) {
  // 限制输入长度，避免超出 token 限制
  const maxLength = 60000  // 保留足够空间给输出
  const truncatedContent = content.length > maxLength
    ? content.substring(0, maxLength) + '\n\n[内容过长，已截断]'
    : content

  try {
    console.log('[AI] 调用 ModelScope API 进行翻译...')
    const client = getClient()

    const response = await client.chat.completions.create({
      model: config.modelscope.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `请将以下英文 Skills 文档翻译为中文：\n\n${truncatedContent}` }
      ],
      temperature: 0.3,
      max_tokens: 32768,
      enable_thinking: false
    })

    const result = response.choices[0]?.message?.content?.trim()
    if (!result) {
      throw new Error('AI 返回为空')
    }

    console.log('[AI] 翻译完成')
    return result
  } catch (error) {
    console.error('[AI] AI 翻译失败:', error.message)
    process.exit(1)
  }
}

/**
 * 主函数
 */
async function main() {
  const inputFile = process.argv[2]
  const outputArg = process.argv[3]

  if (!inputFile) {
    console.error('用法: node ai-process.js <输入文件> [输出文件]')
    console.error('示例: node ai-process.js input.md')
    console.error('        node ai-process.js input.md output.md')
    process.exit(1)
  }

  // 检查文件是否存在
  if (!fs.existsSync(inputFile)) {
    console.error(`[错误] 输入文件不存在: ${inputFile}`)
    process.exit(1)
  }

  // 确定输出文件路径
  let outputFile = outputArg
  if (!outputFile) {
    // 默认输出到 output 目录
    const inputBasename = path.basename(inputFile)
    const outputDir = path.join(path.dirname(__filename), 'output')
    outputFile = path.join(outputDir, inputBasename)
  }

  // 确保输出目录存在
  const outputDir = path.dirname(outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 读取输入文件
  console.log(`[AI] 读取输入文件: ${inputFile}`)
  const inputContent = fs.readFileSync(inputFile, 'utf-8')

  // 提取标题作为参考
  const originalTitle = extractTitle(inputContent)
  console.log(`[AI] 原始标题: ${originalTitle || '(无)'}`)

  // AI 翻译改写
  const result = await aiTranslate(inputContent)

  // 写入输出文件
  console.log(`[AI] 写入输出文件: ${outputFile}`)
  fs.writeFileSync(outputFile, result, 'utf-8')

  console.log('[AI] 处理完成!')
  console.log(`[AI] 输出文件: ${outputFile}`)
}

main()
