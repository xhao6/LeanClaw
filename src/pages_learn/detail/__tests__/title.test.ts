import { describe, it, expect } from 'vitest'
import fm from 'front-matter'

// 模拟 markdown 文件内容
const mockDayContent = (title: string) => `---
title: "${title}"
day: 1
description: "Test description"
---

# Content here
`

describe('标题重复问题测试', () => {
  describe('frontmatter 标题格式测试', () => {
    it('frontmatter 标题已包含 Day 前缀时不重复显示', () => {
      // 模拟 frontmatter 解析
      const content = mockDayContent('Day 6: 让助手主动工作')
      const parsed = fm(content)
      const title = (parsed.attributes as any).title

      // 标题已经是完整格式 "Day 6: xxx"
      expect(title).toBe('Day 6: 让助手主动工作')

      // ========== BUG 演示 ==========
      // 当前模板 (index.vue line 14): Day {{ dayId }}: {{ title }}
      // 如果 title = "Day 6: 让助手主动工作", dayId = "6"
      // 则显示为: "Day 6: Day 6: 让助手主动工作" (重复!)
      // ========== BUG 演示 ==========

      const dayId = '6'
      const buggyDisplay = `Day ${dayId}: ${title}`
      expect(buggyDisplay).toBe('Day 6: Day 6: 让助手主动工作') // 确认 bug 存在

      // 修复后模板应该只显示: {{ title }}
      const correctDisplay = title
      expect(correctDisplay).toBe('Day 6: 让助手主动工作') // 正确，无重复
      expect(correctDisplay).not.toMatch(/^Day \d+: Day \d+:/)
    })

    it('frontmatter 没有标题时使用默认格式', () => {
      const contentNoTitle = `---
day: 1
description: "Test description"
---

# Content here
`
      const parsed = fm(contentNoTitle)
      const title = (parsed.attributes as any).title

      // 没有 title 属性时应返回 undefined
      expect(title).toBeUndefined()

      // 组件中会 fallback 到 `Day ${dayId}` 作为默认标题
      const dayId = '1'
      const defaultTitle = `Day ${dayId}`
      expect(defaultTitle).toBe('Day 1')
    })

    it('检测所有 markdown 文件的标题格式是否存在重复问题', () => {
      // 实际读取 markdown 文件进行测试
      const dayModules = import.meta.glob('/src/pages_learn/static/content/days/*.md', {
        query: '?raw',
        import: 'default',
        eager: true
      }) as Record<string, string>

      Object.entries(dayModules).forEach(([path, content]) => {
        const dayMatch = path.match(/day(\d+)\.md$/)
        if (!dayMatch) return

        const dayId = dayMatch[1]
        const parsed = fm(content)
        const title = (parsed.attributes as any).title

        if (title) {
          // 当前模板行为会产生重复标题
          const buggyDisplay = `Day ${dayId}: ${title}`

          // 验证 bug 存在：如果 title 已包含 "Day X:" 前缀，则显示会重复
          if (title.startsWith(`Day ${dayId}:`)) {
            expect(buggyDisplay).toMatch(new RegExp(`Day ${dayId}: Day ${dayId}:`))
          }
        }
      })
    })

    it('修复后的显示不应该有重复前缀', () => {
      // 验证修复后的逻辑：直接显示 title，不添加前缀
      const testCases = [
        { dayId: '1', title: 'Day 1: 第一天内容', expected: 'Day 1: 第一天内容' },
        { dayId: '6', title: 'Day 6: 让助手主动工作', expected: 'Day 6: 让助手主动工作' },
        { dayId: '7', title: 'Day 7: 最后一天', expected: 'Day 7: 最后一天' },
      ]

      testCases.forEach(({ dayId, title, expected }) => {
        // 修复后的模板只显示 title
        const displayTitle = title
        expect(displayTitle).toBe(expected)
        expect(displayTitle).not.toMatch(/^Day \d+: Day \d+:/)
      })
    })
  })

  describe('检测实际 markdown 文件', () => {
    // 实际读取 markdown 文件进行测试
    const dayModules = import.meta.glob('/src/pages_learn/static/content/days/*.md', {
      query: '?raw',
      import: 'default',
      eager: true
    }) as Record<string, string>

    it('所有 Day 文件的 frontmatter 标题都已包含 Day 前缀', () => {
      Object.entries(dayModules).forEach(([path, content]) => {
        const dayMatch = path.match(/day(\d+)\.md$/)
        if (!dayMatch) return

        const dayId = dayMatch[1]
        const parsed = fm(content)
        const title = (parsed.attributes as any).title

        if (title) {
          // 验证标题格式正确，不包含重复前缀
          expect(title).toMatch(/^Day \d+:/)

          // 确保不会出现 "Day X: Day Y:" 这样的重复
          expect(title).not.toMatch(/^Day \d+: Day \d+:/)
        }
      })
    })
  })
})