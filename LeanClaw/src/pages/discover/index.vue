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
          <view class="flex-1 flex flex-col justify-between py-1">
            <view>
              <view class="flex justify-between items-start">
                 <text class="font-bold text-sm text-gray-800 line-clamp-1 mb-1">{{ item.title }}</text>
                 <wd-tag v-if="index < 2" type="danger" plain size="small" custom-class="!h-5 !px-1.5 !text-[10px]">HOT</wd-tag>
              </view>
              <text class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{{ item.desc }}</text>
            </view>
            <view class="flex justify-between items-center mt-2">
              <view class="flex items-center space-x-2 flex-wrap gap-y-1">
                <wd-tag v-for="tag in item.tags" :key="tag" size="small" custom-class="!bg-blue-50 !text-blue-500 !border-none !mr-1 !h-5 !px-1.5">{{ tag }}</wd-tag>
              </view>
              <view v-if="item.type === 'skill'" class="text-xs text-orange font-bold flex items-center shrink-0">
                <wd-icon name="star-filled" size="12px" class="mr-0.5" />
                {{ item.stars }}
              </view>
              <view v-else class="text-xs text-gray-300 flex items-center shrink-0">
                 <wd-icon name="view" size="14px" class="mr-1" />
                 1.2k
              </view>
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
    // Navigate to skill detail (mock)
    uni.showToast({ title: 'Skill 详情页开发中', icon: 'none' })
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
</script>

<style scoped>
:deep(.wd-card) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
:deep(.wd-tabs__nav) {
  background-color: white !important;
}
</style>
