/**
 * E2E 测试 - 关于我们和用户协议页面
 *
 * 注意：此测试使用 Playwright 针对 H5 构建版本运行。
 * 如需测试微信小程序原生版本，需要使用 WeChat DevTools 和
 * @anthropic-ai/miniprogram-automator 框架。
 *
 * 运行方式:
 * - H5 版本: npx playwright test e2e/about-agreement.spec.ts
 * - 微信小程序: 需要 WeChat DevTools 环境
 */

import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('关于我们页面 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/about/index`)
    await page.waitForLoadState('networkidle')
  })

  test('应正确显示联系信息', async ({ page }) => {
    // 验证邮箱显示
    await expect(page.locator('text=xhaoca@foxmail.com').first()).toBeVisible()
  })

  test('应显示版权年份', async ({ page }) => {
    // 验证版权年份 - 2026
    await expect(page.locator('text=2026').first()).toBeVisible()
  })

  test('应显示关于我们标题', async ({ page }) => {
    // 验证关于我们标题
    await expect(page.locator('text=关于我们').first()).toBeVisible()
  })

  test('应显示功能特点', async ({ page }) => {
    // 验证功能特点内容
    await expect(page.locator('text=功能特点').first()).toBeVisible()
    await expect(page.locator('text=7天学习路径').first()).toBeVisible()
  })

  test('应显示联系我们', async ({ page }) => {
    // 验证联系我们标题
    await expect(page.locator('text=联系我们').first()).toBeVisible()
  })

  test('不应显示 GitHub 联系方式', async ({ page }) => {
    // 验证不显示 GitHub
    await expect(page.locator('text=GitHub').first()).not.toBeVisible()
  })

  test('应显示版本号', async ({ page }) => {
    // 验证版本号
    await expect(page.locator('text=v1.0.0').first()).toBeVisible()
  })
})

test.describe('用户协议页面 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/pages/profile/agreement/index`)
    await page.waitForLoadState('networkidle')
  })

  test('应显示版权声明章节', async ({ page }) => {
    // 验证版权声明章节存在
    await expect(page.locator('text=八、版权声明').first()).toBeVisible()
  })

  test('应显示 MIT 协议链接', async ({ page }) => {
    // 验证 MIT 协议链接存在
    await expect(page.locator('text=https://opensource.org/licenses/MIT').first()).toBeVisible()
  })

  test('应显示服务条款', async ({ page }) => {
    // 验证服务条款章节
    await expect(page.locator('text=一、服务条款').first()).toBeVisible()
  })

  test('应显示协议更新时间', async ({ page }) => {
    // 验证最后更新日期
    await expect(page.locator('text=最后更新: 2026年3月14日').first()).toBeVisible()
  })

  test('应显示版权年份', async ({ page }) => {
    // 验证底部版权年份
    await expect(page.locator('text=2026').first()).toBeVisible()
  })
})
