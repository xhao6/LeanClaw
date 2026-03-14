import { describe, test, expect } from '@jest/globals'

describe('imageHandler', () => {
  test('generateFilename should generate consistent md5 hash', async () => {
    const { generateFilename } = await import('../imageHandler.js')
    const result1 = generateFilename('https://example.com/image.png')
    const result2 = generateFilename('https://example.com/image.png')
    expect(result1).toBe(result2)
    expect(result1).toMatch(/\.webp$/)
  })
})
