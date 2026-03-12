# LeanClaw 后端实施计划

> **对于 AI 开发者:** 必须使用 `superpowers:subagent-driven-development`（如果支持）或 `superpowers:executing-plans` 来执行此计划。步骤使用复选框 (`- [ ]`) 进行跟踪。

**目标:** 为 LeanClaw（微信小程序）建立一个健壮的 CloudBase 后端，包括数据同步、用户进度跟踪和 API 集成。

**架构:**
- **云函数:** 用于业务逻辑（同步资源、用户数据）的无服务器函数。
- **云数据库 (NoSQL):** 存储资源、用户资料、学习进度和收藏夹。
- **认证:** 通过 CloudBase 进行微信小程序登录 (OpenID)。
- **客户端:** uni-app (Vue 3) 通过 `wx.cloud` 连接。

**技术栈:** CloudBase (Node.js 18), wx-server-sdk, NoSQL Database

---

## 第一部分：数据库架构与同步

### 任务 1：数据库架构初始化

**文件:**
- 创建: `cloudfunctions/initSchema/index.js` (可选，主要通过工具操作)
- 创建: `docs/superpowers/specs/database-schema.md` (文档)

- [ ] **步骤 1: 定义数据库集合**
  - `resources`: 存储教程、案例、技能。
  - `users`: 存储用户资料和统计信息。
  - `progress`: 存储用户学习进度（课程）。
  - `favorites`: 存储用户收藏。
  - `certificates`: 存储生成的证书。

- [ ] **步骤 2: 通过 MCP 工具创建集合**
  - 使用 `mcp_cloudbase_writeNoSqlDatabaseStructure` 创建不存在的集合。

### 任务 2：资源同步函数

**文件:**
- 创建: `cloudfunctions/syncResources/index.js`
- 创建: `cloudfunctions/syncResources/package.json`

- [ ] **步骤 1: 创建云函数**
  - 使用 `mcp_cloudbase_createFunction` 创建 `syncResources` (Node.js 18)。

- [ ] **步骤 2: 实现同步逻辑**
  - 从 `openclaw101` 源（或上传到云端的本地 `src/data/mock.ts` JSON）获取数据。
  - 将数据更新插入（Upsert）到 `resources` 集合。
  - 使用 `mcp_cloudbase_updateFunctionCode` 部署。

- [ ] **步骤 3: 触发同步**
  - 使用 `mcp_cloudbase_invokeFunction` 填充初始数据。

---

## 第二部分：用户系统与进度

### 任务 3：用户登录与资料

**文件:**
- 创建: `cloudfunctions/userFunctions/index.js` (合并的用户逻辑)
- 修改: `LeanClaw/src/api/index.ts` (连接到云函数)

- [ ] **步骤 1: 创建 `userFunctions`**
  - 处理 `login`: 获取 OpenID，在 `users` 集合中创建/更新用户。
  - 处理 `getProfile`: 返回用户信息。

- [ ] **步骤 2: 前端集成**
  - 更新 `LeanClaw` 以调用 `wx.cloud.callFunction({ name: 'userFunctions', data: { type: 'login' } })`。

### 任务 4：学习进度

**文件:**
- 修改: `cloudfunctions/userFunctions/index.js`

- [ ] **步骤 1: 添加进度逻辑**
  - 处理 `updateProgress`: 将完成的课程保存到 `progress` 集合。
  - 处理 `getProgress`: 检索完成状态。

- [ ] **步骤 2: 前端集成**
  - 更新学习页面以与云端同步进度。

---

## 第三部分：功能与部署

### 任务 5：收藏系统

**文件:**
- 修改: `cloudfunctions/userFunctions/index.js`

- [ ] **步骤 1: 添加收藏逻辑**
  - 处理 `toggleFavorite`: 在 `favorites` 集合中添加/移除 ID。
  - 处理 `getFavorites`: 获取收藏 ID 的资源详情。

### 任务 6：证书生成

**文件:**
- 创建: `cloudfunctions/generateCertificate/index.js`

- [ ] **步骤 1: 创建函数**
  - 生成证书数据/图片（可选：服务端生成图片或仅存储数据）。
  - 存储到 `certificates` 集合。

---

## 第四部分：迁移（本地到云端）

### 任务 7：数据迁移

- [ ] **步骤 1: 迁移本地 Mock 数据**
  - 读取 `src/data/mock.ts`。
  - 转换为 JSON。
  - 上传到 `resources` 集合。

- [ ] **步骤 2: 切换前端到云 API**
  - 修改 `src/api/` 以优先使用云函数而非本地 Mock。

---

## 执行说明

1. **环境**: 确保 `mcp_cloudbase_auth` 处于活动状态且已设置 `envId`。
2. **工具**: 对所有云操作使用 `mcp_cloudbase_*` 工具。
3. **验证**: 在前端集成之前，使用 `mcp_cloudbase_invokeFunction` 测试每个函数。
