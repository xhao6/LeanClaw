<template>
  <view class="tabbar-layout min-h-screen bg-gray-50 pb-safe">
    <slot />
  </view>
</template>

<script setup lang="ts">
// Tabbar layout logic
</script>

<style scoped>
.tabbar-layout {
  /* Tabbar is already there by uni-app, so we just provide the container */
}
.pb-safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
