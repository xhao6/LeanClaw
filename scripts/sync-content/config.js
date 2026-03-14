import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

export const config = {
  // 魔搭 API
  modelscope: {
    apiKey: process.env.MODELSCOPE_API_KEY,
    baseURL: 'https://api-inference.modelscope.cn/v1/',
    model: 'Qwen/Qwen2.5-72B-Instruct'
  },

  // CloudBase
  cloudbase: {
    envId: process.env.CLOUDBASE_ENV_ID,
    secretId: process.env.CLOUDBASE_SECRET_ID,
    secretKey: process.env.CLOUDBASE_SECRET_KEY
  },

  // 图片存储配置
  image: {
    quality: 80,
    width: 1200,
    format: 'webp'
  },

  // 静态托管路径
  hosting: {
    markdownDir: '/content/markdown/',
    imageDir: '/content/images/'
  }
}
