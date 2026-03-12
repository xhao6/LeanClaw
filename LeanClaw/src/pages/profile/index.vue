<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "我的"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen box-border pb-20">
    <!-- Header/User Info -->
    <view class="bg-primary p-8 pt-12 pb-16 flex items-center space-x-4 relative overflow-hidden">
      <!-- Decorative circles -->
      <view class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none"></view>
      <view class="absolute left-10 bottom-0 w-20 h-20 rounded-full bg-white/5 pointer-events-none"></view>

      <view class="relative z-10 border-2 border-solid border-white/30 rounded-full p-1" @click="handleLogin">
        <image :src="userInfo.avatar || '/static/images/placeholder/fun-avatar.svg'" class="w-16 h-16 rounded-full bg-white" />
      </view>
      
      <view class="relative z-10 text-white flex-1" @click="handleLogin">
        <template v-if="isLoggedIn">
          <view class="text-xl font-bold flex items-center">
            {{ userInfo.name || '龙虾驯养员' }}
            <wd-icon name="edit" size="16px" class="ml-2 opacity-70" />
          </view>
          <view class="text-xs text-white/70 mt-1 bg-white/10 px-2 py-0.5 rounded-full inline-block">ID: {{ userInfo.id ? userInfo.id.substring(0, 8) : '...' }}</view>
        </template>
        <template v-else>
          <view class="text-xl font-bold flex items-center">
            点击登录
          </view>
          <view class="text-xs text-white/70 mt-1">登录同步学习进度</view>
        </template>
      </view>

      <view class="absolute right-6 top-14 text-white/80" @click="goToSettings">
        <wd-icon name="setting" size="24px" />
      </view>
    </view>

    <!-- Stats Card -->
    <view class="px-4 -mt-8 relative z-20">
      <view class="bg-white rounded-2xl shadow-lg shadow-blue-900/5 p-5 flex justify-around items-center">
        <view class="text-center">
          <view class="text-xl font-bold text-primary mb-1">{{ progress.currentDay - 1 }}</view>
          <view class="text-xs text-gray-400">已学天数</view>
        </view>
        <view class="w-[1px] h-8 bg-gray-100"></view>
        <view class="text-center">
          <view class="text-xl font-bold text-orange mb-1">{{ completedLessonsCount }}</view>
          <view class="text-xs text-gray-400">完成课程</view>
        </view>
        <view class="w-[1px] h-8 bg-gray-100"></view>
        <view class="text-center">
          <view class="text-xl font-bold text-green-500 mb-1">{{ progress.badges?.length || 0 }}</view>
          <view class="text-xs text-gray-400">获得徽章</view>
        </view>
      </view>
    </view>

    <!-- Menu List -->
    <view class="p-4 mt-2 space-y-4">
      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="我的收藏" is-link icon="star" size="large" @click="goToFavorites" />
          <wd-cell title="我的证书" is-link icon="thumb-up" size="large" @click="goToCertificate" />
          <wd-cell title="学习统计" is-link icon="chart-bar" size="large" @click="goToStats" />
        </wd-cell-group>
      </view>

      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="消息通知" is-link icon="notification" size="large" @click="goToNotifications" />
          <wd-cell title="关于 LeanClaw" is-link icon="info-circle" size="large" @click="goToAbout" />
        </wd-cell-group>
      </view>

      <view v-if="isLoggedIn" class="pt-4 pb-8">
        <wd-button block type="error" plain custom-class="!rounded-xl !border-gray-200 !text-gray-500 !bg-white" @click="handleLogout">退出登录</wd-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { getProgress } from '@/utils/learnProgress'
import { getFavoritesCount } from '@/utils/favorites'

const userStore = useUserStore()
const { userInfo, isLoggedIn } = storeToRefs(userStore)

const progress = getProgress()
const favoritesCount = computed(() => getFavoritesCount())
const completedLessonsCount = computed(() => progress.completedLessons?.length || 0)

onShow(() => {
  if (isLoggedIn.value) {
    userStore.fetchProfile()
  }
})

const handleLogin = async () => {
  if (isLoggedIn.value) return
  
  uni.showLoading({ title: '登录中...' })
  try {
    await userStore.login()
    uni.showToast({ title: '登录成功', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '登录失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

const handleLogout = () => {
  userStore.logout()
  uni.showToast({ title: '已退出', icon: 'none' })
}

// 跳转收藏页面
const goToFavorites = () => {
  uni.navigateTo({
    url: '/pages/profile/favorites/index'
  })
}

// 跳转证书页面
const goToCertificate = () => {
  uni.navigateTo({
    url: '/pages/profile/certificate/index'
  })
}

// 跳转统计页面
const goToStats = () => {
  uni.navigateTo({
    url: '/pages/profile/stats/index'
  })
}

// 跳转消息通知
const goToNotifications = () => {
  uni.navigateTo({
    url: '/pages/profile/notifications/index'
  })
}

// 跳转关于页面
const goToAbout = () => {
  uni.navigateTo({
    url: '/pages/profile/about/index'
  })
}

// 跳转设置页面
const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/profile/settings/index'
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '当前为游客模式，无法退出登录',
    showCancel: false,
    confirmText: '知道了'
  })
}
</script>

<style scoped>
:deep(.wd-card) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
:deep(.wd-cell-group) {
  background-color: transparent !important;
}
</style>
