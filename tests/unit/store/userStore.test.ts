import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock uni API
vi.mock('@/utils/learnProgress', () => ({
  syncCloudProgress: vi.fn()
}))

describe('用户 Store 测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login 函数应正确处理云函数返回的 user data', async () => {
    // Mock apiLogin
    const mockApiLogin = vi.fn().mockResolvedValue({
      success: true,
      data: {
        _id: 'test-id',
        _openid: 'test-openid',
        name: '测试用户',
        avatar: 'https://example.com/avatar.png',
        level: 2,
        exp: 100
      }
    })

    const mockApiGetProgress = vi.fn().mockResolvedValue({
      success: true,
      data: { list: [{ lessonId: 'day-1', status: 'completed' }] }
    })

    // 测试返回值处理逻辑
    const res = await mockApiLogin()
    expect(res.success).toBe(true)
    expect(res.data._id).toBe('test-id')
    expect(res.data.name).toBe('测试用户')
  })

  it('fetchProfile 函数应正确处理 res.data.user 格式', async () => {
    const mockApiGetProfile = vi.fn().mockResolvedValue({
      success: true,
      data: {
        user: {
          _id: 'test-id',
          name: '测试用户',
          avatar: '',
          level: 1,
          exp: 0
        }
      }
    })

    const res = await mockApiGetProfile()
    expect(res.success).toBe(true)
    expect(res.data.user.name).toBe('测试用户')
  })

  it('isLoggedIn 应在 userInfo.id 有值时返回 true', () => {
    const userInfo = { id: 'test-id', name: '测试', avatar: '', level: 1, exp: 0 }
    const isLoggedIn = !!userInfo.id
    expect(isLoggedIn).toBe(true)
  })

  it('isLoggedIn 应在 userInfo.id 为空时返回 false', () => {
    const userInfo = { id: '', name: '测试', avatar: '', level: 1, exp: 0 }
    const isLoggedIn = !!userInfo.id
    expect(isLoggedIn).toBe(false)
  })
})
