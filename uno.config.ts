import { defineConfig, presetIcons, presetTypography, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [
    presetUni(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: '#1E3A5F', // 深海蓝
      orange: '#FF6B35',  // 龙虾橙
    },
  },
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-col-center': 'flex flex-col items-center justify-center',
    
    // Typography Shortcuts
    'text-h1': 'text-xl font-bold text-primary',       // 页面大标题 (20px)
    'text-h2': 'text-base font-bold text-gray-900',    // 卡片/列表标题 (16px)
    'text-body': 'text-sm text-gray-600 leading-relaxed', // 正文描述 (14px)
    'text-caption': 'text-xs text-gray-400',           // 辅助文字 (12px)
  },
})
