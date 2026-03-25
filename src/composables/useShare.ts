import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { reactive } from 'vue'

// 全局分享配置 - 使用 reactive 以便动态更新
const shareState = reactive({
  title: '轻学Claw - 7天学会OpenClaw',
  path: '/pages/index/index',
  imageUrl: '/static/images/logo.webp'
})

// 是否已注册全局分享
let isGlobalShareRegistered = false

/**
 * 初始化全局分享（仅首次调用生效）
 * 在 App.vue 中调用
 */
export function initGlobalShare() {
  if (isGlobalShareRegistered) return
  isGlobalShareRegistered = true

  // 分享到朋友 - 返回 getter 函数，动态读取最新配置
  onShareAppMessage(() => {
    return {
      title: shareState.title,
      path: shareState.path,
      imageUrl: shareState.imageUrl
    }
  })

  // 分享到朋友圈
  onShareTimeline(() => {
    return {
      title: shareState.title,
      imageUrl: shareState.imageUrl,
      query: ''
    }
  })
}

/**
 * 设置当前页面的分享配置
 * 在页面 onLoad 中调用
 */
export function setShareConfig(options: { title?: string; path?: string; imageUrl?: string }) {
  if (options.title) shareState.title = options.title
  if (options.path) shareState.path = options.path
  if (options.imageUrl) shareState.imageUrl = options.imageUrl
}

/**
 * 重置为默认分享配置
 */
export function resetShareConfig() {
  shareState.title = '轻学Claw - 7天学会OpenClaw'
  shareState.path = '/pages/index/index'
  shareState.imageUrl = '/static/images/logo.webp'
}

/**
 * 获取当前分享配置
 */
export function getShareConfig() {
  return {
    title: shareState.title,
    path: shareState.path,
    imageUrl: shareState.imageUrl
  }
}

/**
 * 兼容旧 API
 */
export function useShare() {
  return {
    initShareToFriend: initGlobalShare,
    initShareToTimeline: initGlobalShare,
    copyLink: () => {
      const url = `${location.origin}${shareState.path}`
      uni.setClipboardData({
        data: url,
        success: () => uni.showToast({ title: '链接已复制', icon: 'success' }),
        fail: () => uni.showToast({ title: '复制失败', icon: 'none' })
      })
    }
  }
}
