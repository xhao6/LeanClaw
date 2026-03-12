import { ref } from 'vue'
import { resources, type ResourceItem } from '@/data/mock'

const STORAGE_KEY = 'viewed_resources'

// Fisher-Yates 洗牌算法
const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * 推荐功能 composable
 * - 每次刷新随机显示不同资源
 * - 优先展示未浏览过的
 */
export function useRecommendations() {
  const recommendations = ref<ResourceItem[]>([])

  // 获取浏览历史
  const getViewedIds = (): string[] => {
    try {
      return uni.getStorageSync(STORAGE_KEY) || []
    } catch {
      return []
    }
  }

  // 记录浏览历史
  const addToViewed = (id: string): void => {
    const viewed = getViewedIds()
    if (!viewed.includes(id)) {
      viewed.push(id)
      uni.setStorageSync(STORAGE_KEY, viewed)
    }
  }

  // 获取推荐（每次刷新随机）
  const fetchRecommendations = (count: number = 2): ResourceItem[] => {
    const viewed = getViewedIds()

    // 优先从未浏览的中选择
    const unviewed = resources.filter(r => !viewed.includes(r.id))
    const pool = unviewed.length >= count ? unviewed : resources

    return shuffle(pool).slice(0, count)
  }

  // 加载推荐数据
  const loadRecommendations = () => {
    recommendations.value = fetchRecommendations(2)
  }

  // 清除浏览历史（用于测试）
  const clearViewedHistory = () => {
    uni.removeStorageSync(STORAGE_KEY)
  }

  return {
    recommendations,
    fetchRecommendations,
    loadRecommendations,
    addToViewed,
    clearViewedHistory,
  }
}
