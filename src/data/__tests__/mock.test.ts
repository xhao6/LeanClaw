import { describe, it, expect } from 'vitest'
import { resources } from '../mock'

describe('mock 资源数据', () => {
  it('应包含资源数据', () => {
    expect(resources.length).toBeGreaterThan(0)
  })

  it('每条资源应有必需字段', () => {
    resources.forEach(resource => {
      expect(resource.id).toBeDefined()
      expect(resource.title).toBeDefined()
      expect(resource.desc).toBeDefined()
      expect(resource.type).toBeDefined()
    })
  })

  it('应包含各类型资源', () => {
    const types = new Set(resources.map(r => r.type))
    expect(types.has('resource')).toBe(true)
  })

  it('应有推荐资源 (featured: true)', () => {
    const featured = resources.filter(r => r.featured)
    expect(featured.length).toBeGreaterThan(0)
  })
})
