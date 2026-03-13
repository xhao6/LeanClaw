import { test, expect } from '@playwright/test'

test.describe('用户协议页面', () => {
  test('应该能通过菜单访问用户协议页面', async ({ page }) => {
    await page.goto('/')
    // 点击"我的"tab
    await page.click('text=我的')
    // 点击用户协议
    await page.click('text=用户协议')
    await expect(page.locator('text=用户协议')).toBeVisible()
  })
})
