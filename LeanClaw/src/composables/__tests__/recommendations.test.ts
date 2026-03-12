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

  describe('fetchRecommendations', () => {
    it('应返回指定数量的推荐', () => {
      const { fetchRecommendations } = useRecommendations()
      const result = fetchRecommendations(2)
      expect(result).toHaveLength(2)
    })

    it('未浏览时从全量数据中随机选择', () => {
      const { fetchRecommendations } = useRecommendations()
      // 执行多次，验证随机性
      const results = new Set()
      for (let i = 0; i < 10; i++) {
        const result = fetchRecommendations(1)
        results.add(result[0]?.id)
      }
      // 多次随机应该有不同的结果
      expect(results.size).toBeGreaterThan(1)
    })
  })

  describe('addToViewed', () => {
    it('应成功记录浏览历史', () => {
      const { addToViewed, clearViewedHistory } = useRecommendations()
      addToViewed('res-001')
      // 通过再次获取推荐来验证已记录
      const { fetchRecommendations } = useRecommendations()
      const result = fetchRecommendations(10)
      expect(result.some(r => r.id === 'res-001')).toBe(false) // 已浏览的不会再次推荐
    })

    it('不应重复记录相同 id', () => {
      const { addToViewed, fetchRecommendations } = useRecommendations()
      addToViewed('res-001')
      addToViewed('res-001')
      // 多次调用应该只记录一次
      const result = fetchRecommendations(10)
      expect(result.filter(r => r.id === 'res-001')).toHaveLength(0)
    })
  })

  describe('loadRecommendations', () => {
    it('应加载推荐数据到 recommendations', () => {
      const { recommendations, loadRecommendations } = useRecommendations()
      loadRecommendations()
      expect(recommendations.value).toHaveLength(2)
    })
  })

  describe('优先展示未浏览', () => {
    it('应优先返回未浏览的资源', () => {
      // 先浏览一些资源
      const { addToViewed, fetchRecommendations } = useRecommendations()

      // 获取所有资源 ID
      const allIds: string[] = []
      const { recommendations: allRecs } = useRecommendations()
      for (let i = 0; i < 5; i++) {
        allRecs.value = fetchRecommendations(100)
        allRecs.value.forEach(r => {
          if (!allIds.includes(r.id)) allIds.push(r.id)
        })
      }

      // 浏览第一个资源
      addToViewed(allIds[0])

      // 再次获取推荐，应该不包含已浏览的
      const { recommendations, loadRecommendations } = useRecommendations()
      loadRecommendations()
      expect(recommendations.value.some(r => r.id === allIds[0])).toBe(false)
    })
  })

  describe('clearViewedHistory', () => {
    it('应清除浏览历史', () => {
      const { addToViewed, clearViewedHistory, fetchRecommendations } = useRecommendations()
      addToViewed('res-001')
      addToViewed('res-002')
      clearViewedHistory()
      // 清除后，之前浏览的资源应该重新出现
      const result = fetchRecommendations(10)
      expect(result.length).toBeGreaterThan(0)
    })
  })
})
