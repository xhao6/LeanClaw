import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock uni API
const mockStorage = new Map<string, any>()

const mockUni = {
  getStorageInfoSync: vi.fn(() => ({
    keys: Array.from(mockStorage.keys()),
    currentSize: Array.from(mockStorage.values()).reduce((acc: number, val: unknown) => {
      return acc + JSON.stringify(val).length
    }, 0) / 1024
  })),
  getStorageSync: vi.fn((key: string) => mockStorage.get(key)),
  setStorageSync: vi.fn((key: string, value: unknown) => mockStorage.set(key, value)),
  removeStorageSync: vi.fn((key: string) => mockStorage.delete(key)),
  showModal: vi.fn((options: Record<string, unknown>) => {
    // 模拟用户点击确定
    if (options.success) {
      options.success({ confirm: true })
    }
  }),
  showToast: vi.fn(),
  reLaunch: vi.fn(),
}

// @ts-ignore
global.uni = mockUni

import { CacheService } from '@/services/CacheService'
import { clearAllFavorites } from '@/utils/favorites'
import { resetProgress } from '@/utils/learnProgress'

describe('CacheService', () => {
  beforeEach(() => {
    mockStorage.clear()
    vi.clearAllMocks()

    mockStorage.set('uni-id-token', 'test-token')
    mockStorage.set('uni-id-token-expire', '1234567890')
    mockStorage.set('favorites', [{ id: '1', title: 'Test' }])
    mockStorage.set('learn_progress', { currentDay: 3, completedLessons: ['day-1'] })
  })

  it('should get cache size', () => {
    const size = CacheService.getCacheSize()
    expect(size).toBeTruthy()
    expect(typeof size).toBe('string')
  })

  it('should clear all cache except login token', async () => {
    await CacheService.clearCache()

    // 登录态应该保留
    expect(mockStorage.has('uni-id-token')).toBe(true)
    expect(mockStorage.has('uni-id-token-expire')).toBe(true)

    // 其他缓存应该被清除
    expect(mockStorage.has('favorites')).toBe(false)
    expect(mockStorage.has('learn_progress')).toBe(false)
  })

  it('should return cleared items list', () => {
    const clearedItems = CacheService.getClearedItemsList()

    expect(clearedItems).toContain('学习进度')
    expect(clearedItems).toContain('收藏数据')
  })
})
