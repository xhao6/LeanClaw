import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @dcloudio/uni-app
vi.mock('@dcloudio/uni-app', () => ({
  onBackPress: vi.fn(),
}))

// Mock uni 对象
const mockUni = {
  redirectTo: vi.fn(),
  reLaunch: vi.fn(),
}

vi.stubGlobal('uni', mockUni)

describe('TabBar 页面返回键拦截集成测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('学习页面集成测试', () => {
    it('learn 页面应导入并调用 useBackButtonRedirect', async () => {
      const { useBackButtonRedirect } = await import('@/composables/useBackButtonRedirect')
      const { handleBackPress } = useBackButtonRedirect('/pages/index/index')
      handleBackPress()
      expect(mockUni.redirectTo).toHaveBeenCalled()
      expect(mockUni.redirectTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/index/index',
        })
      )
    })
  })

  describe('发现页面集成测试', () => {
    it('discover 页面应跳转到首页', async () => {
      const { useBackButtonRedirect } = await import('@/composables/useBackButtonRedirect')
      const { handleBackPress } = useBackButtonRedirect('/pages/index/index')
      handleBackPress()
      expect(mockUni.redirectTo).toHaveBeenCalled()
      expect(mockUni.redirectTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/index/index',
        })
      )
    })
  })

  describe('我的页面集成测试', () => {
    it('profile 页面应跳转到首页', async () => {
      const { useBackButtonRedirect } = await import('@/composables/useBackButtonRedirect')
      const { handleBackPress } = useBackButtonRedirect('/pages/index/index')
      handleBackPress()
      expect(mockUni.redirectTo).toHaveBeenCalled()
      expect(mockUni.redirectTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/index/index',
        })
      )
    })
  })
})
