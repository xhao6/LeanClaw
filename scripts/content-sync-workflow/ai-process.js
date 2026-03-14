/**
 * AI 内容处理脚本
 * 用于：读取 Markdown 文件 → AI 转换 → 输出干净的 Markdown（保留前3张内容图片）
 *
 * 用法: node ai-process.js <输入文件> <输出文件> [图片目录]
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import axios from 'axios'
import sharp from 'sharp'
import OpenAI from 'openai'
import { config } from './config.js'

// 获取 OpenAI 客户端
function getClient() {
  return new OpenAI({
    apiKey: config.modelscope.apiKey,
    baseURL: config.modelscope.baseURL
  })
}

/**
 * 从 Markdown 内容中提取所有图片 URL
 */
function extractImageUrls(content) {
  const urls = []
  // Markdown 图片格式 ![alt](url)
  const mdMatches = content.matchAll(/!\[.*?\]\((.*?)\)/g)
  for (const match of mdMatches) {
    urls.push(match[1])
  }
  // HTML 图片格式 <img src="url">
  const htmlMatches = content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)
  for (const match of htmlMatches) {
    urls.push(match[1])
  }
  return [...new Set(urls)] // 去重
}

/**
 * 下载图片并转为 WebP base64
 */
async function downloadImageAsBase64(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    // 检测图片类型
    const buffer = Buffer.from(response.data)
    const originalMimeType = getMimeType(buffer)
    if (!originalMimeType) {
      console.log(`[图片] 无法识别图片类型，跳过: ${url}`)
      return null
    }

    // 转换为 WebP 格式
    const originalSize = buffer.length
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer()

    const webpSize = webpBuffer.length
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1)

    const base64 = `data:image/webp;base64,${webpBuffer.toString('base64')}`
    console.log(`[图片] 下载成功: ${url.substring(0, 40)}... → WebP 节省 ${savings}% (${(originalSize/1024).toFixed(1)}KB → ${(webpSize/1024).toFixed(1)}KB)`)
    return base64
  } catch (error) {
    console.log(`[图片] 下载/转换失败: ${url} - ${error.message}`)
    return null
  }
}

/**
 * 通过文件头检测图片 MIME 类型
 */
function getMimeType(buffer) {
  const signatures = {
    '89504E47': 'image/png',
    '47494638': 'image/gif',
    '25504446': 'image/pdf',
    'FFD8FF': 'image/jpeg',
    '504B0304': 'image/webp' // 也可能是 zip，但 webp 通常以这个开头
  }

  const hex = buffer.slice(0, 4).toString('hex').toUpperCase()

  for (const [sig, mime] of Object.entries(signatures)) {
    if (hex.startsWith(sig)) {
      return mime
    }
  }

  // 额外检查 JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    return 'image/jpeg'
  }

  return null
}

/**
 * 将 base64 图片嵌入 Markdown
 */
async function embedImagesInMarkdown(content, imageUrls, keepCount = 6) {
  // 提取需要保留的图片 URL（前 keepCount 张）
  const urlsToKeep = imageUrls.slice(0, keepCount)

  console.log(`[图片] 准备保留 ${urlsToKeep.length} 张图片`)
  console.log(`[图片] 正在下载并嵌入 base64...`)

  // 下载所有需要保留的图片
  const base64Map = {}
  for (const url of urlsToKeep) {
    const base64 = await downloadImageAsBase64(url)
    if (base64) {
      base64Map[url] = base64
    }
  }

  // 替换 Markdown 中的图片链接
  let result = content

  // 替换保留的图片为 base64
  for (const [url, base64] of Object.entries(base64Map)) {
    // 替换 Markdown 图片格式
    result = result.replace(new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegex(url)}\\)`, 'g'), `![$1](${base64})`)
    // 替换 HTML 图片格式
    result = result.replace(new RegExp(`<img([^>]*)src=["']${escapeRegex(url)}["']`, 'gi'), `<img$1src="${base64}"`)
  }

  // 删除不在保留列表中的图片
  // 先获取所有图片 URL
  const allImageUrls = extractImageUrls(content)
  for (const url of allImageUrls) {
    if (!base64Map[url]) {
      // 移除 Markdown 图片格式
      result = result.replace(new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegex(url)}\\)`, 'g'), '')
      // 移除 HTML 图片格式
      result = result.replace(new RegExp(`<img[^>]*src=["']${escapeRegex(url)}["'][^>]*>`, 'gi'), '')
    }
  }

  return result
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const SYSTEM_PROMPT = `你是一个HTML到Markdown的格式转换助手。你的唯一任务是把HTML格式转换为Markdown格式。

## 原始文章标题
[TITLE_PLACEHOLDER]

## 转换规则（必须严格遵守）

### 1. 内容保留原则
- 原文的每一个字都要保留
- 不要删除任何正文内容！即使是重复的句子也要保留
- 不要移除任何段落
- 整个文章内容必须100%完整保留

### 2. 图片处理规则
- 在提供的图片列表中，保留前3张内容图片（代码截图、流程图、效果展示等）
- 删除广告图片、装饰图片、无关图片（如 logo、图标、背景图等）
- 保留的图片在 Markdown 中用原始 URL 格式：![alt](图片URL)
- 删除的图片直接移除，不要保留任何痕迹

### 3. 格式转换规则
- 标题结构：# ## ### 保持不变
- 代码块：用三个反引号包裹
- 列表：保持原有结构
- 链接：保留，只保留文字描述
- 表格：保留原始表格结构

### 4. 禁止事项
- 不要移除任何正文内容
- 不要重写句子
- 不要添加自己的解释
- 不要精简内容
- 不要总结或摘要

### 5. 可以移除的内容
- 只移除明显的全屏广告弹窗
- 只移除独立的导航栏元素

## 输出顺序（必须严格遵守）

文章必须按照以下顺序输出：

1. **H1 标题** - 文章的主标题（# 标题）
2. **导读区块** - 在 H1 标题后面紧跟导读
3. **正文内容** - 文章的详细内容
4. **转载信息** - 在文章最后添加转载声明

### 导读格式

在 H1 标题后面立即添加导读，不要换行：

# 标题内容
<div style="border: 2px solid #4CAF50; border-radius: 8px; padding: 12px; margin: 12px 0; background: #f9f9f9;">

**📖轻学龙虾导读**：[100字左右的导读内容]

</div>

正文内容...

### 转载信息格式

在文章最后添加转载信息：

---
**转载声明**
- 原文链接：[原始URL]
- 转载出处：[网站名称]

请直接输出Markdown内容，不要有任何前缀或解释。`

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

  return '未命名文章'
}

/**
 * 从 URL 提取来源域名
 */
function extractSource(url) {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return '未知来源'
  }
}

/**
 * AI 转换
 */
async function aiConvert(content, sourceUrl = '', imageUrls = []) {
  const title = extractTitle(content)
  const sourceName = extractSource(sourceUrl)

  let systemPrompt = SYSTEM_PROMPT.replace('[TITLE_PLACEHOLDER]', title)

  // 如果有图片，提供图片列表给 AI
  if (imageUrls.length > 0) {
    const imageList = imageUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')
    systemPrompt = systemPrompt.replace(
      '## 转换规则（必须严格遵守）',
      `## 图片列表（按顺序编号）

以下是文章中出现的所有图片 URL，按出现顺序编号：

${imageList}

## 转换规则（必须严格遵守）`
    )
  }

  // 限制输入长度，避免超出 token 限制
  const maxLength = 15000
  const truncatedContent = content.length > maxLength
    ? content.substring(0, maxLength) + '\n\n[内容过长，已截断...]'
    : content

  try {
    console.log('[AI] 调用 ModelScope API...')
    console.log(`[AI] 文章包含 ${imageUrls.length} 张图片`)
    const client = getClient()

    const response = await client.chat.completions.create({
      model: config.modelscope.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请将以下Markdown内容转换为干净的Markdown格式：\n\n${truncatedContent}` }
      ],
      temperature: 0.3,
      max_tokens: 8000,
      enable_thinking: false
    })

    const result = response.choices[0]?.message?.content?.trim()
    if (!result) {
      throw new Error('AI 返回为空')
    }

    console.log('[AI] AI 转换成功')
    return result
  } catch (error) {
    console.error('[AI] AI 转换失败:', error.message)
    process.exit(1)
  }
}

/**
 * 主函数
 */
async function main() {
  const inputFile = process.argv[2]
  const outputFile = process.argv[3]

  if (!inputFile || !outputFile) {
    console.error('用法: node ai-process.js <输入文件> <输出文件>')
    console.error('示例: node ai-process.js input.md output.md')
    process.exit(1)
  }

  // 检查文件是否存在
  if (!fs.existsSync(inputFile)) {
    console.error(`[错误] 输入文件不存在: ${inputFile}`)
    process.exit(1)
  }

  // 读取输入文件
  console.log(`[AI] 读取输入文件: ${inputFile}`)
  const inputContent = fs.readFileSync(inputFile, 'utf-8')

  // 从 frontmatter 提取原始 URL
  const urlMatch = inputContent.match(/url:\s*(.+)/)
  const sourceUrl = urlMatch ? urlMatch[1].trim() : ''

  // 提取图片 URL
  const imageUrls = extractImageUrls(inputContent)
  console.log(`[AI] 发现 ${imageUrls.length} 张图片`)

  // AI 转换
  let result = await aiConvert(inputContent, sourceUrl, imageUrls)

  // 嵌入 base64 图片（保留前3张）
  if (imageUrls.length > 0) {
    result = await embedImagesInMarkdown(result, imageUrls, 6)
    console.log('[AI] 图片嵌入完成')
  }

  // 写入输出文件
  console.log(`[AI] 写入输出文件: ${outputFile}`)
  fs.writeFileSync(outputFile, result, 'utf-8')

  console.log('[AI] 处理完成!')
}

main()
