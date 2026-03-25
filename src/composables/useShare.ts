import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

// 默认分享配置
let defaultTitle = '轻学Claw - 7天学会OpenClaw'
let defaultPath = '/pages/index/index'
let defaultImageUrl = '/static/images/logo.webp'

// 是否已注册全局分享
let isGlobalShareRegistered = false

/**
 * 初始化全局分享（仅首次调用生效）
 * 后续页面可通过 setShareConfig 更新配置
 */
export function initGlobalShare() {
  if (isGlobalShareRegistered) return
  isGlobalShareRegistered = true

  // 分享到朋友
  onShareAppMessage(() => {
    return {
      title: defaultTitle,
      path: defaultPath,
      imageUrl: defaultImageUrl
    }
  })

  // 分享到朋友圈
  onShareTimeline(() => {
    return {
      title: defaultTitle,
      imageUrl: defaultImageUrl,
      query: ''
    }
  })
}

/**
 * 设置当前页面的分享配置
 */
export function setShareConfig(options: { title?: string; path?: string; imageUrl?: string }) {
  if (options.title) defaultTitle = options.title
  if (options.path) defaultPath = options.path
  if (options.imageUrl) defaultImageUrl = options.imageUrl
}

/**
 * 重置为默认分享配置
 */
export function resetShareConfig() {
  defaultTitle = '轻学Claw - 7天学会OpenClaw'
  defaultPath = '/pages/index/index'
  defaultImageUrl = '/static/images/logo.webp'
}

/**
 * 兼容旧 API（用于 profile 页面的"转发给朋友"入口）
 */
export function useShare() {
  return {
    initShareToFriend: initGlobalShare,
    initShareToTimeline: initGlobalShare,
    copyLink: () => {
      const url = `${location.origin}${defaultPath}`
      uni.setClipboardData({
        data: url,
        success: () => uni.showToast({ title: '链接已复制', icon: 'success' }),
        fail: () => uni.showToast({ title: '复制失败', icon: 'none' })
      })
    }
  }
}