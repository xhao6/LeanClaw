<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "我的"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen">
    <!-- Header/User Info -->
    <view class="bg-primary p-8 pt-12 pb-16 flex items-center space-x-4">
      <wd-avatar src="https://via.placeholder.com/80" shape="circle" size="72px" class="border-2 border-solid border-white" />
      <view>
        <view class="text-xl font-bold text-white">龙虾驯养员</view>
        <view class="text-xs text-white/70 mt-1">ID: 10245678</view>
      </view>
    </view>

    <!-- Stats Card -->
    <view class="px-4 -mt-8">
      <wd-card custom-class="!rounded-2xl shadow-md p-4 bg-white">
        <view class="grid grid-cols-3 gap-4 text-center">
          <view>
            <view class="text-lg font-bold text-primary">7</view>
            <view class="text-xs text-gray-400">已学天数</view>
          </view>
          <view>
            <view class="text-lg font-bold text-orange">12</view>
            <view class="text-xs text-gray-400">完成案例</view>
          </view>
          <view>
            <view class="text-lg font-bold text-green-500">3</view>
            <view class="text-xs text-gray-400">获得证书</view>
          </view>
        </view>
      </wd-card>
    </view>

    <!-- Menu List -->
    <view class="p-4 mt-2">
      <wd-card custom-class="!rounded-2xl shadow-sm overflow-hidden p-0">
        <wd-cell-group border>
          <wd-cell title="我的收藏" is-link icon="star" />
          <wd-cell title="我的证书" is-link icon="medal" />
          <wd-cell title="学习统计" is-link icon="chart-bar" />
          <wd-cell title="消息通知" is-link icon="notification" />
        </wd-cell-group>
      </wd-card>

      <wd-card custom-class="!rounded-2xl shadow-sm overflow-hidden p-0 mt-4">
        <wd-cell-group border>
          <wd-cell title="设置" is-link icon="setting" />
          <wd-cell title="关于 LeanClaw" is-link icon="info-circle" />
        </wd-cell-group>
      </wd-card>
    </view>

    <!-- Logout Button (optional) -->
    <view class="p-8">
      <wd-button block type="error" plain custom-class="!rounded-xl">退出登录</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
// Profile logic
</script>

<style scoped>
:deep(.wd-card) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
:deep(.wd-cell-group) {
  background-color: transparent !important;
}
</style>
