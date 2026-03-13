<route lang="json">
{
  "style": {
    "navigationBarTitleText": "消息通知"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen box-border">
    <!-- 通知列表 -->
    <view v-if="notifications.length > 0" class="p-4 space-y-3">
      <view
        v-for="(item, index) in notifications"
        :key="index"
        class="bg-white rounded-2xl shadow-sm p-4 flex items-start"
        :class="{ 'opacity-60': item.read }"
      >
        <view
          class="w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0"
          :class="getIconBg(item.type)"
        >
          <wd-icon :name="getIcon(item.type)" size="20px" :color="getIconColor(item.type)" />
        </view>
        <view class="flex-1 min-w-0">
          <view class="flex justify-between items-start">
            <view class="text-sm font-medium text-gray-800">{{ item.title }}</view>
            <view class="text-xs text-gray-400 shrink-0 ml-2">{{ item.time }}</view>
          </view>
          <view class="text-xs text-gray-500 mt-1 line-clamp-2">{{ item.content }}</view>
        </view>
        <view v-if="!item.read" class="w-2 h-2 rounded-full bg-orange ml-2 shrink-0 mt-1"></view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex-col-center py-20 text-gray-400">
      <wd-icon name="notification" size="48px" class="mb-3 text-gray-300" />
      <text>暂无通知</text>
      <text class="text-xs mt-2">学习打卡后会收到通知提醒</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Notification {
  type: 'study' | 'badge' | 'certificate' | 'system'
  title: string
  content: string
  time: string
  read: boolean
}

// 模拟通知数据
const notifications = ref<Notification[]>([
  {
    type: 'study',
    title: '学习提醒',
    content: '今天还没有学习哦，快去完成 Day 1 的课程吧！',
    time: '今天',
    read: false
  },
  {
    type: 'badge',
    title: '徽章获得',
    content: '恭喜获得「初识 OpenClaw」徽章，继续加油！',
    time: '昨天',
    read: true
  },
  {
    type: 'system',
    title: '欢迎使用',
    content: '欢迎加入 LeanClaw，7 天帮你掌握 OpenClaw！',
    time: '3天前',
    read: true
  }
])

const getIcon = (type: string) => {
  const map: Record<string, string> = {
    study: 'calendar',
    badge: 'medal',
    certificate: 'certificate',
    system: 'info-circle'
  }
  return map[type] || 'notification'
}

const getIconBg = (type: string) => {
  const map: Record<string, string> = {
    study: 'bg-primary/10',
    badge: 'bg-yellow-500/10',
    certificate: 'bg-green-500/10',
    system: 'bg-gray-100'
  }
  return map[type] || 'bg-gray-100'
}

const getIconColor = (type: string) => {
  const map: Record<string, string> = {
    study: '#1E3A5F',
    badge: '#EAB308',
    certificate: '#22C55E',
    system: '#9CA3AF'
  }
  return map[type] || '#9CA3AF'
}
</script>
