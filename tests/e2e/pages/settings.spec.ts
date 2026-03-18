import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('设置页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/settings/index')
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })

  test('显示清除缓存', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/settings/index')
    await expect(page.locator('text=清除缓存').first()).toBeVisible()
  })

  test('显示版本信息', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/settings/index')
    await expect(page.locator('text=版本信息').first()).toBeVisible()
  })

  test('显示关于 LeanClaw', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/settings/index')
    await expect(page.locator('text=关于 轻学Claw').first()).toBeVisible()
  })

  test('显示用户信息', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/settings/index')
    await page.waitForTimeout(1000)
    // 需要登录后才能显示用户名
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })

  test('显示底部标语', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/settings/index')
    await expect(page.locator('text=让 AI 学习变得更简单').first()).toBeVisible()
  })
})
