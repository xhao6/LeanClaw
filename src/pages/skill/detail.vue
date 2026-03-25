<route lang="json">
{
  "style": {
    "navigationBarTitleText": "Skill 详情"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen pb-24">
    <!-- Loading -->
    <view v-if="loading" class="flex items-center justify-center min-h-screen">
      <wd-loading color="#FF6B35" />
      <text class="ml-3 text-gray-500">加载中...</text>
    </view>

    <!-- Error -->
    <view v-else-if="error" class="flex flex-col items-center justify-center min-h-screen p-4">
      <wd-icon name="warning" size="48px" class="text-gray-300 mb-3" />
      <text class="text-gray-600">{{ error }}</text>
    </view>

    <!-- Content: Markdown Rendered -->
    <view v-else-if="renderedHtml" class="p-4 bg-white">
      <rich-text :nodes="renderedHtml"></rich-text>
    </view>

    <!-- Fallback: Original Template (if no markdownUrl) -->
    <template v-else>
      <!-- Original template code here -->
    </template>

    <!-- Bottom Action -->
    <view v-if="skillData.markdownUrl" class="article-footer">
      <view class="footer-btn left" @click="handleBack">
        <wd-icon name="arrow-left" size="18px" />
        <text>返回</text>
      </view>
      <view class="footer-btn right" @click="handleFavorite">
        <wd-icon name="star" size="18px" />
        <text>收藏</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import MarkdownIt from 'markdown-it'
import { getSkills } from '@/api/modules/resource'
import { usePageShare, setShareConfig } from '@/composables/useShare'

// 启用分享功能（必须在 setup 顶层调用）
usePageShare({
  title: 'OpenClaw Skills - 轻学Claw',
  path: '/pages/skill/detail',
  imageUrl: '/static/images/logo.webp'
})

const loading = ref(true)
const error = ref('')
const renderedHtml = ref('')
const skillData = ref<any>({
  title: '',
  markdownUrl: '',
  url: ''
})

// Initialize markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// Load skill data from database and render markdown
const loadSkillData = async (name: string) => {
  loading.value = true
  error.value = ''

  try {
    // Fetch skills list from database
    const res = await getSkills({ limit: 100 })
    const skills = res.list || []

    // Find matching skill by title
    const skill = skills.find((s: any) => s.title === name)

    if (!skill) {
      // If not found in database, try to use the name as fallback
      console.warn('[Skill] Not found in database:', name)
      error.value = '未找到该 Skill'
      loading.value = false
      return
    }

    skillData.value = skill
    console.log('[Skill] Found skill:', skill.title, skill.markdownUrl)

    // 更新分享配置
    setShareConfig({
      title: `${skill.title} - 轻学Claw`,
      path: `/pages/skill/detail?name=${encodeURIComponent(skill.title)}`,
      imageUrl: '/static/images/logo.webp'
    })

    // If has markdownUrl, load and render markdown
    if (skill.markdownUrl) {
      await loadMarkdown(skill.markdownUrl)
    } else {
      // No markdownUrl, show error
      error.value = '该 Skill 暂无详细内容'
    }

    // Update navigation bar title
    uni.setNavigationBarTitle({
      title: skill.title || 'Skill 详情'
    })

    loading.value = false
  } catch (err: any) {
    console.error('[Skill] Load failed:', err)
    error.value = err.message || '加载失败'
    loading.value = false
  }
}

// Load and render markdown from URL
const loadMarkdown = async (markdownUrl: string) => {
  try {
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

    // Render markdown
    let html = md.render(res)

    // Apply styles
    html = applyStyles(html)
    renderedHtml.value = html
  } catch (err: any) {
    console.error('[Markdown] Load failed:', err)
    error.value = '无法加载内容'
  }
}

// Apply custom styles to HTML
const applyStyles = (html: string): string => {
  let styled = html

  // Title styles
  styled = styled.replace(/<h1>/g, '<h1 class="h1-style">')
  styled = styled.replace(/<h2>/g, '<h2 class="h2-style">')
  styled = styled.replace(/<h3>/g, '<h3 class="h3-style">')
  styled = styled.replace(/<h4>/g, '<h4 class="h4-style">')

  // Paragraph styles
  styled = styled.replace(/<p>/g, '<p class="p-style">')

  // List styles
  styled = styled.replace(/<ul>/g, '<ul class="ul-style">')
  styled = styled.replace(/<ol>/g, '<ol class="ol-style">')
  styled = styled.replace(/<li>/g, '<li class="li-style">')

  // Code styles
  styled = styled.replace(/<pre>/g, '<pre class="pre-style">')
  styled = styled.replace(/<code>/g, '<code class="code-style">')

  // Link styles
  styled = styled.replace(/<a /g, '<a class="a-style" ')

  // Image styles
  styled = styled.replace(/<img /g, '<img class="img-style" ')

  // Table styles
  styled = styled.replace(/<table>/g, '<div class="table-wrapper"><table class="table-style">')
  styled = styled.replace(/<\/table>/g, '</table></div>')
  styled = styled.replace(/<th>/g, '<th class="th-style">')
  styled = styled.replace(/<td>/g, '<td class="td-style">')

  // Blockquote styles
  styled = styled.replace(/<blockquote>/g, '<blockquote class="blockquote-style">')

  return styled
}

onLoad((options: any) => {
  if (options.name) {
    const name = decodeURIComponent(options.name)
    console.log('[Skill] Loading:', name)
    loadSkillData(name)
  } else {
    error.value = '无效的参数'
    loading.value = false
  }
})

// Handle back
const handleBack = () => {
  uni.navigateBack()
}

// Handle favorite
const handleFavorite = () => {
  uni.showToast({
    title: '已收藏',
    icon: 'success'
  })
}
</script>

<style scoped>
/* Loading */
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
}

:deep(.h4-style) {
  font-size: 30rpx;
  font-weight: 600;
  color: #555;
  margin: 30rpx 0 16rpx 0;
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
  background: #f0f0f0;
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

:deep(.table-wrapper) {
  overflow-x: auto;
  margin: 24rpx 0;
}

:deep(.table-style) {
  width: 100%;
  border-collapse: collapse;
  font-size: 28rpx;
}

:deep(.th-style) {
  background: #f5f5f5;
  padding: 16rpx;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2rpx solid #ddd;
}

:deep(.td-style) {
  padding: 16rpx;
  color: #555;
  border-bottom: 1rpx solid #eee;
}

:deep(.blockquote-style) {
  border-left: 6rpx solid #FF6B35;
  background: #fff7ed;
  padding: 20rpx;
  margin: 24rpx 0;
  color: #666;
}

/* Bottom Footer */
.article-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 20rpx 40rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.footer-btn.left {
  background: #f5f5f5;
  color: #666;
}

.footer-btn.right {
  background: #FF6B35;
  color: #fff;
}
</style>
