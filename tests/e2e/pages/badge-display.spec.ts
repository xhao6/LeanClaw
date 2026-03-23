import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('徽章显示测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('学习统计页应该显示8个徽章格子（7天徽章+连续打卡徽章）', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/stats/index')
    const badgeGrid = page.locator('.grid.grid-cols-7')
    await expect(badgeGrid).toBeVisible()
    // 应该显示8个徽章（7天徽章 + 1连续打卡徽章）
    const badges = badgeGrid.locator('.aspect-square')
    await expect(badges).toHaveCount(8)
  })

  test('首页 Logo 图片应该存在', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/index/index')
    // 检查图片元素存在 (H5编译后是img标签)
    const logo = page.locator('img').first()
    await expect(logo).toBeVisible()
  })

  test('关于页 Logo 图片应该存在', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/about/index')
    const logo = page.locator('img').first()
    await expect(logo).toBeVisible()
  })
})
