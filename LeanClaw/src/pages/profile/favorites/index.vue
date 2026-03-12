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
          class="bg-white p-3 rounded-2xl shadow-sm flex active:bg-gray-50 transition-all"
        >
          <image :src="item.image || getPlaceholder(item)" class="w-20 h-20 rounded-xl mr-3 object-cover bg-gray-100 shrink-0" />
          <view class="flex-1 flex flex-col justify-between py-1 min-w-0">
            <view>
              <view class="flex justify-between items-start">
                <text class="font-bold text-sm text-gray-800 line-clamp-1 flex-1">{{ item.title }}</text>
                <view class="ml-2" @click.stop="handleRemoveFavorite(item.id)">
                  <wd-icon name="star-filled" size="18px" class="text-orange" />
                </view>
              </view>
              <text class="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-1">{{ item.desc }}</text>
            </view>
            <view class="flex items-center justify-between mt-2">
              <view class="flex items-center space-x-1">
                <wd-tag size="small" :type="getTypeTagType(item.type)" custom-class="!h-5 !px-1.5 !text-[10px]">{{ getTypeLabel(item.type) }}</wd-tag>
              </view>
              <text class="text-xs text-gray-400">{{ formatDate(item.addedAt) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  if (activeTab.value === 'all') {
    return favorites.value
  }
  return favorites.value.filter(item => item.type === activeTab.value)
})

const getPlaceholder = (item: FavoriteItem) => {
  if (item.type === 'skill') return '/static/images/placeholder/skill.svg'
  if (item.type === 'case') return '/static/images/placeholder/case.svg'
  return '/static/images/placeholder/article.svg'
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    resource: '资源',
    case: '案例',
    skill: 'Skill'
  }
  return map[type] || type
}

const getTypeTagType = (type: string) => {
  const map: Record<string, string> = {
    resource: 'primary',
    case: 'success',
    skill: 'warning'
  }
  return map[type] || 'default'
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
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
uni.onShow(() => {
  favorites.value = getFavorites()
})
</script>

<style scoped>
:deep(.wd-tabs__nav) {
  background-color: white !important;
}
</style>
