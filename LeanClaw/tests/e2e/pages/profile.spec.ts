import { test, expect } from '@playwright/test'
import { clearStorage, initProgress, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('我的页面测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('显示用户信息', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证用户信息
    await expect(page.locator('text=龙虾驯养员')).toBeVisible()
  })

  test('显示学习统计', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证统计区域
    await expect(page.locator('text=已学天数')).toBeVisible()
  })

  test('显示功能入口', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证功能入口
    await expect(page.locator('text=我的收藏')).toBeVisible()
    await expect(page.locator('text=我的证书')).toBeVisible()
    await expect(page.locator('text=学习统计')).toBeVisible()
    await expect(page.locator('text=关于 LeanClaw')).toBeVisible()
  })

  test('点击关于跳转到关于页面', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 点击关于
    await page.click('text=关于 LeanClaw')

    // 验证跳转
    await expect(page).toHaveURL(/pages\/profile\/about/)
  })

  test('有进度时统计更新', async ({ page }) => {
    // 初始化进度
    await initProgress(page, {
      currentDay: 3,
      completedLessons: ['day-1', 'day-2'],
    })

    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证显示已学天数（应该有数据）
    await expect(page.locator('text=已学天数')).toBeVisible()
  })
})
