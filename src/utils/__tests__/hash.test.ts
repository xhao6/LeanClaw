import { describe, it, expect } from 'vitest'
import { hashCode } from '../hash'

describe('hashCode', () => {
  it('should return a number', () => {
    const result = hashCode('test')
    expect(typeof result).toBe('number')
  })

  it('should return the same hash for the same input', () => {
    const input = 'hello'
    expect(hashCode(input)).toBe(hashCode(input))
  })

  it('should return different hashes for different inputs', () => {
    expect(hashCode('hello')).not.toBe(hashCode('world'))
  })

  it('should return a positive number', () => {
    const result = hashCode('any string')
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it('should handle empty string', () => {
    const result = hashCode('')
    expect(typeof result).toBe('number')
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it('should handle unicode characters', () => {
    const result = hashCode('中文标签')
    expect(typeof result).toBe('number')
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it('should be deterministic based on string content', () => {
    const input = 'consistent_string'
    const result1 = hashCode(input)
    const result2 = hashCode(input)
    expect(result1).toBe(result2)
  })
})