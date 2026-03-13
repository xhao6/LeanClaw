<route lang="json">
{
  "style": {
    "navigationBarTitleText": "资源详情"
  }
}
</route>

<template>
  <view>
    <web-view :src="displayUrl" v-if="displayUrl && !errorMsg"></web-view>
    <view v-if="errorMsg" class="error-view">
      <text class="error-title">无法加载内容</text>
      <text class="error-msg">{{ errorMsg }}</text>
      <text class="error-url">原始链接：{{ url }}</text>
    </view>
    <view v-if="!url && !errorMsg" class="empty-view">
      <text>无效的资源链接</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// CloudBase 静态托管域名
const STATIC_HOST = 'https://leanmind-1gjtoa502716c21d-1410913126.tcloudbaseapp.com'

const url = ref('')
const errorMsg = ref('')

// 从原始 URL 生成资源 ID
function generateResourceId(originalUrl: string): string {
  return originalUrl
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .slice(0, 50)
}

// 计算实际显示的 URL - 云端模式
const displayUrl = computed(() => {
  if (!url.value) return ''

  // 如果已经是静态托管域名，直接使用
  if (url.value.includes('tcloudbaseapp.com')) {
    return url.value
  }

  // 生成资源 ID
  const resourceId = generateResourceId(url.value)

  // 转换为 CloudBase 静态托管 URL
  const cloudPath = `${STATIC_HOST}/content/processed/${resourceId}.html`

  // 设置导航栏标题
  uni.setNavigationBarTitle({
    title: '资源详情'
  })

  return cloudPath
})

onLoad((options: any) => {
  if (options.url) {
    url.value = decodeURIComponent(options.url)
    console.log('[WebView] 原始URL:', url.value)
    console.log('[WebView] 转换后:', displayUrl.value)
  }
})
</script>

<style scoped>
.error-view,
.empty-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 40rpx;
  background: #f8f8f8;
}

.error-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.error-msg {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 20rpx;
}

.error-url {
  font-size: 24rpx;
  color: #999;
  word-break: break-all;
}
</style>
