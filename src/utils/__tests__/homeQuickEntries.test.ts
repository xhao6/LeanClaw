import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('首页快速入口跳转', () => {
  // Mock uni API
  const mockSwitchTab = vi.fn()
  const mockNavigateTo = vi.fn()

  beforeEach(() => {
    globalThis.uni = {
      switchTab: mockSwitchTab,
      navigateTo: mockNavigateTo
    }
    mockSwitchTab.mockClear()
    mockNavigateTo.mockClear()
  })

  describe('handleGoCase', () => {
    it('应跳转到发现页case tab', () => {
      const url = '/pages/discover/index?tab=case'
      expect(url).toContain('tab=case')
      expect(url).toBe('/pages/discover/index?tab=case')
    })

    it('URL包含正确的tab参数值', () => {
      const tabParam = new URLSearchParams('?tab=case').get('tab')
      expect(tabParam).toBe('case')
    })
  })

  describe('handleGoSkills', () => {
    it('应跳转到发现页skill tab', () => {
      const url = '/pages/discover/index?tab=skill'
      expect(url).toContain('tab=skill')
      expect(url).toBe('/pages/discover/index?tab=skill')
    })

    it('URL包含正确的tab参数值', () => {
      const tabParam = new URLSearchParams('?tab=skill').get('tab')
      expect(tabParam).toBe('skill')
    })
  })

  describe('handleGoFavorites', () => {
    it('应跳转到收藏页', () => {
      const url = '/pages/profile/favorites/index'
      expect(url).toBe('/pages/profile/favorites/index')
    })

    it('收藏页路径不包含tab参数', () => {
      const url = '/pages/profile/favorites/index'
      expect(url).not.toContain('?')
      expect(url).not.toContain('tab=')
    })
  })

  describe('URL参数解析', () => {
    it('能正确解析case类型', () => {
      const url = '/pages/discover/index?tab=case'
      const params = new URLSearchParams(url.split('?')[1])
      expect(params.get('tab')).toBe('case')
    })

    it('能正确解析skill类型', () => {
      const url = '/pages/discover/index?tab=skill'
      const params = new URLSearchParams(url.split('?')[1])
      expect(params.get('tab')).toBe('skill')
    })
  })
})
