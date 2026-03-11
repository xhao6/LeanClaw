/**
 * Alova 全局中间件
 */

export const globalMiddleware = async (context: any, next: any) => {
  // 可以在这里处理全局 loading 等
  console.log('Global middleware before request')
  try {
    const result = await next()
    console.log('Global middleware after request')
    return result
  } catch (error) {
    console.error('Global middleware error:', error)
    throw error
  }
}
