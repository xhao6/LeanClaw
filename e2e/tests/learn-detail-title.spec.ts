import { test, expect } from '@playwright/test'

/**
 * E2E 测试：学习详情页标题显示正确，无重复前缀
 *
 * 测试目的：
 * 验证学习详情页的标题显示正确，Day X 后不应再重复显示 "Day X:" 前缀
 *
 * 问题背景：
 * 修复前：导航栏标题显示 "Day 6: Day 6: 让助手主动去工作"（重复）
 * 修复后：导航栏标题显示 "Day 6: 让助手主动去工作"（正确）
 */

test.describe('学习详情页标题显示', () => {
  // 预期标题数据
  const expectedTitles: Record<string, string> = {
    '1': 'Day 1: 初识 OpenClaw',
    '2': 'Day 2: 搭建 AI 助手运行环境',
    '3': 'Day 3: Prompt 的核心技能',
    '4': 'Day 4: 让 AI 助手掌握工具',
    '5': 'Day 5: 开启长期记忆之门',
    '6': 'Day 6: 让助手主动去工作',
    '7': 'Day 7: AI 助手自主思考'
  }

  /**
   * 验证 Day 6 标题无重复
   * 问题：修复前显示 "Day 6: Day 6: 让助手主动去工作"
   * 预期：显示 "Day 6: 让助手主动去工作"
   */
  test('Day 6 标题应该正确显示，无重复前缀', async ({ page }) => {
    // 导航到 Day 6 详情页
    await page.goto('/pages_learn/detail/index?day=6')

    // 等待页面加载完成
    await page.waitForLoadState('networkidle')

    // 获取页面标题
    const title = await page.title()

    // 验证标题不包含重复的 "Day 6:"
    expect(title).not.toContain('Day 6: Day 6:')

    // 验证标题包含正确的 Day 6 标题
    expect(title).toContain('Day 6')
    expect(title).toContain('让助手主动去工作')

    // 验证标题整体格式正确（应该只有一个 "Day 6:"）
    const day6Count = (title.match(/Day 6:/g) || []).length
    expect(day6Count).toBe(1)
  })

  /**
   * 验证 Day 1 标题正确显示
   */
  test('Day 1 标题应该正确显示', async ({ page }) => {
    await page.goto('/pages_learn/detail/index?day=1')
    await page.waitForLoadState('networkidle')

    const title = await page.title()

    // 验证不包含重复模式
    expect(title).not.toContain('Day 1: Day 1:')

    // 验证包含正确内容
    expect(title).toContain('Day 1')
    expect(title).toContain('初识 OpenClaw')

    const day1Count = (title.match(/Day 1:/g) || []).length
    expect(day1Count).toBe(1)
  })

  /**
   * 验证所有 7 天标题都正确显示，无重复模式
   */
  test('所有 7 天标题都应该正确显示，无重复模式', async ({ page }) => {
    for (const [day, expectedTitle] of Object.entries(expectedTitles)) {
      // 导航到对应天的详情页
      await page.goto(`/pages_learn/detail/index?day=${day}`)
      await page.waitForLoadState('networkidle')

      // 获取页面标题
      const title = await page.title()

      // 验证标题不包含重复的 "Day X: Day X:"
      const duplicatePattern = new RegExp(`Day ${day}: Day ${day}:`)
      expect(title).not.toMatch(duplicatePattern)

      // 验证标题包含正确的 "Day X:"
      const dayPattern = new RegExp(`Day ${day}:`)
      expect(title).toMatch(dayPattern)

      // 验证标题不包含课程详情等通用标题（应该是具体标题）
      expect(title).not.toContain('课程详情')

      // 验证标题格式正确（Day X: 应该只出现一次）
      const dayMatches = title.match(new RegExp(`Day ${day}:`, 'g'))
      expect(dayMatches).toHaveLength(1)

      // 验证标题包含预期的课程名称
      const expectedSubtitle = expectedTitle.replace(`Day ${day}: `, '')
      expect(title).toContain(expectedSubtitle)
    }
  })

  /**
   * 验证导航栏标题与页面内容标题一致
   */
  test('导航栏标题应该与页面内容标题一致', async ({ page }) => {
    // 测试 Day 3
    await page.goto('/pages_learn/detail/index?day=3')
    await page.waitForLoadState('networkidle')

    // 获取文档标题（导航栏标题）
    const navTitle = await page.title()

    // 获取页面内的标题元素
    const contentTitle = await page.locator('text=/Day 3: .+/').first().textContent()

    // 验证两者一致（去除空白）
    expect(navTitle.trim()).toBe(contentTitle?.trim())
  })
})
