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
