// 7天学习内容数据

import { getProgress, type LearnProgress } from '@/utils/learnProgress'

export interface LessonDay {
  id: number;
  title: string;
  desc: string;
  status: 'completed' | 'in-progress' | 'locked';
}

export const lessons: LessonDay[] = [
  { id: 1, title: 'Day 1: 初识 OpenClaw', desc: '了解 AI 助手与聊天机器人的本质区别，以及 OpenClaw 的核心价值', status: 'completed' },
  { id: 2, title: 'Day 2: 你的第一个 AI 助手', desc: '配置 LLM 和 Telegram，让小墨跑起来', status: 'completed' },
  { id: 3, title: 'Day 3: 记忆与灵魂', desc: '如何让 AI 拥有长期记忆和独特的性格', status: 'in-progress' },
  { id: 4, title: 'Day 4: 技能系统 (Skills)', desc: '给助手安装"手脚"，让它能上网、读文件、写代码', status: 'locked' },
  { id: 5, title: 'Day 5: 自动化工作流', desc: '连接 Zapier/n8n，让 AI 帮你处理繁琐工作', status: 'locked' },
  { id: 6, title: 'Day 6: 本地化与隐私', desc: '使用 Ollama 运行本地模型，确保数据绝对安全', status: 'locked' },
  { id: 7, title: 'Day 7: 进阶与未来', desc: '微调模型、RAG 知识库以及 OpenClaw 的未来展望', status: 'locked' },
]

// 学习进度数据（使用存储模块）
export interface LearningProgress {
  currentDay: number;
  totalDays: number;
}

// 从存储获取当前进度
export const getCurrentProgress = (): LearningProgress => {
  const storedProgress = getProgress()
  return {
    currentDay: storedProgress.currentDay,
    totalDays: 7
  }
}

// 保持向后兼容的默认进度
export const defaultProgress: LearningProgress = {
  currentDay: 1,
  totalDays: 7
}

// 获取当前进行中的课程
export const getCurrentLesson = () => {
  return lessons.find(lesson => lesson.status === 'in-progress') || lessons[0]
}

// 获取进度百分比
export const getProgressPercent = (currentDay: number, totalDays: number) => {
  return Math.round((currentDay / totalDays) * 100)
}
