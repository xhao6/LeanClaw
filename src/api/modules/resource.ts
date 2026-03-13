import { callFunction, getDb } from '../core/cloud'

/**
 * Get Resources (Articles, Videos, etc.)
 * @param params { type?: string, tag?: string, page?: number, limit?: number }
 */
export const getResources = async (params: any = {}) => {
  const db = getDb()
  const _ = db.command

  const { type, tag, page = 1, limit = 10 } = params
  const skip = (page - 1) * limit

  // Build query conditions - type and tag should be combined with AND
  const queryConditions: Record<string, any> = {}

  if (type) {
    queryConditions.type = _.eq(type)
  }

  if (tag) {
    queryConditions.tags = tag
  }

  let query = db.collection('resources')

  // Apply query conditions if any
  if (Object.keys(queryConditions).length > 0) {
    query = query.where(queryConditions)
  }

  try {
    const res = await query
      .skip(skip)
      .limit(limit)
      .orderBy('heat', 'desc')
      .get()

    return {
      list: res.data,
      total: 0
    }
  } catch (err) {
    console.error('Get resources failed', err)
    return { list: [], total: 0 }
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
