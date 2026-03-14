import axios from 'axios'
import sharp from 'sharp'
import cloudbase from '@cloudbase/node-sdk'
import { config } from './config.js'
import crypto from 'crypto'

// 初始化 CloudBase
const app = cloudbase.init({
  env: config.cloudbase.envId,
  secretId: config.cloudbase.secretId,
  secretKey: config.cloudbase.secretKey
})

/**
 * 下载图片并压缩
 */
async function downloadAndCompress(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  })

  // 使用 sharp 压缩并转换为 WebP
  const buffer = await sharp(Buffer.from(response.data))
    .resize(config.image.width, null, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: config.image.quality })
    .toBuffer()

  return buffer
}

/**
 * 上传到 CloudBase 云存储
 */
async function uploadToCloudStorage(buffer, filename) {
  const cloudPath = config.hosting.imageDir + filename

  try {
    const result = await app.uploadFile({
      cloudPath,
      filePath: buffer
    })

    // 获取临时访问链接
    const tempUrl = await app.getTempFileURL({
      fileList: [result.fileID]
    })

    return tempUrl.fileList[0].tempFileURL
  } catch (error) {
    console.error('[ImageHandler] 上传失败:', error.message)
    throw error
  }
}

/**
 * 生成唯一文件名
 */
export function generateFilename(url) {
  const hash = crypto.createHash('md5').update(url).digest('hex')
  return `${hash}.webp`
}

/**
 * 下载并上传图片，返回 CDN URL
 */
export async function downloadAndUploadImage(url) {
  console.log(`[ImageHandler] 处理图片: ${url}`)

  try {
    const buffer = await downloadAndCompress(url)
    const filename = generateFilename(url)
    const cdnUrl = await uploadToCloudStorage(buffer, filename)

    console.log(`[ImageHandler] 上传成功: ${cdnUrl}`)
    return cdnUrl
  } catch (error) {
    console.error(`[ImageHandler] 处理图片失败: ${url}`, error.message)
    return null // 允许失败，不阻塞流程
  }
}

/**
 * 批量处理图片
 */
export async function processImages(imageUrls) {
  const results = {}

  for (const url of imageUrls) {
    try {
      const cdnUrl = await downloadAndUploadImage(url)
      if (cdnUrl) {
        results[url] = cdnUrl
      }
    } catch (error) {
      console.error(`[ImageHandler] 处理失败: ${url}`)
    }
  }

  return results
}
