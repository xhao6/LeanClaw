import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, getProfile as apiGetProfile, getProgress as apiGetProgress, updateProfile as apiUpdateProfile } from '@/api/modules/user'
import { syncCloudProgress } from '@/utils/learnProgress'

export const useUserStore = defineStore('user', () => {
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref({
    id: '',
    name: '',
    avatar: '',
    level: 1,
    exp: 0
  })

  const isLoggedIn = computed(() => !!userInfo.value.id)

  const setToken = (t: string) => {
    token.value = t
    uni.setStorageSync('token', t)
  }

  const setUserInfo = (info: any) => {
    // Merge existing info
    userInfo.value = { ...userInfo.value, ...info }
  }

  const fetchProfile = async () => {
    try {
      const res = await apiGetProfile()
      // 适配云函数返回格式：res.data.user
      if (res.success && res.data && res.data.user) {
        const user = res.data.user
        setUserInfo({
          id: user._id || user._openid,
          name: user.name || '龙虾驯养员',
          avatar: user.avatar || '',
          level: user.level || 1,
          exp: user.exp || 0
        })

        // Fetch and sync progress
        const progressRes = await apiGetProgress()
        if (progressRes.success && progressRes.data && progressRes.data.list) {
           syncCloudProgress(progressRes.data.list)
        }
      }
      return res
    } catch (err) {
      console.error('Fetch profile failed', err)
    }
  }

  const login = async (wechatUserInfo?: any) => {
    try {
      // 处理微信用户信息：过滤掉默认的"微信用户"和默认头像
      let filteredWechatInfo = wechatUserInfo
      if (wechatUserInfo) {
        // 检查是否返回了默认的用户名（微信在 2022 年后调整了 API）
        const isDefaultName = !wechatUserInfo.nickName ||
          wechatUserInfo.nickName === '微信用户' ||
          wechatUserInfo.nickName === 'WeChat'
        // 检查是否返回了默认的头像（灰色头像）
        const isDefaultAvatar = !wechatUserInfo.avatarUrl ||
          wechatUserInfo.avatarUrl.includes('https://wx.qlogo.cn/mmhead/')

        if (isDefaultName || isDefaultAvatar) {
          // 如果是默认值，传 null 让后端使用默认
          filteredWechatInfo = null
        }
      }

      // Call Cloud Function Login，传递微信用户信息
      const res = await apiLogin(filteredWechatInfo ? { userInfo: filteredWechatInfo } : undefined)
      // 适配云函数返回格式：res.data
      if (res.success && res.data) {
        const user = res.data
        setUserInfo({
          id: user._id || user._openid,
          name: user.name || '龙虾驯养员',
          avatar: user.avatar || '',
          level: user.level || 1,
          exp: user.exp || 0
        })
        // 不需要 token，CloudBase 自动管理 OpenID

        // Fetch and sync progress
        const progressRes = await apiGetProgress()
        if (progressRes.success && progressRes.data && progressRes.data.list) {
           syncCloudProgress(progressRes.data.list)
        }
      }
      return res
    } catch (err) {
      console.error('Login action failed', err)
      throw err
    }
  }

  const logout = () => {
    token.value = ''
    uni.removeStorageSync('token')
    userInfo.value = {
        id: '',
        name: '',
        avatar: '',
        level: 1,
        exp: 0
    }
  }

  const updateUserInfo = async (info: { name?: string; avatar?: string }) => {
    try {
      const res = await apiUpdateProfile(info)
      if (res.success) {
        setUserInfo(info)
        return { success: true }
      }
      return res
    } catch (err) {
      console.error('Update user info failed', err)
      return { success: false, message: '更新失败' }
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    login,
    fetchProfile,
    logout,
    updateUserInfo
  }
})
