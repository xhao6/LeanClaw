<route lang="json">
{
  "style": {
    "navigationBarTitleText": "Skill 详情"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen p-4 pb-24">
    <!-- Header Card -->
    <view class="bg-white rounded-2xl p-5 shadow-sm mb-4 text-center">
      <image :src="skill.icon" class="w-20 h-20 rounded-xl mb-3 mx-auto" />
      <view class="text-xl font-bold mb-1">{{ skill.name }}</view>
      <view class="text-sm text-gray-500 mb-4">{{ skill.desc }}</view>
      <view class="flex justify-center space-x-4 text-xs text-gray-400">
        <view class="flex items-center">
          <AppIcon name="user" class="mr-1" /> {{ skill.author }}
        </view>
        <view class="flex items-center">
          <AppIcon name="star-filled" class="mr-1 text-orange" /> {{ skill.stars }}
        </view>
        <view class="flex items-center">
          <AppIcon name="download" class="mr-1" /> {{ skill.downloads }}
        </view>
      </view>
    </view>

    <!-- Installation -->
    <view class="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <view class="font-bold text-base mb-3 flex items-center">
        <AppIcon name="cloud-download" class="mr-2 text-primary" />
        安装命令
      </view>
      <view class="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm break-all relative">
        <text selectable>{{ installCmd }}</text>
        <view class="absolute top-2 right-2" @click="handleCopy">
          <AppIcon name="copy" size="20px" class="text-white/50 active:text-white" />
        </view>
      </view>
      <wd-button type="primary" block custom-class="mt-4 !bg-orange !border-orange" @click="handleCopy">
        一键复制安装命令
      </wd-button>
    </view>

    <!-- Description -->
    <view class="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <view class="font-bold text-base mb-3">功能介绍</view>
      <view class="text-gray-600 leading-relaxed text-sm space-y-2">
        <view>• 实时监控指定的 GitHub 仓库动态。</view>
        <view>• 支持 Issue、PR、Release 等事件通知。</view>
        <view>• 可配置推送到钉钉、飞书、企业微信群。</view>
        <view>• 支持多仓库同时监控，自定义过滤规则。</view>
      </view>
    </view>

    <!-- Dependencies -->
    <view class="bg-white rounded-2xl p-5 shadow-sm">
      <view class="font-bold text-base mb-3">依赖项</view>
      <view class="flex flex-wrap gap-2">
        <wd-tag plain type="info">node >= 18.0.0</wd-tag>
        <wd-tag plain type="info">axios</wd-tag>
        <wd-tag plain type="info">dayjs</wd-tag>
      </view>
    </view>

    <!-- Bottom Action -->
    <view class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex space-x-4">
      <wd-button type="info" plain icon="github" block class="flex-1">源码</wd-button>
      <wd-button type="error" plain icon="star" block class="flex-1">收藏</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const skill = ref({
  name: 'GitHub Monitor',
  desc: '实时监控 GitHub 仓库动态并推送通知',
  author: 'OpenClaw Team',
  stars: '1.2k',
  downloads: '5.6k',
  icon: 'https://via.placeholder.com/150/24292e/FFFFFF?text=GitHub',
  pkgName: 'claw-skill-github'
})

const installCmd = computed(() => `npm install ${skill.value.pkgName} --save`)

onLoad((options: any) => {
  if (options.name) {
    skill.value.name = decodeURIComponent(options.name)
    skill.value.pkgName = `claw-skill-${options.name.toLowerCase().replace(/\s+/g, '-')}`
  }
})

const handleCopy = () => {
  uni.setClipboardData({
    data: installCmd.value,
    success: () => uni.showToast({ title: '已复制到剪贴板', icon: 'none' })
  })
}
</script>
