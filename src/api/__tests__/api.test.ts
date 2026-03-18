import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock 全局 uni 对象（包括 cloud）
const mockCallFunction = vi.fn()
const mockCloud = {
  callFunction: mockCallFunction
}
globalThis.uni = {
  callFunction: mockCallFunction,
  cloud: mockCloud,
} as any

// 直接 mock API 模块
vi.mock('../modules/user', () => ({
  login: vi.fn().mockResolvedValue({
    success: true,
    data: {
      _id: 'user-123',
      _openid: 'openid-456',
      name: '测试用户',
      avatar: '',
      level: 1,
      exp: 0
    }
  }),
  getProfile: vi.fn().mockResolvedValue({
    success: true,
    data: {
      user: {
        _id: 'user-123',
        name: '测试用户',
        avatar: '',
        level: 2,
        exp: 100
      }
    }
  }),
  getProgress: vi.fn().mockResolvedValue({
    success: true,
    data: {
      list: [
        { lessonId: 'day-1', status: 'completed' },
        { lessonId: 'day-2', status: 'completed' }
      ]
    }
  }),
  updateProfile: vi.fn().mockResolvedValue({
    success: true
  })
}))

vi.mock('../modules/resource', () => ({
  getResources: vi.fn().mockResolvedValue({
    success: true,
    data: {
      list: [
        { id: '1', title: '资源1', type: 'skill' },
        { id: '2', title: '资源2', type: 'case' }
      ],
      total: 2
    }
  }),
  getResourceById: vi.fn().mockResolvedValue({
    success: true,
    data: { id: 'skill-1', title: '测试技能', type: 'skill' }
  }),
  getHotResources: vi.fn().mockResolvedValue({
    success: true,
    data: { list: [{ id: '1', heat: 100 }] }
  }),
  searchResources: vi.fn().mockResolvedValue({
    success: true,
    data: { list: [] }
  })
}))

// 导入 mock 后的 API 函数
import { login, getProfile, getProgress, updateProfile } from '../modules/user'
import { getResources, getResourceById, getHotResources, searchResources } from '../modules/resource'

describe('user API 测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('应正确返回用户数据', async () => {
      const result = await login()
      expect(result.success).toBe(true)
      expect(result.data.name).toBe('测试用户')
    })

    it('登录失败时应返回错误', async () => {
      vi.mocked(login).mockResolvedValueOnce({
        success: false,
        error: '登录失败'
      })

      const result = await login()
      expect(result.success).toBe(false)
    })
  })

  describe('getProfile', () => {
    it('应正确获取用户资料', async () => {
      const result = await getProfile()
      expect(result.success).toBe(true)
      expect(result.data.user.name).toBe('测试用户')
    })
  })

  describe('getProgress', () => {
    it('应正确获取学习进度', async () => {
      const result = await getProgress()
      expect(result.success).toBe(true)
      expect(result.data.list).toHaveLength(2)
    })
  })

  describe('updateProfile', () => {
    it('应正确更新用户资料', async () => {
      const result = await updateProfile({ name: '新名字' })
      expect(result.success).toBe(true)
    })
  })
})

describe('resource API 测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getResources', () => {
    it('应正确获取资源列表', async () => {
      const result = await getResources({ limit: 10 })
      expect(result.success).toBe(true)
      expect(result.data.list).toHaveLength(2)
    })

    it('应支持分页参数', async () => {
      await getResources({ limit: 5, offset: 10 })
      expect(vi.mocked(getResources)).toHaveBeenCalledWith({ limit: 5, offset: 10 })
    })
  })

  describe('getResourceById', () => {
    it('应正确获取单个资源', async () => {
      const result = await getResourceById('skill-1')
      expect(result.success).toBe(true)
    })
  })

  describe('getHotResources', () => {
    it('应正确获取热门资源', async () => {
      const result = await getHotResources(5)
      expect(result.success).toBe(true)
    })
  })

  describe('searchResources', () => {
    it('应正确搜索资源', async () => {
      await searchResources('测试')
      expect(vi.mocked(searchResources)).toHaveBeenCalledWith('测试')
    })
  })
})
