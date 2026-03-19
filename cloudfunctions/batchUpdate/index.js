const cloud = require('tcb-admin-node')
cloud.init()

const db = cloud.database()
const _ = db.command

// 可配置的集合白名单
const ALLOWED_COLLECTIONS = [
  'resources',
  'favorites',
  'certificates',
  'users',
  'progress'
]

// 可配置的管理员 openid 列表（生产环境应使用环境变量）
const ADMIN_IDS = [
  'oeGhS3e5MAD3ZZtd3cdPeecgPXVo' // 测试管理员
]

exports.main = async (event, context) => {
  // 获取调用者 openid
  const openid = context.appEnvwxContext ? context.appEnvwxContext.OPENID : 'anonymous'

  // 权限校验
  if (!ADMIN_IDS.includes(openid)) {
    return {
      success: false,
      message: '无权限执行批量操作'
    }
  }

  const {
    action,     // 操作类型: addFields, removeFields, replaceValue
    collection, // 集合名称
    query = {}, // 筛选条件
    data = {},  // 要添加/更新的字段
    field,      // 字段名（removeFields/replaceValue 使用）
    oldValue,   // 旧值（replaceValue 使用）
    newValue    // 新值（replaceValue 使用）
  } = event

  // 必填参数校验
  if (!action || !collection) {
    return {
      success: false,
      message: '缺少必要参数: action, collection'
    }
  }

  // 集合白名单校验
  if (!ALLOWED_COLLECTIONS.includes(collection)) {
    return {
      success: false,
      message: `不支持操作集合: ${collection}，允许的集合: ${ALLOWED_COLLECTIONS.join(', ')}`
    }
  }

  // 操作类型校验
  const validActions = ['addFields', 'removeFields', 'replaceValue']
  if (!validActions.includes(action)) {
    return {
      success: false,
      message: `无效操作: ${action}，支持的操作为: ${validActions.join(', ')}`
    }
  }

  try {
    let result

    switch (action) {
      case 'addFields': {
        // 增量更新：$set
        // 自动添加 updatedAt 时间戳
        const updateData = {
          ...data,
          updatedAt: _.serverDate()
        }

        result = await db.collection(collection)
          .where(query)
          .update({
            data: updateData
          })
        return {
          success: true,
          message: `成功更新 ${result.updated} 条记录`,
          data: result
        }
      }

      case 'removeFields': {
        // 删除字段：$unset
        if (!field) {
          return {
            success: false,
            message: 'removeFields 操作需要提供 field 参数'
          }
        }

        result = await db.collection(collection)
          .where(query)
          .update({
            data: _.ev({
              [field]: _.remove()
            })
          })
        return {
          success: true,
          message: `成功删除 ${result.updated} 条记录的 ${field} 字段`,
          data: result
        }
      }

      case 'replaceValue': {
        // 替换字段值：需要先查询再逐条更新
        if (!field || oldValue === undefined || newValue === undefined) {
          return {
            success: false,
            message: 'replaceValue 操作需要提供 field, oldValue, newValue 参数'
          }
        }

        // 先查询符合条件的记录
        const { data: list } = await db.collection(collection)
          .where(query)
          .get()

        let updatedCount = 0

        // 逐条更新匹配的记录
        for (const item of list) {
          if (item[field] === oldValue) {
            await db.collection(collection)
              .doc(item._id)
              .update({
                data: {
                  [field]: newValue,
                  updatedAt: _.serverDate()
                }
              })
            updatedCount++
          }
        }

        return {
          success: true,
          message: `成功替换 ${updatedCount} 条记录的 ${field} 字段`,
          data: { updated: updatedCount, total: list.length }
        }
      }

      default:
        return {
          success: false,
          message: `未知操作: ${action}`
        }
    }
  } catch (e) {
    return {
      success: false,
      message: `操作失败: ${e.message}`,
      error: e.toString()
    }
  }
}
