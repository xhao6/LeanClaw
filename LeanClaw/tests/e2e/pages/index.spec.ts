import { test, expect } from '@playwright/test'
import { clearStorage, initProgress, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('首页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('默认进度显示 Day 1, 14%', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page.locator('text=Day 1 /').first()).toBeVisible()
    await expect(page.locator('text=14%').first()).toBeVisible()
  })

  test('下一章标题为初识 OpenClaw', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page.locator('text=下一章：初识 OpenClaw').first()).toBeVisible()
  })

  test('继续学习按钮存在', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page.locator('text=继续学习').first()).toBeVisible()
  })

  test('显示推荐资源卡片', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page.locator('text=热门资源推荐').first()).toBeVisible()
  })

  test('有进度时显示对应数据', async ({ page }) => {
    await initProgress(page, {
      currentDay: 3,
      completedLessons: ['day-1', 'day-2'],
    })
    // 刷新页面确保数据加载
    await page.goto(BASE_URL + '/')
    await page.reload()
    await page.waitForTimeout(500)
    await expect(page.locator('text=Day 3').first()).toBeVisible()
  })
})
