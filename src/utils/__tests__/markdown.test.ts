import { describe, it, expect } from 'vitest'
import { renderMarkdown, parseFrontMatter } from '../markdown'

describe('markdown 渲染工具', () => {
  describe('renderMarkdown', () => {
    it('应正确渲染标题', () => {
      const html = renderMarkdown('# Hello World')
      expect(html).toContain('<h1')
      expect(html).toContain('Hello World')
    })

    it('应正确渲染段落', () => {
      const html = renderMarkdown('This is a paragraph.')
      expect(html).toContain('<p')
      expect(html).toContain('This is a paragraph')
    })

    it('应正确渲染代码块', () => {
      const html = renderMarkdown('```javascript\nconst a = 1\n```')
      expect(html).toContain('<pre')
      expect(html).toContain('hljs')
    })

    it('应正确渲染链接', () => {
      const html = renderMarkdown('[OpenClaw](https://openclaw.ai)')
      expect(html).toContain('<a')
      expect(html).toContain('href="https://openclaw.ai"')
    })

    it('应修复图片路径为云存储 URL', () => {
      const html = renderMarkdown('![img](/images/days/test.jpg)')
      expect(html).toContain('tcb.qcloud.la/images/days/test.jpg')
    })
  })

  describe('parseFrontMatter', () => {
    it('应正确解析 Front Matter', () => {
      const markdown = `---
title: Day 1
day: 1
---
# Content`
      const { attributes, body } = parseFrontMatter(markdown)
      expect(attributes.title).toBe('Day 1')
      expect(attributes.day).toBe('1')
      expect(body).toContain('# Content')
    })

    it('无 Front Matter 时应返回原始内容', () => {
      const markdown = '# Just Content'
      const { attributes, body } = parseFrontMatter(markdown)
      expect(attributes).toEqual({})
      expect(body).toBe('# Just Content')
    })
  })
})
