<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "首页"
  }
}
</route>

<template>
  <view class="p-4 bg-gray-50 min-h-screen">
    <!-- Header -->
    <view class="flex items-center mb-6">
      <image src="/static/logo.png" class="w-10 h-10 mr-2" />
      <view>
        <text class="text-xl font-bold text-primary">LeanClaw</text>
        <view class="text-xs text-gray-500 mt-0.5">养一只龙虾，做AI管家</view>
      </view>
    </view>

    <!-- Learning Progress Card -->
    <wd-card custom-class="mb-4 !rounded-2xl shadow-sm overflow-hidden">
      <view class="flex justify-between items-center mb-4">
        <text class="font-bold text-lg">7天学习路径</text>
        <wd-tag type="warning" plain>第 1 天 / 7 天</wd-tag>
      </view>
      <view class="mb-4">
        <wd-progress :percentage="14" color="#FF6B35" />
      </view>
      <view class="flex justify-between text-xs text-gray-400">
        <text>继续努力，开启今天的学习吧！</text>
        <text>14%</text>
      </view>
      <template #footer>
        <wd-button type="primary" block custom-class="!bg-orange !border-orange" @click="handleGoLearn">
          继续学习
        </wd-button>
      </template>
    </wd-card>

    <!-- Quick Entries -->
    <view class="grid grid-cols-3 gap-4 mb-6">
      <view class="flex-col-center p-3 bg-white rounded-xl shadow-sm" @click="handleGoLearn">
        <wd-icon name="read" size="24px" class="text-orange mb-1" />
        <text class="text-sm">今日学习</text>
      </view>
      <view class="flex-col-center p-3 bg-white rounded-xl shadow-sm" @click="handleGoDiscover">
        <wd-icon name="explore" size="24px" class="text-blue-500 mb-1" />
        <text class="text-sm">热门资源</text>
      </view>
      <view class="flex-col-center p-3 bg-white rounded-xl shadow-sm" @click="handleGoSkills">
        <wd-icon name="app" size="24px" class="text-green-500 mb-1" />
        <text class="text-sm">推荐Skill</text>
      </view>
    </view>

    <!-- Recommendations -->
    <view class="mb-4">
      <view class="flex justify-between items-center mb-3">
        <text class="font-bold text-base">今日推荐资源</text>
        <text class="text-xs text-gray-400" @click="handleGoDiscover">更多 ></text>
      </view>
      <wd-card v-for="i in 2" :key="i" custom-class="mb-3 !rounded-xl">
        <view class="flex">
          <image src="https://via.placeholder.com/80" class="w-20 h-20 rounded-lg mr-3" />
          <view class="flex-1">
            <view class="font-bold text-sm mb-1">OpenClaw 基础入门教程 #{{ i }}</view>
            <view class="text-xs text-gray-400 line-clamp-2">
              这是一段关于 OpenClaw 的入门介绍，帮助你快速理解其核心概念。
            </view>
          </view>
        </view>
      </wd-card>
    </view>
  </view>
</template>

<script setup lang="ts">
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
