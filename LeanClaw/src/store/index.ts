import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref({
    id: '',
    name: '龙虾驯养员',
    avatar: '',
  })

  const setToken = (t: string) => {
    token.value = t
    uni.setStorageSync('token', t)
  }

  const setUserInfo = (info: any) => {
    userInfo.value = { ...userInfo.value, ...info }
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
  }
})
