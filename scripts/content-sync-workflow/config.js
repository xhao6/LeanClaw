// 加载 .env 文件
import 'dotenv/config'

// 直接从环境变量读取配置
export const config = {
  // 魔搭 API（通过 MODELSCOPE_API_KEY 环境变量设置）
  modelscope: {
    apiKey: process.env.MODELSCOPE_API_KEY,
    baseURL: 'https://api-inference.modelscope.cn/v1/',
    model: 'Qwen/Qwen3.5-397B-A17B',
    enableThinking: false
  },

  // CloudBase（通过 MCP 工具处理）
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

// 检查 API Key 是否配置
if (!config.modelscope.apiKey) {
  console.warn('[Config] 警告: 未设置 MODELSCOPE_API_KEY 环境变量，AI 转换功能将不可用')
}
