/**
 * 请求拦截器与响应拦截器的具体处理函数
 */

export const handleBeforeRequest = (method: any) => {
  // 添加鉴权 Token
  const token = uni.getStorageSync('token')
  if (token) {
    method.config.headers.Authorization = `Bearer ${token}`
  }
}

export const handleOnSuccess = async (response: any) => {
  const { data } = response
  // 假设后端返回结构为 { code: 200, data: any, message: string }
  if (data.code !== 200) {
    throw new Error(data.message || '请求失败')
  }
  return data.data
}

export const handleOnError = (err: any) => {
  uni.showToast({
    title: err.message || '网络请求错误',
    icon: 'none',
  })
  throw err
}
