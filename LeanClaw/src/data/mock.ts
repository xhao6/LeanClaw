// Mock data for the app
// Sourced from openclaw101 project

export interface ResourceItem {
  id: string;
  title: string;
  desc: string;
  image?: string;
  tags: string[];
  type: 'resource' | 'case' | 'skill';
  url?: string;
  stars?: string;
  category?: string;
  source?: string;
  featured?: boolean;
}

export const resources: ResourceItem[] = [
  // -- Video (Major: Lex Fridman Podcast) --
  {
    id: 'vid-001',
    title: 'Lex Fridman Podcast #491 — OpenClaw: The Viral AI Agent',
    desc: 'GitHub 历史上增长最快的项目创始人 Peter Steinberger 接受 Lex Fridman 3 小时深度专访，必听',
    url: 'https://www.youtube.com/watch?v=YFjfBk8HI5o',
    type: 'resource',
    tags: ['Lex Fridman', '创始人', '必听'],
    source: 'YouTube',
    image: '/static/images/resources/lex.jpg', // Placeholder
    featured: true
  },
  // -- Video (New Products & Tutorials) --
  {
    id: 'vid-002',
    title: 'Kimi Claw: 浏览器内运行 OpenClaw',
    desc: 'Moonshot AI 推出 Kimi Claw：无需本地部署或 VPS，在浏览器云端运行 OpenClaw Agent 全教程',
    url: 'https://www.youtube.com/watch?v=72voj6uefLY',
    type: 'resource',
    tags: ['Kimi Claw', '无需部署'],
    source: 'YouTube',
    category: 'video'
  },
  {
    id: 'vid-003',
    title: 'Tech With Tim: OpenClaw Full Course',
    desc: '涵盖安装、技能、语音回复、记忆系统的完整系统课程，Hostinger 赞助',
    url: 'https://www.youtube.com/watch?v=vte-fDoZczE',
    type: 'resource',
    tags: ['Tech With Tim', '完整课程'],
    source: 'YouTube',
    category: 'video'
  },
  {
    id: 'vid-004',
    title: 'OpenClaw Use Cases that Actually Work',
    desc: 'Matt Berman 演示真正实用的 OpenClaw 场景，配 Greptile 集成和完整提示词',
    url: 'https://www.youtube.com/watch?v=Q7r--i9lLck',
    type: 'resource',
    tags: ['用例演示', 'Greptile'],
    source: 'YouTube',
    category: 'video'
  },
  
  // -- Getting Started --
  {
    id: 'gs-001',
    title: 'Use OpenClaw to Make a Personal AI Assistant',
    desc: 'Towards Data Science: OpenClaw 个人 AI 助手搭建完整指南，从安装到个性化配置',
    url: 'https://towardsdatascience.com/use-openclaw-to-make-a-personal-ai-assistant/',
    type: 'resource',
    tags: ['TDS', '权威指南'],
    source: 'Towards Data Science',
    category: 'getting-started'
  },
  {
    id: 'gs-002',
    title: 'OpenClaw Tutorial 2026: Setting Up Your 24/7 AI Employee',
    desc: '从 AI 软件到 AI Agent 的认知转变，全流程 24/7 部署配置指南',
    url: 'https://travisnicholson.medium.com/openclaw-tutorial-2026-setting-up-your-24-7-ai-employee-step-by-step-guide-39f52a81707a',
    type: 'resource',
    tags: ['Medium', '24/7', '2026'],
    source: 'Medium',
    category: 'getting-started'
  },

  // -- Deep Dive --
  {
    id: 'dd-001',
    title: 'Why OpenClaw Has Security Experts on Edge',
    desc: 'Fortune 深度报道：OpenClaw 赋予 AI 真实自主权带来的新型安全风险',
    url: 'https://fortune.com/2026/02/12/openclaw-ai-agents-security-risks-beware/',
    type: 'resource',
    tags: ['Fortune', '安全风险'],
    source: 'Fortune',
    category: 'deep-dive'
  },
  {
    id: 'dd-002',
    title: 'OpenClaw Production Guide: 4 Weeks of Hard Lessons',
    desc: '30 天自托管 AI Agent 的真实记录：可扩展性、监控、成本与运营指标综合报告',
    url: 'https://www.sitepoint.com/openclaw-production-lessons-4-weeks-self-hosted-ai/',
    type: 'resource',
    tags: ['SitePoint', '生产环境'],
    source: 'SitePoint',
    category: 'deep-dive'
  },

  // -- Use Cases --
  {
    id: 'case-001',
    title: '9 OpenClaw Projects to Build in 2026',
    desc: '从 Reddit 摘要机器人到自愈服务器，每个项目附配置文件、提示词和社区 Setup 指南',
    url: 'https://www.datacamp.com/blog/openclaw-projects',
    type: 'case',
    tags: ['DataCamp', '实战项目'],
    source: 'DataCamp'
  },
  {
    id: 'case-002',
    title: 'OpenClaw + Skool Community Automation',
    desc: '结合 Skool 社区平台的 OpenClaw 正确玩法：从安装到真实工作流的完整演示',
    url: 'https://www.youtube.com/watch?v=LV6Juz0xcrY',
    type: 'case',
    tags: ['社区自动化', 'Skool'],
    source: 'YouTube'
  },
  
  // -- Skills --
  {
    id: 'skill-001',
    title: 'Web & Frontend',
    desc: 'Production-grade UI, Next.js apps, UI audits',
    type: 'skill',
    tags: ['Frontend', 'Next.js', 'UI'],
    stars: '46 Skills',
    image: '/static/images/skills/frontend.png'
  },
  {
    id: 'skill-002',
    title: 'Coding Agents',
    desc: 'Claude Code, OpenCode control, Multi-worker agents',
    type: 'skill',
    tags: ['Coding', 'Agents'],
    stars: '55 Skills',
    image: '/static/images/skills/coding.png'
  },
  {
    id: 'skill-003',
    title: 'DevOps & Cloud',
    desc: 'Cloudflare Workers, Docker, K8s, Coolify',
    type: 'skill',
    tags: ['DevOps', 'Docker', 'Cloud'],
    stars: '144 Skills',
    image: '/static/images/skills/devops.png'
  },
  {
    id: 'skill-004',
    title: 'Search & Research',
    desc: 'Exa Neural Search, DeepWiki, TechMeme',
    type: 'skill',
    tags: ['Search', 'Research'],
    stars: '148 Skills',
    image: '/static/images/skills/search.png'
  },
  {
    id: 'skill-005',
    title: 'Marketing & Sales',
    desc: 'SEO Audit, Social Content, Email Sequence',
    type: 'skill',
    tags: ['Marketing', 'SEO'],
    stars: '94 Skills',
    image: '/static/images/skills/marketing.png'
  },
  {
    id: 'skill-006',
    title: 'AI & LLMs',
    desc: 'Kimi Integration, ChatGPT Apps, Vector Memory',
    type: 'skill',
    tags: ['AI', 'LLM', 'Memory'],
    stars: '159 Skills',
    image: '/static/images/skills/ai.png'
  }
];
