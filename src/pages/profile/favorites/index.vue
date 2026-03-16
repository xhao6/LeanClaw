<route lang="json">
{
  "layout": "default",
  "style": {
    "navigationBarTitleText": "我的收藏"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen box-border">
    <!-- Tab Filter -->
    <view class="bg-white p-4 pb-2">
      <wd-tabs v-model="activeTab" @change="handleTabChange" line-width="20px" line-height="3px" color="#FF6B35" inactive-color="#999">
        <wd-tab title="全部" name="all" />
        <wd-tab title="资源" name="resource" />
        <wd-tab title="案例" name="case" />
        <wd-tab title="Skills" name="skill" />
      </wd-tabs>
    </view>

    <!-- Content List -->
    <view class="p-4 pt-2">
      <view v-if="filteredFavorites.length === 0" class="flex-col-center py-20 text-gray-400">
        <wd-icon name="star" size="48px" class="mb-3 text-gray-300" />
        <text>暂无收藏内容</text>
        <text class="text-xs mt-2">快去发现页收藏感兴趣的内容吧</text>
      </view>

      <view v-else class="space-y-4">
        <view
          v-for="(item, index) in filteredFavorites"
          :key="item.id"
          class="bg-white p-4 rounded-2xl shadow-sm active:bg-gray-50 transition-all"
        >
          <!-- 标题 -->
          <view class="flex justify-between items-start mb-2">
            <text class="text-h2 line-clamp-2 flex-1 leading-snug pr-2">{{ item.title || '未知收藏' }}</text>
            <view class="flex items-center gap-1 shrink-0" @click.stop="handleRemoveFavorite(item.id)">
              <wd-icon name="star-filled" size="20px" class="text-orange" />
            </view>
          </view>
          <!-- 描述 -->
          <text class="text-body text-gray-500 line-clamp-2 mb-3">{{ item.desc || '无描述' }}</text>
          <!-- 标签 -->
          <view v-if="item.tags && item.tags.length" class="flex flex-wrap gap-2">
            <text
              v-for="(tag, tagIndex) in item.tags"
              :key="tagIndex"
              class="px-3 py-1 text-xs rounded-full border"
              :class="getTagClass(tag)"
            >
              {{ tag }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getFavorites, removeFavorite, type FavoriteItem } from '@/utils/favorites'
import { getTagClass } from '@/composables/useTagColors'

const activeTab = ref<string>('all')

const tabs = [
  { label: '全部', name: 'all' },
  { label: '资源', name: 'resource' },
  { label: '案例', name: 'case' },
  { label: 'Skills', name: 'skill' }
]

const favorites = ref<FavoriteItem[]>(getFavorites())

const filteredFavorites = computed(() => {
  // 不过滤标题，确保显示所有收藏（包括云端同步后标题为空的数据）
  if (activeTab.value === 'all') {
    return favorites.value
  }
  return favorites.value.filter(item => item.type === activeTab.value)
})

const handleTabChange = () => {
  // 重新获取最新数据
  favorites.value = getFavorites()
}

const handleRemoveFavorite = (id: string) => {
  uni.showModal({
    title: '取消收藏',
    content: '确定要取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        removeFavorite(id)
        favorites.value = getFavorites()
        uni.showToast({ title: '已取消收藏', icon: 'none' })
      }
    }
  })
}

// 页面显示时刷新数据
onShow(() => {
  favorites.value = getFavorites()
})
</script>

<style scoped>
:deep(.wd-tabs__nav) {
  background-color: white !important;
}
</style>
