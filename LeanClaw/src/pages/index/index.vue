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
        <!-- Replace with actual logo or a better placeholder -->
        <view class="w-10 h-10 bg-primary rounded-xl flex-center mr-3 shadow-sm">
           <wd-icon name="github-filled" size="24px" color="#ffffff" />
        </view>
        <view>
          <text class="text-xl font-bold text-primary block leading-tight">轻学龙虾</text>
          <text class="text-xs text-gray-400 block mt-0.5">养只龙虾做管家</text>
        </view>
      </view>
      <wd-icon name="notification" size="24px" class="text-gray-400" />
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
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoLearn">
        <view class="w-12 h-12 rounded-2xl bg-orange/10 flex-center mb-2 overflow-hidden">
           <image src="/static/images/placeholder/study.svg" class="w-8 h-8" mode="aspectFit" />
        </view>
        <text class="text-sm font-medium text-gray-700">今日学习</text>
      </view>
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoDiscover">
        <view class="w-12 h-12 rounded-2xl bg-blue-500/10 flex-center mb-2 overflow-hidden">
           <image src="/static/images/placeholder/hot.svg" class="w-8 h-8" mode="aspectFit" />
        </view>
        <text class="text-sm font-medium text-gray-700">热门资源</text>
      </view>
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoSkills">
        <view class="w-12 h-12 rounded-2xl bg-green-500/10 flex-center mb-2 overflow-hidden">
           <image src="/static/images/placeholder/skill.svg" class="w-8 h-8" mode="aspectFit" />
        </view>
        <text class="text-sm font-medium text-gray-700">推荐Skill</text>
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
        <view class="space-y-3">
          <view v-for="item in recommendations" :key="item.id" class="bg-white p-3 rounded-2xl shadow-sm flex active:bg-gray-50 transition-colors" @click="handleRecommendClick(item)">
            <image :src="item.image || '/static/images/placeholder/article.svg'" class="w-24 h-24 rounded-xl mr-3 object-cover bg-gray-100 shrink-0" />
            <view class="flex-1 flex flex-col justify-between py-1 min-h-0">
              <view class="flex-1">
                <view class="flex justify-between items-start">
                     <text class="font-bold text-sm text-gray-800 line-clamp-3 mb-1">{{ item.title }}</text>
                  </view>
                <text class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{{ item.desc }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部状态 -->
        <view class="py-4 text-center">
          <view v-if="loading" class="flex items-center justify-center text-gray-400">
            <wd-loading type="spinner" size="16px" />
            <text class="ml-2 text-xs">加载中...</text>
          </view>
          <text v-else-if="!hasMore" class="text-xs text-gray-400">没有更多了</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { getProgress } from '@/utils/learnProgress'
import { useRecommendations } from '@/composables/useRecommendations'
import type { ResourceItem } from '@/data/mock'

// 获取学习进度
const progress = getProgress()

// 今日推荐
const { recommendations, loading, hasMore, loadRecommendations, loadMore, addToViewed } = useRecommendations()

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
  if (item.url) {
    window.open(item.url, '_blank')
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
const handleGoSkills = () => {
  uni.switchTab({ url: '/pages/discover/index' })
}
</script>

<style scoped>
:deep(.wd-card) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
