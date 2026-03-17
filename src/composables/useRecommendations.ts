import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { getResources } from '@/api/modules/resource'
import { getFavorites } from '@/api/modules/user'
import type { ResourceItem } from '@/types/resource'

// 推荐算法权重配置
const HEAT_WEIGHT = 10       // 热度权重
const USER_BONUS = 50        // 用户已收藏加分
const RANDOM_WEIGHT = 20     // 随机因子权重

/**
 * 计算推荐分数
 * 分数 = 热度分 + 用户收藏加分 + 随机因子
 * 未收藏高热度文章得分最高
 */
const calculateScore = (
  item: ResourceItem,
  userFavorites: Set<string>
): number => {
  const heatScore = (item.heat || 0) * HEAT_WEIGHT
  const userBonusScore = userFavorites.has(item.id) ? USER_BONUS : 0
  const randomFactor = Math.random() * RANDOM_WEIGHT
  return heatScore + userBonusScore + randomFactor
}

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

      // 获取用户收藏ID列表
      const userStore = useUserStore()
      const { isLoggedIn } = storeToRefs(userStore)
      const userFavorites = new Set<string>()

      if (isLoggedIn.value) {
        try {
          const favRes = await getFavorites()
          if (favRes.success && favRes.data) {
            favRes.data.forEach((f: any) => userFavorites.add(f.resourceId))
          }
        } catch (e) {
          console.warn('获取用户收藏失败', e)
        }
      }

      // 过滤掉已浏览的
      const available = allResources.filter(r => !viewedIds.has(r.id))

      // 优先从未浏览的中选择，不够则从全部中选择
      const pool = available.length > 0 ? available : allResources.filter(
        r => !viewedIds.has(r.id)
      )

      // 使用混合推荐算法排序
      const scored = pool.map(item => ({
        item,
        score: calculateScore(item, userFavorites)
      })).sort((a, b) => b.score - a.score)

      recommendations.value = scored.slice(0, PAGE_SIZE).map(s => s.item)
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

      // 获取用户收藏ID列表
      const userStore = useUserStore()
      const { isLoggedIn } = storeToRefs(userStore)
      const userFavorites = new Set<string>()

      if (isLoggedIn.value) {
        try {
          const favRes = await getFavorites()
          if (favRes.success && favRes.data) {
            favRes.data.forEach((f: any) => userFavorites.add(f.resourceId))
          }
        } catch (e) {
          console.warn('获取用户收藏失败', e)
        }
      }

      const available = allResources.filter(
        r => !viewedIds.has(r.id) && !displayedIds.has(r.id)
      )

      const pool = available.length > 0 ? available : allResources.filter(
        r => !displayedIds.has(r.id)
      )

      // 使用混合推荐算法排序
      const scored = pool.map(item => ({
        item,
        score: calculateScore(item, userFavorites)
      })).sort((a, b) => b.score - a.score)

      const newItems = scored.slice(0, PAGE_SIZE).map(s => s.item)
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
    calculateScore, // 导出用于测试
  }
}
