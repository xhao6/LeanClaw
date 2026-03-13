<route lang="json">
{
  "style": {
    "navigationBarTitleText": "案例详情"
  }
}
</route>

<template>
  <view class="bg-white min-h-screen pb-24">
    <!-- Header Image -->
    <image :src="caseData.image" mode="aspectFill" class="w-full h-48 bg-gray-200" />
    
    <!-- Title Section -->
    <view class="p-4 border-b border-gray-100">
      <view class="text-xl font-bold mb-2">{{ caseData.title }}</view>
      <view class="flex items-center space-x-2">
        <wd-tag v-for="tag in caseData.tags" :key="tag" type="primary" plain size="small">{{ tag }}</wd-tag>
      </view>
    </view>

    <!-- Content -->
    <view class="p-4">
      <view class="mb-6">
        <view class="text-lg font-bold mb-2 flex items-center">
          <AppIcon name="info-circle" class="mr-2 text-primary" />
          场景描述
        </view>
        <view class="text-gray-600 leading-relaxed text-sm">
          {{ caseData.desc }}
        </view>
      </view>

      <view class="mb-6">
        <view class="text-lg font-bold mb-3 flex items-center">
          <AppIcon name="list" class="mr-2 text-primary" />
          配置步骤
        </view>
        <view class="space-y-4">
          <view v-for="(step, index) in caseData.steps" :key="index" class="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <view class="font-bold text-sm mb-1 text-orange">Step {{ index + 1 }}</view>
            <view class="text-sm text-gray-700">{{ step }}</view>
          </view>
        </view>
      </view>

      <view class="mb-6">
        <view class="text-lg font-bold mb-3 flex items-center">
          <AppIcon name="code" class="mr-2 text-primary" />
          核心代码
        </view>
        <view class="bg-gray-800 text-gray-200 p-4 rounded-xl font-mono text-xs overflow-x-auto relative group">
          <text selectable>{{ caseData.code }}</text>
          <view class="absolute top-2 right-2 bg-white/10 px-2 py-1 rounded text-xs text-white cursor-pointer" @click="handleCopyCode">复制</view>
        </view>
      </view>
    </view>

    <!-- Bottom Action -->
    <view class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex space-x-4">
      <wd-button type="info" plain icon="star" block class="flex-1">收藏</wd-button>
      <wd-button type="primary" block class="flex-[2] !bg-primary !border-primary">尝试运行</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const caseData = ref({
  title: '加载中...',
  image: '',
  tags: [],
  desc: '',
  steps: [],
  code: ''
})

// Mock data based on ID
const mockCases: Record<string, any> = {
  'default': {
    title: '智能家居自动化',
    image: 'https://via.placeholder.com/375x200/FF6B35/FFFFFF?text=SmartHome',
    tags: ['家居', '自动', 'IoT'],
    desc: '通过 OpenClaw 连接米家设备，实现基于地理位置的回家自动开灯、开空调，并播放欢迎语。',
    steps: [
      '在 OpenClaw 中安装 miot-plugin 插件',
      '配置米家账号与设备 ID',
      '编写自动化脚本，设置触发条件为“定位进入小区”',
      '测试运行并部署'
    ],
    code: `import { Claw } from 'openclaw'
import { MiHome } from 'openclaw-plugin-mihome'

const app = new Claw()
const mi = new MiHome({ user: '...', pass: '...' })

app.on('location.enter', async (loc) => {
  if (loc.name === 'MyHome') {
    await mi.device('light').turnOn()
    await app.speak('欢迎回家！')
  }
})`
  }
}

onLoad((options: any) => {
  const id = options.id || 'default'
  // In real app, fetch from API
  caseData.value = mockCases[id] || mockCases['default']
  if (options.title) {
    caseData.value.title = decodeURIComponent(options.title)
  }
})

const handleCopyCode = () => {
  uni.setClipboardData({
    data: caseData.value.code,
    success: () => uni.showToast({ title: '代码已复制', icon: 'none' })
  })
}
</script>
