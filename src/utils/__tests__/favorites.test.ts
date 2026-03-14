import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock API
vi.mock('@/api/modules/user', () => ({
  toggleFavorite: vi.fn(() => Promise.resolve({ success: true }))
}))
import { toggleFavorite as mockApiToggleFavorite } from '@/api/modules/user'

// 模拟存储
const storage: Record<string, unknown> = {}

// Mock 全局 uni 对象
const mockGetStorageSync = vi.fn((key: string) => {
  return storage[key]
})
const mockSetStorageSync = vi.fn((key: string, value: unknown) => {
  storage[key] = value
})

// 在全局对象上设置 uni
globalThis.uni = {
  getStorageSync: mockGetStorageSync,
  setStorageSync: mockSetStorageSync,
}

import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorited,
  toggleFavorite,
  clearAllFavorites,
  syncFavorites
} from '../favorites'

describe('favorites 收藏功能', () => {
  const mockItem = {
    id: 'test-1',
    type: 'resource' as const,
    title: '测试资源',
    desc: '测试描述',
    url: 'https://example.com',
    tags: [],
    addedAt: Date.now()
  }

  beforeEach(() => {
    // 清空存储
    Object.keys(storage).forEach(key => delete storage[key])
    mockGetStorageSync.mockClear()
    mockSetStorageSync.mockClear()
    clearAllFavorites()
  })

  describe('addFavorite', () => {
    it('应成功添加收藏', () => {
      addFavorite(mockItem)
      const favorites = getFavorites()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].id).toBe('test-1')
    })

    it('不应重复添加相同 id 的收藏', () => {
      addFavorite(mockItem)
      addFavorite(mockItem)
      expect(getFavorites()).toHaveLength(1)
    })
  })

  describe('removeFavorite', () => {
    it('应成功移除收藏', () => {
      addFavorite(mockItem)
      removeFavorite('test-1')
      expect(getFavorites()).toHaveLength(0)
    })
  })

  describe('isFavorited', () => {
    it('已收藏应返回 true', () => {
      addFavorite(mockItem)
      expect(isFavorited('test-1')).toBe(true)
    })

    it('未收藏应返回 false', () => {
      expect(isFavorited('non-existent')).toBe(false)
    })
  })

  describe('toggleFavorite', () => {
    it('未收藏时应添加', () => {
      toggleFavorite(mockItem)
      expect(isFavorited('test-1')).toBe(true)
    })

    it('已收藏时应移除', () => {
      addFavorite(mockItem)
      toggleFavorite(mockItem)
      expect(isFavorited('test-1')).toBe(false)
    })
  })

  describe('clearAllFavorites', () => {
    it('应清空所有收藏', () => {
      addFavorite(mockItem)
      addFavorite({ ...mockItem, id: 'test-2' })
      clearAllFavorites()
      expect(getFavorites()).toHaveLength(0)
    })
  })

  describe('Cloud Sync', () => {
    it('addFavorite should call cloud API with add', () => {
      mockApiToggleFavorite.mockClear()
      addFavorite(mockItem)
      expect(mockApiToggleFavorite).toHaveBeenCalledWith(mockItem.id, mockItem.type, 'add')
    })

    it('removeFavorite should call cloud API with remove', () => {
      addFavorite(mockItem)
      mockApiToggleFavorite.mockClear()
      removeFavorite(mockItem.id)
      expect(mockApiToggleFavorite).toHaveBeenCalledWith(mockItem.id, mockItem.type, 'remove')
    })
  })

  describe('syncFavorites 云端同步', () => {
    it('合并云端和本地收藏（取并集）', () => {
      // 先添加本地收藏
      addFavorite(mockItem)
      expect(getFavorites()).toHaveLength(1)

      // 云端有不同数据
      const cloudData = [
        { _id: 'cloud-1', resourceId: 'cloud-resource-1', resourceType: 'resource' },
        { _id: 'cloud-2', resourceId: 'cloud-resource-2', resourceType: 'skill' }
      ]

      // 同步
      syncFavorites(cloudData)

      // 应该合并双方的收藏
      const favorites = getFavorites()
      expect(favorites).toHaveLength(3)
      const ids = favorites.map(f => f.id)
      expect(ids).toContain('test-1')
      expect(ids).toContain('cloud-resource-1')
      expect(ids).toContain('cloud-resource-2')
    })

    it('本地详情应被保留', () => {
      addFavorite(mockItem)

      // 云端有相同 id
      const cloudData = [
        { _id: 'cloud-1', resourceId: 'test-1', resourceType: 'resource' }
      ]

      syncFavorites(cloudData)

      // 本地详情应保留
      const favorites = getFavorites()
      expect(favorites[0].title).toBe('测试资源')
      expect(favorites[0].desc).toBe('测试描述')
    })

    it('空云端数据应保留本地收藏', () => {
      addFavorite(mockItem)
      expect(getFavorites()).toHaveLength(1)

      syncFavorites([])

      // 本地收藏应保留
      expect(getFavorites()).toHaveLength(1)
    })
  })
})
