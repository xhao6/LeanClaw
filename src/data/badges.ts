// 徽章系统定义

import type { LearnProgress } from '@/utils/learnProgress'

export interface Badge {
  id: string;           // 徽章唯一标识
  name: string;         // 徽章名称
  desc: string;        // 徽章描述
  icon: string;        // 徽章图标（emoji）
  condition: (progress: LearnProgress) => boolean; // 解锁条件
}

// 检查某一天是否完成
const isDayCompleted = (progress: LearnProgress, day: number): boolean => {
  return progress.completedLessons.includes(`day-${day}`)
}

// 徽章列表
export const badges: Badge[] = [
  {
    id: 'day1-badge',
    name: '初识 OpenClaw',
    desc: '完成第1天学习',
    icon: '👋',
    condition: (progress: LearnProgress) => isDayCompleted(progress, 1),
  },
  {
    id: 'day2-badge',
    name: '助手搭建者',
    desc: '完成第2天学习',
    icon: '🤖',
    condition: (progress: LearnProgress) => isDayCompleted(progress, 2),
  },
  {
    id: 'day3-badge',
    name: '灵魂赋予师',
    desc: '完成第3天学习',
    icon: '🧠',
    condition: (progress: LearnProgress) => isDayCompleted(progress, 3),
  },
  {
    id: 'day4-badge',
    name: '数字生活家',
    desc: '完成第4天学习',
    icon: '🏠',
    condition: (progress: LearnProgress) => isDayCompleted(progress, 4),
  },
  {
    id: 'day5-badge',
    name: '技能解锁者',
    desc: '完成第5天学习',
    icon: '🗝️',
    condition: (progress: LearnProgress) => isDayCompleted(progress, 5),
  },
  {
    id: 'day6-badge',
    name: '主动工作者',
    desc: '完成第6天学习',
    icon: '⚡',
    condition: (progress: LearnProgress) => isDayCompleted(progress, 6),
  },
  {
    id: 'day7-badge',
    name: '龙虾驯养师',
    desc: '完成第7天学习',
    icon: '🏆',
    condition: (progress: LearnProgress) => isDayCompleted(progress, 7),
  },
]

// 获取所有徽章
export const getAllBadges = (): Badge[] => {
  return badges
}

// 根据ID获取徽章
export const getBadgeById = (id: string): Badge | undefined => {
  return badges.find(badge => badge.id === id)
}

// 检查徽章是否已解锁
export const isBadgeUnlocked = (progress: LearnProgress, badgeId: string): boolean => {
  return progress.badges.includes(badgeId)
}
