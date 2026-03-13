import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('通知页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/notifications/index')
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })

  test('显示通知列表', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/notifications/index')
    // 页面有默认通知数据
    await expect(page.locator('text=学习提醒').first()).toBeVisible()
  })

  test('显示徽章获得通知', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/notifications/index')
    await expect(page.locator('text=徽章获得').first()).toBeVisible()
  })
})
