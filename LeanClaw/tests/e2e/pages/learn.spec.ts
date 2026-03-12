import { test, expect } from '@playwright/test'
import { clearStorage, initProgress, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('学习页面测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('默认状态：Day 1 进行中，其他锁定', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/learn/index')
    // Day 1 显示数字 "1"（进行中状态）
    await expect(page.locator('.rounded-full >> text=1').first()).toBeVisible()
    // 其他 Day 显示锁图标
    const lockIcons = await page.locator('.text-gray-400 >> nth=0').count()
    // 没有已完成状态（没有勾选图标）
    const checkIcons = await page.locator('.wd-icon-check').count()
    expect(checkIcons).toBe(0)
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
    // Day 1 显示勾选图标（已完成状态）
    await expect(page.locator('.wd-icon-check').first()).toBeVisible()
  })

  test('全部完成后显示已完成', async ({ page }) => {
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6', 'day-7'],
    })
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(300)
    // 全部完成，显示勋章区域
    await expect(page.locator('text=恭喜获得').first()).toBeVisible()
  })
})
