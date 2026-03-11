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
    })
  })

  it('getBadgeById 应返回正确徽章', () => {
    const badge = getBadgeById('day1-badge')
    expect(badge).toBeDefined()
    expect(badge?.name).toBe('初识 OpenClaw')
  })
})
