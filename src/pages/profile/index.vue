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
        <view class="text-center" @click="goToLearn">
          <view class="text-xl font-bold text-orange mb-1">{{ completedLessonsCount }}</view>
          <view class="text-xs text-gray-400">完成课程</view>
        </view>
        <view class="w-[1px] h-8 bg-gray-100"></view>
        <view class="text-center" @click="goToFavorites">
          <view class="text-xl font-bold text-primary mb-1">{{ favoritesCount }}</view>
          <view class="text-xs text-gray-400">我的收藏</view>
        </view>
        <view class="w-[1px] h-8 bg-gray-100"></view>
        <view class="text-center" @click="goToCertificate">
          <view class="text-xl font-bold text-green-500 mb-1">{{ badgesCount }}</view>
          <view class="text-xs text-gray-400">我的徽章</view>
        </view>
      </view>
    </view>

    <!-- Menu List -->
    <view class="p-4 mt-2 space-y-4">
      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="我的证书" is-link icon="thumb-up" size="large" @click="goToCertificate" />
          <wd-cell title="学习统计" is-link icon="chart-bar" size="large" @click="goToStats" />
        </wd-cell-group>
      </view>

      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="用户协议" is-link icon="file" size="large" @click="goToAgreement" />
          <wd-cell title="隐私政策" is-link icon="lock-on" size="large" @click="goToPrivacy" />
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
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { getProgress } from '@/utils/learnProgress'
import { getFavoritesCount, syncFavorites } from '@/utils/favorites'
import { getFavorites as getCloudFavorites } from '@/api/modules/user'

const userStore = useUserStore()
const { userInfo, isLoggedIn } = storeToRefs(userStore)

// 响应式标记，用于强制更新统计数据
const statsVersion = ref(0)

// 使用 computed 实现响应式 - 添加响应式依赖
const favoritesCount = computed(() => {
  void statsVersion.value // 追踪依赖
  return getFavoritesCount()
})
const completedLessonsCount = computed(() => {
  void statsVersion.value // 追踪依赖
  return getProgress().completedLessons?.length || 0
})
const badgesCount = computed(() => {
  void statsVersion.value // 追踪依赖
  return getProgress().badges?.length || 0
})

onShow(async () => {
  // 触发统计数据更新
  statsVersion.value++

  if (isLoggedIn.value) {
    userStore.fetchProfile()

    // 同步云端收藏数据
    try {
      const res = await getCloudFavorites()
      if (res.success && res.data) {
        syncFavorites(res.data)
        // 同步后更新统计
        statsVersion.value++
      } else if (res.success === false) {
        console.warn('同步收藏失败:', res.message)
      }
    } catch (e) {
      console.warn('同步收藏失败', e)
    }
  }
})

const handleLogin = async () => {
  if (isLoggedIn.value) return

  uni.showLoading({ title: '登录中...', mask: true })

  try {
    let wechatUserInfo = null

    // #ifdef MP-WEIXIN
    // 微信小程序：尝试获取用户授权信息（可选，用户可拒绝）
    try {
      wechatUserInfo = await new Promise<any>((resolve) => {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res: any) => {
            resolve(res.userInfo)
          },
          fail: () => {
            // 用户拒绝授权，继续登录但不传递用户信息
            resolve(null)
          }
        })
      })
    } catch (e) {
      console.log('获取授权失败，继续登录:', e)
    }
    // #endif

    // 调用云函数登录
    await userStore.login(wechatUserInfo)

    // 登录成功后更新统计
    statsVersion.value++

    uni.showToast({ title: '登录成功', icon: 'success' })
  } catch (e) {
    console.error('登录失败:', e)
    uni.showToast({ title: '登录失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

const handleLogout = () => {
  userStore.logout()
  // 退出登录后更新统计
  statsVersion.value++
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

// 跳转学习页
const goToLearn = () => {
  uni.switchTab({
    url: '/pages/learn/index'
  })
}

// 跳转统计页面
const goToStats = () => {
  uni.navigateTo({
    url: '/pages/profile/stats/index'
  })
}

// 跳转用户协议
const goToAgreement = () => {
  uni.navigateTo({
    url: '/pages/profile/agreement/index'
  })
}

// 跳转隐私政策
const goToPrivacy = () => {
  uni.navigateTo({
    url: '/pages/profile/privacy/index'
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
