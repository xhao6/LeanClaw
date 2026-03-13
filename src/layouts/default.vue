<template>
  <view class="default-layout min-h-screen bg-gray-50">
    <slot />
  </view>
</template>

<script setup lang="ts">
// Default layout logic
</script>

<style scoped>
.default-layout {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
