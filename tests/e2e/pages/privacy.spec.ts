import { test, expect } from '@playwright/test'
import { BASE_URL } from '../utils/testHelpers'

test.describe('隐私政策页面', () => {
  test('应该能通过菜单访问隐私政策页面', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/index')
    // 点击隐私政策
    await page.click('text=隐私政策')
    // 等待页面跳转
    await page.waitForTimeout(500)
    // 验证隐私政策页面显示
    await expect(page.locator('text=隐私政策').first()).toBeVisible()
  })
})
