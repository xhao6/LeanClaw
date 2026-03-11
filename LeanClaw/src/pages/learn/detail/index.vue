<route lang="json">
{
  "style": {
    "navigationBarTitleText": "课程详情"
  }
}
</route>

<template>
  <view class="bg-white min-h-screen">
    <!-- Progress Indicator -->
    <view class="sticky top-0 z-10 bg-white/80 backdrop-blur px-4 py-2 border-b border-gray-100">
      <view class="flex justify-between items-center mb-1">
        <text class="text-xs font-bold text-orange">Day {{ dayId }}</text>
        <text class="text-xs text-gray-400">已阅读 65%</text>
      </view>
      <wd-progress :percentage="65" color="#FF6B35" :show-pivot="false" />
    </view>

    <!-- Content Area -->
    <view class="p-4 pb-24">
      <view class="mb-6">
        <view class="text-2xl font-bold mb-2">{{ currentDay.title }}</view>
        <view class="flex items-center space-x-3 text-xs text-gray-400">
          <view class="flex items-center">
            <wd-icon name="time" size="14px" class="mr-1" />
            15 分钟
          </view>
          <view class="flex items-center">
            <wd-icon name="user" size="14px" class="mr-1" />
            1.2k 人已学
          </view>
        </view>
      </view>

      <!-- Mock Markdown Content -->
      <view class="prose max-w-none text-gray-700 leading-relaxed space-y-4">
        <view class="font-bold text-lg text-black">1. 什么是 OpenClaw？</view>
        <view>OpenClaw 是一个开源的个人 AI 助理框架，旨在帮助用户通过简单的配置和 Skill 编写，构建属于自己的智能管家。</view>
        
        <view class="bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
          “让每个人都能拥有一个懂自己的 AI 助手，是 OpenClaw 的初心。”
        </view>

        <view class="font-bold text-lg text-black mt-6">2. 核心架构</view>
        <view>OpenClaw 由以下三个核心部分组成：</view>
        <view class="pl-4 space-y-2">
          <view>• <text class="font-bold">Core</text>: 负责消息分发和环境管理</view>
          <view>• <text class="font-bold">Skills</text>: 赋予助理各种能力的插件</view>
          <view>• <text class="font-bold">Adapters</text>: 连接各种聊天平台（如微信、Telegram）</view>
        </view>

        <view class="font-bold text-lg text-black mt-6">3. 安装步骤</view>
        <view class="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
          # 克隆仓库<br/>
          git clone https://github.com/openclaw/core.git<br/>
          <br/>
          # 安装依赖<br/>
          cd core && npm install<br/>
          <br/>
          # 启动服务<br/>
          npm run start
        </view>

        <view class="mt-8 p-4 bg-orange/5 rounded-2xl border border-orange/20">
          <view class="font-bold text-orange mb-2 flex items-center">
            <wd-icon name="check-circle" size="18px" class="mr-2" />
            今日任务
          </view>
          <view class="text-sm space-y-2">
            <view class="flex items-start">
              <wd-checkbox v-model="task1" size="small" custom-class="mr-2 mt-0.5" />
              <text :class="{ 'line-through text-gray-400': task1 }">成功运行 OpenClaw Core</text>
            </view>
            <view class="flex items-start">
              <wd-checkbox v-model="task2" size="small" custom-class="mr-2 mt-0.5" />
              <text :class="{ 'line-through text-gray-400': task2 }">在控制台看到 Hello World 响应</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Bottom Action Bar -->
    <view class="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-gray-100 flex space-x-4">
      <wd-button type="info" plain block class="flex-1" @click="handlePrev">上一节</wd-button>
      <wd-button type="primary" block class="flex-[2] !bg-orange !border-orange shadow-lg shadow-orange/30" @click="handleComplete">
        完成并打卡
      </wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const dayId = ref('1')
const task1 = ref(false)
const task2 = ref(false)

const currentDay = ref({
  title: 'Day 1: 初识 OpenClaw',
  content: '' // Markdown content would go here
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  if (currentPage && currentPage.options && currentPage.options.id) {
    dayId.value = currentPage.options.id
  }
})

const handlePrev = () => {
  uni.navigateBack()
}

const handleComplete = () => {
  uni.showToast({
    title: '打卡成功！',
    icon: 'success'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}
</script>

<style scoped>
.prose {
  font-size: 16px;
}
:deep(.wd-checkbox__label) {
  font-size: 14px !important;
}
</style>
