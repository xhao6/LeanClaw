import { test, expect } from '@playwright/test'

test.describe('隐私政策页面', () => {
  test('应该能访问隐私政策页面', async ({ page }) => {
    await page.goto('/pages/profile/privacy/index')
    await expect(page.locator('.title')).toContainText('隐私政策')
  })

  test('应该显示所有隐私条款', async ({ page }) => {
    await page.goto('/pages/profile/privacy/index')
    await expect(page.locator('.section')).toHaveCount(7)
  })

  test('应该显示更新时间', async ({ page }) => {
    await page.goto('/pages/profile/privacy/index')
    await expect(page.locator('.update-time')).toContainText('2026')
  })
})
