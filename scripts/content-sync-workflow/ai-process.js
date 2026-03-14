/**
 * AI 内容处理脚本
 * 用于：读取 Markdown 文件 → AI 转换 → 输出干净的 Markdown（保留前6张内容图片）
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
 * 下载并保存缩略图到文件（用于上传到云存储）
 * @param {string} url - 图片 URL
 * @param {string} outputPath - 输出文件路径
 * @returns {Promise<string|null>} - 返回保存的文件路径，失败返回 null
 */
async function downloadThumbnail(url, outputPath) {
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
      console.log(`[缩略图] 无法识别图片类型，跳过: ${url}`)
      return null
    }

    // 转换为 WebP 格式并调整尺寸为缩略图 (400x400)
    const webpBuffer = await sharp(buffer)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer()

    // 确保输出目录存在
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(outputPath, webpBuffer)
    console.log(`[缩略图] 已保存: ${outputPath} (${(webpBuffer.length/1024).toFixed(1)}KB)`)
    return outputPath
  } catch (error) {
    console.log(`[缩略图] 下载/保存失败: ${url} - ${error.message}`)
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
 * @returns {Promise<{content: string, thumbnailUrl: string|null}>} - 返回处理后的内容和缩略图 URL
 */
async function embedImagesInMarkdown(content, imageUrls, keepCount = 6) {
  // 提取需要保留的图片 URL（默认保留前 6 张）
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

  // 返回处理后的内容 + 第一张保留的图片 URL 作为缩略图
  const thumbnailUrl = urlsToKeep.length > 0 ? urlsToKeep[0] : null
  return { content: result, thumbnailUrl }
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const SYSTEM_PROMPT = `你是一个HTML到Markdown的格式转换助手。你的唯一任务是把HTML格式转换为Markdown格式。

## 原始标题（仅作参考）
[ORIGINAL_TITLE]

## 转换规则（必须严格遵守）

### 1. 标题生成规则
- 根据文章内容生成一个简洁的中文标题
- **严格字数：12-20字，不能超过20字**
- 风格：不能标题党，要吸引人但客观
- 标题格式：# 你的标题（输出前务必数一下字数）

### 2. 内容保留原则
- 原文的每一个字都要保留
- 不要删除任何正文内容！即使是重复的句子也要保留
- 不要移除任何段落
- 整个文章内容必须100%完整保留

### 3. 图片处理规则
- 在提供的图片列表中，保留前3张内容图片（代码截图、流程图、效果展示等）
- 删除广告图片、装饰图片、无关图片（如 logo、图标、背景图等）
- 保留的图片在 Markdown 中用原始 URL 格式：![alt](图片URL)
- 删除的图片直接移除，不要保留任何痕迹

### 4. 格式转换规则
- 标题结构：# ## ### 保持不变
- 代码块：用三个反引号包裹
- 列表：保持原有结构
- **链接处理**：
  - 使用标准 Markdown 链接格式：[链接文本](URL)
  - **禁止拆分**：不要把一个链接拆分成「链接文本 URL」两段，链接文本和URL必须在一起
  - 移除链接的底色、背景色、样式
- 表格：保留原始表格结构
- **禁止强制拉伸**：不要在文字之间添加额外空格来拉伸行宽，保持文字紧凑
- **文字默认左对齐**：不要使用居中对齐、居右对齐，所有正文文字保持左对齐

### 5. 格式美化规则（非常重要）
- **链接保持完整**：链接文本和URL必须在一起形成完整链接，不要拆分
- **正文必须有 H1 标题**：正文开头必须有 # 标题（与 Front Matter 的 title 一致）
- **删除重复的 tags**：正文内容中绝对不能出现 "tags:" 这个词和标签列表（如 "- AI 助手"、"- 云端部署" 等）
- **清理多余加粗标记**：移除文章中滥用或无意义的 ** 标记，只保留真正需要强调的词汇（如术语、关键概念）
- **段落间距优化**：在段落之间保持合理的空行，使文章结构清晰
- **代码样式统一**：确保代码块语言标记正确（如 javascript、python 等）
- **列表缩进统一**：确保列表项缩进一致，使用 - 或 * 作为标记

### 6. 禁止事项
- 不要移除任何正文内容
- 不要重写句子
- 不要添加自己的解释
- 不要精简内容
- 不要总结或摘要
- 不要做标题党

### 7. 可以移除的内容
- 只移除明显的全屏广告弹窗
- 只移除独立的导航栏元素
- **CTA 推广信息**：移除文章末尾或中间的作者推广信息，包括但不限于：
  - "更多教程"、"欢迎查看"、"欢迎扫码"、"扫码关注"
  - "本人公众号"、"关注我"、"点击下方"
  - "加微信"、"添加好友"、"联系作者"
  - 微信公众号二维码图片及配文
  - 微信群、QQ群邀请链接及二维码
  - 商业推广、付费课程广告
  - "原创声明"、"版权所有"类声明（保留转载声明即可）

### 8. 标签生成规则
- 根据文章内容生成 2-4 个中文标签
- 标签要求：简洁、有区分度、用户容易理解
- 示例：["云部署", "企业微信", "入门教程", "飞书集成"]
- **重要**：所有标签必须使用中文！

## 输出顺序（必须严格遵守）

文章必须按照以下顺序输出：

1. **Front Matter** - 在文章最开头添加 YAML 格式的元信息（包含 title 和 tags）
2. **导读区块** - 直接开始导读内容
3. **正文内容** - 文章的详细内容（不要包含标题，标题已在 Front Matter 中）
4. **转载信息** - 在文章最后添加转载声明

### Front Matter 格式

在文章最开头添加：

---
title: 标题
tags:
  - 标签1
  - 标签2
  - 标签3
---

### 导读格式

Front Matter 之后直接开始导读：

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
 * 从 Markdown 内容中提取原始标题（仅用于参考，让AI生成新标题）
 */
function extractOriginalTitle(content) {
  // 尝试从 frontmatter 提取
  const titleMatch = content.match(/title:\s*(.+)/)
  if (titleMatch) return titleMatch[1].trim()

  // 尝试从第一行 H1 提取
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) return h1Match[1].trim()

  return ''
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
  // 提取原始标题作为参考，让 AI 生成新标题
  const originalTitle = extractOriginalTitle(content)
  const sourceName = extractSource(sourceUrl)

  // 将原始标题传给 AI，让它生成合适的新标题
  let systemPrompt = SYSTEM_PROMPT.replace(
    '[ORIGINAL_TITLE]',
    originalTitle || '（无原始标题）'
  )

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
  const maxLength = 32768  // Qwen3.5-397B 支持更长上下文
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
      max_tokens: 32768,  // Qwen3.5-397B 支持更长输出
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

  // AI 转换（AI 会自动生成合适的新标题和 tags）
  let result = await aiConvert(inputContent, sourceUrl, imageUrls)

  // 嵌入 base64 图片（保留前6张）
  if (imageUrls.length > 0) {
    const { content } = await embedImagesInMarkdown(result, imageUrls, 6)
    result = content
    console.log('[AI] 图片嵌入完成')
  }

  // 从 AI 返回的内容中提取 tags 和 title
  const tagsMatch = result.match(/^---\n[\s\S]*?tags:\n([\s\S]*?)^---/m)
  const titleMatch = result.match(/^---\ntitle:\s*(.+)/m)
  let tags = []
  let extractedTitle = ''
  if (tagsMatch && tagsMatch[1]) {
    tags = tagsMatch[1].split('\n').map(t => t.replace(/^-\s*/, '').trim()).filter(t => t && !t.startsWith('-'))
    console.log(`[AI] 提取到标签: ${tags.join(', ')}`)
    console.log(`::TAGS::${JSON.stringify(tags)}::`)
  }
  if (titleMatch) {
    extractedTitle = titleMatch[1].trim()
    console.log(`[AI] 提取到标题: ${extractedTitle}`)
  }

  // 移除 Front Matter 部分（只保留正文）
  const frontMatterMatch = result.match(/^---\n[\s\S]*?^---\n/m)
  if (frontMatterMatch) {
    result = result.replace(frontMatterMatch[0], '')
    console.log('[AI] 已移除 Front Matter')
  }

  // 在正文开头添加 H1 标题
  if (extractedTitle) {
    result = `# ${extractedTitle}\n\n${result}`
    console.log('[AI] 已添加 H1 标题到正文')
  }

  // 写入输出文件
  console.log(`[AI] 写入输出文件: ${outputFile}`)
  fs.writeFileSync(outputFile, result, 'utf-8')

  console.log('[AI] 处理完成!')
}

main()
