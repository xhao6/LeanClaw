// src/api/core/tcbWeb.ts
import { config } from '@/config'

const ENV_ID = config.cloud.envId
const BASE_URL = `https://${ENV_ID}.bspapp.com`
const REQUEST_TIMEOUT = 10000 // 10秒超时

// Check if running in mini-program
const IS_MINI_PROGRAM = typeof wx !== 'undefined' && wx.request

/**
 * Initialize CloudBase Web SDK (占位)
 */
export const initTcbWeb = () => {
  console.log('[CloudBase Web] Using HTTP trigger')
}

/**
 * Get CloudBase database instance - 不支持
 */
export const getDbWeb = () => {
  throw new Error('Database access not supported')
}

/**
 * Call cloud function via HTTP trigger (带超时)
 * 使用小程序 wx.cloud.callFunction 或 fetch
 */
export const callFunctionWeb = async (name: string, data: any = {}) => {
  const url = `${BASE_URL}/${name}`
  console.log(`[CloudBase Web] Calling ${name} at ${url}`)

  // 小程序环境使用 wx.cloud.callFunction
  if (IS_MINI_PROGRAM) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'))
      }, REQUEST_TIMEOUT)

      wx.cloud.callFunction({
        name,
        data,
        complete: () => {
          clearTimeout(timeoutId)
        },
        success: (res: any) => {
          console.log(`[CloudBase Web] ${name} result:`, res.result)
          resolve(res.result)
        },
        fail: (err: any) => {
          console.error(`[CloudBase Web] Function ${name} failed:`, err)
          reject(err)
        }
      })
    })
  }

  // Web 环境使用 fetch
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CloudBase-Env-ID': ENV_ID
      },
      body: JSON.stringify(data),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    const result = await res.json()
    console.log(`[CloudBase Web] ${name} result:`, result)
    return result
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error(`[CloudBase Web] Function ${name} timed out`)
    } else {
      console.error(`[CloudBase Web] Function ${name} failed:`, err)
    }
    throw err
  }
}
