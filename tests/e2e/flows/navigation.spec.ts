import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

test.describe('导航流程测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('首页可访问', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page.locator('.uni-tabbar__label').first()).toBeVisible()
  })

  test('学习页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await expect(page.locator('text=7天学习路径').first()).toBeVisible()
  })

  test('发现页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/discover/index')
    await expect(page.locator('text=发现').first()).toBeVisible()
  })

  test('我的页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/index')
    // 未登录状态显示"点击登录"
    await expect(page.locator('text=点击登录').first()).toBeVisible()
  })

  test('学习详情页可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages_learn/detail/index?day=1')
    await expect(page.locator('text=课程详情').first()).toBeVisible()
  })

  test('技能详情页可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/skill/detail?name=Web%20%26%20Frontend')
    await expect(page.locator('text=Skill 详情').first()).toBeVisible()
  })

  test('关于页面可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/about/index')
    await expect(page.locator('.uni-page-head__title').first()).toBeVisible()
  })
})
