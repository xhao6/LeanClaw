import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('统计页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })

  test('显示已学天数', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await expect(page.locator('text=已学天数').first()).toBeVisible()
  })

  test('显示完成课程', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await expect(page.locator('text=完成课程').first()).toBeVisible()
  })

  test('显示学习时长', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await expect(page.locator('text=学习时长').first()).toBeVisible()
  })

  test('显示连续打卡', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    await expect(page.locator('text=连续打卡').first()).toBeVisible()
  })
})
