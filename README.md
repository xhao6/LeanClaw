# LeanClaw（轻学Claw）— AI 技能学习小程序

基于 **UniApp + Vue 3 + TypeScript + 腾讯云开发（CloudBase）** 的 AI 技能学习小程序，接入**魔搭（ModelScope）大模型 API**，支持 H5 / 微信小程序 / 支付宝小程序 / 抖音小程序 / App 多端。

## 核心功能

- **7 天学习路径**：零基础入门 AI 技能，每天 15-20 分钟碎片化学习
- **游戏化设计**：养一只"龙虾"作为 AI 管家，徽章 + 证书体系（如"龙虾驯养师证书"）
- **资源聚合**：150+ OpenClaw / AI 技能资源收录与导航
- **AI 问答与内容生成**：接入魔搭 Qwen 大模型（`api-inference.modelscope.cn`）
- **内容管理系统**：批量增量更新云数据库（batchUpdate 云函数，MongoDB `$set`，仅管理员可调）

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | UniApp (Vue 3) · TypeScript · UnoCSS · alova |
| 后端 | CloudBase 云函数 · NoSQL 数据库 · 云存储 |
| AI | ModelScope Qwen API（环境变量注入密钥） |
| 测试 | Playwright E2E（`e2e/`）· Jest 单测（`tests/`） |

## 目录结构

```
├── src/               # 小程序应用（Vue3 + TS）
│   ├── pages/         # learn / discover / case / skill / profile / webview
│   ├── composables/   # 组合式函数（useBackButtonRedirect 等）
│   └── utils/         # 工具（hash / tag colors 等）
├── cloudfunctions/    # CloudBase 云函数（batchUpdate 等）
├── scripts/           # 内容同步工具链（dotenv 读取密钥）
├── e2e/               # Playwright E2E
├── tests/             # Jest 单测
└── docs/              # 变更日志 / 内容策略 / 数据模型
```

## 快速开始

前置：Node.js 16+ · 腾讯云开发账号 · 魔搭 API Key

```bash
npm install

# 环境变量（勿提交真实值）
cp .env.example .env   # MODELSCOPE_API_KEY / CLOUDBASE_ENV_ID / CLOUDBASE_SECRET_ID / CLOUDBASE_SECRET_KEY

npm run dev:h5         # H5 开发
npm run dev:mp-weixin  # 微信小程序
```

## 测试

```bash
npm run test           # Jest 单测 + 覆盖率
npm run test:mp        # 小程序端测试
```

## 安全

- 所有密钥仅通过 `.env` / 环境变量注入（`process.env.*`），**仓库内无任何硬编码密钥**
- 数据库批量更新接口仅管理员可调用
