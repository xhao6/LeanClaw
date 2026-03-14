// Markdown 渲染工具模块
// 使用 markdown-it 解析 Markdown，支持代码高亮、表格等常用语法

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// 创建 markdown-it 实例，配置代码高亮
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    // 如果没有指定语言，使用默认处理
    if (!lang) {
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }

    try {
      // 使用 highlight.js 进行代码高亮
      const highlighted = hljs.highlight(str, {
        language: lang,
        ignoreIllegals: true
      }).value

      return `<pre class="hljs language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`
    } catch (e) {
      // 高亮失败时返回原始内容
      console.warn('Code highlighting failed:', e)
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
  }
})

/**
 * 渲染 Markdown 为 HTML
 * @param content Markdown 原文
 * @returns 渲染后的 HTML 字符串
 */
export const renderMarkdown = (content: string): string => {
  if (!content) return ''

  let rendered = md.render(content)

  // 修复图片路径：/images/days/ -> 云存储 URL
  const CLOUD_IMAGE_BASE = 'https://leanmind-1gjtoa502716c21d-1410913126.tcloudbaseapp.com/images'
  rendered = rendered.replace(/\/images\/days\//g, `${CLOUD_IMAGE_BASE}/days/`)

  // 添加样式类名
  rendered = applyStyles(rendered)

  return rendered
}

/**
 * 应用自定义样式到 HTML 元素
 * @param html 渲染后的 HTML
 * @returns 添加样式后的 HTML
 */
const applyStyles = (html: string): string => {
  let styled = html

  // 标题样式
  styled = styled.replace(/<h1>/g, '<h1 class="text-2xl font-bold mt-6 mb-4 text-primary">')
  styled = styled.replace(/<h2>/g, '<h2 class="text-xl font-bold mt-8 mb-4 text-gray-800 border-l-4 border-orange pl-3">')
  styled = styled.replace(/<h3>/g, '<h3 class="text-lg font-bold mt-6 mb-3 text-gray-800">')
  styled = styled.replace(/<h4>/g, '<h4 class="text-base font-bold mt-5 mb-2 text-gray-800">')

  // 段落样式
  styled = styled.replace(/<p>/g, '<p class="mb-4 text-gray-600 leading-7 text-justify">')

  // 列表样式
  styled = styled.replace(/<ul>/g, '<ul class="mb-4 pl-5 space-y-2 list-disc text-gray-600">')
  styled = styled.replace(/<ol>/g, '<ol class="mb-4 pl-5 space-y-2 list-decimal text-gray-600">')
  styled = styled.replace(/<li>/g, '<li class="pl-1">')

  // 引用块样式
  styled = styled.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-200 pl-4 py-2 my-4 bg-gray-50 text-gray-500 italic rounded-r-lg">')

  // 行内代码样式
  styled = styled.replace(/<code>/g, '<code class="bg-gray-100 text-orange px-1.5 py-0.5 rounded text-sm font-mono">')

  // 表格样式
  styled = styled.replace(/<table>/g, '<div class="overflow-x-auto my-4"><table class="w-full border-collapse text-sm text-left">')
  styled = styled.replace(/<\/table>/g, '</table></div>')
  styled = styled.replace(/<th>/g, '<th class="border-b border-gray-200 bg-gray-50 p-3 font-bold text-gray-700">')
  styled = styled.replace(/<td>/g, '<td class="border-b border-gray-100 p-3 text-gray-600">')
  styled = styled.replace(/<tr>/g, '<tr class="hover:bg-gray-50 transition-colors">')

  // 图片样式 - 使用 aspectFit 保持原始比例，避免拉伸
  styled = styled.replace(/<img/g, '<img class="w-full rounded-xl my-4 shadow-sm" mode="aspectFit" style="background-color: #f5f5f5;"')

  // 链接样式
  styled = styled.replace(/<a /g, '<a class="text-orange underline hover:text-orange-dark transition-colors" ')

  // 水平分割线
  styled = styled.replace(/<hr>/g, '<hr class="my-6 border-gray-200">')

  // 强调和加粗
  styled = styled.replace(/<strong>/g, '<strong class="font-bold text-gray-800">')
  styled = styled.replace(/<em>/g, '<em class="italic text-gray-600">')

  return styled
}

/**
 * 从 Front Matter 格式的 Markdown 中提取属性和内容
 * @param markdown 包含 Front Matter 的 Markdown 原文
 * @returns 包含 attributes 和 body 的对象
 */
export const parseFrontMatter = (markdown: string): { attributes: Record<string, any>; body: string } => {
  // 简单的 Front Matter 解析
  const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = markdown.match(fmRegex)

  if (!match) {
    return { attributes: {}, body: markdown }
  }

  const frontMatterStr = match[1]
  const body = match[2]

  // 解析 YAML 风格的属性（简化版）
  const attributes: Record<string, any> = {}
  const lines = frontMatterStr.split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()

      // 移除引号
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      attributes[key] = value
    }
  }

  return { attributes, body }
}

/**
 * 获取支持的代码语言列表
 */
export const getSupportedLanguages = (): string[] => {
  return hljs.listLanguages()
}

export default md
