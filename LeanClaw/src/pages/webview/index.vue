<route lang="json">
{
  "style": {
    "navigationBarTitleText": "资源详情"
  }
}
</route>

<template>
  <view>
    <web-view :src="url" v-if="url"></web-view>
    <view v-else class="flex-center h-screen bg-gray-50 text-gray-400">
      <text>无效的资源链接</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const url = ref('')

onLoad((options: any) => {
  if (options.url) {
    url.value = decodeURIComponent(options.url)
  }
})
</script>
