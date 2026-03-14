import { describe, test, expect } from '@jest/globals'

describe('aiConverter', () => {
  test('replaceImageUrls should replace URLs correctly', async () => {
    const { replaceImageUrls } = await import('../aiConverter.js')
    const html = '<img src="https://old.com/img.png">'
    const mapping = { 'https://old.com/img.png': 'https://new.com/img.webp' }
    const result = replaceImageUrls(html, mapping)
    expect(result).toContain('https://new.com/img.webp')
    expect(result).not.toContain('https://old.com/img.png')
  })

  test('basicConvert should convert HTML to markdown', async () => {
    const { basicConvert } = await import('../aiConverter.js')
    const html = '<h1>标题</h1><p>内容</p>'
    const result = basicConvert(html)
    expect(result).toContain('# 标题')
  })
})
