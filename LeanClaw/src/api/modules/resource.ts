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

  let query = db.collection('resources')

  if (type) {
    query = query.where({ type })
  }
  
  if (tag) {
    // Array contains logic needed? Or simple equality for single tag
    // If 'tags' is array in DB, verify if strict equality or 'in' is needed
    // CloudBase supports array matching
    // For now, assume 'tags' contains 'tag'
    // query = query.where({ tags: _.in([tag]) }) // This means tags matches exactly one of these
    // Actually, to check if array contains value, simpler approach:
    // CloudBase query automatically handles array contains for simple value
    // E.g. where({ tags: 'foo' }) matches if 'foo' is in tags array
    query = query.where({
      tags: tag
    })
  }

  try {
    const res = await query
      .skip(skip)
      .limit(limit)
      .orderBy('heat', 'desc') // Order by popularity/heat
      .get()
    
    return {
      list: res.data,
      total: 0 // Count requires separate call if needed
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
