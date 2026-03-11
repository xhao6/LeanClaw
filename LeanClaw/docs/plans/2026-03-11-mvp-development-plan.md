# LeanClaw MVP 开发计划

## 概述

本文档对比 PRD 需求与当前实现状态，确定后续开发步骤。

## 数据来源

- **学习内容**：复用 `openclaw101/content/days/` 的 7 天 Markdown 内容
- **资源数据**：复用 `openclaw101/src/data/resources.ts` 的完整数据结构
- **分类体系**：复用 `openclaw101` 的 categoryMeta 定义

## 待开发功能清单

### Phase 1: 数据接入与首页完善

| 功能 | 描述 | 优先级 |
|-----|------|-------|
| 接入7天学习内容 | 将 openclaw101/content/days/ 的 md 文件转换为应用内数据 | P0 |
| 接入资源数据 | 将 openclaw101/src/data/resources.ts 数据同步到 mock.ts | P0 |
| 首页动态数据 | 将首页的硬编码数据替换为真实数据（学习进度、推荐资源） | P0 |
| 学习进度存储 | 使用 uni.setStorage 存储学习进度（当前天数、lesson完成状态） | P1 |

### Phase 2: 学习模块完善

| 功能 | 描述 | 优先级 |
|-----|------|-------|
| 每日详情页完善 | 渲染 Markdown 内容，支持代码高亮 | P0 |
| Lesson 进度记录 | 记录每个 lesson 的完成状态和观看时长 | P1 |
| 学习打卡功能 | 每日学习打卡，记录连续打卡天数 | P1 |
| 学习徽章系统 | 7个每日徽章 + 成就解锁逻辑 | P1 |
| 电子证书 | 完成7天学习后生成"龙虾驯养师"证书 | P1 |

### Phase 3: 发现模块完善

| 功能 | 描述 | 优先级 |
|-----|------|-------|
| 资源列表完善 | 接入真实资源数据，支持分类筛选 | P0 |
| 案例列表 | 展示 use-cases 分类内容 | P0 |
| Skills 列表 | 展示 Skills 分类内容 | P0 |
| 收藏功能 | 收藏资源/案例/Skills，支持列表查看 | P1 |

### Phase 4: 我的模块完善

| 功能 | 描述 | 优先级 |
|-----|------|-------|
| 学习统计 | 对接进度数据，展示已学天数、完成课程数 | P1 |
| 我的收藏 | 展示已收藏的资源/案例/Skills | P1 |
| 成就展示 | 展示已获得的徽章和证书 | P1 |
| 设置页面 | 完善设置项（清除缓存、版本信息等） | P0 |

## 技术实现要点

### 数据转换

1. **学习内容转换**：将 md 文件解析为结构化数据（title, day, sections, tasks）
2. **资源数据同步**：扩展 mock.ts 的 ResourceItem 接口，对接 openclaw101 数据结构

### 存储设计

```typescript
interface LearnProgress {
  currentDay: number;        // 当前学习第几天 (1-7)
  completedLessons: string[]; // 已完成的 lesson ID 列表
  totalTime: number;         // 总学习时长（分钟）
  streak: number;            // 连续打卡天数
  badges: string[];          // 已获得徽章
  certificate: boolean;      // 是否获得证书
}

interface FavoriteItem {
  id: string;
  type: 'resource' | 'case' | 'skill';
  addedAt: number;
}
```

### Markdown 渲染

使用 markdown-it 或 uni-markdown 组件渲染学习内容，支持代码高亮。

## 后续步骤

1. **Phase 1**：先完成数据接入和首页完善
2. **Phase 2-4**：按优先级迭代开发

---

*生成时间：2026-03-11*
