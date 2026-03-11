import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    UniPages({
      dts: 'src/uni-pages.d.ts',
    }),
    UniLayouts(),
    uni(),
    UnoCSS(),
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
