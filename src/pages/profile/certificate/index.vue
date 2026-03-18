<route lang="json">
{
  "style": {
    "navigationBarTitleText": "我的证书"
  }
}
</route>

<template>
  <view class="min-h-screen bg-gradient-to-b from-ocean-dark to-ocean-light flex flex-col items-center px-4 py-6">
    <!-- 证书卡片 -->
    <view class="w-full max-w-md">
      <!-- 证书背景 -->
      <view class="bg-gradient-to-br from-ocean-dark via-ocean-dark to-ocean-light rounded-3xl p-1 shadow-2xl">
        <view class="bg-white rounded-[22px] p-6 relative overflow-hidden">
          <!-- 装饰元素 -->
          <view class="absolute -right-8 -top-8 w-32 h-32 bg-lobster-orange-10 rounded-full"></view>
          <view class="absolute -left-4 -bottom-4 w-20 h-20 bg-ocean-dark-5 rounded-full"></view>

          <!-- 证书内容 -->
          <view class="relative z-10">
            <!-- 顶部装饰 -->
            <view class="flex justify-center mb-4">
              <view class="w-16 h-16 rounded-full bg-gradient-to-br from-lobster-orange to-lobster-orange-80 flex items-center justify-center shadow-lg">
                <text class="text-3xl">🦞</text>
              </view>
            </view>

            <!-- 标题 -->
            <view class="text-center mb-2">
              <text class="text-2xl font-bold text-ocean-dark">{{ certificate.title }}</text>
            </view>

            <!-- 副标题 -->
            <view class="text-center mb-2">
              <text class="text-sm text-gray-400">{{ certificate.subtitle }}</text>
            </view>

            <!-- 学习进度条 -->
            <view class="mt-3 mb-6 px-4">
              <view class="flex justify-between items-center mb-2">
                <text class="text-xs text-gray-400">学习进度</text>
                <text class="text-xs font-medium text-lobster-orange">{{ Math.round((learningDays / 7) * 100) }}%</text>
              </view>
              <view class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <view
                  class="h-full bg-gradient-to-r from-lobster-orange to-lobster-orange-90 rounded-full transition-all duration-500"
                  :style="{ width: `${(learningDays / 7) * 100}%` }"
                ></view>
              </view>
            </view>

            <!-- 分隔线 -->
            <view class="flex items-center justify-center mb-6">
              <view class="w-16 h-[1px] bg-gradient-to-r from-transparent via-lobster-orange to-transparent"></view>
              <text class="mx-3 text-lobster-orange">✦</text>
              <view class="w-16 h-[1px] bg-gradient-to-r from-transparent via-lobster-orange to-transparent"></view>
            </view>

            <!-- 证书描述 -->
            <view class="text-center mb-6 px-2">
              <text class="text-sm text-gray-500 leading-relaxed">{{ certificate.desc }}</text>
            </view>

            <!-- 颁发信息 -->
            <view class="bg-gray-50 rounded-xl p-4 mb-6">
              <view class="flex justify-between items-center mb-2">
                <text class="text-xs text-gray-400">持有人</text>
                <text class="text-sm font-medium text-gray-700">{{ certificate.holderName }}</text>
              </view>
              <view class="flex justify-between items-center">
                <text class="text-xs text-gray-400">颁发日期</text>
                <text class="text-sm font-medium text-gray-700">{{ certificate.issuedDate }}</text>
              </view>
            </view>

            <!-- 学习统计 -->
            <view class="grid grid-cols-2 gap-3 mb-6">
              <view class="bg-gradient-to-br from-ocean-light-20 to-ocean-light-10 rounded-xl p-3 text-center">
                <text class="text-xl font-bold text-ocean-dark">{{ learningDays }}</text>
                <text class="text-xs text-gray-400 block mt-1">学习天数</text>
              </view>
              <view class="bg-gradient-to-br from-lobster-orange-10 to-lobster-orange-5 rounded-xl p-3 text-center">
                <text class="text-xl font-bold text-lobster-orange">{{ badgeCount }}</text>
                <text class="text-xs text-gray-400 block mt-1">获得徽章</text>
              </view>
            </view>

            <!-- 保存按钮 -->
            <button
              class="w-full h-12 bg-gradient-to-r from-lobster-orange to-lobster-orange-90 rounded-xl text-gray-900 font-medium flex items-center justify-center"
              @click="saveToAlbum"
            >
              <wd-icon name="photo" size="18px" class="mr-2" />
              保存到相册
            </button>
          </view>
        </view>
      </view>

      <!-- 底部提示已移除 -->
    </view>

    <!-- 隐藏的 canvas 用于生成证书图片 -->
    <canvas canvas-id="certificateCanvas" style="width: 300px; height: 420px; position: absolute; left: -9999px;"></canvas>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { getCertificate, getProgress, type LearnProgress } from '@/utils/learnProgress'
import { createCertificate, type Certificate } from '@/data/certificate'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 证书信息 - 使用用户昵称，无昵称时使用默认名称
const certificate = ref<Certificate>(createCertificate(userInfo.value.name || ''))
const progress = ref<LearnProgress>(getProgress())

// 计算学习天数
const learningDays = computed(() => {
  const completedSet = new Set(progress.value.completedLessons || [])
  let count = 0
  for (let i = 1; i <= 7; i++) {
    if (completedSet.has(`day-${i}`)) {
      count++
    }
  }
  return count
})

// 徽章数量
const badgeCount = computed(() => progress.value.badges.length)

// 保存到相册
const saveToAlbum = () => {
  uni.showLoading({ title: '生成中...' })

  const ctx = uni.createCanvasContext('certificateCanvas')

  // 绘制背景
  ctx.setFillStyle('#ffffff')
  ctx.fillRect(0, 0, 300, 420)

  // 绘制装饰圆
  ctx.setFillStyle('rgba(230, 126, 34, 0.1)')
  ctx.beginPath()
  ctx.arc(280, 40, 60, 0, 2 * Math.PI)
  ctx.fill()

  // 绘制标题
  ctx.setFillStyle('#0c2d48')
  ctx.setFontSize(20)
  ctx.setTextAlign('center')
  ctx.fillText(certificate.value.title, 150, 60)

  // 绘制副标题
  ctx.setFillStyle('#999999')
  ctx.setFontSize(12)
  ctx.fillText(certificate.value.subtitle, 150, 85)

  // 绘制分隔线
  ctx.setStrokeStyle('#e67e22')
  ctx.beginPath()
  ctx.moveTo(100, 100)
  ctx.lineTo(200, 100)
  ctx.stroke()

  // 绘制描述
  ctx.setFillStyle('#666666')
  ctx.setFontSize(12)
  const desc = certificate.value.desc
  const descLines = desc.match(/.{1,20}/g) || [desc]
  descLines.forEach((line: string, i: number) => {
    ctx.fillText(line, 150, 130 + i * 18)
  })

  // 绘制持有人信息
  ctx.setFillStyle('#333333')
  ctx.setFontSize(14)
  ctx.textAlign = 'left'
  ctx.fillText(`持有人: ${certificate.value.holderName}`, 40, 200)
  ctx.fillText(`颁发日期: ${certificate.value.issuedDate}`, 40, 230)

  // 绘制统计
  ctx.setFillStyle('#0c2d48')
  ctx.setFontSize(24)
  ctx.textAlign = 'center'
  ctx.fillText(String(learningDays.value), 100, 290)
  ctx.setFillStyle('#666666')
  ctx.setFontSize(10)
  ctx.fillText('学习天数', 100, 310)

  ctx.setFillStyle('#e67e22')
  ctx.setFontSize(24)
  ctx.fillText(String(badgeCount.value), 200, 290)
  ctx.setFillStyle('#666666')
  ctx.setFontSize(10)
  ctx.fillText('获得徽章', 200, 310)

  // 绘制 Logo - 右上角靠近边缘 5% 处
  ctx.setFontSize(30)
  ctx.fillText('🦞', 270, 60)

  ctx.draw(false, () => {
    setTimeout(() => {
      uni.canvasToTempFilePath({
        canvasId: 'certificateCanvas',
        success: (res: { tempFilePath: string }) => {
          const tempFilePath = res.tempFilePath
          uni.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: () => {
              uni.hideLoading()
              uni.showToast({
                title: '已保存到相册',
                icon: 'success',
              })
            },
            fail: (err: { errMsg: string }) => {
              uni.hideLoading()
              if (err.errMsg.includes('auth deny')) {
                uni.showModal({
                  title: '提示',
                  content: '需要授权保存到相册权限',
                  success: (res: { confirm: boolean }) => {
                    if (res.confirm) {
                      uni.openSetting()
                    }
                  }
                })
              } else {
                uni.showToast({
                  title: '保存失败',
                  icon: 'none',
                })
              }
            }
          })
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({
            title: '生成图片失败',
            icon: 'none',
          })
        }
      })
    }, 500)
  })
}

onMounted(() => {
  // 获取证书信息
  const cert = getCertificate()
  if (cert) {
    certificate.value = cert
  }
  // 刷新进度
  progress.value = getProgress()
})
</script>

<style scoped>
.bg-ocean-dark {
  background-color: #0c2d48;
}
.bg-ocean-light {
  background-color: #1a4a6e;
}
.from-ocean-dark {
  --tw-gradient-from: #0c2d48;
}
.to-ocean-light {
  --tw-gradient-to: #1a4a6e;
}
.text-ocean-dark {
  color: #0c2d48;
}
.bg-ocean-light-10 {
  background-color: rgba(26, 74, 110, 0.1);
}
.bg-ocean-light-20 {
  background-color: rgba(26, 74, 110, 0.2);
}
.text-ocean-light {
  color: #1a4a6e;
}

.bg-lobster-orange {
  background-color: #e67e22;
}
.text-lobster-orange {
  color: #e67e22;
}
.from-lobster-orange {
  --tw-gradient-from: #e67e22;
}
.to-lobster-orange-90 {
  --tw-gradient-to: rgba(230, 126, 34, 0.9);
}
.bg-lobster-orange-10 {
  background-color: rgba(230, 126, 34, 0.1);
}
.bg-ocean-dark-5 {
  background-color: rgba(12, 45, 72, 0.05);
}
.to-lobster-orange-80 {
  --tw-gradient-to: rgba(230, 126, 34, 0.8);
}
</style>
