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
        <!-- 已登录状态 -->
        <view v-if="isLoggedIn" class="flex items-center space-x-4">
          <view class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <text class="text-3xl">{{ userInfo.avatar || '🦞' }}</text>
          </view>
          <view>
            <view class="text-lg font-bold text-gray-800">{{ userInfo.name || '用户' }}</view>
            <view class="text-xs text-gray-400 mt-1">ID: {{ userInfo.id }}</view>
          </view>
        </view>
        <!-- 未登录状态 -->
        <view v-else class="flex items-center space-x-4">
          <view class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <text class="text-3xl">👤</text>
          </view>
          <view>
            <view class="text-lg font-bold text-gray-400">未登录</view>
            <view class="text-xs text-gray-400 mt-1">点击登录账号</view>
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
          <wd-cell title="关于 轻学Claw" is-link icon="link" size="large" @click="goToAbout" />
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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { CacheService } from '@/services/CacheService'

// 用户状态
const userStore = useUserStore()
const { userInfo, isLoggedIn } = storeToRefs(userStore)

// 版本号
const version = '1.0.0'

// 缓存大小（动态获取）
const cacheSize = computed(() => CacheService.getCacheSize())

// 清除缓存
const handleClearCache = () => {
  CacheService.confirmAndClear()
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
