# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
