import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, getProfile as apiGetProfile, getProgress as apiGetProgress } from '@/api/modules/user'
import { syncCloudProgress } from '@/utils/learnProgress'

export const useUserStore = defineStore('user', () => {
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref({
    id: '',
    name: '龙虾驯养员',
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
      if (res.success && res.user) {
        setUserInfo(res.user)
        
        // Fetch and sync progress
        const progressRes = await apiGetProgress()
        if (progressRes.success && Array.isArray(progressRes.data)) {
           syncCloudProgress(progressRes.data)
        }
      }
      return res
    } catch (err) {
      console.error('Fetch profile failed', err)
      // Silent fail is okay if just checking status
    }
  }

  const login = async () => {
    try {
      // Call Cloud Function Login
      const res = await apiLogin()
      if (res.success) {
        setUserInfo(res.user)
        if (res.token) {
            setToken(res.token)
        }
        
        // Fetch and sync progress
        const progressRes = await apiGetProgress()
        if (progressRes.success && Array.isArray(progressRes.data)) {
           syncCloudProgress(progressRes.data)
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
        name: '龙虾驯养员',
        avatar: '',
        level: 1,
        exp: 0
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
    logout
  }
})
