import { describe, it, expect } from 'vitest'
import { badges, getBadgeById, getAllBadges, isBadgeUnlocked } from '../badges'

describe('badges 徽章数据', () => {
  it('应包含 7 个徽章', () => {
    expect(badges).toHaveLength(7)
  })

  it('每个徽章应有必需字段', () => {
    badges.forEach(badge => {
      expect(badge.id).toBeDefined()
      expect(badge.name).toBeDefined()
      expect(badge.desc).toBeDefined()
      expect(badge.icon).toBeDefined()
      expect(badge.condition).toBeDefined()
    })
  })

  it('getBadgeById 应返回正确徽章', () => {
    const badge = getBadgeById('day1-badge')
    expect(badge).toBeDefined()
    expect(badge?.name).toBe('初识 OpenClaw')
  })

  it('getBadgeById 应返回 undefined（不存在时）', () => {
    const badge = getBadgeById('non-existent')
    expect(badge).toBeUndefined()
  })

  it('getAllBadges 应返回所有徽章', () => {
    const all = getAllBadges()
    expect(all).toHaveLength(7)
    expect(all).toEqual(badges)
  })

  describe('isBadgeUnlocked', () => {
    const mockProgress = {
      currentDay: 1,
      completedLessons: ['day-1'],
      totalTime: 30,
      streak: 1,
      lastLearnDate: '',
      badges: ['day1-badge'],
      certificate: false,
    }

    it('已解锁的徽章应返回 true', () => {
      expect(isBadgeUnlocked(mockProgress, 'day1-badge')).toBe(true)
    })

    it('未解锁的徽章应返回 false', () => {
      expect(isBadgeUnlocked(mockProgress, 'day2-badge')).toBe(false)
    })
  })

  describe('徽章解锁条件', () => {
    it('day1-badge 应在完成 day-1 时解锁', () => {
      const progress = { completedLessons: ['day-1'], streak: 0 } as any
      const badge = getBadgeById('day1-badge')
      expect(badge?.condition(progress)).toBe(true)
    })

    it('day2-badge 应在未完成 day-2 时不解锁', () => {
      const progress = { completedLessons: ['day-1'], streak: 0 } as any
      const badge = getBadgeById('day2-badge')
      expect(badge?.condition(progress)).toBe(false)
    })

    it('streak-badge 应在连续学习7天时解锁', () => {
      const progress = { completedLessons: [], streak: 7 } as any
      const badge = getBadgeById('streak-badge')
      expect(badge?.condition(progress)).toBe(true)
    })
  })
})
