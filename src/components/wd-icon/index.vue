<template>
  <app-icon :name="name" :size="size" :color="color" />
</template>

<script setup lang="ts">
defineProps<{
  name: string
  size?: number | string
  color?: string
}>()
</script>
