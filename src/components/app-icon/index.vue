<template>
  <text class="icon" :class="[sizeClass, colorClass]" :style="customStyle">
    {{ iconMap[name] || '?' }}
  </text>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  size?: number | string
  color?: string
}>()

// 基础 ASCII 字符映射 - 确保小程序兼容
const iconMap: Record<string, string> = {
  // 常用图标
  'check': '[OK]',
  'check-circle-filled': '[OK]',
  'check-circle-fill': '[OK]',
  'star': '*',
  'star-filled': '*',
  'warning': '[!]',
  'close-circle': '[X]',
  'info-circle': '[i]',
  'notification': '[N]',
  'arrow-right': '>',
  'arrow-left': '<',
  'lock-on': '[L]',
  'medal': '[M]',
  'edit': '[E]',
  'setting': '[S]',
  'calendar': '[C]',
  'time': '[T]',
  'fire': '[F]',
  'clock': '[K]',
  'download': '[D]',
  'copy': '[cp]',
  'cloud-download': '[cloud]',
  'list': '[=]',
  'code': '</>',
  'user': '[U]',
  'mail': '[@]',
  'github': '[G]',
  'photo': '[P]',
  'phone': '[Ph]',
  'search': '[?]',
  'home': '[H]',
  'menu': '[=]',
  'plus': '+',
  'minus': '-',
}

const sizeClass = computed(() => {
  if (!props.size) return ''
  const sizeNum = Number(props.size)
  if (sizeNum <= 16) return 'text-xs'
  if (sizeNum <= 20) return 'text-sm'
  if (sizeNum <= 24) return 'text-base'
  return 'text-lg'
})

const customStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) {
    style.color = props.color
  }
  return style
})

const colorClass = computed(() => {
  if (!props.color) return ''
  if (props.color.includes('orange')) return 'text-orange'
  if (props.color.includes('gray')) return 'text-gray'
  if (props.color.includes('red')) return 'text-red'
  if (props.color.includes('green')) return 'text-green'
  if (props.color.includes('primary')) return 'text-primary'
  return ''
})
</script>

<style scoped>
.icon {
  font-style: normal;
  font-weight: normal;
  line-height: 1;
}
</style>
