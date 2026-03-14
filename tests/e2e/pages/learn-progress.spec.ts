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
    await page.waitForTimeout(500)

    // Day 1 显示数字 "1"（进行中状态）
    await expect(page.locator('.rounded-full >> text=1').first()).toBeVisible()
    // 其他 Day 显示锁图标
    // 没有已完成状态（没有勾选图标）
    const checkIcons = await page.locator('.wd-icon-check').count()
    expect(checkIcons).toBe(0)
  })

  test('学习页：Day 1 完成，Day 2 进行中', async ({ page }) => {
    await initProgress(page, {
      currentDay: 2,
      completedLessons: ['day-1'],
    })
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(500)

    // Day 1 显示勾选图标（已完成）
    await expect(page.locator('.wd-icon-check').first()).toBeVisible()
    // Day 2 显示数字 "2"（进行中）
    await expect(page.locator('.rounded-full >> text=2').first()).toBeVisible()
  })

  test('学习页：Day 1-3 完成，显示正确状态', async ({ page }) => {
    await initProgress(page, {
      currentDay: 4,
      completedLessons: ['day-1', 'day-2', 'day-3'],
    })
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(500)

    // 3个勾选图标
    const checkIcons = await page.locator('.wd-icon-check').count()
    expect(checkIcons).toBe(3)
    // Day 4 显示数字 "4"（进行中）
    await expect(page.locator('.rounded-full >> text=4').first()).toBeVisible()
  })

  test('学习页：全部完成，显示勋章', async ({ page }) => {
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6', 'day-7'],
    })
    await page.goto(BASE_URL + '/#/pages/learn/index')
    await page.waitForTimeout(500)

    // 7个勾选（全完成）
    const checkIcons = await page.locator('.wd-icon-check').count()
    expect(checkIcons).toBe(7)
    // 显示恭喜获得勋章区域
    await expect(page.locator('text=恭喜获得').first()).toBeVisible()
    await expect(page.locator('text=龙虾驯养师').first()).toBeVisible()
  })

  // ==================== 首页进度卡片测试 ====================

  test('首页：无进度时显示 Day 1, 0%', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    await expect(page.locator('text=Day 1 /').first()).toBeVisible()
    await expect(page.locator('text=0%').first()).toBeVisible()
    await expect(page.locator('text=下一章：初识 OpenClaw').first()).toBeVisible()
  })

  test('首页：完成1天后显示 Day 2, 14%', async ({ page }) => {
    await initProgress(page, {
      currentDay: 2,
      completedLessons: ['day-1'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    await expect(page.locator('text=Day 2 /').first()).toBeVisible()
    await expect(page.locator('text=14%').first()).toBeVisible()
    await expect(page.locator('text=下一章：你的第一个 AI 助手').first()).toBeVisible()
    await expect(page.locator('text=继续学习 Day 2').first()).toBeVisible()
  })

  test('首页：完成2天后显示 Day 3, 29%', async ({ page }) => {
    await initProgress(page, {
      currentDay: 3,
      completedLessons: ['day-1', 'day-2'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    await expect(page.locator('text=Day 3 /').first()).toBeVisible()
    await expect(page.locator('text=29%').first()).toBeVisible()
    await expect(page.locator('text=下一章：记忆与灵魂').first()).toBeVisible()
  })

  test('首页：完成3天后显示 Day 4, 43%', async ({ page }) => {
    await initProgress(page, {
      currentDay: 4,
      completedLessons: ['day-1', 'day-2', 'day-3'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    await expect(page.locator('text=Day 4 /').first()).toBeVisible()
    await expect(page.locator('text=43%').first()).toBeVisible()
    await expect(page.locator('text=下一章：技能系统').first()).toBeVisible()
  })

  test('首页：完成4天后显示 Day 5, 57%', async ({ page }) => {
    await initProgress(page, {
      currentDay: 5,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    await expect(page.locator('text=Day 5 /').first()).toBeVisible()
    await expect(page.locator('text=57%').first()).toBeVisible()
    await expect(page.locator('text=下一章：自动化工作流').first()).toBeVisible()
  })

  test('首页：完成5天后显示 Day 6, 71%', async ({ page }) => {
    await initProgress(page, {
      currentDay: 6,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    await expect(page.locator('text=Day 6 /').first()).toBeVisible()
    await expect(page.locator('text=71%').first()).toBeVisible()
    await expect(page.locator('text=下一章：本地化与隐私').first()).toBeVisible()
  })

  test('首页：完成6天后显示 Day 7, 86%', async ({ page }) => {
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    await expect(page.locator('text=Day 7 /').first()).toBeVisible()
    await expect(page.locator('text=86%').first()).toBeVisible()
    await expect(page.locator('text=下一章：进阶与未来').first()).toBeVisible()
  })

  test('首页：全部完成显示 100%, 恭喜完成', async ({ page }) => {
    await initProgress(page, {
      currentDay: 7,
      completedLessons: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'day-6', 'day-7'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    await expect(page.locator('text=100%').first()).toBeVisible()
    await expect(page.locator('text=下一章：全部完成').first()).toBeVisible()
    await expect(page.locator('text=恭喜完成全部课程').first()).toBeVisible()
  })

  // ==================== 继续学习按钮测试 ====================

  test('继续学习按钮：无进度时跳转到学习页', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    // 点击继续学习按钮
    await page.locator('text=继续学习').click({ force: true })
    await page.waitForTimeout(500)

    // 应跳转到学习页
    const url = page.url()
    expect(url).toContain('learn/index')
  })

  test('继续学习按钮：有进度时跳转到学习页', async ({ page }) => {
    await initProgress(page, {
      currentDay: 3,
      completedLessons: ['day-1', 'day-2'],
    })
    await page.goto(BASE_URL)
    await page.waitForTimeout(500)

    // 点击继续学习按钮
    await page.locator('text=继续学习 Day 3').click({ force: true })
    await page.waitForTimeout(500)

    // 应跳转到学习页（首页按钮使用 switchTab）
    const url = page.url()
    expect(url).toContain('learn/index')
  })

  // ==================== 学习详情页测试 ====================

  test('学习详情页：可访问', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages_learn/detail/index?day=1')
    await page.waitForTimeout(1000)

    // 页面应有课程内容或任务区域
    await expect(page.locator('text=今日任务清单').first()).toBeVisible()
  })

  test('学习详情页：Day 1 内容正确加载', async ({ page }) => {
    await page.goto(BASE_URL + '/#/pages_learn/detail/index?day=1')
    await page.waitForTimeout(1000)

    // 应该有任务
    await expect(page.locator('text=阅读并理解本章内容').first()).toBeVisible()
    await expect(page.locator('text=完成文末的思考题').first()).toBeVisible()
  })
})
