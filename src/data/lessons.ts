// 7天学习内容数据

export interface LessonDay {
  id: string;
  day: number;
  title: string;
  content: string;
}

export const lessons: LessonDay[] = [
  { id: 'day-1', day: 1, title: 'Day 1: 初识 OpenClaw', content: '了解 AI 助手与聊天机器人的本质区别，以及 OpenClaw 的核心价值' },
  { id: 'day-2', day: 2, title: 'Day 2: 你的第一个 AI 助手', content: '配置 LLM 和 Telegram，让小墨跑起来' },
  { id: 'day-3', day: 3, title: 'Day 3: 记忆与灵魂', content: '如何让 AI 拥有长期记忆和独特的性格' },
  { id: 'day-4', day: 4, title: 'Day 4: 技能系统 (Skills)', content: '给助手安装"手脚"，让它能上网、读文件、写代码' },
  { id: 'day-5', day: 5, title: 'Day 5: 自动化工作流', content: '连接 Zapier/n8n，让 AI 帮你处理繁琐工作' },
  { id: 'day-6', day: 6, title: 'Day 6: 本地化与隐私', content: '使用 Ollama 运行本地模型，确保数据绝对安全' },
  { id: 'day-7', day: 7, title: 'Day 7: 进阶与未来', content: '微调模型、RAG 知识库以及 OpenClaw 的未来展望' },
]

// 根据ID获取课程
export const getLessonById = (id: string): LessonDay | undefined => {
  return lessons.find(lesson => lesson.id === id)
}

// 获取所有课程ID
export const getAllLessonIds = (): string[] => {
  return lessons.map(lesson => lesson.id)
}
