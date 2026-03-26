# LeanClaw 代码重构计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 消除代码重复、提升类型安全、清理技术债务

**Architecture:** 重构遵循 DRY 原则，将共享代码提取到统一位置，类型定义集中管理，移除死代码

**Tech Stack:** TypeScript, Vue 3 Composition API, uni-app

---

## 阶段一：高优先级 - 代码重复修复

### Task 1: 提取共享 hashCode 函数

**Files:**
- Create: `src/utils/hash.ts` - 共享的 hashCode 函数
- Modify: `src/composables/useTagColors.ts:24-30` - 移除重复实现，改为导入
- Modify: `src/composables/useRecommendations.ts:22-30` - 移除重复实现，改为导入

- [ ] **Step 1: 创建 src/utils/hash.ts**

```typescript
/**
 * 计算字符串的 hash 值（用于颜色分配等场景）
 */
export const hashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

export default hashCode
```

- [ ] **Step 2: 修改 useTagColors.ts**

在文件顶部添加导入：
```typescript
import { hashCode } from '@/utils/hash'
```

删除本文件中的 hashCode 函数实现（约第 24-30 行）

- [ ] **Step 3: 修改 useRecommendations.ts**

在文件顶部添加导入：
```typescript
import { hashCode } from '@/utils/hash'
```

删除本文件中的 hashCode 函数实现（约第 22-30 行）

- [ ] **Step 4: 验证构建**

```bash
npm run build:mp-weixin 2>&1 | tail -5
```
Expected: Build success

- [ ] **Step 5: 提交**

```bash
git add src/utils/hash.ts src/composables/useTagColors.ts src/composables/useRecommendations.ts
git commit -m "refactor: extract hashCode to shared utility"
```

---

### Task 2: 统一 Markdown 样式处理

**Files:**
- Modify: `src/utils/markdown.ts` - 确保 applyStyles 导出且支持自定义配置
- Modify: `src/pages_learn/detail/index.vue:181-196` - 改用 markdown.ts 的 renderMarkdown
- Modify: `src/pages/case/detail.vue` - 同样改用统一的样式处理
- Modify: `src/pages/skill/detail.vue` - 同样改用统一的样式处理
- Modify: `src/pages/webview/index.vue` - 同样改用统一的样式处理

- [ ] **Step 1: 检查 markdown.ts 当前实现**

读取 `src/utils/markdown.ts` 确认 `renderMarkdown` 和 `applyStyles` 的签名

- [ ] **Step 2: 更新 pages_learn/detail/index.vue**

将第 181-196 行的样式替换逻辑替换为调用 `renderMarkdown()`

- [ ] **Step 3: 更新 case/detail.vue**

将 `applyStyles` 调用替换为 `renderMarkdown()` 或统一导入

- [ ] **Step 4: 更新 skill/detail.vue**

同样统一样式处理

- [ ] **Step 5: 更新 webview/index.vue**

同样统一样式处理

- [ ] **Step 6: 验证构建**

```bash
npm run build:mp-weixin 2>&1 | tail -5
```
Expected: Build success

- [ ] **Step 7: 提交**

```bash
git add src/utils/markdown.ts src/pages_learn/detail/index.vue src/pages/case/detail.vue src/pages/skill/detail.vue src/pages/webview/index.vue
git commit -m "refactor: unify markdown styling across all detail pages"
```

---

### Task 3: 统一云存储图片基础 URL

**Files:**
- Modify: `src/config/index.ts` - 添加 IMAGE_BASE_URL 配置
- Modify: `src/utils/markdown.ts:45` - 使用配置而非硬编码
- Modify: `src/pages_learn/detail/index.vue:176` - 使用配置

- [ ] **Step 1: 更新配置**

在 `src/config/index.ts` 中添加：
```typescript
export const config = {
  cloud: {
    envId: 'leanmind-1gjtoa502716c21d'
  },
  cdn: {
    imageBase: 'https://6c65-leanmind-1gjtoa502716c21d-1410913126.tcb.qcloud.la'
  }
}
```

- [ ] **Step 2: 更新 markdown.ts**

将硬编码的 `CLOUD_IMAGE_BASE` 替换为 `config.cdn.imageBase`

- [ ] **Step 3: 更新 pages_learn/detail/index.vue**

同样替换为使用配置

- [ ] **Step 4: 验证构建**

```bash
npm run build:mp-weixin 2>&1 | tail -5
```
Expected: Build success

- [ ] **Step 5: 提交**

```bash
git add src/config/index.ts src/utils/markdown.ts src/pages_learn/detail/index.vue
git commit -m "refactor: centralize CDN configuration"
```

---

## 阶段二：中优先级 - 技术债务清理

### Task 4: 移除死代码

**Files:**
- Modify: `src/composables/useRecommendations.ts` - 移除未使用的 `shuffle` 函数和 `useUserFavorites`

- [ ] **Step 1: 检查 shuffle 和 useUserFavorites 是否被使用**

```bash
grep -n "shuffle\|useUserFavorites" src/composables/useRecommendations.ts
grep -r "shuffle\|useUserFavorites" src/ --include="*.ts" --include="*.vue" | grep -v "useRecommendations.ts"
```

- [ ] **Step 2: 确认无外部引用后删除这两个函数**

- [ ] **Step 3: 验证构建**

```bash
npm run build:mp-weixin 2>&1 | tail -5
```

- [ ] **Step 4: 提交**

```bash
git add src/composables/useRecommendations.ts
git commit -m "refactor: remove dead code (shuffle, useUserFavorites)"
```

---

### Task 5: 添加类型定义

**Files:**
- Create: `src/types/api.ts` - API 请求/响应类型定义
- Modify: `src/api/core/cloud.ts` - 使用具体类型替代 any
- Modify: `src/api/core/tcbWeb.ts` - 使用具体类型替代 any
- Modify: `src/api/modules/resource.ts` - 使用具体类型替代 any

- [ ] **Step 1: 创建基础类型文件**

```typescript
// src/types/api.ts

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface CloudFunctionRequest {
  name: string
  data?: Record<string, any>
}

export interface CloudFunctionResponse {
  success: boolean
  result?: any
  error?: string
}
```

- [ ] **Step 2: 更新 cloud.ts 使用类型**

- [ ] **Step 3: 更新 tcbWeb.ts 使用类型**

- [ ] **Step 4: 更新 resource.ts 使用类型**

- [ ] **Step 5: 验证类型检查**

```bash
npm run type-check 2>&1 | head -30
```

- [ ] **Step 6: 提交**

```bash
git add src/types/api.ts src/api/core/cloud.ts src/api/core/tcbWeb.ts src/api/modules/resource.ts
git commit -m "refactor: add TypeScript types for API layer"
```

---

## 阶段三：低优先级 - 其他优化

### Task 6: 移除生产环境 console.log

**Files:**
- Modify: `src/App.vue` - 移除或替换 console.log
- Modify: `src/pages/case/detail.vue` - 移除调试日志
- Modify: `src/pages/skill/detail.vue` - 移除调试日志
- Modify: `src/api/core/middleware.ts` - 移除调试日志

- [ ] **Step 1: 识别需要保留的日志**

保留必要的错误日志，移除调试性质的 console.log

- [ ] **Step 2: 批量替换**

将 `console.log` 替换为条件日志（仅在开发模式输出）

- [ ] **Step 3: 验证构建**

- [ ] **Step 4: 提交**

---

### Task 7: 统一 API 调用模式

**Files:**
- Modify: `src/api/core/instance.ts` - 连接 alova 到实际 API 调用或移除
- Modify: `src/api/core/cloud.ts` - 添加超时配置
- Modify: `src/api/core/tcbWeb.ts` - 统一错误处理

- [ ] **Step 1: 检查 instance.ts 是否被使用**

```bash
grep -r "from.*instance\|import.*instance" src/ --include="*.ts" --include="*.vue" | grep -v "node_modules"
```

- [ ] **Step 2: 根据使用情况决定是连接还是移除**

- [ ] **Step 3: 验证构建**

- [ ] **Step 4: 提交**

---

## 任务依赖关系

```
Task 1 (hashCode) ─┬─> Task 2 (Markdown) ─┬─> Task 3 (Config)
                   │                      │
                   └──────────────────────┘
                          │
                          v
Task 4 (Dead Code) ──────┴──> Task 5 (Types) ──> Task 6 (Logs) ──> Task 7 (API)
```

**建议执行顺序:**
1. Task 1 → 2 → 3（代码重复）
2. Task 4 → 5（技术债务）
3. Task 6 → 7（其他优化）

---

## 验证命令

所有任务完成后运行：

```bash
# 单元测试
npm run test:run

# E2E 测试
npm run e2e

# 构建验证
npm run build:mp-weixin
npm run build:h5
```

Expected: All tests pass, builds succeed
