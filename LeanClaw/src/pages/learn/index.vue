<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "学习"
  }
}
</route>

<template>
  <view class="p-4 bg-gray-50 min-h-screen">
    <view class="mb-6">
      <view class="text-xl font-bold mb-1">7天学习路径</view>
      <view class="text-xs text-gray-500">从零开始掌握 OpenClaw，养一只"龙虾"做自己的 AI 管家</view>
    </view>

    <!-- 7-Day Steps -->
    <view class="space-y-4">
      <wd-card v-for="(day, index) in learnDays" :key="index" custom-class="!rounded-2xl shadow-sm border-l-4 border-l-solid" :class="day.status === 'completed' ? 'border-l-green-500' : (day.status === 'in-progress' ? 'border-l-orange' : 'border-l-gray-300')">
        <view class="flex items-center justify-between">
          <view class="flex items-center flex-1">
            <view class="w-10 h-10 flex-center rounded-full mr-4 text-white font-bold" :class="day.status === 'completed' ? 'bg-green-500' : (day.status === 'in-progress' ? 'bg-orange animate-pulse' : 'bg-gray-300')">
              {{ index + 1 }}
            </view>
            <view>
              <view class="font-bold text-sm">{{ day.title }}</view>
              <view class="text-xs text-gray-400 mt-1">{{ day.desc }}</view>
            </view>
          </view>
          <wd-icon :name="day.status === 'completed' ? 'check-circle' : 'play-circle'" size="24px" :class="day.status === 'completed' ? 'text-green-500' : (day.status === 'in-progress' ? 'text-orange' : 'text-gray-300')" @click="handleDayClick(day)" />
        </view>
      </wd-card>
    </view>

    <!-- Summary / Badge -->
    <view v-if="allCompleted" class="mt-8 flex-col-center p-6 bg-white rounded-2xl shadow-sm border-2 border-dashed border-orange">
      <wd-icon name="medal" size="48px" class="text-orange mb-3" />
      <view class="font-bold text-lg text-primary mb-1">恭喜获得“龙虾驯养师”勋章！</view>
      <view class="text-xs text-gray-400">你已经完成了所有课程，开启你的 AI 管家之旅吧</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const learnDays = ref([
  { title: 'Day 1: 初识 OpenClaw', desc: '了解 OpenClaw 的基本概念和安装步骤', status: 'completed' },
  { title: 'Day 2: 基础配置', desc: '学习如何配置环境并运行第一个项目', status: 'in-progress' },
  { title: 'Day 3: Skills 核心', desc: '理解 Skills 的原理并尝试使用内置 Skill', status: 'pending' },
  { title: 'Day 4: 进阶开发', desc: '开始编写属于你的第一个 Skill', status: 'pending' },
  { title: 'Day 5: 数据持久化', desc: '学习如何在 Skill 中保存数据', status: 'pending' },
  { title: 'Day 6: 平台接入', desc: '将 OpenClaw 接入到微信、钉钉等平台', status: 'pending' },
  { title: 'Day 7: 实战项目', desc: '从零构建一个完整的龙虾 AI 管家', status: 'pending' },
])

const allCompleted = computed(() => learnDays.value.every(d => d.status === 'completed'))

const handleDayClick = (day: any) => {
  // Logic to navigate to day detail
  console.log('Navigating to:', day.title)
  uni.navigateTo({
    url: `/pages/learn/detail/index?id=${day.title.split(' ')[1].replace(':', '')}`
  })
}
</script>

<style scoped>
:deep(.wd-card) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.border-l-solid {
  border-left-style: solid;
}
</style>
