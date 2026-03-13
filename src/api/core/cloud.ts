/**
 * CloudBase Function Wrapper
 */

export interface CloudResult<T = any> {
  success: boolean
  message?: string
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
    // @ts-ignore
    const res = await wx.cloud.callFunction({
      name,
      data
    })
    
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
  // @ts-ignore
  return wx.cloud.database()
}

/**
 * Get Cloud Storage File ID from URL
 */
export const getFileId = (url: string) => {
  if (url.startsWith('cloud://')) return url
  return '' 
}
