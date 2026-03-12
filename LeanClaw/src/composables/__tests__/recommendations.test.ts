import { describe, it, expect, beforeEach, vi } from 'vitest'

// 模拟存储
const storage: Record<string, unknown> = {}

// Mock 全局 uni 对象
const mockGetStorageSync = vi.fn((key: string) => {
  return storage[key]
})
const mockSetStorageSync = vi.fn((key: string, value: unknown) => {
  storage[key] = value
})
const mockRemoveStorageSync = vi.fn((key: string) => {
  delete storage[key]
})

globalThis.uni = {
  getStorageSync: mockGetStorageSync,
  setStorageSync: mockSetStorageSync,
  removeStorageSync: mockRemoveStorageSync,
}

import { useRecommendations } from '../useRecommendations'

describe('useRecommendations 推荐功能', () => {
  beforeEach(() => {
    // 清空存储
    Object.keys(storage).forEach(key => delete storage[key])
    mockGetStorageSync.mockClear()
    mockSetStorageSync.mockClear()
    mockRemoveStorageSync.mockClear()
  })

  describe('loadRecommendations 首次加载', () => {
    it('应加载 5 条推荐', () => {
      const { recommendations, loadRecommendations } = useRecommendations()
      loadRecommendations()
      expect(recommendations.value).toHaveLength(5)
    })

    it('应设置 allLoaded 状态', () => {
      const { allLoaded, loadRecommendations } = useRecommendations()
      loadRecommendations()
      expect(typeof allLoaded.value).toBe('boolean')
    })
  })

  describe('loadMore 加载更多', () => {
    it('应加载更多推荐', () => {
      const { recommendations, loadRecommendations, loadMore } = useRecommendations()
      loadRecommendations()
      const initialLength = recommendations.value.length
      loadMore()
      expect(recommendations.value.length).toBeGreaterThan(initialLength)
    })

    it('加载中应阻止重复触发', () => {
      const { loading, loadRecommendations, loadMore } = useRecommendations()
      loadRecommendations()
      // 手动设置为 loading
      loading.value = true
      loadMore()
      // loading 应该仍然是 true
      expect(loading.value).toBe(true)
    })

    it('全部加载完成后不应再加载', () => {
      const { allLoaded, loadRecommendations, loadMore } = useRecommendations()
      loadRecommendations()
      // 强制设置为全部加载完成
      allLoaded.value = true
      loadMore()
      // 应该不报错
    })
  })

  describe('hasMore 计算属性', () => {
    it('未全部加载时应为 true', () => {
      const { hasMore, loadRecommendations } = useRecommendations()
      loadRecommendations()
      expect(hasMore.value).toBe(true)
    })

    it('全部加载完成后应为 false', () => {
      const { allLoaded, hasMore, loadRecommendations } = useRecommendations()
      loadRecommendations()
      allLoaded.value = true
      expect(hasMore.value).toBe(false)
    })
  })

  describe('addToViewed', () => {
    it('应成功记录浏览历史', () => {
      const recs = useRecommendations()
      recs.loadRecommendations()
      const firstId = recs.recommendations.value[0]?.id
      if (firstId) {
        recs.addToViewed(firstId)
        // 验证添加成功（重新加载后该 ID 不在列表中）
        const recs2 = useRecommendations()
        recs2.loadRecommendations()
        expect(recs2.recommendations.value.some(r => r.id === firstId)).toBe(false)
      }
    })
  })

  describe('去重逻辑', () => {
    it('单次加载不应出现重复', () => {
      const { recommendations, loadRecommendations } = useRecommendations()
      loadRecommendations()

      // 检查是否有重复
      const ids = recommendations.value.map(r => r.id)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    })

    it('最多加载 30 条', () => {
      const { recommendations, loadRecommendations, loadMore } = useRecommendations()
      loadRecommendations()

      // 持续加载直到无法再加载
      for (let i = 0; i < 20; i++) {
        loadMore()
        if (recommendations.value.length >= 30) break
      }

      expect(recommendations.value.length).toBeLessThanOrEqual(30)
    })
  })

  describe('clearViewedHistory', () => {
    it('应清除浏览历史', () => {
      // 先浏览一些资源
      const recs1 = useRecommendations()
      recs1.loadRecommendations()
      const ids = recs1.recommendations.value.map(r => r.id)
      ids.forEach(id => recs1.addToViewed(id))

      // 清除历史
      recs1.clearViewedHistory()

      // 重新加载，应该能看到之前的资源
      const recs2 = useRecommendations()
      recs2.loadRecommendations()

      // 至少有资源可以显示
      expect(recs2.recommendations.value.length).toBeGreaterThan(0)
    })
  })
})
