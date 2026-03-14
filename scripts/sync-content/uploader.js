import cloudbase from '@cloudbase/node-sdk'
import { config } from './config.js'

const app = cloudbase.init({
  env: config.cloudbase.envId,
  secretId: config.cloudbase.secretId,
  secretKey: config.cloudbase.secretKey
})

/**
 * 上传 Markdown 文件到静态托管
 */
export async function uploadMarkdown(content, filename) {
  const cloudPath = config.hosting.markdownDir + filename

  // 创建临时文件
  const tempPath = `/tmp/${filename}`

  // 写入临时文件（Node.js 环境）
  const fs = await import('fs/promises')
  await fs.writeFile(tempPath, content, 'utf-8')

  try {
    const result = await app.uploadFile({
      cloudPath,
      filePath: tempPath
    })

    console.log(`[Uploader] 上传成功: ${cloudPath}`)
    return cloudPath
  } finally {
    // 清理临时文件
    await fs.unlink(tempPath).catch(() => {})
  }
}

/**
 * 获取静态托管的访问 URL
 */
export function getMarkdownUrl(filename) {
  const env = config.cloudbase.envId
  // 静态托管默认域名
  return `https://${env}-1410913126.tcb.qcloud.la${config.hosting.markdownDir}${filename}`
}
