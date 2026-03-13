<route lang="json">
{
  "style": {
    "navigationBarTitleText": "课程详情"
  }
}
</route>

<template>
  <view class="bg-white min-h-screen">
    <!-- Progress Indicator -->
    <view class="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-3 border-b border-gray-100 shadow-sm">
      <view class="flex justify-between items-center mb-2">
        <text class="text-sm font-bold text-primary">Day {{ dayId }}: {{ title }}</text>
      </view>
      <wd-progress :percentage="scrollPercentage" color="#FF6B35" :show-pivot="false" custom-class="!h-1" />
    </view>

    <!-- Loading State -->
    <view v-if="loading" class="flex-center py-20">
      <wd-loading color="#FF6B35" />
    </view>

    <!-- Error State -->
    <view v-else-if="error" class="flex-col-center py-20 px-8 text-center">
      <wd-icon name="close-circle" size="48px" class="text-red-400 mb-4" />
      <text class="text-gray-500 mb-6">{{ error }}</text>
      <wd-button size="small" @click="loadContent">重试</wd-button>
    </view>

    <!-- Content Area -->
    <view v-else class="p-5 pb-32">
      <!-- Markdown Content -->
      <view class="markdown-body">
        <rich-text :nodes="htmlContent" :space="true" @itemclick="handleLinkClick"></rich-text>
      </view>

      <!-- Task Checklist -->
      <view class="mt-12 p-5 bg-orange/5 rounded-2xl border border-orange/20">
        <view class="font-bold text-orange text-lg mb-4 flex items-center">
          <wd-icon name="check-circle-filled" size="20px" class="mr-2" />
          今日任务清单
        </view>
        <view class="space-y-4">
          <view v-for="(task, index) in tasks" :key="index" class="flex items-start" @click="toggleTask(index)">
            <view class="w-5 h-5 rounded-full border-2 flex-center mr-3 shrink-0 mt-0.5 transition-colors"
              :class="task.checked ? 'bg-orange border-orange' : 'border-gray-300 bg-white'"
            >
              <wd-icon v-if="task.checked" name="check" size="12px" color="white" />
            </view>
            <text class="text-sm leading-relaxed transition-all" :class="task.checked ? 'text-gray-400 line-through' : 'text-gray-800'">
              {{ task.text }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- Bottom Action Bar -->
    <view class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-gray-100 flex shadow-lg z-50" :class="hasPrev ? 'justify-between space-x-4' : 'justify-center'">
      <template v-if="hasPrev">
        <wd-button type="info" plain block class="flex-1 !border-gray-200 !text-gray-600 !bg-gray-50" @click="handlePrev">上一节</wd-button>
        <wd-button type="primary" block class="flex-[2] !bg-orange !border-orange shadow-lg shadow-orange/30 !rounded-xl !text-base" :disabled="!allTasksCompleted" @click="handleComplete">
          {{ allTasksCompleted ? '完成并打卡 ✅' : '完成两项任务后再打卡 ✌️' }}
        </wd-button>
      </template>
      <template v-else>
        <wd-button type="primary" block class="!bg-orange !border-orange shadow-lg shadow-orange/30 !rounded-xl !text-base w-[70%]" :disabled="!allTasksCompleted" @click="handleComplete">
          {{ allTasksCompleted ? '完成并打卡 ✅' : '完成两项任务后再打卡 ✌️' }}
        </wd-button>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'
import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import { markLessonComplete } from '@/utils/learnProgress'
import { updateProgress } from '@/api/modules/user'

// 使用 Vite import.meta.glob 导入所有 md 文件内容
const mdModules = import.meta.glob('/src/static/content/days/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

// 提取 day ID 和内容
const dayContents: Record<string, string> = {}
for (const path in mdModules) {
  const match = path.match(/day(\d+)\.md$/)
  if (match) {
    dayContents[match[1]] = mdModules[path] as string
  }
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const dayId = ref('1')
const title = ref('')
const htmlContent = ref('')
const loading = ref(true)
const error = ref('')
const scrollPercentage = ref(0)
const tasks = ref([
  { text: '阅读并理解本章内容', checked: false },
  { text: '完成文末的思考题', checked: false }
])

const hasPrev = computed(() => parseInt(dayId.value) > 1)
const allTasksCompleted = computed(() => tasks.value.every(t => t.checked))

// Load content based on dayId
const loadContent = async () => {
  loading.value = true
  error.value = ''

  try {
    // 直接从预加载的内容中获取
    const res = dayContents[dayId.value]

    if (!res) {
      throw new Error(`课程 ${dayId.value} 不存在`)
    }

    if (typeof res === 'string') {
      const content = fm(res)
      title.value = (content.attributes as any).title || `Day ${dayId.value}`

      // Process markdown
      let rendered = md.render(content.body)
      
      // Fix image paths: /images/days/ -> /static/images/days/
      rendered = rendered.replace(/\/images\/days\//g, '/static/images/days/')
      
      // Improve styling for rich-text
      // Add class to standard tags for better styling control if needed
      rendered = rendered.replace(/<h1>/g, '<h1 class="text-2xl font-bold mt-6 mb-4 text-primary">')
      rendered = rendered.replace(/<h2>/g, '<h2 class="text-xl font-bold mt-8 mb-4 text-gray-800 border-l-4 border-orange pl-3">')
      rendered = rendered.replace(/<h3>/g, '<h3 class="text-lg font-bold mt-6 mb-3 text-gray-800">')
      rendered = rendered.replace(/<p>/g, '<p class="mb-4 text-gray-600 leading-7 text-justify">')
      rendered = rendered.replace(/<ul>/g, '<ul class="mb-4 pl-5 space-y-2 list-disc text-gray-600">')
      rendered = rendered.replace(/<li>/g, '<li class="pl-1">')
      rendered = rendered.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-200 pl-4 py-2 my-4 bg-gray-50 text-gray-500 italic rounded-r-lg">')
      rendered = rendered.replace(/<code>/g, '<code class="bg-gray-100 text-orange px-1.5 py-0.5 rounded text-sm font-mono">')
      rendered = rendered.replace(/<pre>/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-4 text-sm font-mono shadow-sm">')
      rendered = rendered.replace(/<img/g, '<img class="w-full rounded-xl my-4 shadow-sm" mode="widthFix"')
      rendered = rendered.replace(/<table>/g, '<div class="overflow-x-auto my-4"><table class="w-full border-collapse text-sm text-left">')
      rendered = rendered.replace(/<th>/g, '<th class="border-b border-gray-200 bg-gray-50 p-3 font-bold text-gray-700">')
      rendered = rendered.replace(/<td>/g, '<td class="border-b border-gray-100 p-3 text-gray-600">')
      
      htmlContent.value = rendered
      
      // Reset tasks for demo (in real app, load from storage)
      tasks.value = [
        { text: '阅读并理解本章内容', checked: false },
        { text: '完成文末的思考题', checked: false }
      ]
    }
  } catch (e: any) {
    console.error(e)
    error.value = '加载课程内容失败，请检查网络或稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.options || {}

  // 支持 day 和 id 两种参数名
  if (options.day) {
    dayId.value = options.day
  } else if (options.id) {
    dayId.value = options.id
  }

  loadContent()
})

onPageScroll((e) => {
  // Calculate read progress (simplified)
  const query = uni.createSelectorQuery()
  query.select('.markdown-body').boundingClientRect(data => {
    if (data && !Array.isArray(data) && data.height) {
      const height = data.height
      const scrollTop = e.scrollTop
      const windowHeight = uni.getWindowInfo().windowHeight

      let percentage = Math.round(((scrollTop + windowHeight) / (height + 200)) * 100)
      if (percentage > 100) percentage = 100
      scrollPercentage.value = percentage
      
      // Auto check "Read content" task if scrolled to bottom
      if (percentage > 95 && !tasks.value[0].checked) {
        tasks.value[0].checked = true
      }
    }
  }).exec()
})

const handleLinkClick = (e: any) => {
  // Handle external links if needed
}

const toggleTask = (index: number) => {
  tasks.value[index].checked = !tasks.value[index].checked
}

const handlePrev = () => {
  const prevId = parseInt(dayId.value) - 1
  if (prevId > 0) {
    uni.redirectTo({
      url: `/pages/learn/detail/index?day=${prevId}`
    })
  }
}

const handleComplete = async () => {
  const lessonId = `day-${dayId.value}`

  // 同步到云端
  try {
    await updateProgress(lessonId, 'completed')
  } catch (e) {
    console.error('更新进度失败', e)
  }

  // 标记本地课程完成
  markLessonComplete(lessonId)

  uni.showToast({ title: '课程已完成', icon: 'success' })

  // 如果还有下一课，提示继续
  if (parseInt(dayId.value) < 7) {
    setTimeout(() => {
      uni.showModal({
        title: '恭喜完成',
        content: '是否继续学习下一课？',
        success: (res) => {
          if (res.confirm) {
            uni.redirectTo({
              url: `/pages/learn/detail/index?day=${parseInt(dayId.value) + 1}`
            })
          } else {
            // 返回学习页面
            uni.navigateBack()
          }
        }
      })
    }, 1500)
  } else {
    // 全部完成
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
}
</script>

<style>
/* Scoped styles don't work well with v-html/rich-text content */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>
