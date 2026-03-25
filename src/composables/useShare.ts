import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

interface ShareOptions {
  title?: string
  path?: string
  imageUrl?: string
}

export function useShare(options: ShareOptions = {}) {
  const defaultTitle = '轻学Claw - 7天学会OpenClaw'
  const defaultPath = '/pages/index/index'
  const defaultImageUrl = '/static/images/logo.webp'

  /**
   * 分享到朋友
   */
  const initShareToFriend = () => {
    onShareAppMessage((res) => {
      if (res.from === 'button') {
        console.log('来自页面内转发按钮')
      }
      return {
        title: options.title || defaultTitle,
        path: options.path || defaultPath,
        imageUrl: options.imageUrl || defaultImageUrl
      }
    })
  }

  /**
   * 分享到朋友圈
   */
  const initShareToTimeline = () => {
    onShareTimeline(() => {
      return {
        title: options.title || defaultTitle,
        imageUrl: options.imageUrl || defaultImageUrl,
        query: ''
      }
    })
  }

  /**
   * 复制链接
   */
  const copyLink = (link?: string) => {
    const url = link || `${location.origin}${options.path || defaultPath}`
    uni.setClipboardData({
      data: url,
      success: () => {
        uni.showToast({ title: '链接已复制', icon: 'success' })
      },
      fail: () => {
        uni.showToast({ title: '复制失败', icon: 'none' })
      }
    })
  }

  return {
    initShareToFriend,
    initShareToTimeline,
    copyLink
  }
}