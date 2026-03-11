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
          <text class="text-xl font-bold text-primary block leading-tight">LeanClaw</text>
          <text class="text-xs text-gray-400 block mt-0.5">Master Skills Faster</text>
        </view>
      </view>
      <wd-icon name="notification" size="24px" class="text-gray-400" />
    </view>

    <!-- Learning Progress Card -->
    <view class="mb-6 relative overflow-hidden rounded-[24rpx] bg-white shadow-lg shadow-blue-900/5">
      <view class="p-5">
        <view class="flex justify-between items-center mb-6">
          <view>
            <text class="text-xs text-gray-400 block mb-1">当前进度</text>
            <text class="font-bold text-2xl text-primary">Day 3 <text class="text-sm text-gray-400 font-normal">/ 7</text></text>
          </view>
          <view class="w-12 h-12 rounded-full border-4 border-orange/20 flex-center">
             <text class="text-xs font-bold text-orange">42%</text>
          </view>
        </view>
        
        <view class="mb-6">
          <view class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <view class="h-full bg-primary w-[42%] rounded-full relative">
               <view class="absolute right-0 top-0 bottom-0 w-2 bg-white/20"></view>
            </view>
          </view>
          <text class="text-xs text-gray-400 mt-2 block">下一章：Skills 核心原理解析</text>
        </view>

        <wd-button type="primary" block custom-class="!bg-orange !border-orange !rounded-xl !h-11 !text-base shadow-orange/20 shadow-lg" @click="handleGoLearn">
          继续学习 Day 3
        </wd-button>
      </view>
      
      <!-- Decorative circles -->
      <view class="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-50/50 pointer-events-none"></view>
      <view class="absolute -left-4 bottom-8 w-16 h-16 rounded-full bg-orange/5 pointer-events-none"></view>
    </view>

    <!-- Quick Entries -->
    <view class="grid grid-cols-3 gap-3 mb-8">
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoLearn">
        <view class="w-12 h-12 rounded-2xl bg-orange/10 flex-center mb-2">
           <wd-icon name="read" size="24px" class="text-orange" />
        </view>
        <text class="text-sm font-medium text-gray-700">今日学习</text>
      </view>
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoDiscover">
        <view class="w-12 h-12 rounded-2xl bg-blue-500/10 flex-center mb-2">
           <wd-icon name="explore" size="24px" class="text-blue-500" />
        </view>
        <text class="text-sm font-medium text-gray-700">热门资源</text>
      </view>
      <view class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform" @click="handleGoSkills">
        <view class="w-12 h-12 rounded-2xl bg-green-500/10 flex-center mb-2">
           <wd-icon name="app" size="24px" class="text-green-500" />
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
      
      <view class="space-y-3">
        <view v-for="i in 2" :key="i" class="bg-white p-3 rounded-2xl shadow-sm flex active:bg-gray-50 transition-colors">
          <image src="https://via.placeholder.com/160" class="w-24 h-24 rounded-xl mr-3 object-cover bg-gray-100 shrink-0" />
          <view class="flex-1 flex flex-col justify-between py-1">
            <view>
              <view class="flex justify-between items-start">
                 <text class="font-bold text-sm text-gray-800 line-clamp-1 mb-1">OpenClaw 基础入门教程 #{{ i }}</text>
                 <wd-tag type="warning" plain size="small" custom-class="!h-5 !px-1.5 !text-[10px]">NEW</wd-tag>
              </view>
              <text class="text-xs text-gray-400 line-clamp-2 leading-relaxed">这是一段关于 OpenClaw 的入门介绍，帮助你快速理解其核心概念。</text>
            </view>
            <view class="flex items-center text-xs text-gray-400 mt-2">
               <wd-icon name="view" size="14px" class="mr-1" />
               <text class="mr-3">2.4k</text>
               <wd-icon name="thumb-up" size="14px" class="mr-1" />
               <text>128</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Index Page Mounted')
})

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
