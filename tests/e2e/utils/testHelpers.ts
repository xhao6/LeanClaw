import { Page } from '@playwright/test'

export const BASE_URL = 'http://localhost:5173'

/**
 * 清理所有存储数据
 */
export async function clearStorage(page: Page): Promise<void> {
  await page.goto(BASE_URL)
  await page.evaluate(() => {
    try {
      uni.removeStorageSync('learn_progress')
      uni.removeStorageSync('favorites')
    } catch (e) {
      // ignore
    }
  })
}

/**
 * 初始化学习进度
 */
export async function initProgress(
  page: Page,
  data: {
    currentDay: number
    completedLessons: string[]
    totalTime?: number
    streak?: number
    lastLearnDate?: string
    badges?: string[]
    certificate?: boolean
  }
): Promise<void> {
  await page.goto(BASE_URL)
  await page.evaluate((progressData) => {
    uni.setStorageSync('learn_progress', progressData)
  }, {
    currentDay: data.currentDay,
    completedLessons: data.completedLessons || [],
    totalTime: data.totalTime || 0,
    streak: data.streak || 0,
    lastLearnDate: data.lastLearnDate || '',
    badges: data.badges || [],
    certificate: data.certificate || false,
  })
}

/**
 * 初始化收藏数据
 */
export async function initFavorites(
  page: Page,
  items: Array<{ id: string; type: string; title: string }>
): Promise<void> {
  await page.goto(BASE_URL)
  await page.evaluate((favItems) => {
    uni.setStorageSync('favorites', favItems)
  }, items)
}

/**
 * 等待页面加载完成
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle')
}

/**
 * 初始化登录状态
 */
export async function initLoginState(
  page: Page,
  userData: {
    id: string
    name: string
    avatar?: string
    level?: number
    exp?: number
  }
): Promise<void> {
  await page.goto(BASE_URL)
  await page.evaluate((user) => {
    // 设置 token
    uni.setStorageSync('token', 'mock-token-' + user.id)
    // 设置用户信息（模拟登录后的状态）
    uni.setStorageSync('userInfo', {
      id: user.id,
      name: user.name,
      avatar: user.avatar || '',
      level: user.level || 1,
      exp: user.exp || 0
    })
  }, userData)
}

/**
 * 初始化未登录状态（清除所有用户数据）
 */
export async function initLoggedOutState(page: Page): Promise<void> {
  await page.goto(BASE_URL)
  await page.evaluate(() => {
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  })
}
