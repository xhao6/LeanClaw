import { ref, computed } from 'vue'
import { resources, type ResourceItem } from '@/data/mock'

const STORAGE_KEY = 'viewed_resources'
const PAGE_SIZE = 5
const MAX_ITEMS = 30

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
 * - 无限滚动：默认 5 条，滚动到底部加载更多
 * - 最多 30 条
 * - 优先展示未浏览过的
 */
export function useRecommendations() {
  const recommendations = ref<ResourceItem[]>([])
  const loading = ref(false)
  const allLoaded = ref(false)

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

  // 获取推荐池（已去重）
  const getPool = (): ResourceItem[] => {
    const viewed = getViewedIds()
    const viewedIds = new Set(viewed)

    // 过滤掉已展示的
    const displayedIds = new Set(recommendations.value.map(r => r.id))

    const available = resources.filter(
      r => !viewedIds.has(r.id) && !displayedIds.has(r.id)
    )

    // 优先从未浏览的中选择，不够则从全部中选择
    const pool = available.length > 0 ? available : resources.filter(
      r => !displayedIds.has(r.id)
    )

    return shuffle(pool)
  }

  // 加载推荐数据（首次）
  const loadRecommendations = () => {
    loading.value = true

    const pool = getPool()
    recommendations.value = pool.slice(0, PAGE_SIZE)
    allLoaded.value = recommendations.value.length >= MAX_ITEMS || pool.length <= PAGE_SIZE

    loading.value = false
  }

  // 加载更多
  const loadMore = () => {
    if (loading.value || allLoaded.value) return

    loading.value = true

    const pool = getPool()
    const currentLength = recommendations.value.length
    const remaining = MAX_ITEMS - currentLength

    if (remaining > 0) {
      const newItems = pool.slice(0, Math.min(PAGE_SIZE, remaining))
      recommendations.value = [...recommendations.value, ...newItems]
      allLoaded.value = recommendations.value.length >= MAX_ITEMS || newItems.length < PAGE_SIZE
    } else {
      allLoaded.value = true
    }

    loading.value = false
  }

  // 是否有更多
  const hasMore = computed(() => !allLoaded.value)

  // 清除浏览历史（用于测试）
  const clearViewedHistory = () => {
    uni.removeStorageSync(STORAGE_KEY)
  }

  return {
    recommendations,
    loading,
    hasMore,
    allLoaded,
    loadRecommendations,
    loadMore,
    addToViewed,
    clearViewedHistory,
  }
}
