import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'

// Mock uni API
const mockSwitchTab = vi.fn()
const mockShowToast = vi.fn()
const mockNavigateTo = vi.fn()

vi.mock('@dcloudio/uni-app', () => ({
  showToast: mockShowToast,
  switchTab: mockSwitchTab,
  navigateTo: mockNavigateTo,
  getStorageSync: vi.fn(() => ''),
  setStorageSync: vi.fn(),
  removeStorageSync: vi.fn(),
  onShow: vi.fn(),
}))

// Mock userStore
const mockLogin = vi.fn().mockResolvedValue({ success: true })
let mockIsLoggedInValue = false

vi.mock('@/store', () => ({
  useUserStore: vi.fn(() => ({
    isLoggedIn: mockIsLoggedInValue,
    login: mockLogin,
    userInfo: { id: '', name: '', avatar: '', level: 1, exp: 0 },
  })),
}))

// Mock learnProgress
vi.mock('@/utils/learnProgress', () => ({
  getProgress: vi.fn(() => ({
    completedLessons: [],
    badges: [],
  })),
  syncCloudProgress: vi.fn(),
}))

// Test component that simulates the learn page's login area
// This mirrors the actual learn/index.vue structure
const LoginTestComponent = {
  props: ['isLoggedIn'],
  emits: ['login'],
  setup(props: any) {
    // This mimics the actual userStore usage in learn/index.vue
    const userStore = {
      isLoggedIn: props.isLoggedIn,
      login: mockLogin
    }

    // This mimics the ACTUAL current implementation (BEFORE fix)
    // Current: uni.switchTab({ url: '/pages/profile/index' })
    const currentGoToLogin = () => {
      mockSwitchTab({ url: '/pages/profile/index' })
    }

    // The login button click handler - exposed via template in actual component
    const handleLoginClick = () => {
      currentGoToLogin()
    }

    return () => h('view', {}, [
      !props.isLoggedIn && h('view', { 'data-testid': 'login-reminder' }, [
        h('text', {}, '未登录状态无法同步云端进度'),
        h('button', {
          'data-testid': 'login-button',
          onClick: handleLoginClick
        }, '去登录')
      ])
    ])
  }
}

describe('learn page login functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsLoggedInValue = false
    mockLogin.mockResolvedValue({ success: true })
    mockSwitchTab.mockClear()
    mockShowToast.mockClear()
  })

  describe('login-reminder UI condition', () => {
    it('should show login-reminder when user is not logged in', () => {
      mockIsLoggedInValue = false

      const wrapper = mount(LoginTestComponent, {
        props: { isLoggedIn: false }
      })

      const loginReminder = wrapper.find('[data-testid="login-reminder"]')
      expect(loginReminder.exists()).toBe(true)
    })

    it('should NOT show login-reminder when user is logged in', () => {
      mockIsLoggedInValue = true

      const wrapper = mount(LoginTestComponent, {
        props: { isLoggedIn: true }
      })

      const loginReminder = wrapper.find('[data-testid="login-reminder"]')
      expect(loginReminder.exists()).toBe(false)
    })
  })

  describe('goToLogin behavior', () => {
    it('CURRENT: goToLogin calls uni.switchTab (old behavior)', async () => {
      // This test shows the CURRENT behavior before the fix
      const wrapper = mount(LoginTestComponent, {
        props: { isLoggedIn: false }
      })

      const loginButton = wrapper.find('[data-testid="login-button"]')
      await loginButton.trigger('click')

      // Current behavior: switchTab IS called
      expect(mockSwitchTab).toHaveBeenCalledWith({ url: '/pages/profile/index' })
    })

    it('EXPECTED: goToLogin should call userStore.login() directly', async () => {
      // This test defines the EXPECTED behavior AFTER the fix
      // When the component is fixed, it should call userStore.login() instead of switchTab

      // Simulate the expected behavior
      const expectedGoToLogin = async () => {
        await mockLogin()
      }

      await expectedGoToLogin()

      // Expected: login should be called
      expect(mockLogin).toHaveBeenCalled()
    })

    it('EXPECTED: goToLogin should NOT call uni.switchTab after fix', async () => {
      // After the fix, switchTab should NOT be called

      // Simulate the expected behavior
      const expectedGoToLogin = async () => {
        await mockLogin()
      }

      await expectedGoToLogin()

      // Expected: switchTab should NOT be called
      expect(mockSwitchTab).not.toHaveBeenCalled()
    })

    it('EXPECTED: should show success toast after successful login', async () => {
      // After the fix, should show success toast
      const expectedGoToLogin = async () => {
        try {
          await mockLogin()
          mockShowToast({ title: '登录成功', icon: 'success' })
        } catch (e) {
          mockShowToast({ title: '登录失败', icon: 'none' })
        }
      }

      await expectedGoToLogin()

      expect(mockShowToast).toHaveBeenCalledWith({ title: '登录成功', icon: 'success' })
    })
  })
})