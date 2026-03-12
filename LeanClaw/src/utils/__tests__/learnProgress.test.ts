import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock API module
vi.mock('@/api/modules/user', () => ({
  updateProgress: vi.fn(() => Promise.resolve({ success: true }))
}))

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
} as any

import {
  getProgress,
  saveProgress,
  updateCurrentDay,
  markLessonComplete,
  addLearningTime,
  checkAndUpdateStreak,
  resetProgress,
  getDefaultProgress,
  addBadge,
  grantCertificate,
  canGrantCertificate,
  getCertificateDate,
  getCertificate,
  checkAndUnlockBadges,
  syncCloudProgress,
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

    it('应返回存储的进度数据', () => {
      storage['learn_progress'] = {
        currentDay: 3,
        completedLessons: ['day-1', 'day-2'],
        totalTime: 60,
        streak: 2,
        lastLearnDate: '2024-01-15',
        badges: ['day1-badge'],
        certificate: false,
      }
      const progress = getProgress()
      expect(progress.currentDay).toBe(3)
      expect(progress.completedLessons).toEqual(['day-1', 'day-2'])
      expect(progress.totalTime).toBe(60)
      expect(progress.streak).toBe(2)
    })
  })

  describe('saveProgress', () => {
    it('应保存进度到存储', () => {
      const progress = getProgress()
      progress.currentDay = 5
      saveProgress(progress)
      expect(mockSetStorageSync).toHaveBeenCalled()
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

    it('应在完成更高天数时更新当前天数', () => {
      markLessonComplete('day-3')
      const progress = getProgress()
      // 完成 day-3 后应解锁下一课（day-4）
      expect(progress.currentDay).toBe(4)
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

    it('同一天重复打卡不应增加连续天数', () => {
      checkAndUpdateStreak()
      const result = checkAndUpdateStreak()
      expect(result.streak).toBe(1)
    })
  })

  describe('addBadge', () => {
    it('应添加新徽章', () => {
      addBadge('day1-badge')
      const progress = getProgress()
      expect(progress.badges).toContain('day1-badge')
    })

    it('不应重复添加相同徽章', () => {
      addBadge('day1-badge')
      addBadge('day1-badge')
      const progress = getProgress()
      expect(progress.badges.filter(b => b === 'day1-badge').length).toBe(1)
    })
  })

  describe('canGrantCertificate', () => {
    it('未完成所有课程时应返回 false', () => {
      markLessonComplete('day-1')
      expect(canGrantCertificate()).toBe(false)
    })

    it('完成所有7天课程时应返回 true', () => {
      for (let i = 1; i <= 7; i++) {
        markLessonComplete(`day-${i}`)
      }
      expect(canGrantCertificate()).toBe(true)
    })
  })

  describe('grantCertificate', () => {
    it('应在满足条件时颁发证书', () => {
      for (let i = 1; i <= 7; i++) {
        markLessonComplete(`day-${i}`)
      }
      const cert = grantCertificate('测试用户')
      expect(cert.holderName).toBe('测试用户')
      expect(getProgress().certificate).toBe(true)
    })

    it('应保存证书颁发日期', () => {
      for (let i = 1; i <= 7; i++) {
        markLessonComplete(`day-${i}`)
      }
      grantCertificate()
      const dateStr = getCertificateDate()
      expect(dateStr).toMatch(/\d{4}-\d{2}-\d{2}/)
    })
  })

  describe('getCertificate', () => {
    it('未获得证书时应返回 null', () => {
      const cert = getCertificate()
      expect(cert).toBeNull()
    })

    it('已获得证书时应返回证书信息', () => {
      for (let i = 1; i <= 7; i++) {
        markLessonComplete(`day-${i}`)
      }
      grantCertificate('测试用户')
      const cert = getCertificate()
      expect(cert).not.toBeNull()
      // getCertificate 使用默认 holderName，因为没有保存自定义名称
      expect(cert?.holderName).toBe('龙虾驯养员')
      expect(cert?.title).toBe('龙虾驯养师')
    })
  })

  describe('checkAndUnlockBadges', () => {
    it('应在满足条件时解锁新徽章', () => {
      markLessonComplete('day-1')
      const newBadges = checkAndUnlockBadges()
      expect(newBadges.length).toBeGreaterThan(0)
      expect(newBadges[0].id).toBe('day1-badge')
    })

    it('不应重复解锁已拥有的徽章', () => {
      addBadge('day1-badge')
      markLessonComplete('day-1')
      const newBadges = checkAndUnlockBadges()
      expect(newBadges.length).toBe(0)
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

  describe('getDefaultProgress', () => {
    it('应返回默认进度对象', () => {
      const defaultProgress = getDefaultProgress()
      expect(defaultProgress.currentDay).toBe(1)
      expect(defaultProgress.completedLessons).toEqual([])
      expect(defaultProgress.certificate).toBe(false)
    })
  })

  describe('syncCloudProgress', () => {
    it('应同步云端进度到本地', () => {
      const cloudData = [{ lessonId: 'day-1', status: 'completed' }]
      const progress = syncCloudProgress(cloudData)
      expect(progress.completedLessons).toContain('day-1')
      expect(progress.currentDay).toBe(2)
    })
  })
})
