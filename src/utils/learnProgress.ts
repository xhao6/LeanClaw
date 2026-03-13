// 学习进度存储模块
// 使用 uni.setStorageSync / uni.getStorageSync 进行数据持久化

// 导入徽章模块
import { badges, type Badge } from '@/data/badges'
import { createCertificate, type Certificate } from '@/data/certificate'

// 存储 key
const STORAGE_KEY = 'learn_progress'
const CERTIFICATE_DATE_KEY = 'certificate_date'

// LearnProgress 接口定义
export interface LearnProgress {
  currentDay: number;        // 当前学习第几天 (1-7)
  completedLessons: string[]; // 已完成的 lesson ID 列表
  totalTime: number;         // 总学习时长（分钟）
  streak: number;            // 连续打卡天数
  lastLearnDate: string;    // 最后学习日期 (YYYY-MM-DD)
  badges: string[];         // 已获得徽章
  certificate: boolean;     // 是否获得证书
}

// 默认进度数据
export const defaultLearnProgress: LearnProgress = {
  currentDay: 1,
  completedLessons: [],
  totalTime: 0,
  streak: 0,
  lastLearnDate: '',
  badges: [],
  certificate: false,
}

// 获取当前进度
export const getProgress = (): LearnProgress => {
  try {
    const data = uni.getStorageSync(STORAGE_KEY)
    if (data) {
      return {
        ...defaultLearnProgress,
        ...data,
        completedLessons: [...(data.completedLessons || [])],
        badges: [...(data.badges || [])],
      }
    }
  } catch (e) {
    console.error('获取学习进度失败:', e)
  }
  return {
    currentDay: defaultLearnProgress.currentDay,
    completedLessons: [...defaultLearnProgress.completedLessons],
    totalTime: defaultLearnProgress.totalTime,
    streak: defaultLearnProgress.streak,
    lastLearnDate: defaultLearnProgress.lastLearnDate,
    badges: [...defaultLearnProgress.badges],
    certificate: defaultLearnProgress.certificate,
  }
}

// 保存进度
export const saveProgress = (progress: LearnProgress): void => {
  try {
    uni.setStorageSync(STORAGE_KEY, progress)
  } catch (e) {
    console.error('保存学习进度失败:', e)
  }
}

// 更新当前天数
export const updateCurrentDay = (day: number): LearnProgress => {
  const progress = getProgress()
  progress.currentDay = Math.min(Math.max(1, day), 7)
  saveProgress(progress)
  return progress
}

// Sync cloud progress to local storage
export const syncCloudProgress = (cloudData: any[]) => {
  const progress = getProgress()
  let changed = false
  
  // Merge cloud data
  cloudData.forEach(item => {
    if (item.status === 'completed' && !progress.completedLessons.includes(item.lessonId)) {
      progress.completedLessons.push(item.lessonId)
      changed = true
    }
  })
  
  if (changed) {
    // Recalculate current day
    const maxDay = progress.completedLessons.reduce((max, id) => {
      const dayNum = parseInt(id.replace('day-', ''), 10)
      return dayNum > max ? dayNum : max
    }, 0)
    
    if (maxDay < 7) {
      progress.currentDay = maxDay + 1
    } else {
      progress.currentDay = 7
    }
    
    saveProgress(progress)
  }
  
  return progress
}

// 标记 lesson 完成
// 注意：云端同步由调用方负责，避免重复调用
export const markLessonComplete = (lessonId: string): LearnProgress => {
  const progress = getProgress()
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId)

    // 完成后自动解锁下一课
    const dayNum = parseInt(lessonId.replace('day-', ''), 10)
    if (dayNum && dayNum < 7) {
      // 将 currentDay 设置为下一课
      progress.currentDay = dayNum + 1
    } else if (dayNum === 7) {
      // 完成最后一课
      progress.currentDay = 7
    }
    saveProgress(progress)
  }
  return progress
}

// 增加学习时长
export const addLearningTime = (minutes: number): LearnProgress => {
  const progress = getProgress()
  progress.totalTime += minutes
  saveProgress(progress)
  return progress
}

// 获取今天的日期字符串 YYYY-MM-DD
const getTodayString = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 检查并更新连续打卡
export const checkAndUpdateStreak = (): LearnProgress => {
  const progress = getProgress()
  const today = getTodayString()

  if (progress.lastLearnDate === today) {
    // 今天已经打卡过，不更新
    return progress
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

  if (progress.lastLearnDate === yesterdayStr) {
    // 昨天打卡了，连续天数+1
    progress.streak += 1
  } else if (progress.lastLearnDate === '') {
    // 第一次打卡
    progress.streak = 1
  } else {
    // 中断了，重新开始
    progress.streak = 1
  }

  progress.lastLearnDate = today
  saveProgress(progress)
  return progress
}

// 添加徽章
export const addBadge = (badge: string): LearnProgress => {
  const progress = getProgress()
  if (!progress.badges.includes(badge)) {
    progress.badges.push(badge)
    saveProgress(progress)
  }
  return progress
}

// 颁发证书
export const grantCertificate = (holderName?: string): Certificate => {
  const progress = getProgress()
  if (!progress.certificate) {
    progress.certificate = true
    // 保存证书颁发日期
    const now = new Date()
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    uni.setStorageSync(CERTIFICATE_DATE_KEY, dateStr)
    saveProgress(progress)
  }
  return createCertificate(holderName)
}

// 检查是否满足证书颁发条件（完成7天所有课程）
export const canGrantCertificate = (): boolean => {
  const progress = getProgress()
  // 检查是否完成了所有7天的课程
  for (let i = 1; i <= 7; i++) {
    if (!progress.completedLessons.includes(`day-${i}`)) {
      return false
    }
  }
  return true
}

// 获取证书颁发日期
export const getCertificateDate = (): string => {
  return uni.getStorageSync(CERTIFICATE_DATE_KEY) || ''
}

// 获取证书信息（如果没有证书返回null）
export const getCertificate = (): Certificate | null => {
  const progress = getProgress()
  if (!progress.certificate) {
    return null
  }
  const dateStr = getCertificateDate()
  const cert = createCertificate()
  if (dateStr) {
    const [year, month, day] = dateStr.split('-')
    cert.issuedDate = `${year}年${month}月${day}日`
  }
  return cert
}

// 重置进度（用于测试）
export const resetProgress = (): LearnProgress => {
  const progress: LearnProgress = {
    currentDay: 1,
    completedLessons: [],
    totalTime: 0,
    streak: 0,
    lastLearnDate: '',
    badges: [],
    certificate: false,
  }
  saveProgress(progress)
  return progress
}

// 获取默认进度（导出函数形式）
export const getDefaultProgress = (): LearnProgress => {
  return { ...defaultLearnProgress }
}

// 检查并解锁徽章
// 返回新获得的徽章列表
export const checkAndUnlockBadges = (): Badge[] => {
  const progress = getProgress()
  const newBadges: Badge[] = []

  for (const badge of badges) {
    // 如果徽章未解锁且满足条件
    if (!progress.badges.includes(badge.id) && badge.condition(progress)) {
      progress.badges.push(badge.id)
      newBadges.push(badge)
    }
  }

  if (newBadges.length > 0) {
    saveProgress(progress)
  }

  return newBadges
}
