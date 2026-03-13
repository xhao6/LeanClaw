import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// 构建完成后复制 resources 目录
function copyResources() {
  return {
    name: 'copy-resources',
    closeBundle() {
      const resourcesSrc = resolve(__dirname, 'static/images/resources')
      const resourcesDest = resolve(__dirname, 'dist/build/mp-weixin/static/images/resources')

      if (existsSync(resourcesSrc)) {
        if (!existsSync(resourcesDest)) {
          mkdirSync(resourcesDest, { recursive: true })
        }
        const files = readdirSync(resourcesSrc)
        for (const file of files) {
          const srcFile = join(resourcesSrc, file)
          const destFile = join(resourcesDest, file)
          if (statSync(srcFile).isFile()) {
            copyFileSync(srcFile, destFile)
          }
        }
        console.log(`[copy-resources] Copied ${files.length} resources`)
      }

      // 复制 content/processed 目录（WebView 静态托管资源）
      const processedSrc = resolve(__dirname, 'content/processed')
      const processedDest = resolve(__dirname, 'dist/build/mp-weixin/static/content/processed')

      if (existsSync(processedSrc)) {
        if (!existsSync(processedDest)) {
          mkdirSync(processedDest, { recursive: true })
        }
        const files = readdirSync(processedSrc)
        let copiedCount = 0
        for (const file of files) {
          const srcFile = join(processedSrc, file)
          const destFile = join(processedDest, file)
          if (statSync(srcFile).isFile()) {
            copyFileSync(srcFile, destFile)
            copiedCount++
          }
        }
        console.log(`[copy-resources] Copied ${copiedCount} processed HTML files`)
      }

      // 创建空的 mock.js 占位符（避免微信开发者工具报错）
      const dataDir = resolve(__dirname, 'dist/build/mp-weixin/data')
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true })
      }
      const mockJsPath = join(dataDir, 'mock.js')
      if (!existsSync(mockJsPath)) {
        require('fs').writeFileSync(mockJsPath, '// mock placeholder\n', 'utf-8')
      }

      // 恢复 wot-design-uni 的 wd-icon.wxss，但删除 CDN 字体链接（已用 base64 替代）
      const destWdIconWxss = resolve(__dirname, 'dist/build/mp-weixin/node-modules/wot-design-uni/components/wd-icon/wd-icon.wxss')
      if (existsSync(destWdIconWxss)) {
        let content = require('fs').readFileSync(destWdIconWxss, 'utf-8')
        // 删除 @font-face 块（包括压缩后的单行格式）
        // 匹配 @font-face{...}，其中 {...} 可能包含 url(...) 和其他内容
        content = content.replace(/@font-face\{[^}]+\}/g, '')
        require('fs').writeFileSync(destWdIconWxss, content, 'utf-8')
        console.log('[copy-resources] Cleaned wd-icon.wxss (CDN font-face removed)')
      }

      console.log('[copy-resources] Done!')
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  assetsInclude: ['**/*.md'],
  plugins: [
    // UniPages({
    //   dts: 'src/uni-pages.d.ts',
    // }),
    UniLayouts(),
    uni(),
    UnoCSS(),
    copyResources(),
    AutoImport({
      imports: [
        'vue',
        'uni-app',
        'pinia',
        {
          'uni-mini-router': ['useRouter', 'useRoute'],
        },
      ],
      dts: 'src/auto-import.d.ts',
    }),
    Components({
      dts: 'src/components.d.ts',
      // 指定本地组件目录
      dirs: ['src/components'],
    }),
  ],
})
