import { clearAllFavorites } from '@/utils/favorites'
import { resetProgress } from '@/utils/learnProgress'

// 需要保留的存储 key
const KEYS_TO_KEEP = ['uni-id-token', 'uni-id-token-expire']

export class CacheService {
  /**
   * 获取缓存大小
   */
  static getCacheSize(): string {
    try {
      const info = uni.getStorageInfoSync()
      const sizeInBytes = info.currentSize * 1024 // 转换为字节

      if (sizeInBytes < 1024) {
        return `${sizeInBytes.toFixed(2)} B`
      } else if (sizeInBytes < 1024 * 1024) {
        return `${(sizeInBytes / 1024).toFixed(2)} KB`
      } else {
        return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
      }
    } catch (e) {
      console.error('获取缓存大小失败:', e)
      return '0 KB'
    }
  }

  /**
   * 获取将被清除的数据项列表
   */
  static getClearedItemsList(): string[] {
    const items: string[] = []

    try {
      const info = uni.getStorageInfoSync()

      // 检查学习进度
      if (info.keys.includes('learn_progress')) {
        items.push('学习进度')
      }

      // 检查收藏数据
      if (info.keys.includes('favorites')) {
        items.push('收藏数据')
      }

      // 检查其他非登录相关的缓存
      const otherKeys = info.keys.filter(
        key => !KEYS_TO_KEEP.includes(key)
      )
      if (otherKeys.length > 0) {
        items.push(`其他缓存 (${otherKeys.length}项)`)
      }
    } catch (e) {
      console.error('获取清除列表失败:', e)
    }

    return items.length > 0 ? items : ['无缓存数据']
  }

  /**
   * 清除所有本地缓存（除登录态外）
   */
  static async clearCache(): Promise<void> {
    // 1. 清除学习进度
    resetProgress()

    // 2. 清除收藏数据
    clearAllFavorites()

    // 3. 清除其他缓存
    try {
      const info = uni.getStorageInfoSync()
      info.keys.forEach(key => {
        if (!KEYS_TO_KEEP.includes(key)) {
          uni.removeStorageSync(key)
        }
      })
    } catch (e) {
      console.error('清除缓存失败:', e)
    }
  }

  /**
   * 显示确认对话框并清除缓存
   */
  static async confirmAndClear(): Promise<void> {
    const itemsList = this.getClearedItemsList()

    return new Promise((resolve) => {
      uni.showModal({
        title: '清除缓存',
        content: `确定要清除以下数据吗？\n\n${itemsList.join('\n')}\n\n清除后无法恢复，登录态将保留。`,
        success: async (res) => {
          if (res.confirm) {
            await this.clearCache()

            uni.showToast({
              title: '缓存已清除',
              icon: 'success',
            })

            // 延迟刷新页面
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/index/index',
              })
            }, 1000)
          }
          resolve()
        }
      })
    })
  }
}
