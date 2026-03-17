// cloudfunctions/getResources/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

// 参数校验与边界处理
const sanitizeParams = (event) => {
  let { type, tag, page = 1, limit = 10 } = event

  // 确保page和limit是有效数字
  page = parseInt(page)
  limit = parseInt(limit)

  // 边界校验
  if (isNaN(page) || page < 1) page = 1
  if (isNaN(limit) || limit < 1) limit = 10
  if (limit > 50) limit = 50 // 限制最大返回数量

  // 参数类型校验
  if (type && typeof type !== 'string') type = undefined
  if (tag && typeof tag !== 'string') tag = undefined

  return { type, tag, page, limit }
}

exports.main = async (event, context) => {
  const { type, tag, page, limit } = sanitizeParams(event)
  const skip = (page - 1) * limit

  try {
    // Build query conditions
    const queryConditions = {}

    if (type && ['resource', 'case', 'skill'].includes(type)) {
      queryConditions.type = type
    }

    if (tag) {
      // 限制tag长度，防止正则性能问题
      const safeTag = tag.substring(0, 50)
      queryConditions.tags = db.command.elemMatch({
        $regex: safeTag,
        $options: 'i'
      })
    }

    // Execute query
    let query = db.collection('resources')

    if (Object.keys(queryConditions).length > 0) {
      query = query.where(queryConditions)
    }

    const res = await query
      .skip(skip)
      .limit(limit)
      .orderBy('heat', 'desc')
      .get()

    // 获取每个资源的收藏数
    const resourcesList = res.data || []
    if (resourcesList.length > 0) {
      try {
        const favoritesRes = await db.collection('favorites')
          .groupBy('resourceId')
          .aggregate({
            count: db.command.aggregate.sum(1)
          })

        // 构建收藏数映射
        const heatMap = {}
        if (favoritesRes.list) {
          favoritesRes.list.forEach(item => {
            heatMap[item.resourceId] = item.count
          })
        }

        // 给每个资源附加 heat 字段（使用收藏数）
        resourcesList.forEach(item => {
          item.heat = heatMap[item._id] || item.heat || 0
        })
      } catch (e) {
        console.warn('获取收藏数失败:', e)
        // 失败时使用原有的 heat 字段
      }
    }

    // Get total count
    let totalQuery = db.collection('resources')
    if (Object.keys(queryConditions).length > 0) {
      totalQuery = totalQuery.where(queryConditions)
    }
    const countRes = await totalQuery.count()

    return {
      success: true,
      list: resourcesList,
      total: countRes.total
    }
  } catch (err) {
    console.error('Get resources failed:', err)
    return {
      success: false,
      error: err.message,
      list: [],
      total: 0
    }
  }
}
