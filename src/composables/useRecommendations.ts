import { ref, computed } from 'vue'
import { getResources } from '@/api/modules/resource'
import type { ResourceItem } from '@/types/resource'

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
  const error = ref<string | null>(null)

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

  // 加载推荐数据（首次）- 从后端获取
  const loadRecommendations = async () => {
    loading.value = true

    try {
      // 从后端获取资源数据（按热度排序）
      const res = await getResources({ limit: MAX_ITEMS })
      const allResources: ResourceItem[] = res.list || []

      // 获取浏览历史
      const viewedIds = new Set(getViewedIds())

      // 过滤掉已浏览的
      const available = allResources.filter(r => !viewedIds.has(r.id))

      // 优先从未浏览的中选择，不够则从全部中选择
      const pool = available.length > 0 ? available : allResources.filter(
        r => !viewedIds.has(r.id)
      )

      recommendations.value = shuffle(pool).slice(0, PAGE_SIZE)
      allLoaded.value = recommendations.value.length >= MAX_ITEMS || pool.length <= PAGE_SIZE
    } catch (err) {
      console.error('Load recommendations failed', err)
      error.value = '加载失败，请稍后重试'
      recommendations.value = []
      allLoaded.value = true
    }

    // 检查是否为空
    if (recommendations.value.length === 0 && !error.value) {
      error.value = '暂无推荐内容'
    }

    loading.value = false
  }

  // 加载更多 - 从后端获取
  const loadMore = async () => {
    if (loading.value || allLoaded.value) return

    loading.value = true

    try {
      // 重新获取全部数据（实际项目中应该分页，这里简化处理）
      const res = await getResources({ limit: MAX_ITEMS })
      const allResources: ResourceItem[] = res.list || []

      const viewedIds = new Set(getViewedIds())
      const displayedIds = new Set(recommendations.value.map(r => r.id))

      const available = allResources.filter(
        r => !viewedIds.has(r.id) && !displayedIds.has(r.id)
      )

      const pool = available.length > 0 ? available : allResources.filter(
        r => !displayedIds.has(r.id)
      )

      const newItems = shuffle(pool).slice(0, PAGE_SIZE)
      recommendations.value = [...recommendations.value, ...newItems]
      allLoaded.value = recommendations.value.length >= MAX_ITEMS || newItems.length < PAGE_SIZE
    } catch (err) {
      console.error('Load more failed', err)
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
    error,
    loadRecommendations,
    loadMore,
    addToViewed,
    clearViewedHistory,
  }
}
