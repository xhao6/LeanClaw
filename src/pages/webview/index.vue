<route lang="json">
{
  "style": {
    "navigationBarTitleText": "资源详情"
  }
}
</route>

<template>
  <view class="container">
    <!-- Loading -->
    <view v-if="loading" class="loading-view">
      <wd-loading color="#FF6B35" />
      <text class="loading-text">加载中...</text>
    </view>

    <!-- Error -->
    <view v-else-if="error" class="error-view">
      <wd-icon name="warning" size="48px" class="text-gray-300 mb-3" />
      <text class="error-title">无法加载内容</text>
      <text class="error-msg">{{ error }}</text>
    </view>

    <!-- Content -->
    <view v-else class="content-view">
      <rich-text :nodes="renderedHtml"></rich-text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import MarkdownIt from 'markdown-it'

const url = ref('')
const loading = ref(true)
const error = ref('')
const renderedHtml = ref('')

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 从 URL 中提取 markdown 文件路径并加载
const loadMarkdown = async (markdownUrl: string) => {
  loading.value = true
  error.value = ''

  try {
    // 使用 uni.request 获取 markdown 内容
    const res = await new Promise<any>((resolve, reject) => {
      uni.request({
        url: markdownUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`HTTP ${res.statusCode}`))
          }
        },
        fail: (err) => reject(err)
      })
    })

    // 渲染 markdown
    let html = md.render(res)

    // 图片处理：使用云存储的图片（已经是完整 URL）
    // 确保图片可以正常显示

    // 添加样式
    html = html.replace(/<h1>/g, '<h1 class="h1-style">')
    html = html.replace(/<h2>/g, '<h2 class="h2-style">')
    html = html.replace(/<h3>/g, '<h3 class="h3-style">')
    html = html.replace(/<p>/g, '<p class="p-style">')
    html = html.replace(/<ul>/g, '<ul class="ul-style">')
    html = html.replace(/<ol>/g, '<ol class="ol-style">')
    html = html.replace(/<li>/g, '<li class="li-style">')
    html = html.replace(/<pre>/g, '<pre class="pre-style">')
    html = html.replace(/<code>/g, '<code class="code-style">')
    html = html.replace(/<a /g, '<a class="a-style" ')
    html = html.replace(/<img /g, '<img class="img-style" ')

    renderedHtml.value = html

    // 设置标题
    const titleMatch = res.match(/^#\s+(.+)$/m)
    if (titleMatch) {
      uni.setNavigationBarTitle({
        title: titleMatch[1].slice(0, 20)
      })
    }

    loading.value = false
  } catch (err: any) {
    console.error('[Markdown] 加载失败:', err)
    error.value = err.message || '加载失败'
    loading.value = false
  }
}

onLoad((options: any) => {
  if (options.url) {
    const decodedUrl = decodeURIComponent(options.url)
    console.log('[WebView] 原始URL:', decodedUrl)

    // 检查是否是 markdown 文件
    if (decodedUrl.endsWith('.md')) {
      loadMarkdown(decodedUrl)
    } else {
      error.value = '不支持的文件类型'
      loading.value = false
    }
  } else {
    error.value = '无效的链接'
    loading.value = false
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f8f8f8;
}

.loading-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20rpx;
}

.loading-text {
  color: #999;
  font-size: 28rpx;
}

.error-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 40rpx;
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
}

.content-view {
  padding: 30rpx;
  background: #fff;
}

/* Markdown 样式 */
:deep(.h1-style) {
  font-size: 44rpx;
  font-weight: 700;
  color: #1E3A5F;
  margin: 40rpx 0 30rpx 0;
  line-height: 1.4;
}

:deep(.h2-style) {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin: 50rpx 0 24rpx 0;
  padding-left: 20rpx;
  border-left: 6rpx solid #FF6B35;
  line-height: 1.4;
}

:deep(.h3-style) {
  font-size: 32rpx;
  font-weight: 600;
  color: #444;
  margin: 40rpx 0 20rpx 0;
  line-height: 1.4;
}

:deep(.p-style) {
  font-size: 30rpx;
  color: #555;
  line-height: 1.8;
  margin-bottom: 24rpx;
  text-align: justify;
}

:deep(.ul-style),
:deep(.ol-style) {
  margin: 24rpx 0;
  padding-left: 40rpx;
}

:deep(.li-style) {
  font-size: 30rpx;
  color: #555;
  line-height: 1.8;
  margin-bottom: 12rpx;
}

:deep(.pre-style) {
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 24rpx;
  margin: 24rpx 0;
  overflow-x: auto;
}

:deep(.code-style) {
  font-family: 'Courier New', Courier, monospace;
  font-size: 28rpx;
  color: #e74c3c;
  background: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

:deep(.a-style) {
  color: #FF6B35;
  text-decoration: underline;
}

:deep(.img-style) {
  max-width: 100%;
  border-radius: 12rpx;
  margin: 24rpx 0;
}
</style>
