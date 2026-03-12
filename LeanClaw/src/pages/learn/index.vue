<route lang="json">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "学习"
  }
}
</route>

<template>
  <view class="p-4 bg-gray-50 min-h-screen box-border">
    <view class="mb-6 pt-2">
      <text class="text-xl font-bold text-primary block">7天学习路径</text>
      <text class="text-xs text-gray-500 block mt-1">从零开始掌握 OpenClaw，养一只"龙虾"做自己的 AI 管家</text>
    </view>

    <!-- 7-Day Steps -->
    <view class="relative pl-4 space-y-6 pb-10">
      <!-- Timeline Line -->
      <view class="absolute left-[27rpx] top-4 bottom-10 w-0.5 bg-gray-200"></view>

      <view v-for="(day, index) in learnDays" :key="index" class="relative z-10" @click="handleDayClick(day)">
        <view class="flex items-start">
           <!-- Status Indicator -->
           <view 
             class="w-6 h-6 rounded-full flex-center mr-4 shrink-0 border-2 border-white shadow-sm z-20"
             :class="getStatusColor(day.status)"
           >
             <wd-icon v-if="day.status === 'completed'" name="check" size="14px" color="white" />
             <text v-else-if="day.status === 'in-progress'" class="text-xs font-bold text-white">{{ index + 1 }}</text>
             <wd-icon v-else name="lock-on" size="14px" class="text-gray-400" />
           </view>

           <!-- Card -->
           <view 
             class="flex-1 p-4 rounded-2xl shadow-sm transition-all active:scale-[0.98]"
             :class="day.status === 'in-progress' ? 'bg-white ring-2 ring-orange/20 shadow-orange/10' : (day.status === 'locked' ? 'bg-gray-100 opacity-80' : 'bg-white')"
           >
             <view class="flex justify-between items-start mb-1">
               <text class="font-bold text-sm" :class="day.status === 'locked' ? 'text-gray-500' : 'text-gray-800'">{{ day.title }}</text>
               <wd-tag v-if="day.status === 'in-progress'" type="warning" size="small" custom-class="!h-5 !px-1.5 !text-[10px]">进行中</wd-tag>
               <wd-tag v-if="day.status === 'completed'" type="success" plain size="small" custom-class="!h-5 !px-1.5 !text-[10px]">已完成</wd-tag>
             </view>
             <text class="text-xs mt-1 block leading-relaxed" :class="day.status === 'locked' ? 'text-gray-400' : 'text-gray-500'">{{ day.desc }}</text>
             
             <view v-if="day.status === 'in-progress'" class="mt-3 flex justify-end">
                <wd-button size="small" custom-class="!bg-orange !border-orange !rounded-lg !h-7 !px-3 !text-xs">开始学习</wd-button>
             </view>
           </view>
        </view>
      </view>
    </view>

    <!-- Summary / Badge -->
    <view v-if="allCompleted" class="mt-8 flex-col-center p-6 bg-white rounded-2xl shadow-sm border-2 border-dashed border-orange mb-8">
      <wd-icon name="medal" size="48px" class="text-orange mb-3" />
      <view class="font-bold text-lg text-primary mb-1">恭喜获得“龙虾驯养师”勋章！</view>
      <view class="text-xs text-gray-400">你已经完成了所有课程，开启你的 AI 管家之旅吧</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getProgress } from '@/utils/learnProgress'

// 用于触发重新计算
const refreshKey = ref(0)

onShow(() => {
  // 每次页面显示时重新获取进度
  refreshKey.value++
})

const learnDays = computed(() => {
  const days = [
    { title: 'Day 1: 初识 OpenClaw', desc: '了解 AI 助手与聊天机器人的本质区别，以及 OpenClaw 的核心价值', id: 'day-1' },
    { title: 'Day 2: 你的第一个 AI 助手', desc: '配置 LLM 和 Telegram，让小墨跑起来', id: 'day-2' },
    { title: 'Day 3: 记忆与灵魂', desc: '如何让 AI 拥有长期记忆和独特的性格', id: 'day-3' },
    { title: 'Day 4: 技能系统 (Skills)', desc: '给助手安装"手脚"，让它能上网、读文件、写代码', id: 'day-4' },
    { title: 'Day 5: 自动化工作流', desc: '连接 Zapier/n8n，让 AI 帮你处理繁琐工作', id: 'day-5' },
    { title: 'Day 6: 本地化与隐私', desc: '使用 Ollama 运行本地模型，确保数据绝对安全', id: 'day-6' },
    { title: 'Day 7: 进阶与未来', desc: '微调模型、RAG 知识库以及 OpenClaw 的未来展望', id: 'day-7' },
  ]

  // 强制响应式更新
  refreshKey.value

  const progress = getProgress()
  const completedLessons = progress.completedLessons || []

  // 计算当前可学习的课程：已完成的最大天数 + 1
  const maxCompletedDay = completedLessons.reduce((max, lessonId) => {
    const dayNum = parseInt(lessonId.replace('day-', ''), 10)
    return dayNum > max ? dayNum : max
  }, 0)
  const currentLearnableDay = Math.min(maxCompletedDay + 1, 7) // 最多7天

  return days.map((day, index) => {
    const dayNum = index + 1
    const isCompleted = completedLessons.includes(day.id)
    const isCurrent = dayNum === currentLearnableDay && !isCompleted
    const isLocked = dayNum > currentLearnableDay

    return {
      ...day,
      status: isCompleted ? 'completed' : (isCurrent ? 'in-progress' : (isLocked ? 'locked' : 'in-progress'))
    }
  })
})

const allCompleted = computed(() => learnDays.value.every((d: any) => d.status === 'completed'))

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500'
    case 'in-progress': return 'bg-orange animate-pulse'
    default: return 'bg-gray-200'
  }
}

const handleDayClick = (day: any) => {
  if (day.status === 'locked') {
    uni.showToast({ title: '请先完成前面的课程', icon: 'none' })
    return
  }
  // Logic to navigate to day detail
  console.log('Navigating to:', day.title)
  // Extract day number from id "day-1" -> "1"
  const dayNum = day.id.replace('day-', '')
  uni.navigateTo({
    url: `/pages/learn/detail/index?id=${dayNum}`
  })
}
</script>
