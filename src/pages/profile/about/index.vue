<route lang="json">
{
  "style": {
    "navigationBarTitleText": "关于我们"
  }
}
</route>

<template>
  <view class="bg-gray-50 min-h-screen box-border">
    <!-- Logo区域 -->
    <view class="bg-white py-12 px-4 text-center">
      <view class="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/5 to-orange/5 flex items-center justify-center shadow-lg shadow-primary/10 overflow-hidden">
        <image src="/static/images/logo-v1.png" mode="aspectFill" class="w-full h-full" />
      </view>
      <view class="text-2xl font-bold text-gray-800 mt-6">轻学Claw</view>
      <view class="text-sm text-gray-400 mt-2">AI学习好帮手</view>
      <view class="text-xs text-primary font-medium mt-2">v{{ version }}</view>
    </view>

    <!-- 简介 -->
    <view class="p-4">
      <view class="bg-white rounded-2xl shadow-sm p-5">
        <view class="text-base font-bold text-gray-800 mb-3">关于我们</view>
        <view class="text-sm text-gray-500 leading-relaxed">
          轻学Claw 是一个专注于 OpenClaw AI 助手学习的平台。我们提供 7 天完整的学习路径，帮助用户从零开始掌握 AI 助手的使用技巧，开启智能生活新体验。
        </view>
      </view>
    </view>

    <!-- 功能特点 -->
    <view class="p-4 pt-0">
      <view class="bg-white rounded-2xl shadow-sm p-5">
        <view class="text-base font-bold text-gray-800 mb-4">功能特点</view>
        <view class="space-y-4">
          <view class="flex items-start space-x-3">
            <view class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <text class="text-base">📚</text>
            </view>
            <view>
              <view class="text-sm font-medium text-gray-800">7天学习路径</view>
              <view class="text-xs text-gray-400 mt-0.5">系统化学习，从入门到进阶</view>
            </view>
          </view>
          <view class="flex items-start space-x-3">
            <view class="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
              <text class="text-base">🏆</text>
            </view>
            <view>
              <view class="text-sm font-medium text-gray-800">徽章成就系统</view>
              <view class="text-xs text-gray-400 mt-0.5">完成学习目标，获得专属徽章</view>
            </view>
          </view>
          <view class="flex items-start space-x-3">
            <view class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <text class="text-base">📖</text>
            </view>
            <view>
              <view class="text-sm font-medium text-gray-800">丰富学习资源</view>
              <view class="text-xs text-gray-400 mt-0.5">技能教程、实战案例一手掌握</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="p-4 pt-0">
      <view class="bg-white rounded-2xl shadow-sm p-5">
        <view class="text-base font-bold text-gray-800 mb-4">联系我们</view>
        <view class="space-y-3">
          <view class="flex items-center justify-between py-2">
            <view class="flex items-center space-x-2">
              <wd-icon name="mail" size="18px" />
              <text class="text-sm text-gray-600">邮箱</text>
            </view>
            <text class="text-xs text-gray-400">xhaoca@foxmail.com</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部版权 -->
    <view class="p-8 text-center">
      <view class="text-xs text-gray-300">
        © 2026 轻学Claw. All rights reserved.
      </view>
      <view class="text-xs text-gray-300 mt-1">
        Made with ❤️ for AI learners
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const version = '1.0.0'
</script>
