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

      // 创建空的 mock.js 占位符（避免微信开发者工具报错）
      const dataDir = resolve(__dirname, 'dist/build/mp-weixin/data')
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true })
      }
      const mockJsPath = join(dataDir, 'mock.js')
      if (!existsSync(mockJsPath)) {
        require('fs').writeFileSync(mockJsPath, '// mock placeholder\n', 'utf-8')
      }

      // 删除 wot-design-uni 的字体文件（避免阿里云 CDN 无法访问）
      const wdIconWxss = resolve(__dirname, 'dist/build/mp-weixin/node-modules/wot-design-uni/components/wd-icon/wd-icon.wxss')
      if (existsSync(wdIconWxss)) {
        const content = require('fs').readFileSync(wdIconWxss, 'utf-8')
        // 移除字体相关 CSS
        const cleaned = content.replace(/@font-face\{[^}]*\}/g, '')
        require('fs').writeFileSync(wdIconWxss, cleaned, 'utf-8')
        console.log('[copy-resources] Cleaned wd-icon font-face')
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
    }),
  ],
})
