<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "发现"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen box-border">
    <!-- Search Bar -->
    <view class="px-4 py-2 bg-white sticky top-0 z-10 shadow-sm">
      <wd-search 
        v-model="searchValue" 
        placeholder="搜索资源、案例或 Skills" 
        custom-class="!bg-gray-100 !rounded-full"
        @search="handleSearch" 
        @clear="handleSearch" 
      />
    </view>

    <!-- Tabs for categories -->
    <view class="bg-white mb-2 pb-1">
      <wd-tabs 
        v-model="activeTab" 
        @change="handleTabChange" 
        sticky 
        :offset-top="52"
        line-width="20px"
        line-height="3px"
        color="#FF6B35"
        inactive-color="#999"
      >
        <wd-tab v-for="(tab, index) in tabs" :key="index" :title="tab.label" :name="tab.name" />
      </wd-tabs>
    </view>

    <!-- Content List -->
    <view class="p-4 pt-0">
      <view v-if="loading" class="flex-center py-10">
        <wd-loading color="#FF6B35" />
      </view>

      <view v-else-if="filteredItems.length === 0" class="flex-col-center py-20 text-gray-400">
        <wd-icon name="warning" size="48px" class="mb-3 text-gray-300" />
        <text>未找到相关内容</text>
      </view>

      <view v-else class="space-y-4">
        <view
          v-for="(item, index) in filteredItems"
          :key="index"
          class="bg-white p-3 rounded-2xl shadow-sm flex active:bg-gray-50 transition-all active:scale-[0.99]"
          @click="handleItemClick(item)"
        >
          <image :src="item.image || getPlaceholder(item)" class="w-24 h-24 rounded-xl mr-4 object-cover bg-gray-100 shrink-0" />
          <view class="flex-1 flex flex-col justify-between py-1 min-h-0">
            <view class="flex-1">
              <view class="flex justify-between items-start mb-2">
                 <text class="text-h2 line-clamp-2 flex-1 leading-snug">{{ item.title }}</text>
                 <view class="flex items-center gap-1 ml-2 shrink-0 pt-0.5" @click.stop="handleToggleFavorite(item)">
                   <wd-icon :name="isFavorited(item.id) ? 'star-filled' : 'star'" size="20px" :class="isFavorited(item.id) ? 'text-orange' : 'text-gray-300'" />
                 </view>
              </view>
              <text class="text-body line-clamp-2">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { resources, type ResourceItem } from '@/data/mock'
import { toggleFavorite, isFavorited } from '@/utils/favorites'

const searchValue = ref('')
const activeTab = ref<string>('resource')
const loading = ref(false)

const tabs = [
  { label: '优质资源', name: 'resource' },
  { label: '精选案例', name: 'case' },
  { label: 'Skills', name: 'skill' }
]

const filteredItems = computed(() => {
  let items = resources.filter(item => {
    // Filter by tab type
    if (activeTab.value === 'resource') {
      return item.type === 'resource' || item.type === 'case' // Combine for now or separate
    }
    return item.type === activeTab.value
  })
  
  // Specific fix: resources tab should show resources; case tab show cases
  if (activeTab.value === 'resource') items = resources.filter(i => i.type === 'resource')
  if (activeTab.value === 'case') items = resources.filter(i => i.type === 'case')
  if (activeTab.value === 'skill') items = resources.filter(i => i.type === 'skill')

  // Filter by search
  if (searchValue.value) {
    const query = searchValue.value.toLowerCase()
    items = items.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.desc.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return items
})

const getPlaceholder = (item: ResourceItem) => {
  if (item.type === 'skill') return '/static/images/placeholder/skill.svg'
  if (item.type === 'case') return '/static/images/placeholder/case.svg'
  if (item.category === 'video') return '/static/images/placeholder/video.svg'
  return '/static/images/placeholder/article.svg'
}

const handleSearch = () => {
  // Search is reactive, but we can add analytics or debouncing here
}

const handleTabChange = (e: any) => {
  // Tab change logic
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

const handleItemClick = (item: ResourceItem) => {
  if (item.type === 'skill') {
    // Navigate to skill detail page
    uni.navigateTo({
      url: `/pages/skill/detail?name=${encodeURIComponent(item.title)}`
    })
  } else if (item.url) {
    // Handle external link
    // #ifdef H5
    window.open(item.url, '_blank')
    // #endif

    // #ifndef H5
    uni.setClipboardData({
      data: item.url,
      success: () => {
        uni.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' })
      }
    })
    // #endif
  }
}

const handleToggleFavorite = (item: ResourceItem) => {
  toggleFavorite(item)
  if (isFavorited(item.id)) {
    uni.showToast({ title: '已收藏', icon: 'success' })
  } else {
    uni.showToast({ title: '已取消收藏', icon: 'none' })
  }
}
</script>

<style scoped>
:deep(.wd-card) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
:deep(.wd-tabs__nav) {
  background-color: white !important;
}
:deep(.wd-tabs__nav-item) {
  font-size: 16px !important;
  font-weight: bold;
  color: #111827; /* gray-900 */
}
:deep(.wd-tabs__nav-item.is-active) {
  color: #FF6B35 !important;
  font-size: 18px !important; /* 选中时稍微大一点 */
}
</style>
