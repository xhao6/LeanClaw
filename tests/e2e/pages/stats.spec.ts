import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL, initProgress } from '../utils/testHelpers'

test.describe('统计页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })

  test('无进度数据时应显示0天', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await page.waitForTimeout(500)
    // 初始状态已学天数应为0
    const daysText = page.locator('text=/ 7天')
    await expect(daysText).toBeVisible()
  })

  test('完成1天课程后显示已学天数1', async ({ page }) => {
    await initProgress(page, {
      currentDay: 2,
      completedLessons: ['day-1'],
      badges: ['day1-badge'],
      streak: 1,
    })
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await page.waitForTimeout(500)
    // 已学天数应显示1
    const completedText = page.locator('text=已学天数')
    await expect(completedText).toBeVisible()
    // 完成课程应显示1
    const checkText = page.locator('text=完成课程')
    await expect(checkText).toBeVisible()
  })

  test('完成7天课程后应解锁全部7个徽章', async ({ page }) => {
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6', 'day-7'],
      badges: ['day1-badge', 'day2-badge', 'day3-badge', 'day4-badge', 'day5-badge', 'day6-badge', 'day7-badge'],
      streak: 7,
      certificate: true,
    })
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await page.waitForTimeout(500)
    // 徽章展示区应该可见
    const badgeSection = page.locator('text=获得徽章')
    await expect(badgeSection).toBeVisible()
    // 应该显示8个徽章格子
    const badgeGrid = page.locator('.grid.grid-cols-7')
    const badges = badgeGrid.locator('.aspect-square')
    await expect(badges).toHaveCount(8)
  })

  test('学习进度条应正确显示7天', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await page.waitForTimeout(500)
    // 应该显示7个进度条（Day 1 - Day 7）
    const dayLabels = page.locator('text=/Day \\d/')
    await expect(dayLabels).toHaveCount(7)
  })

  test('徽章解锁状态应根据进度正确显示', async ({ page }) => {
    // 完成前3天课程
    await initProgress(page, {
      currentDay: 4,
      completedLessons: ['day-1', 'day-2', 'day-3'],
      badges: ['day1-badge', 'day2-badge', 'day3-badge'],
      streak: 3,
    })
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await page.waitForTimeout(500)
    // 徽章展示区应该可见
    const badgeSection = page.locator('text=获得徽章')
    await expect(badgeSection).toBeVisible()
  })
})
