# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
description: CloudBase AI Development Rules Guide - Provides scenario-based best practices to ensure development quality
globs: *
alwaysApply: true
inclusion: always
---

# CloudBase AI Development Rules Guide

## 🗂️ Rule File Path Resolution Strategy

**CRITICAL: All rule file paths in this document follow a smart resolution strategy to support multiple AI editors.**

### Path Resolution Rules

When this document references a rule file, try locations in this order:

1. **CodeBuddy Path**: `.codebuddy/rules/tcb/rules/{rule-name}/rule.md`
2. **Universal Path**: `rules/{rule-name}/rule.md`
3. **Fallback Search**: Use `search_file` with pattern `*{rule-name}*rule.md`

### Rule Name Mapping

| Rule Shorthand | Full Rule Name |
|----------------|----------------|
| `auth-tool` | Authentication Tool Configuration |
| `auth-web` | Web Authentication |
| `auth-wechat` | WeChat Mini Program Authentication |
| `auth-nodejs` | Node.js Authentication |
| `auth-http-api` | HTTP API Authentication |
| `web-development` | Web Platform Development |
| `miniprogram-development` | Mini Program Platform Development |
| `cloudrun-development` | CloudRun Backend Development |
| `cloud-functions` | Cloud Functions Development |
| `http-api` | HTTP API Usage |
| `relational-database-tool` | MySQL Database Tool Operations |
| `relational-database-web` | MySQL Web SDK |
| `no-sql-web-sdk` | NoSQL Web SDK |
| `no-sql-wx-mp-sdk` | NoSQL WeChat Mini Program SDK |
| `cloudbase-platform` | CloudBase Platform Knowledge |
| `cloud-storage-web` | Cloud Storage Web SDK |
| `ui-design` | UI Design Guidelines |
| `spec-workflow` | Software Engineering Workflow |
| `data-model-creation` | Data Model Creation |
| `ai-model-web` | AI Model Calling (Web SDK) |
| `ai-model-nodejs` | AI Model Calling (Node SDK) |
| `ai-model-wechat` | AI Model Calling (WeChat Mini Program) |

### Usage Example

When you see "Read `{auth-web}` rule file" in this document:
- Try: `.codebuddy/rules/tcb/rules/auth-web/rule.md` first
- Then: `rules/auth-web/rule.md`
- Finally: Search with pattern `*auth-web*rule.md`

**Note**: Files already using `rules/` prefix (like `rules/ui-design/rule.md`) work universally across all editors and don't need path resolution.

---

## Quick Reference for AI

**⚠️ CRITICAL: Read this section first based on your project type**

### When Developing a Web Project:
1. **Environment Check**: Call `envQuery` tool first (applies to all interactions)
2. **⚠️ Template Download (MANDATORY for New Projects)**: **MUST call `downloadTemplate` tool FIRST when starting a new project** - Do NOT create files manually. Use `downloadTemplate` with `template="react"` or `template="vue"` to get the complete project structure. Only proceed with manual file creation if template download fails or user explicitly requests it.
3. **⚠️ UI Design (CRITICAL)**: **MUST read `rules/ui-design/rule.md` FIRST before generating any page, interface, component, or style** - This is NOT optional. You MUST explicitly read this file and output the design specification before writing any UI code.
4. **Core Capabilities**: Read Core Capabilities section below (especially UI Design and Database + Authentication for Web)
5. **⚠️ Authentication Configuration Check (MANDATORY)**: **When user mentions ANY login/authentication requirement, MUST FIRST read `{auth-tool}` rule file (using path resolution strategy) and check/configure authentication providers BEFORE implementing frontend code**
6. **Platform Rules**: Read `{web-development}` rule file (using path resolution strategy) for platform-specific rules (SDK integration, static hosting, build configuration)
7. **Authentication**: Read `{auth-web}` rule file (using path resolution strategy) and `{auth-tool}` - **MUST use Web SDK built-in authentication**
8. **Database**:
   - NoSQL: `rules/no-sql-web-sdk/rule.md`
   - MySQL: `rules/relational-database-web/rule.md` + `rules/relational-database-tool/rule.md`

### When Developing a Mini Program Project:
1. **Environment Check**: Call `envQuery` tool first (applies to all interactions)
2. **⚠️ Template Download (MANDATORY for New Projects)**: **MUST call `downloadTemplate` tool FIRST when starting a new project** - Do NOT create files manually. Use `downloadTemplate` with `template="miniprogram"` to get the complete project structure. Only proceed with manual file creation if template download fails or user explicitly requests it.
3. **⚠️ UI Design (CRITICAL)**: **MUST read `rules/ui-design/rule.md` FIRST before generating any page, interface, component, or style** - This is NOT optional. You MUST explicitly read this file and output the design specification before writing any UI code.
4. **Core Capabilities**: Read Core Capabilities section below (especially UI Design and Database + Authentication for Mini Program)
5. **Platform Rules**: Read `rules/miniprogram-development/rule.md` for platform-specific rules (project structure, WeChat Developer Tools, wx.cloud usage)
6. **Authentication**: Read `rules/auth-wechat/rule.md` - **Naturally login-free, get OPENID in cloud functions**
7. **Database**:
   - NoSQL: `rules/no-sql-wx-mp-sdk/rule.md`
   - MySQL: `rules/relational-database-tool/rule.md` (via tools)

### When Developing a Native App Project (iOS/Android/Flutter/React Native/etc.):
1. **Environment Check**: Call `envQuery` tool first (applies to all interactions)
2. **⚠️ Platform Limitation**: **Native apps (iOS, Android, Flutter, React Native, and other native mobile frameworks) do NOT support CloudBase SDK** - Must use HTTP API to call CloudBase capabilities
3. **⚠️ UI Design (CRITICAL)**: **MUST read `rules/ui-design/rule.md` FIRST before generating any page, interface, component, or style** - This is NOT optional. You MUST explicitly read this file and output the design specification before writing any UI code.
4. **Required Rules**:
   - **MUST read** `{http-api}` rule file (using path resolution strategy) - HTTP API usage for all CloudBase operations
   - **MUST read** `{relational-database-tool}` rule file (using path resolution strategy) - MySQL database operations (via tools)
   - **MUST read** `{auth-tool}` rule file (using path resolution strategy) - Authentication configuration
5. **Optional Rules**:
   - `rules/cloudbase-platform/rule.md` - Universal CloudBase platform knowledge
   - `rules/ui-design/rule.md` - UI design guidelines (if UI is involved)
6. **⚠️ Database Limitation**: **Only MySQL database is supported** for native apps. If users need to use MySQL database, **MUST prompt them to enable it in the console first**:
   - Enable MySQL database at: [CloudBase Console - MySQL Database](https://tcb.cloud.tencent.com/dev?envId=${envId}#/db/mysql/table/default/)
   - Replace `${envId}` with the actual environment ID

---

## Core Capabilities (Must Be Done Well)

### 0. ⚠️ Configuration-First Principle (NEW - HIGHEST PRIORITY)

**🚨 MANDATORY: Always check and configure CloudBase services BEFORE implementing code**

**Authentication Trigger Words Detection:**

When user mentions ANY of these words, immediately read the auth-tool rule file:

- Phone login / SMS login / Mobile login
- Email login
- WeChat login / Wechat auth
- Username password login / User/pass login
- Anonymous login / Guest login
- Login / Register / Auth / Authentication / Sign in / Sign up

**Rule File Location Strategy:**

When you see `{rule-name}` notation in this document, apply the path resolution strategy from the top of this file:
1. Try `.codebuddy/rules/tcb/rules/{rule-name}/rule.md` first (CodeBuddy)
2. Then try `rules/{rule-name}/rule.md` (Other editors)
3. Use `search_file` with pattern `*{rule-name}*rule.md` if both fail

**Specific example for auth-tool:**
1. `.codebuddy/rules/tcb/rules/auth-tool/rule.md` (CodeBuddy)
2. `rules/auth-tool/rule.md` (Other editors: Cursor, WindSurf, etc.)
3. Use `search_file` with pattern `*auth-tool*rule.md` if both fail

**Execution Sequence:**

1. **FIRST**: Read `{auth-tool}` rule file using the path resolution strategy
2. **SECOND**: Use `callCloudApi` to check current authentication configuration
3. **THIRD**: Enable required authentication methods (if not configured)
4. **FOURTH**: Verify configuration is effective
5. **FIFTH**: Implement frontend authentication code

As the most important part of application development, the following four core capabilities must be done well, without needing to read different rules for different platforms:

### 1. ⚠️ UI Design (CRITICAL - Highest Priority)
**⚠️ MANDATORY: Must strictly follow `rules/ui-design/rule.md` rules for ALL design work**

**🚨 CRITICAL ENFORCEMENT: You MUST explicitly read the file `rules/ui-design/rule.md` before generating ANY UI code. This is NOT a suggestion - it is a MANDATORY requirement.**

**Before generating ANY page, interface, component, or style:**
1. **MUST FIRST explicitly read `rules/ui-design/rule.md` file** - Use file reading tools to read this file, do NOT skip this step
2. **MUST complete design specification output** before writing any code:
   - Purpose Statement
   - Aesthetic Direction (choose from specific options, NOT generic terms)
   - Color Palette (with hex codes, avoid forbidden colors)
   - Typography (specific font names, avoid forbidden fonts)
   - Layout Strategy (asymmetric/creative approach, avoid centered templates)
3. **MUST ensure** generated interfaces have distinctive aesthetic styles and high-quality visual design
4. **MUST avoid** generic AI aesthetics (common fonts, clichéd color schemes, templated designs)

**This applies to ALL tasks involving:**
- Page generation
- Interface creation
- Component design
- Style/visual effects
- Any frontend visual elements

**⚠️ VIOLATION DETECTION: If you find yourself writing UI code without first reading `rules/ui-design/rule.md`, STOP immediately and read the file first.**

### 2. Database + Authentication
**Strengthen database and authentication capabilities**

**Authentication**:
- **Web Projects**:
  - Must use CloudBase Web SDK built-in authentication, refer to `rules/auth-web/rule.md`
  - Platform development rules: Refer to `rules/web-development/rule.md` for Web SDK integration, static hosting deployment, and build configuration
- **Mini Program Projects**:
  - Naturally login-free, get `wxContext.OPENID` in cloud functions, refer to `rules/auth-wechat/rule.md`
  - Platform development rules: Refer to `rules/miniprogram-development/rule.md` for mini program project structure, WeChat Developer Tools integration, and CloudBase capabilities
- **Node.js Backend**: Refer to `rules/auth-nodejs/rule.md`

**Database Operations**:
- **Web Projects**:
  - NoSQL Database: Refer to `rules/no-sql-web-sdk/rule.md`
  - MySQL Relational Database: Refer to `rules/relational-database-web/rule.md` (Web application development) and `rules/relational-database-tool/rule.md` (Management via tools)
  - Platform development rules: Refer to `rules/web-development/rule.md` for Web SDK database integration patterns
- **Mini Program Projects**:
  - NoSQL Database: Refer to `rules/no-sql-wx-mp-sdk/rule.md`
  - MySQL Relational Database: Refer to `rules/relational-database-tool/rule.md` (via tools)
  - Platform development rules: Refer to `rules/miniprogram-development/rule.md` for mini program database integration and wx.cloud usage

### 3. Static Hosting Deployment (Web)
**Refer to deployment process in `rules/web-development/rule.md`**
- Use CloudBase static hosting after build completion
- Deploy using `uploadFiles` tool
- Remind users that CDN has a few minutes of cache after deployment
- Generate markdown format access links with random queryString

### 4. Backend Deployment (Cloud Functions or CloudRun)
- **Cloud Function Deployment**: Refer to `rules/cloud-functions/rule.md` - Use `getFunctionList` to query, then call `createFunction` or `updateFunctionCode` to deploy. **Important**: Runtime cannot be changed after creation, must select correct runtime initially.
- **CloudRun Deployment**: Refer to `rules/cloudrun-development/rule.md` - Use `manageCloudRun` tool for containerized deployment
- Ensure backend code supports CORS, prepare Dockerfile (for container type)

## Project Overview

This repository is a monorepo containing two main projects:

1. **LeanClaw** (`LeanClaw/`) - A uni-app based cross-platform application for learning content
2. **openclaw101** (`openclaw101/`) - A Next.js 14 documentation site for OpenClaw resources

## Development Commands

### LeanClaw (Main Project)

```bash
cd LeanClaw

# Install dependencies
npm install  # or pnpm install

# Development
npm run dev:h5         # Run H5 web version
npm run dev:mp-weixin  # Run WeChat mini-program

# Build
npm run build:h5         # Build H5 web
npm run build:mp-weixin # Build WeChat mini-program

# Code quality
npm run type-check  # TypeScript type checking
npm run lint        # ESLint with auto-fix
npm run format      # Prettier formatting
npm run alova-gen   # Generate API from Alova config
```

### openclaw101

```bash
cd openclaw101

# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build
```

## Architecture

### LeanClaw

A uni-app + Vue 3 + TypeScript cross-platform application:

- **UI Framework**: wot-design-uni component library
- **State Management**: Pinia
- **HTTP Client**: alova with @alova/adapter-uniapp
- **Routing**: uni-mini-router + @uni-helper/vite-plugin-uni-pages (file-based routing)
- **Styling**: UnoCSS with @uni-helper/unocss-preset-uni
- **Build**: Vite

**Key Directories**:
- `src/api/` - API layer with Alova configuration
- `src/pages/` - Page components (file-based routing)
- `src/components/` - Global reusable components
- `src/store/` - Pinia stores
- `src/layouts/` - Layout templates (default, tabbar)
- `src/composables/` - Vue composables
- `src/utils/` - Utility functions
- `src/data/` - Static data and mock data

**Configuration Files**:
- `pages.config.ts` - Page and tabbar configuration
- `alova.config.ts` - Alova API configuration
- `uno.config.ts` - UnoCSS configuration
- `vite.config.ts` - Vite build configuration

### openclaw101

A Next.js 14 documentation site:

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages

**Key Directories**:
- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/data/` - Static data (resources.ts)

## Key Conventions

1. **LeanClaw uses file-based routing**: Pages are defined in `src/pages/` directory with `index.vue` files
2. **API generation**: Use `npm run alova-gen` to generate typed API methods from configuration
3. **Type definitions**: Auto-generated in `src/auto-import.d.ts` and `src/uni-pages.d.ts`
4. **Global components**: Registered via unplugin-vue-components in vite.config.ts

## 语言规范

本项目所有问答统一使用中文，包括代码注释、文档、提交信息等。
