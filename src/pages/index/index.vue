<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "首页"
  }
}
</route>

<template>
  <view class="p-4 bg-gray-50 min-h-screen box-border">
    <!-- Header -->
    <view class="flex items-center justify-between mb-6 pt-2">
      <view class="flex items-center">
        <!-- Logo -->
        <image src="/static/images/logo.webp" class="w-10 h-10 rounded-xl mr-3 shadow-sm bg-white" mode="aspectFit" />
        <view>
          <text class="text-xl font-bold text-primary block leading-tight">轻学AI虾</text>
          <text class="text-xs text-gray-400 block mt-0.5">养只龙虾做管家</text>
        </view>
      </view>
      <!-- #ifdef H5 -->
      <wd-icon name="notification" size="24px" class="text-gray-400" />
      <!-- #endif -->
    </view>

    <!-- Learning Progress Card -->
    <view class="mb-6 relative overflow-hidden rounded-[24rpx] bg-white shadow-lg shadow-blue-900/5">
      <!-- Decorative circles -->
      <view class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-50/50 pointer-events-none"></view>
      <view class="absolute -left-4 bottom-8 w-16 h-16 rounded-full bg-orange/5 pointer-events-none"></view>

      <view class="p-5 relative z-10">
        <view class="flex justify-between items-center mb-6">
          <view>
            <text class="text-xs text-gray-400 block mb-1">当前进度</text>
            <text class="font-bold text-2xl text-primary">Day {{ progress.currentDay }} <text class="text-sm text-gray-400 font-normal">/ 7</text></text>
          </view>
        </view>
        <view class="absolute right-[5%] top-[5%] z-20">
          <text class="text-2xl font-bold text-orange/90">{{ progressPercent }}%</text>
        </view>
        
        <view class="mb-6">
          <view class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <view class="h-full bg-primary rounded-full relative" :style="{ width: progressPercent + '%' }">
               <view class="absolute right-0 top-0 bottom-0 w-2 bg-white/20"></view>
            </view>
          </view>
          <text class="text-xs text-gray-400 mt-2 block">下一章：{{ nextChapter }}</text>
        </view>

        <wd-button type="primary" block custom-class="!bg-orange !border-orange !rounded-xl !h-11 !text-base shadow-orange/20 shadow-lg" @click="handleGoLearn">
          {{ buttonText }}
        </wd-button>
      </view>
    </view>

    <!-- Quick Entries -->
    <view class="grid grid-cols-3 gap-3 mb-8">
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoCase">
        <view class="w-12 h-12 rounded-2xl bg-orange/10 flex-center mb-2 overflow-hidden">
           <image src="/static/images/placeholder/quick-case.svg" class="w-8 h-8" mode="aspectFit" />
        </view>
        <text class="text-sm font-medium text-gray-700">精选案例</text>
      </view>
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoSkills">
        <view class="w-12 h-12 rounded-2xl bg-blue-500/10 flex-center mb-2 overflow-hidden">
           <image src="/static/images/placeholder/quick-skills.svg" class="w-8 h-8" mode="aspectFit" />
        </view>
        <text class="text-sm font-medium text-gray-700">Skills大全</text>
      </view>
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoFavorites">
        <view class="w-12 h-12 rounded-2xl bg-green-500/10 flex-center mb-2 overflow-hidden">
           <image src="/static/images/placeholder/quick-fav.svg" class="w-8 h-8" mode="aspectFit" />
        </view>
        <text class="text-sm font-medium text-gray-700">我的收藏</text>
      </view>
    </view>

    <!-- Recommendations -->
    <view class="mb-4">
      <view class="flex justify-between items-center mb-4 px-1">
        <view class="flex items-center">
           <view class="w-1 h-4 bg-orange rounded-full mr-2"></view>
           <text class="font-bold text-lg text-primary">今日推荐</text>
        </view>
        <text class="text-xs text-gray-400 flex items-center" @click="handleGoDiscover">
          查看全部 <wd-icon name="arrow-right" size="12px" class="ml-0.5" />
        </text>
      </view>

      <scroll-view scroll-y class="h-[400px]" @scrolltolower="handleLoadMore">
        <!-- 空状态 / 错误状态 -->
        <view v-if="error" class="flex flex-col items-center justify-center py-12 text-gray-400">
          <wd-icon name="warning" size="32px" class="mb-2" />
          <text class="text-sm">{{ error }}</text>
        </view>

        <!-- 推荐列表 -->
        <view v-else class="space-y-3">
          <view v-for="item in recommendations" :key="item.id" class="bg-white p-4 rounded-2xl shadow-sm active:bg-gray-50 transition-all" @click="handleRecommendClick(item)">
            <!-- 标题 -->
            <view class="flex justify-between items-start mb-2">
              <text class="text-h2 line-clamp-2 flex-1 leading-snug pr-2">{{ item.title }}</text>
              <view class="flex items-center gap-1 shrink-0" @click.stop="handleToggleFavorite(item)">
                <wd-icon :name="isFavorited(item.id) ? 'star-filled' : 'star'" size="20px" :class="isFavorited(item.id) ? 'text-orange' : 'text-gray-300'" />
              </view>
            </view>
            <!-- 描述 -->
            <text class="text-body text-gray-500 line-clamp-2 mb-3">{{ item.desc }}</text>
            <!-- 标签 -->
            <view v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
              <text
                v-for="(tag, tagIndex) in item.tags"
                :key="tagIndex"
                class="px-3 py-1 text-xs rounded-full border"
                :class="getTagClass(tag)"
              >
                {{ tag }}
              </text>
            </view>
          </view>
        </view>

        <!-- 底部状态 -->
        <view class="py-4 text-center">
          <view v-if="loading" class="flex items-center justify-center text-gray-400">
            <wd-loading type="spinner" size="16px" />
            <text class="ml-2 text-xs">加载中...</text>
          </view>
          <text v-else-if="!hasMore && recommendations.length > 0" class="text-xs text-gray-400">没有更多了</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { getProgress } from '@/utils/learnProgress'
import { useRecommendations } from '@/composables/useRecommendations'
import { getTagClass } from '@/composables/useTagColors'
import { useUserStore } from '@/store'
import type { ResourceItem } from '@/types/resource'
import { toggleFavorite, isFavorited } from '@/utils/favorites'

// 获取学习进度
const progress = getProgress()

// 今日推荐
const { recommendations, loading, hasMore, error, loadRecommendations, loadMore, addToViewed } = useRecommendations()

// 计算进度百分比：基于已完成的课程数
const progressPercent = computed(() => {
  return Math.round((progress.completedLessons.length / 7) * 100)
})

// 获取下一章标题：基于已完成课程数显示下一课
const nextChapter = computed(() => {
  const dayTitles = ['', '初识 OpenClaw', '你的第一个 AI 助手', '记忆与灵魂', '技能系统 (Skills)', '自动化工作流', '本地化与隐私', '进阶与未来']
  const completedCount = progress.completedLessons.length
  if (completedCount >= 7) return '全部完成'
  return dayTitles[completedCount + 1] || '开始学习'
})

// 是否已完成所有课程
const allCompleted = computed(() => progress.completedLessons.length >= 7)

// 按钮文字
const buttonText = computed(() => {
  if (allCompleted.value) return '恭喜完成全部课程 🎉'
  return `继续学习 Day ${progress.currentDay}`
})

onMounted(() => {
  console.log('Index Page Mounted')
  loadRecommendations()
})

// 点击推荐项
const handleRecommendClick = (item: ResourceItem) => {
  addToViewed(item.id)
  // 跳转到对应页面
  if (item.markdownUrl) {
    // 优先使用 markdownUrl
    const markdownUrl = item.markdownUrl
    // #ifdef H5
    window.open(`https://markdown.net.cn/render?url=${encodeURIComponent(markdownUrl)}`, '_blank')
    // #endif
    // #ifndef H5
    uni.navigateTo({ url: `/pages/webview/index?url=${encodeURIComponent(markdownUrl)}` })
    // #endif
  } else if (item.url) {
    // #ifdef H5
    window.open(item.url, '_blank')
    // #endif
    // #ifndef H5
    uni.navigateTo({ url: `/pages/webview/index?url=${encodeURIComponent(item.url)}` })
    // #endif
  }
}

// 滚动到底部加载更多
const handleLoadMore = () => {
  loadMore()
}

const handleGoLearn = () => {
  uni.switchTab({ url: '/pages/learn/index' })
}
const handleGoDiscover = () => {
  uni.switchTab({ url: '/pages/discover/index' })
}
const handleGoCase = () => {
  uni.switchTab({ url: '/pages/discover/index?tab=case' })
}
const handleGoSkills = () => {
  uni.switchTab({ url: '/pages/discover/index?tab=skill' })
}
const handleGoFavorites = () => {
  uni.navigateTo({ url: '/pages/profile/favorites/index' })
}

// 切换收藏
const handleToggleFavorite = (item: ResourceItem) => {
  // 检查登录状态
  const userStore = useUserStore()
  const { isLoggedIn } = storeToRefs(userStore)

  if (!isLoggedIn.value) {
    uni.showModal({
      title: '提示',
      content: '登录后可收藏内容，是否前往登录？',
      success: (res) => {
        if (res.confirm) {
          uni.switchTab({ url: '/pages/profile/index' })
        }
      }
    })
    return
  }

  // 原有逻辑
  toggleFavorite(item)
  if (isFavorited(item.id)) {
    uni.showToast({ title: '已收藏', icon: 'success' })
  } else {
    uni.showToast({ title: '已取消收藏', icon: 'none' })
  }
}
</script>

<style scoped>
:deep(.wd-card) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
