import { test, expect } from '@playwright/test'
import { clearStorage, initProgress, initFavorites, initLoginState, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('我的页面测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('显示未登录状态', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证未登录状态
    await expect(page.locator('text=点击登录')).toBeVisible()
    await expect(page.locator('text=登录同步学习进度')).toBeVisible()
  })

  test('未登录时不显示退出登录按钮', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证未登录时不显示退出登录按钮
    await expect(page.locator('text=退出登录')).not.toBeVisible()
  })

  test('显示学习统计', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证统计区域 - 新的布局：完成课程 | 我的收藏 | 我的徽章
    await expect(page.locator('text=完成课程')).toBeVisible()
    await expect(page.locator('text=我的徽章')).toBeVisible()
    // 我的收藏在 Stats Card 中，用 first() 取第一个
    await expect(page.getByText('我的收藏').first()).toBeVisible()
  })

  test('显示功能入口', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证功能入口 - 收藏在 Stats Card 和 menu 中都有
    await expect(page.locator('text=我的证书')).toBeVisible()
    await expect(page.locator('text=学习统计')).toBeVisible()
    await expect(page.locator('text=清除缓存')).toBeVisible()
    await expect(page.locator('text=关于 轻学Claw')).toBeVisible()
  })

  test('点击关于跳转到关于页面', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 点击关于
    await page.click('text=关于 轻学Claw')

    // 验证跳转
    await expect(page).toHaveURL(/pages\/profile\/about/)
  })

  test('有进度时统计更新', async ({ page }) => {
    // 初始化进度
    await initProgress(page, {
      currentDay: 3,
      completedLessons: ['day-1', 'day-2'],
    })

    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 验证显示完成课程数量（应该是 2）
    await expect(page.locator('text=完成课程')).toBeVisible()
    // 完成课程数字应该是 2
    await expect(page.locator('text=2').first()).toBeVisible()
  })

  test('点击 Stats Card 中的收藏可跳转', async ({ page }) => {
    // 初始化收藏
    await initFavorites(page, [
      { id: 'fav-1', type: 'resource', title: '测试收藏' }
    ])

    await page.goto(`${BASE_URL}/#/pages/profile/index`)

    // 点击 Stats Card 中的收藏（第一个）
    await page.getByText('我的收藏').first().click()

    // 验证跳转到收藏页面
    await expect(page).toHaveURL(/pages\/profile\/favorites/)
  })

  // ==================== 登录状态测试 ====================

  // 注意：设置入口已隐藏，相关测试已移除
})
