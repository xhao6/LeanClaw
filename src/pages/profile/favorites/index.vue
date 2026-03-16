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
            <text class="text-h2 line-clamp-2 flex-1 leading-snug pr-2">{{ item.title }}</text>
            <view class="flex items-center gap-1 shrink-0" @click.stop="handleRemoveFavorite(item.id)">
              <wd-icon name="star-filled" size="20px" class="text-orange" />
            </view>
          </view>
          <!-- 描述 -->
          <text class="text-body text-gray-500 line-clamp-2 mb-3">{{ item.desc }}</text>
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

const activeTab = ref<string>('all')

const tabs = [
  { label: '全部', name: 'all' },
  { label: '资源', name: 'resource' },
  { label: '案例', name: 'case' },
  { label: 'Skills', name: 'skill' }
]

const favorites = ref<FavoriteItem[]>(getFavorites())

const filteredFavorites = computed(() => {
  // 过滤掉没有标题的无效收藏
  const validFavorites = favorites.value.filter(item => item.title)
  if (activeTab.value === 'all') {
    return validFavorites
  }
  return validFavorites.filter(item => item.type === activeTab.value)
})

// 标签颜色池
const tagColors = [
  'border-orange-200 text-orange-600 bg-orange-50',
  'border-blue-200 text-blue-600 bg-blue-50',
  'border-green-200 text-green-600 bg-green-50',
  'border-purple-200 text-purple-600 bg-purple-50',
  'border-pink-200 text-pink-600 bg-pink-50',
  'border-amber-200 text-amber-600 bg-amber-50',
  'border-cyan-200 text-cyan-600 bg-cyan-50',
  'border-indigo-200 text-indigo-600 bg-indigo-50',
  'border-rose-200 text-rose-600 bg-rose-50',
  'border-teal-200 text-teal-600 bg-teal-10',
]

// 哈希函数
const hashCode = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

const getTagClass = (tag: string) => {
  const index = hashCode(tag) % tagColors.length
  return tagColors[index]
}

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
