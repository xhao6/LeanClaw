<template>
  <view class="article-footer">
    <view class="footer-btn left" @click="handleBack">
      <wd-icon name="arrow-left" size="18px" />
      <text>返回</text>
    </view>
    <view class="footer-btn right" @click="handleFavorite">
      <wd-icon :name="isFavorited ? 'star-filled' : 'star'" size="18px" />
      <text>{{ isFavorited ? '已收藏' : '收藏' }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { toggleFavorite, isFavorited as checkFavorited } from '@/utils/favorites'
import type { ResourceItem } from '@/types/resource'

const props = defineProps<{
  resource: ResourceItem
}>()

const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

const isFavorited = computed(() => checkFavorited(props.resource.id))

const handleBack = () => {
  uni.navigateBack()
}

const handleFavorite = () => {
  if (!isLoggedIn.value) {
    uni.showModal({
      title: '提示',
      content: '登录后可收藏内容，是否前往登录？',
      success: (res) => {
        if (res.confirm) {
          uni.switchTab({ url: '/pages/profile/index' })
        }
      }
    })
    return
  }

  const wasFavorited = isFavorited.value // 保存切换前的状态
  toggleFavorite(props.resource)

  // 根据切换前的状态显示提示（切换后状态相反）
  if (wasFavorited) {
    uni.showToast({ title: '已取消收藏', icon: 'none' })
  } else {
    uni.showToast({ title: '已收藏', icon: 'success' })
  }
}
</script>

<style scoped>
.article-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 20rpx 40rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.footer-btn.left {
  background: #f5f5f5;
  color: #666;
}

.footer-btn.right {
  background: #FF6B35;
  color: #fff;
}
</style>
