import { crawlPage, extractImages } from './crawler.js'
import { processImages, downloadAndUploadImage } from './imageHandler.js'
import { convertHtmlToMarkdown, replaceImageUrls } from './aiConverter.js'
import { uploadMarkdown, getMarkdownUrl } from './uploader.js'

// 模拟：读取资源列表（实际应从数据库或 API 获取）
async function getResourceList() {
  // 这里应该从 LeanClaw 的资源数据源获取
  // 暂时硬编码示例
  return [
    {
      id: 'b96a304769b3d62a00022e030045edd8',
      url: 'https://cloud.tencent.com/developer/article/2625073',
      title: '腾讯云 — OpenClaw 接入飞书保姆级教程'
    },
    {
      id: 'b96a304769b3d62a00022e026c54a629',
      url: 'https://help.aliyun.com/zh/simple-application-server/use-cases/openclaw-faq',
      title: '阿里云 — OpenClaw 常见问题文档'
    },
    {
      id: 'b96a304769b3d62a00022e052495a563',
      url: 'https://apifox.com/apiskills/openclaw-installation-and-usage-guide/',
      title: 'OpenClaw 下载安装使用 — 详细图文教程'
    }
  ]
}

/**
 * 处理单个资源
 */
async function processResource(resource) {
  console.log(`\n[Main] 开始处理: ${resource.title}`)

  // 1. 爬取网页
  console.log('[Main] 步骤1: 爬取网页...')
  const { html, title } = await crawlPage(resource.url)

  // 2. 提取并处理图片
  console.log('[Main] 步骤2: 处理图片...')
  const imageUrls = extractImages(html, resource.url)
  console.log(`[Main] 发现 ${imageUrls.length} 张图片`)

  const imageMapping = {}
  for (const url of imageUrls) {
    const cdnUrl = await downloadAndUploadImage(url)
    if (cdnUrl) {
      imageMapping[url] = cdnUrl
    }
  }

  // 3. 替换 HTML 中的图片 URL
  console.log('[Main] 步骤3: 替换图片 URL...')
  const processedHtml = replaceImageUrls(html, imageMapping)

  // 4. AI 转换
  console.log('[Main] 步骤4: AI 转换...')
  const markdown = await convertHtmlToMarkdown(processedHtml, resource.url, '', resource.title)

  // 5. 上传
  console.log('[Main] 步骤5: 上传到静态托管...')
  const filename = `${resource.id}.md`
  await uploadMarkdown(markdown, filename)

  // 6. 返回结果
  const result = {
    id: resource.id,
    title: resource.title,
    markdownUrl: getMarkdownUrl(filename),
    imagesProcessed: Object.keys(imageMapping).length
  }

  console.log(`[Main] 处理完成: ${result.markdownUrl}`)
  return result
}

/**
 * 主函数
 */
async function main() {
  console.log('[Main] 开始同步内容...')

  try {
    // 获取资源列表
    const resources = await getResourceList()
    console.log(`[Main] 共 ${resources.length} 个资源待处理`)

    // 处理每个资源
    const results = []
    for (const resource of resources) {
      try {
        const result = await processResource(resource)
        results.push(result)
      } catch (error) {
        console.error(`[Main] 处理失败: ${resource.title}`, error.message)
      }
    }

    console.log(`\n[Main] 完成！成功 ${results.length}/${resources.length}`)

    // 输出结果（可保存到文件供后续使用）
    console.log('\n结果:')
    console.log(JSON.stringify(results, null, 2))
  } catch (error) {
    console.error('[Main] 错误:', error)
    process.exit(1)
  }
}

// 运行
main()
