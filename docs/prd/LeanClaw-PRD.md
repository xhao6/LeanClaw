# LeanClaw - 产品需求文档

## 1. 产品概述

**产品名称**：LeanClaw (原: 轻学龙虾)

**产品定位**：OpenClaw 学习助手，帮助用户从零开始掌握 OpenClaw，养一只"龙虾"做自己的 AI 管家

**目标用户**：
- 学生
- 上班族（白领）
- 自由职业者
- 自媒体
- 科技爱好者

**核心价值**：用最快速、最简洁、最避坑的方式学会 OpenClaw

**竞品分析**：暂无直接竞品

---

## 2. 核心功能模块

### 2.1 模块1：7天学习模块

**功能描述**：
- 提供结构化的7天学习路径，从零开始掌握 OpenClaw
- 每天的学习内容以图文教程为主，支持 Markdown 渲染
- 内容展示采用 Markdown 渲染，类似 Notion/飞书文档风格
- 学习进度记录：基于已完成课程数计算进度
- 学习时长控制在 15-20 分钟/天，适合碎片化学习
- **已实现解锁机制**：完成后自动解锁下一课

**激励方案**：
- 学习徽章（7个每日徽章 + 成就徽章）
- 学习进度可视化：完成1天=14%，全部完成=100%
- 完成7天学习后获得"龙虾驯养师"电子证书

**实现细节**：
- 进度计算：`progressPercent = completedLessons.length / 7 * 100`
- 当前可学课程 = 已完成最大天数 + 1
- 完成后状态显示"已完成"

### 2.2 模块2：全网优质资源汇总

**功能描述**：
- 聚合 OpenClaw 相关的优质资源，通过滚动信息流展示
- 资源分类：按类型（教程/文档/视频/文章）和难度（入门/进阶/高级）
- **当前资源数量**：~150+ 条（已同步自 openclaw101）
- 通过内置 WebView 方式打开第三方网站
- **已实现收藏功能**
- 卡片展示优化：标题 2-3 行 + 描述 1-2 行，移除底部元信息

**实现细节**：
- 数据来源：CloudBase NoSQL 数据库 `resources` 集合
- 资源类型：resource（资源）、case（案例）、skill（技能）
- 卡片布局：左图右文，图片 200x200 WebP
- URL 筛选：已移除中国无法访问的链接

**推荐算法（v0.3+）**：
- 混合推荐算法：热度分 + 用户收藏状态 + 随机因子
- 分数计算：`score = heat * 10 + (已收藏 ? 50 : 0) + random() * 20`
- 未收藏高热度文章优先展示
- 随机因子保证内容多样性

### 2.3 模块3：应用案例场景展示

**功能描述**：
- 展示 OpenClaw 的实际应用案例和使用场景
- 案例展示形式：图文 + 代码片段 + 配置步骤
- 案例分类：按使用场景（智能家居、办公自动化、开发辅助、生活助手、数据分析）
- **当前案例数量**：~26 个

**实现细节**：
- 案例详情页：`pages/case/detail.vue`
- 使用 WebView 打开案例原文

### 2.4 模块4：OpenClaw Skills 大全

**功能描述**：
- 展示 OpenClaw 的 Skills 列表，按热度排序
- 展示信息：名称、描述、分类、热度、安装命令、作者、GitHub Stars
- 支持分类筛选和关键词搜索
- 热度排序基于综合热度（下载量 + 评分 + 更新频率）
- **当前 Skills 数量**：~8 个

**实现细节**：
- 技能详情页：`pages/skill/detail.vue`
- 支持收藏功能

---

## 3. 页面结构

### 3.1 TabBar 设计

```
📱 TabBar 建议（4个入口）

┌─────────┬─────────┬─────────┬─────────┐
│   🏠    │   📚    │   📖    │   👤    │
│  首页   │  学习   │  发现   │  我的   │
└─────────┴─────────┴─────────┴─────────┘
```

### 3.2 页面层级

```
📱 LeanClaw 小程序架构

├── 🏠 首页 (Home) - TabBar
│   ├── 学习进度卡片（显示当前学习天数/进度百分比）
│   ├── 今日推荐资源
│   └── 热门 Skills 快捷入口
│
├── 📚 学习 (Learn) - TabBar
│   ├── 7天学习路径（7个卡片）
│   │   ├── 已完成：✅ 绿色 + "已完成"
│   │   ├── 进行中：🔄 橙色高亮
│   │   └── 未开始：⏸️ 灰色
│   ├── 每日详情页（Markdown + 任务）
│   └── 学习打卡
│
├── 📖 发现 (Discover) - TabBar
│   ├── 分类标签（资源/案例/Skills）
│   ├── 资源信息流（卡片列表）
│   │   ├── 标题 2-3 行
│   │   ├── 描述 1-2 行
│   │   └── 缩略图 200x200
│   ├── 资源详情（WebView）
│   └── 收藏功能
│
└── 👤 我的 (Profile) - TabBar
    ├── 用户信息 + Logo
    ├── 学习统计
    ├── 我的收藏
    ├── 我的证书
    ├── 学习统计详情
    ├── 消息通知
    ├── 关于我们
    └── 设置
```

### 3.3 页面详情

| 页面 | 路径 | 实现状态 |
|------|------|----------|
| 首页 | `/pages/index/index` | ✅ |
| 发现 | `/pages/discover/index` | ✅ |
| 学习 | `/pages/learn/index` | ✅ |
| 我的 | `/pages/profile/index` | ✅ |
| 学习详情 | `/pages/learn/detail/index` | ✅ |
| 案例详情 | `/pages/case/detail` | ✅ |
| 技能详情 | `/pages/skill/detail` | ✅ |
| WebView | `/pages/webview/index` | ✅ |
| 我的收藏 | `/pages/profile/favorites/index` | ✅ |
| 我的证书 | `/pages/profile/certificate/index` | ✅ |
| 学习统计 | `/pages/profile/stats/index` | ✅ |
| 消息通知 | `/pages/profile/notifications/index` | ✅ |
| 关于我们 | `/pages/profile/about/index` | ✅ |
| 设置 | `/pages/profile/settings/index` | ✅ |

---

## 4. UI/UX 设计方向

### 4.1 设计风格

**科技简约 + 亲和活泼**

| 维度 | 建议 |
|-----|------|
| **主色调** | 深海蓝 (#1E3A5F) + 龙虾橙 (#FF6B35) |
| **辅助色** | 浅灰背景、白色卡片、绿色成功态 |
| **字体** | 系统默认字体，标题加粗 |
| **圆角** | 大圆角（12-16px），亲和感 |
| **图标** | 线性图标，统一粗细 |

### 4.2 核心页面设计

**首页**：
- 顶部：品牌 Logo + 标语"养一只龙虾，做AI管家"
- 中部：学习进度卡片（显示第X天/7天）
- 底部：快捷入口（今日学习、热门资源、推荐Skill）

**学习页**：
- 7天路径以时间轴/阶梯形式展示
- 已完成：✅ 绿色
- 进行中：🔄 橙色高亮
- 未开始：⏸️ 灰色

**发现页**：
- 顶部：分类标签（资源/案例/Skills）
- 中部：信息流卡片列表
- 支持下拉刷新、上拉加载

**我的页**：
- 用户信息
- 学习统计（已学天数、完成课程）
- 设置入口

---

## 5. 技术实现方案

### 5.1 技术栈

- **框架**：uni-app (Vue 3 + TypeScript)
- **UI组件库**：wot-design-uni
- **请求库**：alova + @alova/adapter-uniapp
- **路由**：uni-mini-router + @uni-helper/vite-plugin-uni-pages (文件路由)
- **状态管理**：pinia
- **样式**：UnoCSS + @uni-helper/unocss-preset-uni
- **构建工具**：Vite
- **代码规范**：ESLint + Prettier + husky
- **测试**：Vitest (单元测试) + Playwright (E2E测试)

### 5.2 项目结构

```
LeanClaw/
├── src/
│   ├── api/                 # API 层
│   │   ├── core/           # 核心配置
│   │   │   ├── instance.ts    # Alova 实例配置
│   │   │   ├── handlers.ts    # 请求处理器
│   │   │   └── middleware.ts  # 中间件
│   │   └── index.ts        # API 导出
│   ├── pages/             # 页面组件（文件式路由）
│   │   ├── index/         # 首页
│   │   ├── discover/      # 发现页（资源/案例/Skills 3个Tab）
│   │   ├── learn/         # 学习页（7天学习路径）
│   │   ├── profile/       # 我的页面
│   │   │   ├── index.vue       # 主页面
│   │   │   ├── favorites/      # 收藏列表
│   │   │   ├── certificate/    # 证书
│   │   │   ├── stats/          # 学习统计
│   │   │   ├── notifications/  # 消息通知
│   │   │   ├── about/          # 关于我们
│   │   │   └── settings/       # 设置
│   │   ├── case/detail.vue    # 案例详情
│   │   ├── skill/detail.vue   # 技能详情
│   │   └── webview/index.vue   # WebView 页面
│   ├── composables/       # Vue 组合式函数
│   │   └── useRecommendations.ts  # 推荐资源
│   ├── data/              # 静态数据
│   │   ├── mock.ts           # 资源数据（~150+资源）
│   │   ├── lessons.ts        # 课程数据（7天）
│   │   ├── badges.ts         # 徽章数据
│   │   └── certificate.ts    # 证书生成
│   ├── store/             # Pinia 状态管理
│   ├── utils/             # 工具函数
│   │   ├── learnProgress.ts    # 学习进度管理
│   │   ├── favorites.ts        # 收藏功能
│   │   └── markdown.ts        # Markdown 渲染
│   ├── layouts/           # 布局模板（default/tabbar）
│   ├── static/            # 静态资源
│   │   ├── images/
│   │   │   ├── resources/  # 资源缩略图（200x200 WebP）
│   │   │   ├── logo.webp   # Logo
│   │   │   └── placeholder/ # 占位图
│   │   └── tabbar/        # TabBar 图标
│   ├── pages.json         # 页面配置
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── scripts/               # 脚本工具
│   └── sync-resources.py  # 资源同步脚本
├── tests/                # 测试文件
│   ├── e2e/              # 端到端测试（Playwright）
│   └── __tests__/        # 单元测试（Vitest）
├── package.json
├── vite.config.ts
├── uno.config.ts
└── pages.config.ts
```

### 5.3 核心配置文件

| 文件 | 说明 |
|------|------|
| `pages.json` | 页面路由和 TabBar 配置 |
| `uno.config.ts` | UnoCSS 快捷方式和主题 |
| `vite.config.ts` | Vite 构建配置 |
| `alova.config.ts` | Alova API 配置 |

### 5.4 数据存储

| 数据类型 | 存储方式 |
|----------|----------|
| 学习进度 | `uni.setStorageSync('learn_progress', {...})` |
| 收藏列表 | `uni.setStorageSync('favorites', {...})` |
| 用户信息 | `uni.setStorageSync('user_info', {...})` |

### 5.5 资源同步

- **来源**：`openclaw101/src/data/resources.ts`
- **同步脚本**：`scripts/sync-resources.py`
- **处理**：已筛选中国无法访问的 URL（GitHub、Reddit 等）
- **缩略图**：200x200 WebP，抓取 OG Image，使用 Cover 模式

### 5.6 MVP 功能清单

| 模块 | 功能点 | 状态 |
|-----|-------|------|
| **首页** | 学习进度展示 | ✅ |
| | 快捷入口（精选案例、Skills大全、我的收藏） | ✅ (v0.3) |
| | 今日推荐资源 | ✅ |
| | 下拉刷新 | ✅ (v0.3) |
| | 混合推荐算法（热度+收藏+随机） | ✅ (v0.3) |
| | 发现页URL参数支持tab切换 | ✅ (v0.3) |
| **学习** | 7天内容展示（Markdown） | ✅ |
| | 学习进度记录 | ✅ |
| | 完成后解锁下一课 | ✅ |
| | 徽章系统 | ✅ |
| | 徽章自动解锁 | ✅ (v0.3.1) |
| | 证书生成 | ✅ |
| | 未登录提醒横幅 | ✅ (v0.3.1) |
| **发现** | 资源列表 | ✅ |
| | 案例展示 | ✅ |
| | Skills列表 | ✅ |
| | WebView打开第三方 | ✅ |
| | 收藏功能 | ✅ |
| | 下拉刷新 | ✅ (v0.3) |
| **我的** | 学习统计 | ✅ |
| | 学习统计（移除学习时长和连续打卡） | ✅ (v0.3.1) |
| | 我的收藏 | ✅ |
| | 我的证书 | ✅ |
| | 消息通知 | ✅ |
| | 关于页面 | ✅ (v0.3.1 更新：Logo、联系方式、版权年份) |
| | 用户协议页面 | ✅ (v0.3.1 新增：版权声明 + MIT 协议) |
| | 设置页面 | ✅ |
| | 设置页显示正确登录状态 | ✅ (v0.3.1) |
| | 修改昵称 | ✅ (v0.3) |
| **测试** | 单元测试（Vitest） | ✅ |
| | E2E测试（Playwright） | ✅ |
| | 登录态模拟支持 | ✅ (v0.3.1) |
| | API层单元测试 | ✅ (v0.3.1) |
| | 学习进度响应式更新 | ✅ (v0.3.1) |

### 5.7 开发命令

```bash
# 开发
npm run dev:h5         # H5 开发服务器
npm run dev:mp-weixin # 微信小程序开发

# 构建
npm run build:h5         # 构建 H5
npm run build:mp-weixin # 构建微信小程序

# 测试
npm run test           # 单元测试（监听模式）
npm run test:run       # 单元测试（单次运行）
npm run test:coverage  # 覆盖率报告
npm run e2e            # E2E 测试
npm run e2e:headed    # E2E 测试（有头模式）

# 代码质量
npm run type-check  # TypeScript 类型检查
npm run lint        # ESLint 检查
npm run format      # Prettier 格式化
```

### 5.3 数据方案

**MVP 版本**：
- **学习内容**：本地 Markdown 文件（便于复用开源资源，支持代码高亮、格式丰富）
- **资源/案例/Skills**：基于 GitHub 仓库 `https://github.com/mengjian-github/openclaw101` 的数据结构，转换为本地 JSON
- **用户进度**：uni-app 本地存储（uni.setStorage）

**后续版本**：可接入后端服务，实现数据同步 and 用户系统

### 5.4 内容复用方案

**GitHub 仓库复用**：基于 [openclaw101](https://github.com/mengjian-github/openclaw101) 仓库（MIT 协议）进行内容复用

**复用策略**：
- **学习内容**：使用仓库中的 7天学习路径作为基础，转换为 Markdown 格式
- **资源数据**：直接使用仓库的 `src/data/resources.ts` 数据结构，转换为本地 JSON
- **分类体系**：复用仓库的资源分类（官方、入门、平台接入、技能开发等）
- **内容质量**：保留原仓库的优质内容和结构

**优势**：
- 节省内容创建时间
- 保证内容质量和完整性
- 后续可与原仓库保持同步更新

### 5.5 版权声明

本小程序中所引用的「7天学习路径」内容，源自 GitHub 开源项目：[https://github.com/mengjian-github/openclaw101](https://github.com/mengjian-github/openclaw101)

该项目的版权归原作者 mengjian-github 所有，采用 MIT 开源许可协议授权。

本小程序对该教程的使用遵循 MIT 协议要求：
- 保留原项目的版权声明及许可声明
- 未篡改原教程的核心内容
- 在用户协议页面添加了完整的版权声明和 MIT 协议摘要

---

## 6. 开发计划

### 6.1 开发阶段

1. **需求分析与设计**：完成产品需求文档和 UI 设计稿
2. **基础架构搭建**：初始化项目，配置技术栈
3. **核心功能开发**：实现 4 个核心模块
4. **测试与优化**：功能测试、性能优化、用户体验优化
5. **发布上线**：提交审核，发布小程序

### 6.2 时间预估

| 阶段 | 时间 |
|-----|------|
| 需求分析与设计 | 3-5 天 |
| 基础架构搭建 | 2-3 天 |
| 核心功能开发 | 10-15 天 |
| 测试与优化 | 3-5 天 |
| 发布上线 | 1-2 天 |

**总计**：约 20-30 天

---

## 7. 风险评估

| 风险 | 影响 | 应对措施 |
|-----|------|---------|
| 内容更新维护 | 内容过时影响用户体验 | 建立内容更新机制，定期更新学习资料和资源 |
| 第三方资源访问 | WebView 加载速度慢 | 优化 WebView 加载策略，提供预加载功能 |
| 数据同步 | 本地存储数据丢失 | 实现简单的备份机制，后续接入云端存储 |
| 用户留存 | 学习积极性下降 | 增强游戏化元素，提供社区互动功能 |

---

## 8. 后续规划

1. **社区功能**：用户交流、问答、分享案例
2. **个性化推荐**：基于用户学习行为推荐相关资源
3. **技能市场**：集成 ClawHub，支持一键安装 Skills
4. **多平台支持**：扩展到其他小程序平台
5. **付费内容**：优质课程、高级案例

---

## 9. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 0.3.1 | 2026-03-18 | 页面更新（关于我们 + 用户协议）+ 登录提醒功能 + 徽章自动解锁 + 学习统计优化 + 测试增强 |
| 0.3 | 2026-03-17 | 推荐系统优化（下拉刷新 + 混合推荐算法）+ 修改昵称功能 + 首页快捷入口改版 + 发现页URL参数 |
| 0.2 | 2026-03-12 | 资源卡片优化 + 缩略图升级 + 微信小程序支持 |
| 0.1 | 2026-03-12 | 初始版本，包含核心功能 |

---

## 10. 结论

LeanClaw 是一个专注于 OpenClaw 学习的小程序，通过结构化的学习路径、优质资源聚合和实际案例展示，帮助用户快速掌握 OpenClaw 技能。MVP 版本将聚焦核心功能，确保用户能够通过最简洁的方式学会使用 OpenClaw，为后续的功能扩展和用户增长奠定基础。
