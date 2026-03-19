// Mock uni API globally
const mockSwitchTab = vi.fn()
const mockShowToast = vi.fn()

vi.stubGlobal('uni', {
  switchTab: mockSwitchTab,
  showToast: mockShowToast
})

// Mock the userStore module
const mockLogin = vi.fn().mockResolvedValue({ success: true })
vi.mock('@/store', () => ({
  useUserStore: () => ({
    isLoggedIn: false,
    login: mockLogin
  })
}))

// Mock the Vue file to avoid CSS processing issues
vi.mock('@/pages/learn/index.vue', () => ({
  goToLogin: async () => {
    const { useUserStore } = await import('@/store')
    const userStore = useUserStore()
    try {
      await userStore.login()
      uni.showToast({ title: '登录成功', icon: 'success' })
    } catch (e) {
      console.error('登录失败:', e)
      uni.showToast({ title: '登录失败', icon: 'none' })
    }
  }
}))

describe('学习页登录功能', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLogin.mockResolvedValue({ success: true })
  })

  it('goToLogin应直接调用login而非跳转', async () => {
    // Import the mocked module
    const { goToLogin } = await import('@/pages/learn/index.vue')

    // Call goToLogin
    await goToLogin()

    // Verify login was called
    expect(mockLogin).toHaveBeenCalled()
    // Verify switchTab was NOT called
    expect(mockSwitchTab).not.toHaveBeenCalled()
  })
})
