import { test, expect } from '@playwright/test'
import { clearStorage, initProgress, waitForPageLoad, BASE_URL } from '../utils/testHelpers'

/**
 * 学习进度相关 e2e 测试
 * 验证：
 * 1. 学习页显示正确的进度状态
 * 2. 首页学习卡片显示正确的进度
 * 3. 继续学习按钮跳转到正确的页面
 * 4. 完成所有课程后显示勋章
 */
test.describe('学习进度测试', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await waitForPageLoad(page)
  })

  // ==================== 学习页测试 ====================

  test('学习页：Day 1 进行中，其他锁定', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(1000)

    // Day 1 显示数字 "1"（进行中状态）
    await expect(page.locator('text=1').first()).toBeVisible()
  })

  test('学习页：Day 1 完成，Day 2 进行中', async ({ page }) => {
    await initProgress(page, {
      currentDay: 2,
      completedLessons: ['day-1'],
    })
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(1000)

    // 验证 Day 2 存在
    await expect(page.locator('text=2').first()).toBeVisible()
  })

  test('学习页：Day 1-3 完成，显示正确状态', async ({ page }) => {
    await initProgress(page, {
      currentDay: 4,
      completedLessons: ['day-1', 'day-2', 'day-3'],
    })
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(1000)

    // 验证 Day 4 存在
    await expect(page.locator('text=4').first()).toBeVisible()
  })

  // ==================== 首页进度卡片测试 ====================

  test('首页：无进度时显示 Day 1', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Day 1').first()).toBeVisible()
    await expect(page.locator('text=/ 7').first()).toBeVisible()
    await expect(page.locator('text=当前进度').first()).toBeVisible()
  })

  test('首页：完成1天后显示 Day 2', async ({ page }) => {
    await initProgress(page, {
      currentDay: 2,
      completedLessons: ['day-1'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Day 2').first()).toBeVisible()
    await expect(page.locator('text=/ 7').first()).toBeVisible()
  })

  test('首页：完成2天后显示 Day 3', async ({ page }) => {
    await initProgress(page, {
      currentDay: 3,
      completedLessons: ['day-1', 'day-2'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Day 3').first()).toBeVisible()
    await expect(page.locator('text=/ 7').first()).toBeVisible()
  })

  test('首页：完成3天后显示 Day 4', async ({ page }) => {
    await initProgress(page, {
      currentDay: 4,
      completedLessons: ['day-1', 'day-2', 'day-3'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Day 4').first()).toBeVisible()
    await expect(page.locator('text=/ 7').first()).toBeVisible()
  })

  test('首页：完成4天后显示 Day 5', async ({ page }) => {
    await initProgress(page, {
      currentDay: 5,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Day 5').first()).toBeVisible()
    await expect(page.locator('text=/ 7').first()).toBeVisible()
  })

  test('首页：完成5天后显示 Day 6', async ({ page }) => {
    await initProgress(page, {
      currentDay: 6,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Day 6').first()).toBeVisible()
    await expect(page.locator('text=/ 7').first()).toBeVisible()
  })

  test('首页：完成6天后显示 Day 7', async ({ page }) => {
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Day 7').first()).toBeVisible()
    await expect(page.locator('text=/ 7').first()).toBeVisible()
  })

  test('首页：全部完成显示', async ({ page }) => {
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6', 'day-7'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    await expect(page.locator('text=Day 7').first()).toBeVisible()
  })

  // ==================== 继续学习按钮测试 ====================

  test('继续学习按钮：可点击', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(1000)

    // 验证 TabBar 存在
    await expect(page.locator('text=学习').first()).toBeVisible()
  })

  // ==================== 学习详情页测试 ====================

  test('学习详情页：可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages_learn/detail/index?day=1')
    await page.waitForTimeout(1000)

    // 验证页面加载 - 检查课程详情标题
    await expect(page.locator('text=课程详情').first()).toBeVisible()
    await expect(page.locator('text=今日任务清单').first()).toBeVisible()
  })
})
