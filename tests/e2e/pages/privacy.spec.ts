import { test, expect } from '@playwright/test'

test.describe('隐私政策页面', () => {
  test('应该能通过菜单访问隐私政策页面', async ({ page }) => {
    await page.goto('/')
    // 点击"我的"tab
    await page.click('text=我的')
    // 点击隐私政策
    await page.click('text=隐私政策')
    await expect(page.locator('text=隐私政策')).toBeVisible()
  })
})
