<route lang="json">
{
  "style": {
    "navigationBarTitleText": "设置"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen box-border">
    <!-- 用户信息卡片 -->
    <view class="p-4">
      <view class="bg-white rounded-2xl shadow-sm p-5">
        <view class="flex items-center space-x-4">
          <view class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <text class="text-3xl">🦞</text>
          </view>
          <view>
            <view class="text-lg font-bold text-gray-800">龙虾驯养员</view>
            <view class="text-xs text-gray-400 mt-1">ID: 10245678</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 设置列表 -->
    <view class="p-4 pt-0 space-y-4">
      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="清除缓存" is-link icon="delete" size="large" @click="handleClearCache">
            <template #value>
              <text class="text-gray-400">{{ cacheSize }}</text>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>

      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="版本信息" icon="info-circle" size="large">
            <template #value>
              <text class="text-gray-400">v{{ version }}</text>
            </template>
          </wd-cell>
          <wd-cell title="关于 LeanClaw" is-link icon="link" size="large" @click="goToAbout" />
        </wd-cell-group>
      </view>
    </view>

    <!-- 底部说明 -->
    <view class="p-8 text-center">
      <view class="text-xs text-gray-300">
        OpenClaw 学习助手 v{{ version }}
      </view>
      <view class="text-xs text-gray-300 mt-1">
        让 AI 学习变得更简单
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { clearAllFavorites } from '@/utils/favorites'
import { resetProgress } from '@/utils/learnProgress'

// 版本号
const version = '1.0.0'

// 缓存大小（模拟显示）
const cacheSize = computed(() => '2.3 MB')

// 清除缓存
const handleClearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除所有缓存数据吗？这将清除学习进度、收藏等本地数据，且无法恢复。',
    success: (res) => {
      if (res.confirm) {
        confirmClearCache()
      }
    }
  })
}

// 确认清除缓存
const confirmClearCache = () => {
  // 清除学习进度
  resetProgress()
  // 清除收藏
  clearAllFavorites()
  // 清除其他可能的缓存
  try {
    const keysToKeep = ['uni-id-token', 'uni-id-token-expire']
    const allKeys = uni.getStorageInfoSync().keys
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        uni.removeStorageSync(key)
      }
    })
  } catch (e) {
    console.error('清除缓存失败:', e)
  }

  uni.showToast({
    title: '缓存已清除',
    icon: 'success',
  })

  // 延迟刷新页面
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/index/index',
    })
  }, 1000)
}

// 跳转到关于页面
const goToAbout = () => {
  uni.navigateTo({
    url: '/pages/profile/about/index',
  })
}
</script>

<style scoped>
:deep(.wd-cell-group) {
  background-color: transparent !important;
}
</style>
