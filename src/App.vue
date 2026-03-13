<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { config } from '@/config'
import { initTcbWeb } from '@/api/core/tcbWeb'

onLaunch(() => {
  console.log('App Launch')

  // 环境检测优先级：微信小程序 > Web SDK
  if (typeof wx !== 'undefined' && wx.cloud) {
    // 微信小程序环境
    wx.cloud.init({
      env: config.cloud.envId,
      traceUser: true
    })
    console.log('CloudBase initialized (WeChat)')
  } else {
    // H5/Web 环境：使用 Web SDK 或 HTTP 触发器
    try {
      initTcbWeb()
      console.log('CloudBase Web SDK initialized')
    } catch (e) {
      console.warn('CloudBase Web SDK init failed:', e)
    }
  }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})

// 分享给好友
onShareAppMessage(() => {
  return {
    title: '轻学龙虾 - 7天入门 OpenClaw',
    path: '/pages/index/index',
    imageUrl: '/static/images/share-cover.png'
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: '轻学龙虾 - 7天入门 OpenClaw',
    query: ''
  }
})
</script>

<style>
/* Global styles */
body {
  background-color: #F8F8F8;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
}
</style>
