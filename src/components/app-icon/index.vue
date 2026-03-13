<template>
  <text class="icon" :class="[sizeClass, colorClass]" :style="customStyle">
    {{ iconMap[name] || '●' }}
  </text>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  size?: number | string
  color?: string
}>()

const iconMap: Record<string, string> = {
  // 常用图标
  'check': '✓',
  'check-circle-filled': '✓',
  'star': '☆',
  'star-filled': '★',
  'warning': '⚠',
  'close-circle': '✕',
  'info-circle': 'ℹ',
  'notification': '🔔',
  'arrow-right': '→',
  'arrow-left': '←',
  'lock-on': '🔒',
  'medal': '🏅',
  'edit': '✎',
  'setting': '⚙',
  'calendar': '📅',
  'time': '⏱',
  'fire': '🔥',
  'clock': '🕐',
  'download': '⬇',
  'copy': '📋',
  'cloud-download': '☁',
  'list': '☰',
  'code': '⟨/⟩',
  'user': '👤',
  'mail': '✉',
  'github': '⌘',
  'photo': '🖼',
  'check-circle-fill': '✓',
  'phone': '📞',
  'search': '🔍',
  'home': '🏠',
  'menu': '☰',
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
