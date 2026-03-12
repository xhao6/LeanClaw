<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
  
  // Initialize CloudBase
  if (wx.cloud) {
    wx.cloud.init({
      env: 'leanmind-1gjtoa502716c21d', // Env ID
      traceUser: true
    })
    console.log('CloudBase initialized')
  } else {
    console.error('wx.cloud not available')
  }
})

onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
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
