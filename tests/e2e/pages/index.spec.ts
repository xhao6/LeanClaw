import { test, expect } from '@playwright/test'
import { clearStorage, initProgress, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('首页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('首页可访问', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)
    // 验证首页标题
    await expect(page.locator('text=首页').first()).toBeVisible()
  })

  test('默认进度显示 Day 1', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)
    await expect(page.locator('text=Day 1').first()).toBeVisible()
    await expect(page.locator('text=/ 7').first()).toBeVisible()
  })

  test('显示当前进度区域', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)
    // 验证当前进度文字
    await expect(page.locator('text=当前进度').first()).toBeVisible()
  })

  test('显示快速入口', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)
    // 验证快速入口
    await expect(page.locator('text=精选案例').first()).toBeVisible()
    await expect(page.locator('text=Skills大全').first()).toBeVisible()
    await expect(page.locator('text=我的收藏').first()).toBeVisible()
  })

  test('显示推荐区域', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)
    await expect(page.locator('text=今日推荐').first()).toBeVisible()
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
