# 修复学习进度数据关联

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development

**目标：** 将首页和学习页面的mock数据替换为真实的学习进度数据，关联 learnProgress.ts 的存储逻辑

**架构：** 使用 Pinia 或直接在页面中调用 learnProgress.ts 的 getProgress() 获取真实进度

---

## 任务清单

### Task 1: 首页进度数据动态化

**文件：**
- 修改: `LeanClaw/src/pages/index/index.vue`

**Step 1: 导入 learnProgress**

在 `<script setup>` 中添加：
```typescript
import { getProgress } from '@/utils/learnProgress'
```

**Step 2: 添加进度数据**

```typescript
const progress = getProgress()

// 计算进度百分比
const progressPercent = computed(() => {
  return Math.round((progress.currentDay / 7) * 100)
})

// 获取下一章标题
const nextChapter = computed(() => {
  const dayTitles = ['', '初识 OpenClaw', '你的第一个 AI 助手', '记忆与灵魂', '技能系统 (Skills)', '自动化工作流', '本地化与隐私', '进阶与未来']
  return dayTitles[progress.currentDay] || '全部完成'
})
```

**Step 3: 替换模板中的硬编码**

- `Day 3` → `Day {{ progress.currentDay }}`
- `42%` → `{{ progressPercent }}%`
- `Skills 核心原理解析` → `{{ nextChapter }}`

**Step 4: 测试**

访问首页，确认显示的是真实进度（默认应为 Day 1, 14%）

---

### Task 2: 学习页面状态动态化

**文件：**
- 修改: `LeanClaw/src/pages/learn/index.vue`

**Step 1: 导入 learnProgress**

```typescript
import { getProgress } from '@/utils/learnProgress'
```

**Step 2: 动态计算每日状态**

```typescript
const progress = getProgress()

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

  const completedLessons = progress.completedLessons || []
  const currentDay = progress.currentDay || 1

  return days.map((day, index) => {
    const dayNum = index + 1
    const isCompleted = completedLessons.includes(day.id)
    const isCurrent = dayNum === currentDay && !isCompleted
    const isLocked = dayNum > currentDay && !isCompleted

    return {
      ...day,
      status: isCompleted ? 'completed' : (isCurrent ? 'in-progress' : (isLocked ? 'locked' : 'in-progress'))
    }
  })
})
```

**Step 3: 更新 handleDayClick 逻辑**

```typescript
const handleDayClick = (day: any) => {
  if (day.status === 'locked') {
    uni.showToast({ title: '请先完成前面的课程', icon: 'none' })
    return
  }

  // Extract day number from title "Day 1: ..." -> "1"
  const dayNum = day.title.split(':')[0].replace('Day ', '')
  uni.navigateTo({
    url: `/pages/learn/detail/index?day=${dayNum}`
  })
}
```

**Step 4: 测试**

1. 访问学习页面，默认应全部显示 locked（除Day 1为进行中）
2. 手动在存储中设置 completedLessons 包含 'day-1'，刷新后 Day 1 应显示已完成

---

### Task 3: 学习详情页完成课程功能

**文件：**
- 修改: `LeanClaw/src/pages/learn/detail/index.vue`

**Step 1: 导入 markLessonComplete**

```typescript
import { markLessonComplete, getProgress } from '@/utils/learnProgress'
```

**Step 2: 添加完成课程功能**

```typescript
const handleMarkComplete = () => {
  const lessonId = `day-${day}`
  markLessonComplete(lessonId)
  uni.showToast({ title: '课程已完成', icon: 'success' })

  // 提示下一课程
  if (day < 7) {
    uni.showModal({
      title: '恭喜完成',
      content: '是否继续学习下一课？',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: `/pages/learn/detail/index?day=${day + 1}`
          })
        }
      }
    })
  }
}
```

**Step 3: 添加完成按钮**

在模板底部添加"标记完成"按钮

---

### Task 4: 验证完整流程

**测试步骤：**

1. 清除存储后访问首页 → 应显示 Day 1, 14%
2. 访问学习页面 → Day 1 应为"进行中"，其他为锁定
3. 进入 Day 1 详情页 → 点击"标记完成"
4. 返回学习页面 → Day 1 应显示"已完成"，Day 2 应变为"进行中"
5. 访问首页 → 应显示 Day 2, 28%

---

## 执行选项

**计划已保存到 `docs/plans/2026-03-12-fix-learn-progress.md`**

请选择执行方式？

1. **Subagent-Driven (本会话)** - 我派遣 subagent 逐个实现任务
2. **你手动执行**
