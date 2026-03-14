import cloudbase from '@cloudbase/node-sdk'
import fs from 'fs'
import path from 'path'
import { config } from './config.js'

const app = cloudbase.init({
  env: config.cloudbase.envId || 'leanmind-1gjtoa502716c21d',
  secretId: config.cloudbase.secretId,
  secretKey: config.cloudbase.secretKey
})

/**
 * 上传 Markdown 文件到静态托管
 */
export async function uploadMarkdown(content, filename) {
  const cloudPath = config.hosting.markdownDir + filename

  // 保存到本地文件
  const outputDir = path.join(process.cwd(), 'output')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const localPath = path.join(outputDir, filename)
  fs.writeFileSync(localPath, content, 'utf-8')
  console.log(`[Uploader] 已保存到本地: ${localPath}`)

  // 尝试上传
  try {
    const result = await app.uploadFile({
      cloudPath,
      filePath: fs.createReadStream(localPath)
    })
    console.log(`[Uploader] 上传成功: ${cloudPath}`)
    return cloudPath
  } catch (error) {
    console.error('[Uploader] 上传失败:', error.message)
    // 返回本地路径供参考
    return localPath
  }
}

/**
 * 获取静态托管的访问 URL
 */
export function getMarkdownUrl(filename) {
  const env = config.cloudbase.envId || 'leanmind-1gjtoa502716c21d'
  // 静态托管默认域名
  return `https://${env}-1410913126.tcb.qcloud.la${config.hosting.markdownDir}${filename}`
}
