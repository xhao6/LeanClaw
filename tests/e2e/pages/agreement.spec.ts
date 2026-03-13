import { test, expect } from '@playwright/test'

test.describe('用户协议页面', () => {
  test('应该能访问用户协议页面', async ({ page }) => {
    await page.goto('/pages/profile/agreement/index')
    await expect(page.locator('.title')).toContainText('用户协议')
  })

  test('应该显示所有协议章节', async ({ page }) => {
    await page.goto('/pages/profile/agreement/index')
    await expect(page.locator('.section')).toHaveCount(7)
  })

  test('应该显示更新时间', async ({ page }) => {
    await page.goto('/pages/profile/agreement/index')
    await expect(page.locator('.update-time')).toContainText('2026')
  })
})
