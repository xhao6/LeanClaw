import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('案例详情页测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/case/detail?id=smart-home')
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })

  test('显示场景描述', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/case/detail?id=smart-home')
    await expect(page.locator('text=场景描述').first()).toBeVisible()
  })

  test('显示配置步骤', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/case/detail?id=smart-home')
    await expect(page.locator('text=配置步骤').first()).toBeVisible()
  })

  test('显示核心代码', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/case/detail?id=smart-home')
    await expect(page.locator('text=核心代码').first()).toBeVisible()
  })

  test('显示复制按钮', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/case/detail?id=smart-home')
    await expect(page.locator('text=复制').first()).toBeVisible()
  })

  test('显示尝试运行按钮', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/case/detail?id=smart-home')
    await expect(page.locator('text=尝试运行').first()).toBeVisible()
  })
})
