import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

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

  test('显示完成学习提示', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/certificate/index')
    await expect(page.locator('text=完成 7 天学习即可获得证书').first()).toBeVisible()
  })
})
