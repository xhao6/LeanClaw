import { describe, it, expect } from 'vitest'

// 徽章定义
interface Badge {
  id: string
  name: string
  icon: string
  condition: (progress: any) => boolean
}

// 模拟徽章数据
const mockBadges: Badge[] = [
  {
    id: 'day1-badge',
    name: '初识 OpenClaw',
    icon: '👋',
    condition: (progress) => progress.completedLessons.includes('day-1'),
  },
  {
    id: 'day2-badge',
    name: '助手搭建者',
    icon: '🤖',
    condition: (progress) => progress.completedLessons.includes('day-2'),
  },
  {
    id: 'day3-badge',
    name: '灵魂赋予师',
    icon: '🧠',
    condition: (progress) => progress.completedLessons.includes('day-3'),
  },
  {
    id: 'day4-badge',
    name: '数字生活家',
    icon: '🏠',
    condition: (progress) => progress.completedLessons.includes('day-4'),
  },
  {
    id: 'day5-badge',
    name: '技能解锁者',
    icon: '🔓',
    condition: (progress) => progress.completedLessons.includes('day-5'),
  },
  {
    id: 'day6-badge',
    name: '主动工作者',
    icon: '⚡',
    condition: (progress) => progress.completedLessons.includes('day-6'),
  },
  {
    id: 'streak-badge',
    name: '连续学习者',
    icon: '🔥',
    condition: (progress) => progress.streak >= 7,
  },
]

describe('徽章解锁逻辑', () => {
  it('完成5天课程应该解锁前5个徽章', () => {
    const progress = {
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5'],
      badges: [],
      streak: 5,
    }

    const result = mockBadges.map(badge => ({
      ...badge,
      unlocked: badge.condition(progress),
    }))

    expect(result[0].unlocked).toBe(true) // day1
    expect(result[1].unlocked).toBe(true) // day2
    expect(result[2].unlocked).toBe(true) // day3
    expect(result[3].unlocked).toBe(true) // day4
    expect(result[4].unlocked).toBe(true) // day5
    expect(result[5].unlocked).toBe(false) // day6
    expect(result[6].unlocked).toBe(false) // streak
  })

  it('未完成任何课程应该全部显示锁', () => {
    const progress = {
      completedLessons: [],
      badges: [],
      streak: 0,
    }

    const result = mockBadges.map(badge => ({
      ...badge,
      unlocked: badge.condition(progress),
    }))

    result.forEach(badge => {
      expect(badge.unlocked).toBe(false)
    })
  })

  it('完成3天课程应该解锁前3个徽章', () => {
    const progress = {
      completedLessons: ['day-1', 'day-2', 'day-3'],
      badges: [],
      streak: 3,
    }

    const result = mockBadges.map(badge => ({
      ...badge,
      unlocked: badge.condition(progress),
    }))

    expect(result[0].unlocked).toBe(true)
    expect(result[1].unlocked).toBe(true)
    expect(result[2].unlocked).toBe(true)
    expect(result[3].unlocked).toBe(false)
    expect(result[4].unlocked).toBe(false)
  })

  it('7天连续学习应该解锁所有徽章', () => {
    const progress = {
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6', 'day-7'],
      badges: [],
      streak: 7,
    }

    const result = mockBadges.map(badge => ({
      ...badge,
      unlocked: badge.condition(progress),
    }))

    // day1-day6 应该解锁
    expect(result[0].unlocked).toBe(true)
    expect(result[1].unlocked).toBe(true)
    expect(result[2].unlocked).toBe(true)
    expect(result[3].unlocked).toBe(true)
    expect(result[4].unlocked).toBe(true)
    expect(result[5].unlocked).toBe(true)
    // streak 徽章也应该解锁
    expect(result[6].unlocked).toBe(true)
  })
})
