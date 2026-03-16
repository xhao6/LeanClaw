// 标签颜色 composable
// 统一管理多巴胺配色标签样式

import { computed } from 'vue'

// 15种多巴胺色
const TAG_COLORS = [
  'border-orange-200 text-orange-600 bg-orange-50',
  'border-blue-200 text-blue-600 bg-blue-50',
  'border-green-200 text-green-600 bg-green-50',
  'border-purple-200 text-purple-600 bg-purple-50',
  'border-pink-200 text-pink-600 bg-pink-50',
  'border-amber-200 text-amber-600 bg-amber-50',
  'border-cyan-200 text-cyan-600 bg-cyan-50',
  'border-indigo-200 text-indigo-600 bg-indigo-50',
  'border-rose-200 text-rose-600 bg-rose-50',
  'border-teal-200 text-teal-600 bg-teal-50',
  'border-lime-200 text-lime-600 bg-lime-50',
  'border-fuchsia-200 text-fuchsia-600 bg-fuchsia-50',
  'border-violet-200 text-violet-600 bg-violet-50',
  'border-sky-200 text-sky-600 bg-sky-50',
  'border-emerald-200 text-emerald-600 bg-emerald-50',
]

// 字符串哈希函数
const hashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function useTagColors() {
  // 根据标签名获取颜色class
  const getTagClass = (tag: string): string => {
    const index = hashCode(tag) % TAG_COLORS.length
    return TAG_COLORS[index]
  }

  // 获取所有颜色（用于静态展示等场景）
  const allTagColors = computed(() => TAG_COLORS)

  return {
    getTagClass,
    allTagColors,
    TAG_COLORS
  }
}
