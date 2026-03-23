<route lang="json">
{
  "layout": "default",
  "style": {
    "navigationBarTitleText": "学习统计"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen box-border">
    <!-- 统计卡片 -->
    <view class="p-4">
      <view class="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <!-- 已学天数 -->
        <view class="flex items-center justify-between">
          <view class="flex items-center">
            <view class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <wd-icon name="calendar" size="20px" color="#1E3A5F" />
            </view>
            <view>
              <view class="text-sm text-gray-500">已学天数</view>
              <view class="text-xl font-bold text-primary">{{ completedLessonsCount }} <text class="text-sm font-normal text-gray-400">/ 7天</text></view>
            </view>
          </view>
        </view>

        <view class="h-[1px] bg-gray-100"></view>

        <!-- 完成课程 -->
        <view class="flex items-center justify-between">
          <view class="flex items-center">
            <view class="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center mr-3">
              <wd-icon name="check" size="20px" color="#FF6B35" />
            </view>
            <view>
              <view class="text-sm text-gray-500">完成课程</view>
              <view class="text-xl font-bold text-orange">{{ completedLessonsCount }} <text class="text-sm font-normal text-gray-400">/ 7节</text></view>
            </view>
          </view>
        </view>

        <view class="h-[1px] bg-gray-100"></view>

      </view>
    </view>

    <!-- 学习进度 -->
    <view class="p-4 pt-0">
      <view class="bg-white rounded-2xl shadow-sm p-5">
        <view class="text-base font-bold text-gray-800 mb-4">学习进度</view>
        <view class="space-y-3">
          <view v-for="(day, index) in dayProgress" :key="index" class="flex items-center">
            <view class="w-12 text-sm text-gray-500">Day {{ index + 1 }}</view>
            <view class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <view
                class="h-full rounded-full transition-all"
                :class="day.completed ? 'bg-primary' : 'bg-gray-200'"
                :style="{ width: day.completed ? '100%' : '0%' }"
              ></view>
            </view>
            <view class="w-10 text-right">
              <wd-icon v-if="day.completed" name="check-circle-fill" size="16px" color="#22C55E" />
              <wd-icon v-else name="clock" size="16px" color="#CBD5E1" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 徽章展示 -->
    <view class="p-4 pt-0">
      <view class="bg-white rounded-2xl shadow-sm p-5">
        <view class="flex justify-between items-center mb-4">
          <view class="text-base font-bold text-gray-800">获得徽章</view>
          <view class="text-sm text-gray-400">{{ progress.badges?.length || 0 }} / 7</view>
        </view>
        <view class="grid grid-cols-7 gap-2">
          <view
            v-for="(badge, index) in allBadges"
            :key="index"
            class="aspect-square rounded-xl flex items-center justify-center"
            :class="badge.unlocked ? 'bg-primary/10' : 'bg-gray-100'"
          >
            <text class="text-xl">{{ badge.unlocked ? badge.icon : '🔒' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="p-8 text-center">
      <view class="text-xs text-gray-400">
        坚持学习，7 天后即可获得证书
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getProgress } from '@/utils/learnProgress'
import { badges } from '@/data/badges'

const completedLessonsCount = computed(() => {
  const progress = getProgress()
  return progress.completedLessons?.length || 0
})

// 每日进度
const dayProgress = computed(() => {
  const progress = getProgress()
  const completedSet = new Set(progress.completedLessons || [])
  return Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    completed: completedSet.has(`day-${i + 1}`)
  }))
})

// 徽章状态 - 使用 badges 中定义的 condition 函数自动判断解锁状态
const allBadges = computed(() => {
  const progress = getProgress()
  return badges.map(badge => ({
    ...badge,
    unlocked: badge.condition(progress)
  }))
})

// 当前进度
const progress = computed(() => getProgress())
</script>
