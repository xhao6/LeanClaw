# LeanClaw 前端适配实施计划

> **对于 AI 开发者:** 必须使用 `superpowers:subagent-driven-development`（如果支持）或 `superpowers:executing-plans` 来执行此计划。步骤使用复选框 (`- [ ]`) 进行跟踪。

**目标:** 将 LeanClaw 前端从使用本地 Mock 数据迁移到对接 CloudBase 云函数和数据库，并实现完整的用户登录与状态管理流程。

**前提条件:**
- 后端实施计划 (`2026-03-12-backend-implementation.md`) 中的云函数和数据库集合已部署完成。

---

## 第一部分：环境配置与基础 API

### 任务 1：CloudBase 环境初始化

**文件:**
- 修改: `LeanClaw/src/main.ts`
- 修改: `LeanClaw/src/api/core/cloud.ts` (新建)

- [ ] **步骤 1: 初始化 wx.cloud**
  - 在 `App.vue` 或 `main.ts` 中调用 `wx.cloud.init({ env: 'YOUR_ENV_ID' })`。
  - 确保环境 ID 配置正确。

- [ ] **步骤 2: 封装云函数调用**
  - 创建 `callFunction` 封装方法，统一处理 loading 状态和错误提示。

### 任务 2：API 层重构

**文件:**
- 修改: `LeanClaw/src/api/index.ts`
- 修改: `LeanClaw/src/api/modules/user.ts` (新建)
- 修改: `LeanClaw/src/api/modules/resource.ts` (新建)

- [ ] **步骤 1: 用户 API 对接**
  - 实现 `login` 接口调用云函数 `userFunctions/login`。
  - 实现 `getProfile` 接口。

- [ ] **步骤 2: 资源 API 对接**
  - 实现 `getResources` 接口调用云数据库查询。
  - 替换原有的 Mock 数据引用。

---

## 第二部分：用户登录与状态管理

### 任务 3：Pinia Store 改造

**文件:**
- 修改: `LeanClaw/src/store/user.ts`

- [ ] **步骤 1: 登录逻辑改造**
  - 移除本地 Mock 登录逻辑。
  - 调用 `wx.login` 获取 code（虽然云开发不需要 code 换 token，但可能需要触发静默登录流程）。
  - 调用云函数获取 OpenID 和用户信息。
  - 保存 token/session 到本地存储。

- [ ] **步骤 2: 用户信息同步**
  - 在应用启动时自动检查登录状态并同步最新用户信息。

### 任务 4：登录 UI 交互

**文件:**
- 修改: `LeanClaw/src/pages/profile/index.vue`

- [ ] **步骤 1: 登录按钮逻辑**
  - 绑定点击事件到 Store 的登录 Action。
  - 处理“获取用户信息”授权（如果需要头像昵称）。

- [ ] **步骤 2: 登录状态展示**
  - 根据 Store 状态切换显示“登录/注册”按钮或用户信息。

---

## 第三部分：核心功能数据对接

### 任务 5：学习进度同步

**文件:**
- 修改: `LeanClaw/src/pages/learn/index.vue`
- 修改: `LeanClaw/src/pages/learn/detail/index.vue`

- [ ] **步骤 1: 进度读取**
  - 页面加载时从云端拉取最新进度。
  - 替换本地 `uni.getStorageSync` 逻辑。

- [ ] **步骤 2: 进度更新**
  - 完成课程后调用云函数更新进度。
  - 确保本地 Store 和云端数据一致。

### 任务 6：收藏功能对接

**文件:**
- 修改: `LeanClaw/src/pages/discover/index.vue`
- 修改: `LeanClaw/src/pages/profile/favorites/index.vue`

- [ ] **步骤 1: 收藏状态管理**
  - 将收藏列表从本地 Storage 迁移到云数据库。
  - 优化收藏/取消收藏的交互响应速度（乐观更新）。

---

## 第四部分：测试与清理

### 任务 7：清理 Mock 数据

- [ ] **步骤 1: 移除 Mock 文件**
  - 删除 `src/data/mock.ts`。
  - 搜索全项目，确保没有残留的 Mock 引用。

- [ ] **步骤 2: 全流程测试**
  - 测试新用户注册。
  - 测试数据同步。
  - 测试离线/弱网情况下的表现。
