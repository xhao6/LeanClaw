import { test, expect } from '@playwright/test'
import { clearStorage, initProgress, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('证书页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/certificate/index')
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })

  test('显示证书标题', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/certificate/index')
    await expect(page.locator('text=OpenClaw').first()).toBeVisible()
  })

  test('显示龙虾图标', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/certificate/index')
    // 证书页面顶部有龙虾图标
    await expect(page.locator('text=🦞').first()).toBeVisible()
  })

  test('显示保存到相册按钮', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/certificate/index')
    await expect(page.locator('text=保存到相册').first()).toBeVisible()
  })

  test('无进度时显示0%进度', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/certificate/index')
    // 验证进度条显示 0%
    await expect(page.locator('text=学习进度').first()).toBeVisible()
    await expect(page.locator('text=0%').first()).toBeVisible()
  })

  test('有进度时显示正确进度', async ({ page }) => {
    // 初始化进度：完成 3 天课程
    await initProgress(page, {
      currentDay: 3,
      completedLessons: ['day-1', 'day-2', 'day-3'],
      badges: ['day1-badge']
    })

    await page.goto(BASE_URL + '/#/pages/profile/certificate/index')

    // 验证进度条显示 43%（3/7 ≈ 43%）
    await expect(page.locator('text=学习进度').first()).toBeVisible()
    await expect(page.locator('text=43%').first()).toBeVisible()
  })

  test('完成7天显示100%进度', async ({ page }) => {
    // 初始化进度：完成全部 7 天课程
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6', 'day-7'],
      badges: ['day1-badge', 'day2-badge', 'day3-badge', 'day4-badge', 'day5-badge', 'day6-badge', 'day7-badge']
    })

    await page.goto(BASE_URL + '/#/pages/profile/certificate/index')

    // 验证进度条显示 100%
    await expect(page.locator('text=学习进度').first()).toBeVisible()
    await expect(page.locator('text=100%').first()).toBeVisible()
  })
})
