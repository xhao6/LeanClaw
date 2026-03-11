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

// 在全局对象上设置 uni
globalThis.uni = {
  getStorageSync: mockGetStorageSync,
  setStorageSync: mockSetStorageSync,
}

import {
  getProgress,
  saveProgress,
  updateCurrentDay,
  markLessonComplete,
  addLearningTime,
  checkAndUpdateStreak,
  resetProgress,
  getDefaultProgress
} from '../learnProgress'

describe('learnProgress 工具函数', () => {
  beforeEach(() => {
    // 清空存储
    Object.keys(storage).forEach(key => delete storage[key])
    mockGetStorageSync.mockClear()
    mockSetStorageSync.mockClear()
    resetProgress()
  })

  describe('getProgress', () => {
    it('应返回默认进度（无存储数据时）', () => {
      const progress = getProgress()
      expect(progress.currentDay).toBe(1)
      expect(progress.completedLessons).toEqual([])
      expect(progress.totalTime).toBe(0)
      expect(progress.streak).toBe(0)
      expect(progress.badges).toEqual([])
      expect(progress.certificate).toBe(false)
    })
  })

  describe('updateCurrentDay', () => {
    it('应正确更新当前天数', () => {
      updateCurrentDay(3)
      const progress = getProgress()
      expect(progress.currentDay).toBe(3)
    })

    it('应限制天数在 1-7 范围内', () => {
      updateCurrentDay(10)
      expect(getProgress().currentDay).toBe(7)

      updateCurrentDay(0)
      expect(getProgress().currentDay).toBe(1)
    })
  })

  describe('markLessonComplete', () => {
    it('应标记课程为完成', () => {
      markLessonComplete('day-1')
      const progress = getProgress()
      expect(progress.completedLessons).toContain('day-1')
    })

    it('不应重复添加相同课程', () => {
      markLessonComplete('day-1')
      markLessonComplete('day-1')
      const progress = getProgress()
      expect(progress.completedLessons.filter(l => l === 'day-1').length).toBe(1)
    })
  })

  describe('addLearningTime', () => {
    it('应累加学习时长', () => {
      addLearningTime(15)
      addLearningTime(20)
      expect(getProgress().totalTime).toBe(35)
    })
  })

  describe('checkAndUpdateStreak', () => {
    it('首次打卡应返回 streak 为 1', () => {
      const result = checkAndUpdateStreak()
      expect(result.streak).toBe(1)
      expect(getProgress().streak).toBe(1)
    })
  })

  describe('resetProgress', () => {
    it('应重置所有进度数据', () => {
      updateCurrentDay(5)
      addLearningTime(100)
      markLessonComplete('day-1')

      resetProgress()

      const progress = getProgress()
      expect(progress.currentDay).toBe(1)
      expect(progress.totalTime).toBe(0)
      expect(progress.completedLessons).toEqual([])
    })
  })
})
