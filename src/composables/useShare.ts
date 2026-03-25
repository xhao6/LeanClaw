import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { reactive } from 'vue'

// 全局分享配置
const shareState = reactive({
  title: '轻学Claw - 7天学会OpenClaw',
  path: '/pages/index/index',
  imageUrl: '/static/images/logo.webp'
})

/**
 * 设置当前页面的分享配置
 * 在页面 onLoad 或 setup 顶层调用
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
 * 启用页面分享功能
 * 在页面 setup 顶层调用一次即可
 * 同时设置分享配置并注册分享钩子
 */
export function usePageShare(options?: { title?: string; path?: string; imageUrl?: string }) {
  // 先设置配置
  if (options) {
    setShareConfig(options)
  }

  // 启用分享菜单
  // #ifdef MP-WEIXIN
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  // #endif

  // 分享给朋友
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
 * 兼容旧 API
 */
export function useShare() {
  return {
    initShareToFriend: usePageShare,
    initShareToTimeline: usePageShare,
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
