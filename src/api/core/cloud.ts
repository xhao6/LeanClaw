/**
 * CloudBase Function Wrapper
 */

// 环境检测：判断运行环境
const isWeixin = typeof wx !== 'undefined' && wx.cloud !== undefined
const isUniCloud = typeof uni !== 'undefined' && uni.cloud !== undefined

export interface CloudResult<T = any> {
  success: boolean
  message?: string
  error?: string
  data?: T
  [key: string]: any
}

/**
 * Call a cloud function
 * @param name Function name
 * @param data Parameters
 * @returns Result data
 */
export const callFunction = async <T = any>(name: string, data: any = {}): Promise<T> => {
  try {
    let res
    if (isWeixin) {
      res = await wx.cloud.callFunction({ name, data })
    } else if (isUniCloud) {
      res = await uni.cloud.callFunction({ name, data })
    } else {
      throw new Error('Cloud environment not available')
    }

    const result = res.result as CloudResult<T>

    // Optional: Standardize error handling if your cloud functions return { success: false, error: '...' }
    if (result && typeof result === 'object' && 'success' in result && !result.success) {
      throw new Error(result.message || result.error || 'Cloud function failed')
    }

    return result as T
  } catch (err: any) {
    console.error(`[Cloud] Function ${name} failed:`, err)
    // Map error to user-friendly message if needed
    throw err
  }
}

/**
 * Get Cloud Database instance
 */
export const getDb = () => {
  if (isWeixin) {
    return wx.cloud.database()
  } else if (isUniCloud) {
    return uni.cloud.database()
  }
  throw new Error('Cloud environment not available')
}

/**
 * Get Cloud Storage File ID from URL
 */
export const getFileId = (url: string) => {
  if (url.startsWith('cloud://')) return url
  // 从云存储 URL 中提取 fileID
  // 例如: https://xxx.tcb.qcloud.cn/xxx/cloudbase/xxx.png -> cloudbase://xxx.png
  const match = url.match(/cloudbase\/([^?]+)/)
  if (match) {
    return `cloudbase://${match[1]}`
  }
  return ''
}
