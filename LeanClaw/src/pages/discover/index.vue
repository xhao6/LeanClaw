<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "发现"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen">
    <!-- Search Bar -->
    <view class="px-4 py-2 bg-white sticky top-0 z-10 shadow-sm">
      <wd-search v-model="searchValue" placeholder="搜索资源、案例或 Skills" @search="handleSearch" @clear="handleSearch" />
    </view>

    <!-- Tabs for categories -->
    <view class="bg-white mb-2">
      <wd-tabs v-model="activeTab" @change="handleTabChange" sticky :offset-top="52">
        <wd-tab v-for="(tab, index) in tabs" :key="index" :title="tab.label" :name="tab.name" />
      </wd-tabs>
    </view>

    <!-- Content List -->
    <view class="p-4 pt-0">
      <view v-if="loading" class="flex-center py-10">
        <wd-loading />
      </view>

      <view v-else-if="filteredItems.length === 0" class="flex-col-center py-20 text-gray-400">
        <wd-icon name="warning" size="48px" class="mb-3" />
        <text>未找到相关内容</text>
      </view>

      <view v-else class="space-y-4">
        <wd-card v-for="(item, index) in filteredItems" :key="index" custom-class="!rounded-2xl shadow-sm mb-4" @click="handleItemClick(item)">
          <view class="flex">
            <image :src="item.image || 'https://via.placeholder.com/120'" class="w-24 h-24 rounded-xl mr-4 object-cover" />
            <view class="flex-1 flex flex-col justify-between py-1">
              <view>
                <view class="font-bold text-sm mb-1 line-clamp-1">{{ item.title }}</view>
                <view class="text-xs text-gray-500 line-clamp-2 leading-tight">{{ item.desc }}</view>
              </view>
              <view class="flex justify-between items-center mt-2">
                <view class="flex items-center space-x-2">
                  <wd-tag v-for="tag in item.tags" :key="tag" size="small" type="primary" plain>{{ tag }}</wd-tag>
                </view>
                <view v-if="item.type === 'skill'" class="text-xs text-orange font-medium flex items-center">
                  <wd-icon name="star-filled" size="14px" class="mr-1" />
                  {{ item.stars }}
                </view>
              </view>
            </view>
          </view>
        </wd-card>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchValue = ref('')
const activeTab = ref('resource')
const loading = ref(false)

const tabs = [
  { label: '优质资源', name: 'resource' },
  { label: '应用案例', name: 'case' },
  { label: 'Skills 大全', name: 'skill' },
]

const items = ref([
  // 优质资源
  { title: 'OpenClaw 官方文档', desc: '最权威的开发指南，涵盖所有核心 API 和功能介绍', type: 'resource', tags: ['官方', '文档'], image: 'https://via.placeholder.com/150/1E3A5F/FFFFFF?text=Docs' },
  { title: 'DeepSeek 接入教程', desc: '详细讲解如何将国产最强模型接入 OpenClaw', type: 'resource', tags: ['AI', '入门'], image: 'https://via.placeholder.com/150/007bff/FFFFFF?text=DeepSeek' },
  { title: '从零开始写 Skill', desc: '保姆级教程，手把手教你编写第一个 OpenClaw 插件', type: 'resource', tags: ['开发', '教程'], image: 'https://via.placeholder.com/150/6f42c1/FFFFFF?text=Skill' },
  { title: 'Docker 部署指南', desc: '使用 Docker 快速部署 OpenClaw 环境，一键运行', type: 'resource', tags: ['部署', 'Docker'], image: 'https://via.placeholder.com/150/2496ed/FFFFFF?text=Docker' },

  // 应用案例
  { title: '智能家居自动化', desc: '通过 OpenClaw 实现家电语音控制和场景联动', type: 'case', tags: ['家居', '自动'], image: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=Home' },
  { title: '个人财务管家', desc: '自动记录支出，分析消费习惯，提供理财建议', type: 'case', tags: ['理财', '工具'], image: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Finance' },
  { title: '自媒体助手', desc: '自动抓取热点，辅助文案生成，多平台一键发布', type: 'case', tags: ['自媒体', '生产力'], image: 'https://via.placeholder.com/150/e83e8c/FFFFFF?text=Media' },
  { title: '会议摘要提取', desc: '接入语音识别，自动提取会议要点和待办事项', type: 'case', tags: ['办公', 'AI'], image: 'https://via.placeholder.com/150/17a2b8/FFFFFF?text=Meeting' },

  // Skills
  { title: 'GitHub Repo Monitor', desc: '实时监控仓库动态，自动推送到各平台', type: 'skill', tags: ['开发', '工具'], stars: '1.2k', image: 'https://via.placeholder.com/150/24292e/FFFFFF?text=GitHub' },
  { title: 'Weather Expert', desc: '精准天气预报，根据天气提醒穿衣和出行', type: 'skill', tags: ['生活', '工具'], stars: '850', image: 'https://via.placeholder.com/150/ffc107/FFFFFF?text=Weather' },
  { title: 'Translation Pro', desc: '多语言实时翻译，支持文档和网页翻译', type: 'skill', tags: ['翻译', 'AI'], stars: '2.1k', image: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Translate' },
  { title: 'Stock Master', desc: '实时股价追踪，智能分析趋势，预警提醒', type: 'skill', tags: ['投资', '金融'], stars: '1.5k', image: 'https://via.placeholder.com/150/dc3545/FFFFFF?text=Stock' },
])

const handleItemClick = (item: any) => {
  console.log('Item clicked:', item.title)
  uni.showModal({
    title: item.title,
    content: `你点击了 ${item.type === 'skill' ? 'Skill' : '内容'}: ${item.title}。MVP 版本暂不支持查看详情。`,
    showCancel: false,
  })
}

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchTab = item.type === activeTab.value
    const matchSearch = item.title.toLowerCase().includes(searchValue.value.toLowerCase()) ||
                        item.desc.toLowerCase().includes(searchValue.value.toLowerCase())
    return matchTab && matchSearch
  })
})

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleTabChange = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
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
