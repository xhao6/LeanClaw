import { test, expect } from '@playwright/test'
import { clearStorage, initProgress, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('学习页面测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('默认状态：Day 1 进行中，其他锁定', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await expect(page.locator('text=进行中').first()).toBeVisible()
    const completedCount = await page.locator('text=已完成').count()
    expect(completedCount).toBe(0)
  })

  test('学习详情页可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/learn/detail/index?day=1')
    await expect(page.locator('text=课程详情').first()).toBeVisible()
  })

  test('完成课程后状态更新', async ({ page }) => {
    await initProgress(page, {
      currentDay: 2,
      completedLessons: ['day-1'],
    })
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await expect(page.locator('text=已完成').first()).toBeVisible()
  })

  test('全部完成后显示已完成', async ({ page }) => {
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6', 'day-7'],
    })
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(300)
    const completedCount = await page.locator('text=已完成').count()
    expect(completedCount).toBeGreaterThan(0)
  })
})
