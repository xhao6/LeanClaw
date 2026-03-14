import { describe, test, expect } from '@jest/globals'

describe('crawler', () => {
  test('extractImages should extract and dedupe image URLs', async () => {
    const { extractImages } = await import('../crawler.js')
    const html = '<img src="https://example.com/img.png"><img src="/relative.png">'
    const images = extractImages(html, 'https://example.com/page')
    expect(images).toContain('https://example.com/img.png')
    expect(images.length).toBeGreaterThan(0)
  })
})
