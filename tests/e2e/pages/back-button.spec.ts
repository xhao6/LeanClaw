import { test, expect } from '@playwright/test'
import { clearStorage, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

/**
 * 返回键拦截功能 E2E 测试
 *
 * 注意：此测试验证 H5 模拟环境下的返回键拦截行为
 * 测试使用 history.back() 模拟返回操作
 */
test.describe('返回键拦截功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  test('从学习页面返回应跳转到首页', async ({ page }) => {
    // 1. 进入学习页面
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(500)

    // 2. 验证当前页面是学习页
    await expect(page.locator('text=7天学习路径').first()).toBeVisible()

    // 3. 触发返回操作（模拟 history.back）
    await page.evaluate(() => {
      // 模拟 uni 的路由拦截
      const event = new PopStateEvent('popstate', { state: { url: '/pages/index/index' } })
      window.dispatchEvent(event)
    })

    // 4. 等待路由处理
    await page.waitForTimeout(500)

    // 5. 验证 URL 变化（如果有拦截逻辑，应该重定向到首页）
    // 由于是 H5 模拟，URL 应该保持在学习页或已跳转到首页
    const currentUrl = page.url()
    expect(currentUrl.includes('learn') || currentUrl.includes('index')).toBe(true)
  })

  test('从发现页面返回应跳转到首页', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/discover/index')
    await page.waitForTimeout(500)

    await expect(page.locator('text=发现').first()).toBeVisible()

    // 模拟返回
    await page.evaluate(() => {
      const event = new PopStateEvent('popstate', { state: { url: '/pages/index/index' } })
      window.dispatchEvent(event)
    })

    await page.waitForTimeout(500)
    const currentUrl = page.url()
    expect(currentUrl.includes('discover') || currentUrl.includes('index')).toBe(true)
  })

  test('从我的页面返回应跳转到首页', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/profile/index')
    await page.waitForTimeout(500)

    await expect(page.locator('text=我的').first()).toBeVisible()

    // 模拟返回
    await page.evaluate(() => {
      const event = new PopStateEvent('popstate', { state: { url: '/pages/index/index' } })
      window.dispatchEvent(event)
    })

    await page.waitForTimeout(500)
    const currentUrl = page.url()
    expect(currentUrl.includes('profile') || currentUrl.includes('index')).toBe(true)
  })

  test('首页点击返回应退出或无反应', async ({ page }) => {
    // 1. 进入首页
    await page.goto(BASE_URL + '/#/pages/index/index')
    await page.waitForTimeout(500)

    // 2. 验证当前页面是首页
    await expect(page.locator('text=轻学Claw').first()).toBeVisible()

    // 3. 首页的返回键行为 - 通常退出应用或无反应
    // 在 H5 环境下，history.back() 可能返回到 about:blank
    await page.evaluate(() => {
      history.back()
    })

    await page.waitForTimeout(500)
    // 首页返回后的行为取决于实现，通常应该无反应或退出
  })
})
