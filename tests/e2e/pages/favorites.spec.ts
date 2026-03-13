import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('收藏页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/favorites/index')
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })

  test('显示全部Tab', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/favorites/index')
    await expect(page.locator('text=全部').first()).toBeVisible()
  })

  test('显示资源Tab', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/favorites/index')
    await expect(page.locator('text=资源').first()).toBeVisible()
  })

  test('显示案例Tab', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/favorites/index')
    await expect(page.locator('text=案例').first()).toBeVisible()
  })

  test('显示Skills Tab', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/favorites/index')
    await expect(page.locator('text=Skills').first()).toBeVisible()
  })

  test('无收藏时显示空状态', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/favorites/index')
    await expect(page.locator('text=暂无收藏内容').first()).toBeVisible()
  })
})
