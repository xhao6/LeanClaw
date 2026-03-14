import { crawlPage, extractImages } from './crawler.js'
import { convertHtmlToMarkdown, replaceImageUrls } from './aiConverter.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 测试单个 URL 的爬取和 AI 转换
 */
async function testSync(url) {
  console.log(`\n[Test] 开始测试: ${url}`)
  console.log('='.repeat(50))

  try {
    // 1. 爬取网页
    console.log('[Test] 步骤1: 爬取网页...')
    const { html, title } = await crawlPage(url)
    console.log(`[Test] 标题: ${title}`)
    console.log(`[Test] HTML 长度: ${html.length} 字符`)

    // 2. 提取图片
    console.log('\n[Test] 步骤2: 提取图片...')
    const imageUrls = extractImages(html, url)
    console.log(`[Test] 发现 ${imageUrls.length} 张图片`)
    if (imageUrls.length > 0) {
      console.log('[Test] 图片列表:')
      imageUrls.forEach((img, i) => console.log(`  ${i + 1}. ${img}`))
    }

    // 3. 替换图片 URL（这里不实际替换，因为没上传）
    console.log('\n[Test] 步骤3: 跳过图片上传（通过 MCP 处理）')
    const processedHtml = html // 保留原始图片 URL

    // 4. AI 转换
    console.log('\n[Test] 步骤4: AI 转换 HTML → Markdown...')
    const markdown = await convertHtmlToMarkdown(processedHtml)
    console.log(`[Test] Markdown 长度: ${markdown.length} 字符`)

    // 5. 保存到本地文件
    const outputDir = path.join(__dirname, 'output')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const filename = `test-${Date.now()}.md`
    const outputPath = path.join(outputDir, filename)
    fs.writeFileSync(outputPath, markdown, 'utf-8')
    console.log(`\n[Test] Markdown 已保存到: ${outputPath}`)

    // 6. 返回结果
    const result = {
      url,
      title,
      imageCount: imageUrls.length,
      imageUrls,
      markdownLength: markdown.length,
      outputFile: outputPath
    }

    console.log('\n' + '='.repeat(50))
    console.log('[Test] 测试完成!')
    console.log(JSON.stringify(result, null, 2))

    return result
  } catch (error) {
    console.error('\n[Test] 错误:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// 从命令行参数获取 URL
const url = process.argv[2]
if (!url) {
  console.error('用法: node test-sync.js <URL>')
  console.error('示例: node test-sync.js https://zhuanlan.zhihu.com/p/2009247841873331092')
  process.exit(1)
}

testSync(url)
