import OpenAI from 'openai'
import TurndownService from 'turndown'
import { config } from './config.js'

// 懒加载 OpenAI 客户端
let client = null

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: config.modelscope.apiKey,
      baseURL: config.modelscope.baseURL
    })
  }
  return client
}

// 初始化 Turndown（HTML 转 Markdown）
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
})

// 自定义规则：保留图片
turndownService.addRule('images', {
  filter: 'img',
  replacement: (content, node) => {
    const alt = node.alt || ''
    const src = node.src || ''
    return `![${alt}](${src})`
  }
})

const SYSTEM_PROMPT = `你是一个专业的技术文章整理助手。请将以下HTML内容转换为干净的Markdown格式。

要求：
1. 保留标题结构（# ## ###）
2. 保留代码块（用\`\`\`包裹）
3. 保留图片（用![描述](URL)格式）
4. 移除广告、导航栏、页脚等无关内容
5. 代码块保留原始缩进
6. 列表保持原有结构
7. 链接保留，只保留文字描述

## 重要：添加导读和出处

在文章标题后面，必须添加一个导读区块，格式如下：

> 📖 **导读**
> [约100字的导读内容，介绍背景、主要观点，吸引读者继续阅读]

在文章最后，必须添加转载信息，格式如下：

---
**转载声明**
- 原文链接：[原始URL]
- 转载出处：[网站名称]
- 版权声明：本文为转载内容，著作权归原作者所有

请直接输出Markdown内容，不要有任何前缀或解释。`

/**
 * 使用 Turndown 基础转换
 */
export function basicConvert(html) {
  return turndownService.turndown(html)
}

/**
 * 使用 AI 优化 Markdown
 * @param {string} html - HTML 内容
 * @param {string} sourceUrl - 原始 URL（用于转载出处）
 * @param {string} sourceName - 来源网站名称
 */
async function aiOptimize(html, sourceUrl = '', sourceName = '') {
  try {
    console.log('[AIConverter] 调用魔搭 API...')

    // 构建用户提示，包含原始 URL 和来源信息
    let userPrompt = `请将以下HTML内容转换为Markdown：\n\n${html.substring(0, 15000)}`

    if (sourceUrl) {
      userPrompt += `\n\n原始URL：${sourceUrl}`
    }
    if (sourceName) {
      userPrompt += `\n来源网站：${sourceName}`
    }

    const response = await getClient().chat.completions.create({
      model: config.modelscope.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 8000,
      enable_thinking: config.modelscope.enableThinking || false
    })

    const markdown = response.choices[0]?.message?.content?.trim()

    if (!markdown) {
      throw new Error('AI 返回为空')
    }

    console.log('[AIConverter] AI 转换成功')
    return markdown
  } catch (error) {
    console.error('[AIConverter] AI 转换失败，改用基础转换:', error.message)
    return basicConvert(html)
  }
}

/**
 * 主入口：HTML 转 Markdown
 * @param {string} html - HTML 内容
 * @param {string} sourceUrl - 原始 URL（用于转载出处）
 * @param {string} sourceName - 来源网站名称（可选，默认从 URL 提取）
 */
export async function convertHtmlToMarkdown(html, sourceUrl = '', sourceName = '') {
  if (!html || html.trim().length === 0) {
    return ''
  }

  // 清理 HTML（移除多余空白）
  html = html.replace(/\s+/g, ' ').trim()

  // 自动提取来源名称
  if (!sourceName && sourceUrl) {
    try {
      const urlObj = new URL(sourceUrl)
      sourceName = urlObj.hostname.replace('www.', '')
    } catch (e) {
      sourceName = '未知来源'
    }
  }

  // 优先使用 AI 转换
  return await aiOptimize(html, sourceUrl, sourceName)
}

/**
 * 替换 HTML 中的图片 URL
 */
export function replaceImageUrls(html, urlMapping) {
  let result = html

  for (const [originalUrl, newUrl] of Object.entries(urlMapping)) {
    // 处理多种 URL 格式
    result = result.replace(new RegExp(escapeRegExp(originalUrl), 'g'), newUrl)
  }

  return result
}

// 转义正则特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
