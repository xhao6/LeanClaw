import axios from 'axios'
import sharp from 'sharp'
import cloudbase from '@cloudbase/node-sdk'
import { config } from './config.js'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { createReadStream } from 'fs'

// 初始化 CloudBase
const app = cloudbase.init({
  env: config.cloudbase.envId || 'leanmind-1gjtoa502716c21d',
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
 * 上传到 CloudBase 云存储（暂时跳过，使用原始 URL）
 * TODO: 后续使用 MCP uploadFiles 工具上传
 */
async function uploadToCloudStorage(buffer, filename) {
  // 暂时返回 null，表示跳过图片上传
  // 图片将使用原始 URL
  console.log('[ImageHandler] 跳过图片上传，使用原始 URL')
  return null
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
