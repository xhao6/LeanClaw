import { callFunctionWeb } from '../core/tcbWeb'

/**
 * Get Resources (Articles, Videos, etc.)
 * @param params { type?: string, tag?: string, page?: number, limit?: number }
 */
export const getResources = async (params: any = {}) => {
  const { type, tag, page = 1, limit = 10 } = params

  // 参数边界校验
  const safePage = Math.max(1, parseInt(String(page)) || 1)
  const safeLimit = Math.min(50, Math.max(1, parseInt(String(limit)) || 10))

  // 尝试使用云函数获取真实数据
  try {
    const cloudRes = await callFunctionWeb('getResources', { type, tag, page: safePage, limit: safeLimit })
    if (cloudRes && cloudRes.success && cloudRes.list) {
      console.log('[Resources] Using cloud function data')
      return {
        list: cloudRes.list,
        total: cloudRes.total
      }
    }
  } catch (e) {
    console.error('[Resources] Cloud function failed:', e)
  }

  // 无兜底数据，直接返回空结果
  console.warn('[Resources] No data available')
  return {
    list: [],
    total: 0
  }
}

/**
 * Get Cases (Specific type of resource)
 */
export const getCases = async (params: any = {}) => {
  return getResources({ ...params, type: 'case' })
}

/**
 * Get Skills (Specific type of resource)
 */
export const getSkills = async (params: any = {}) => {
  return getResources({ ...params, type: 'skill' })
}
