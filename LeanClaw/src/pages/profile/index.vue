<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "我的"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen box-border">
    <!-- Header/User Info -->
    <view class="bg-primary p-8 pt-12 pb-16 flex items-center space-x-4 relative overflow-hidden">
      <!-- Decorative circles -->
      <view class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none"></view>
      <view class="absolute left-10 bottom-0 w-20 h-20 rounded-full bg-white/5 pointer-events-none"></view>
      
      <view class="relative z-10 border-2 border-solid border-white/30 rounded-full p-1">
        <wd-avatar src="https://via.placeholder.com/100" shape="circle" size="72px" />
      </view>
      <view class="relative z-10 text-white">
        <view class="text-xl font-bold flex items-center">
          龙虾驯养员
          <wd-icon name="edit" size="16px" class="ml-2 opacity-70" />
        </view>
        <view class="text-xs text-white/70 mt-1 bg-white/10 px-2 py-0.5 rounded-full inline-block">ID: 10245678</view>
      </view>
      
      <view class="absolute right-6 top-14 text-white/80">
        <wd-icon name="setting" size="24px" />
      </view>
    </view>

    <!-- Stats Card -->
    <view class="px-4 -mt-8 relative z-20">
      <view class="bg-white rounded-2xl shadow-lg shadow-blue-900/5 p-5 flex justify-around items-center">
        <view class="text-center">
          <view class="text-xl font-bold text-primary mb-1">7</view>
          <view class="text-xs text-gray-400">已学天数</view>
        </view>
        <view class="w-[1px] h-8 bg-gray-100"></view>
        <view class="text-center">
          <view class="text-xl font-bold text-orange">12</view>
          <view class="text-xs text-gray-400">完成案例</view>
        </view>
        <view class="w-[1px] h-8 bg-gray-100"></view>
        <view class="text-center">
          <view class="text-xl font-bold text-green-500">3</view>
          <view class="text-xs text-gray-400">获得证书</view>
        </view>
      </view>
    </view>

    <!-- Menu List -->
    <view class="p-4 mt-2 space-y-4">
      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="我的收藏" is-link icon="star" size="large" />
          <wd-cell title="我的证书" is-link icon="medal" size="large" />
          <wd-cell title="学习统计" is-link icon="chart-bar" size="large" />
        </wd-cell-group>
      </view>

      <view class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <wd-cell-group border>
          <wd-cell title="消息通知" is-link icon="notification" size="large" value="2" />
          <wd-cell title="关于 LeanClaw" is-link icon="info-circle" size="large" />
        </wd-cell-group>
      </view>
      
      <view class="pt-4 pb-8">
        <wd-button block type="error" plain custom-class="!rounded-xl !border-gray-200 !text-gray-500 !bg-white">退出登录</wd-button>
      </view>
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
