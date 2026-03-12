# LeanClaw 回归测试用例集

> **For Claude:** REQUIRED SUB-SKILL: 使用 superpowers:subagent-driven-development 或手动执行实现测试任务。

**目标：** 为 LeanClaw MVP 创建完整的回归测试用例集，确保核心功能稳定运行

**架构方案：** 使用 Vitest + @vue/test-utils + happy-dom 进行单元测试和组件测试，覆盖数据层（utils）、业务逻辑和页面交互

**技术栈：** vitest, @vue/test-utils, happy-dom, @vitest/coverage-v8

---

## 测试范围

### 1. 工具函数测试（优先级：高）

| 测试文件 | 测试功能 | 状态 |
|---------|---------|------|
| `src/utils/__tests__/learnProgress.test.ts` | 学习进度存储与计算 | 待创建 |
| `src/utils/__tests__/favorites.test.ts` | 收藏功能增删改查 | 待创建 |
| `src/utils/__tests__/markdown.test.ts` | Markdown 渲染 | 待创建 |
| `src/data/__tests__/lessons.test.ts` | 课程数据读取 | 待创建 |
| `src/data/__tests__/badges.test.ts` | 徽章数据与解锁逻辑 | 待创建 |

### 2. 数据测试

| 测试文件 | 测试功能 | 状态 |
|---------|---------|------|
| `src/data/__tests__/mock.test.ts` | 资源数据完整性 | 待创建 |
| `src/data/__tests__/certificate.test.ts` | 证书数据生成 | 待创建 |

### 3. 集成测试（优先级：中）

| 测试文件 | 测试功能 | 状态 |
|---------|---------|------|
| `tests/e2e/basic-flow.test.ts` | 核心用户流程 | 待创建 |

---

## 任务清单

### Task 1: 配置 Vitest 测试框架

**文件：**
- 修改: `LeanClaw/package.json`
- 创建: `LeanClaw/vitest.config.ts`

**Step 1: 安装测试依赖**

```bash
cd LeanClaw
npm install -D vitest @vue/test-utils happy-dom @vitest/coverage-v8 jsdom
```

**Step 2: 创建 vitest.config.ts**

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

**Step 3: 添加测试脚本**

修改 `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Step 4: 运行测试验证**

```bash
npm run test:run
Expected: PASS (无测试文件时显示 0 tests)
```

**Step 5: 提交**

```bash
git add package.json vitest.config.ts
git commit -m "test: 配置 Vitest 测试框架"
```

---

### Task 2: 学习进度工具函数测试

**文件：**
- 创建: `LeanClaw/src/utils/__tests__/learnProgress.test.ts`
- 修改: `LeanClaw/src/utils/learnProgress.ts` (如需要)

**Step 1: 创建测试文件**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getProgress,
  saveProgress,
  updateCurrentDay,
  markLessonComplete,
  addLearningTime,
  checkAndUpdateStreak,
  resetProgress,
  getDefaultProgress
} from '../learnProgress'

// Mock uni API
vi.mock('@dcloudio/uni-app', () => ({
  getStorageSync: vi.fn((key: string) => {
    if (key === 'learn_progress') {
      return undefined // 初始无数据
    }
    return undefined
  }),
  setStorageSync: vi.fn(),
}))

describe('learnProgress 工具函数', () => {
  beforeEach(() => {
    resetProgress()
  })

  describe('getProgress', () => {
    it('应返回默认进度（无存储数据时）', () => {
      const progress = getProgress()
      expect(progress.currentDay).toBe(1)
      expect(progress.completedLessons).toEqual([])
      expect(progress.totalTime).toBe(0)
      expect(progress.streak).toBe(0)
      expect(progress.badges).toEqual([])
      expect(progress.certificate).toBe(false)
    })
  })

  describe('updateCurrentDay', () => {
    it('应正确更新当前天数', () => {
      updateCurrentDay(3)
      const progress = getProgress()
      expect(progress.currentDay).toBe(3)
    })

    it('应限制天数在 1-7 范围内', () => {
      updateCurrentDay(10)
      expect(getProgress().currentDay).toBe(7)

      updateCurrentDay(0)
      expect(getProgress().currentDay).toBe(1)
    })
  })

  describe('markLessonComplete', () => {
    it('应标记课程为完成', () => {
      markLessonComplete('day-1')
      const progress = getProgress()
      expect(progress.completedLessons).toContain('day-1')
    })

    it('不应重复添加相同课程', () => {
      markLessonComplete('day-1')
      markLessonComplete('day-1')
      const progress = getProgress()
      expect(progress.completedLessons.filter(l => l === 'day-1').length).toBe(1)
    })
  })

  describe('addLearningTime', () => {
    it('应累加学习时长', () => {
      addLearningTime(15)
      addLearningTime(20)
      expect(getProgress().totalTime).toBe(35)
    })
  })

  describe('checkAndUpdateStreak', () => {
    it('首次打卡应返回 streak 为 1', () => {
      const result = checkAndUpdateStreak()
      expect(result).toBe(1)
      expect(getProgress().streak).toBe(1)
    })
  })

  describe('resetProgress', () => {
    it('应重置所有进度数据', () => {
      updateCurrentDay(5)
      addLearningTime(100)
      markLessonComplete('day-1')

      resetProgress()

      const progress = getProgress()
      expect(progress.currentDay).toBe(1)
      expect(progress.totalTime).toBe(0)
      expect(progress.completedLessons).toEqual([])
    })
  })
})
```

**Step 2: 运行测试验证失败（预期）**

```bash
npm run test:run -- src/utils/__tests__/learnProgress.test.ts
Expected: FAIL (文件不存在)
```

**Step 3: 确认 learnProgress.ts 导出函数存在**

检查 `src/utils/learnProgress.ts` 包含以下导出：
- `getProgress()`
- `saveProgress(progress)`
- `updateCurrentDay(day)`
- `markLessonComplete(lessonId)`
- `addLearningTime(minutes)`
- `checkAndUpdateStreak()`
- `resetProgress()`
- `getDefaultProgress()`

**Step 4: 运行测试**

```bash
npm run test:run -- src/utils/__tests__/learnProgress.test.ts
Expected: PASS (所有测试通过)
```

**Step 5: 提交**

```bash
git add src/utils/__tests__/learnProgress.test.ts
git commit -m "test: 添加学习进度工具函数测试"
```

---

### Task 3: 收藏功能测试

**文件：**
- 创建: `LeanClaw/src/utils/__tests__/favorites.test.ts`

**Step 1: 创建测试文件**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorited,
  toggleFavorite,
  clearAllFavorites
} from '../favorites'

describe('favorites 收藏功能', () => {
  const mockItem = {
    id: 'test-1',
    type: 'resource' as const,
    title: '测试资源',
    desc: '测试描述',
    url: 'https://example.com',
    addedAt: Date.now()
  }

  beforeEach(() => {
    clearAllFavorites()
  })

  describe('addFavorite', () => {
    it('应成功添加收藏', () => {
      addFavorite(mockItem)
      const favorites = getFavorites()
      expect(favorites).toHaveLength(1)
      expect(favorites[0].id).toBe('test-1')
    })

    it('不应重复添加相同 id 的收藏', () => {
      addFavorite(mockItem)
      addFavorite(mockItem)
      expect(getFavorites()).toHaveLength(1)
    })
  })

  describe('removeFavorite', () => {
    it('应成功移除收藏', () => {
      addFavorite(mockItem)
      removeFavorite('test-1')
      expect(getFavorites()).toHaveLength(0)
    })
  })

  describe('isFavorited', () => {
    it('已收藏应返回 true', () => {
      addFavorite(mockItem)
      expect(isFavorited('test-1')).toBe(true)
    })

    it('未收藏应返回 false', () => {
      expect(isFavorited('non-existent')).toBe(false)
    })
  })

  describe('toggleFavorite', () => {
    it('未收藏时应添加', () => {
      toggleFavorite(mockItem)
      expect(isFavorited('test-1')).toBe(true)
    })

    it('已收藏时应移除', () => {
      addFavorite(mockItem)
      toggleFavorite(mockItem)
      expect(isFavorited('test-1')).toBe(false)
    })
  })

  describe('clearAllFavorites', () => {
    it('应清空所有收藏', () => {
      addFavorite(mockItem)
      addFavorite({ ...mockItem, id: 'test-2' })
      clearAllFavorites()
      expect(getFavorites()).toHaveLength(0)
    })
  })
})
```

**Step 2: 运行测试**

```bash
npm run test:run -- src/utils/__tests__/favorites.test.ts
Expected: PASS
```

**Step 3: 提交**

```bash
git add src/utils/__tests__/favorites.test.ts
git commit -m "test: 添加收藏功能测试"
```

---

### Task 4: Markdown 渲染测试

**文件：**
- 创建: `LeanClaw/src/utils/__tests__/markdown.test.ts`

**Step 1: 创建测试文件**

```typescript
import { describe, it, expect } from 'vitest'
import { renderMarkdown, parseFrontMatter } from '../markdown'

describe('markdown 渲染工具', () => {
  describe('renderMarkdown', () => {
    it('应正确渲染标题', () => {
      const html = renderMarkdown('# Hello World')
      expect(html).toContain('<h1')
      expect(html).toContain('Hello World')
    })

    it('应正确渲染段落', () => {
      const html = renderMarkdown('This is a paragraph.')
      expect(html).toContain('<p')
      expect(html).toContain('This is a paragraph')
    })

    it('应正确渲染代码块', () => {
      const html = renderMarkdown('```javascript\nconst a = 1\n```')
      expect(html).toContain('<pre')
      expect(html).toContain('hljs')
    })

    it('应正确渲染链接', () => {
      const html = renderMarkdown('[OpenClaw](https://openclaw.ai)')
      expect(html).toContain('<a')
      expect(html).toContain('href="https://openclaw.ai"')
    })

    it('应修复图片路径', () => {
      const html = renderMarkdown('![img](/images/days/test.jpg)')
      expect(html).toContain('/static/images/days/test.jpg')
    })
  })

  describe('parseFrontMatter', () => {
    it('应正确解析 Front Matter', () => {
      const markdown = `---
title: Day 1
day: 1
---
# Content`
      const { attributes, body } = parseFrontMatter(markdown)
      expect(attributes.title).toBe('Day 1')
      expect(attributes.day).toBe('1')
      expect(body).toContain('# Content')
    })

    it('无 Front Matter 时应返回原始内容', () => {
      const markdown = '# Just Content'
      const { attributes, body } = parseFrontMatter(markdown)
      expect(attributes).toEqual({})
      expect(body).toBe('# Just Content')
    })
  })
})
```

**Step 2: 运行测试**

```bash
npm run test:run -- src/utils/__tests__/markdown.test.ts
Expected: PASS
```

**Step 3: 提交**

```bash
git add src/utils/__tests__/markdown.test.ts
git commit -m "test: 添加 Markdown 渲染测试"
```

---

### Task 5: 数据文件测试

**文件：**
- 创建: `LeanClaw/src/data/__tests__/lessons.test.ts`
- 创建: `LeanClaw/src/data/__tests__/badges.test.ts`
- 创建: `LeanClaw/src/data/__tests__/mock.test.ts`

**Step 1: lessons.test.ts**

```typescript
import { describe, it, expect } from 'vitest'
import { lessons, getLessonById, getAllLessonIds } from '../lessons'

describe('lessons 课程数据', () => {
  it('应包含 7 天课程', () => {
    expect(lessons).toHaveLength(7)
  })

  it('每课应有必需字段', () => {
    lessons.forEach(lesson => {
      expect(lesson.id).toBeDefined()
      expect(lesson.day).toBeDefined()
      expect(lesson.title).toBeDefined()
      expect(lesson.content).toBeDefined()
    })
  })

  it('getLessonById 应返回正确课程', () => {
    const lesson = getLessonById('day-1')
    expect(lesson).toBeDefined()
    expect(lesson?.day).toBe(1)
  })

  it('getLessonById 应返回 undefined（不存在时）', () => {
    expect(getLessonById('invalid')).toBeUndefined()
  })

  it('课程 ID 格式应正确', () => {
    const ids = getAllLessonIds()
    ids.forEach((id, index) => {
      expect(id).toBe(`day-${index + 1}`)
    })
  })
})
```

**Step 2: badges.test.ts**

```typescript
import { describe, it, expect } from 'vitest'
import { badges, getBadgeById, getAllBadges, isBadgeUnlocked } from '../badges'

describe('badges 徽章数据', () => {
  it('应包含 7 个徽章', () => {
    expect(badges).toHaveLength(7)
  })

  it('每个徽章应有必需字段', () => {
    badges.for {
      expect(bEach(badge =>adge.id).toBeDefined()
      expect(badge.name).toBeDefined()
      expect(badge.desc).toBeDefined()
      expect(badge.icon).toBeDefined()
    })
  })

  it('getBadgeById 应返回正确徽章', () => {
    const badge = getBadgeById('day1-badge')
    expect(badge).toBeDefined()
    expect(badge?.name).toBe('初识 OpenClaw')
  })
})
```

**Step 3: mock.test.ts**

```typescript
import { describe, it, expect } from 'vitest'
import { resources } from '../mock'

describe('mock 资源数据', () => {
  it('应包含资源数据', () => {
    expect(resources.length).toBeGreaterThan(0)
  })

  it('每条资源应有必需字段', () => {
    resources.forEach(resource => {
      expect(resource.id).toBeDefined()
      expect(resource.title).toBeDefined()
      expect(resource.desc).toBeDefined()
      expect(resource.type).toBeDefined()
    })
  })

  it('应包含各类型资源', () => {
    const types = new Set(resources.map(r => r.type))
    expect(types.has('resource')).toBe(true)
  })

  it('应有推荐资源 (featured: true)', () => {
    const featured = resources.filter(r => r.featured)
    expect(featured.length).toBeGreaterThan(0)
  })
})
```

**Step 4: 运行测试**

```bash
npm run test:run -- src/data/__tests__/
Expected: PASS
```

**Step 5: 提交**

```bash
git add src/data/__tests__/
git commit -m "test: 添加数据文件测试"
```

---

### Task 6: 运行完整测试套件

**Step 1: 运行所有测试**

```bash
npm run test:run
Expected:
- tests passed
- 显示测试覆盖率
```

**Step 2: 生成覆盖率报告**

```bash
npm run test:coverage
Expected: 生成 coverage 目录
```

**Step 3: 提交**

```bash
git add .
git commit -m "test: 完成 MVP 回归测试用例集"
```

---

## 执行选项

**计划已保存到 `docs/plans/2026-03-12-mvp-regression-tests.md`**

两种执行方式：

1. **Subagent-Driven (本会话)** - 我为每个任务派遣 subagent，快速迭代
2. **Parallel Session (新会话)** - 在新会话中使用 executing-plans

请选择执行方式？
