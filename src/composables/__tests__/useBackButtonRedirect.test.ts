import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBackButtonRedirect } from '../useBackButtonRedirect'

// Mock uni 对象
const mockUni = {
  redirectTo: vi.fn(),
  reLaunch: vi.fn(),
  onAppRoute: vi.fn(),
  offAppRoute: vi.fn(),
}

// 设置全局 uni mock
vi.stubGlobal('uni', mockUni)

describe('useBackButtonRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('基础功能测试', () => {
    it('应正确导出 composable', () => {
      expect(typeof useBackButtonRedirect).toBe('function')
    })

    it('应返回一个包含 handleBackPress 的对象', () => {
      const result = useBackButtonRedirect()
      expect(result).toHaveProperty('handleBackPress')
      expect(typeof result.handleBackPress).toBe('function')
    })
  })

  describe('handleBackPress 函数测试', () => {
    it('应调用 uni.redirectTo 跳转到指定页面', () => {
      const { handleBackPress } = useBackButtonRedirect('/pages/index/index')
      handleBackPress()
      expect(mockUni.redirectTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/index/index',
        })
      )
    })

    it('应使用默认页面路径 when 未传入参数', () => {
      const { handleBackPress } = useBackButtonRedirect()
      handleBackPress()
      expect(mockUni.redirectTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/index/index',
        })
      )
    })

    it('应调用 uni.reLaunch when redirectTo 失败', () => {
      mockUni.redirectTo.mockImplementationOnce((options: any) => {
        options.fail?.({ errMsg: 'fail' })
      })
      const { handleBackPress } = useBackButtonRedirect('/pages/learn/index')
      handleBackPress()
      expect(mockUni.reLaunch).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/learn/index',
        })
      )
    })

    it('应返回 true 表示阻止默认返回行为', () => {
      const { handleBackPress } = useBackButtonRedirect()
      const result = handleBackPress()
      expect(result).toBe(true)
    })
  })

  describe('自定义页面路径测试', () => {
    it('应使用自定义页面路径', () => {
      const { handleBackPress } = useBackButtonRedirect('/pages/discover/index')
      handleBackPress()
      expect(mockUni.redirectTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/discover/index',
        })
      )
    })
  })
})
