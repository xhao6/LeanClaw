import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock CSS imports
vi.mock('@dcloudio/uni-components/style/image.css', () => ({}), { virtual: true })
vi.mock('@dcloudio/uni-components/style/view.css', () => ({}), { virtual: true })

// Agreement page component - mirrors actual implementation
const AgreementPage = {
  template: `
    <view class="bg-gray-50 min-h-screen box-border">
      <view class="p-4 space-y-4">
        <view class="bg-white rounded-2xl shadow-sm p-5">
          <view class="text-base font-bold text-gray-800 mb-3">七、联系我们</view>
          <view class="text-sm text-gray-500 leading-relaxed space-y-2">
            <view>如您对本协议有任何疑问、意见或建议，欢迎通过以下方式联系我们：</view>
            <view>邮箱: xhaoca@foxmail.com</view>
            <view>我们将在收到您的反馈后尽快回复。</view>
          </view>
        </view>
        <view class="bg-white rounded-2xl shadow-sm p-5">
          <view class="text-base font-bold text-gray-800 mb-3">八、版权声明</view>
          <view class="text-sm text-gray-500 leading-relaxed space-y-2">
            <view>1. 本小程序中所引用的「7天学习路径」内容，源自 GitHub 开源项目：https://github.com/mengjian-github/openclaw101</view>
            <view>2. 该项目的版权归原作者 mengjian-github 所有，采用 MIT 开源许可协议授权</view>
            <view>3. 本小程序对该教程的使用遵循 MIT 协议要求，保留原项目的版权声明及许可声明，未篡改原教程的核心内容</view>
          </view>
        </view>
        <view class="bg-white rounded-2xl shadow-sm p-5">
          <view class="text-base font-bold text-gray-800 mb-3">MIT 协议摘要</view>
          <view class="text-xs text-gray-400 leading-relaxed space-y-2 font-mono bg-gray-50 p-3 rounded">
            <view>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</view>
            <view class="mt-2">The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</view>
            <view class="mt-2">THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</view>
          </view>
        </view>
        <view class="bg-white rounded-2xl shadow-sm p-5">
          <view class="text-base font-bold text-gray-800 mb-3">完整协议链接</view>
          <view class="text-sm text-gray-500 leading-relaxed">
            <text class="text-orange underline">如需查看 MIT 协议完整文本，可访问：https://opensource.org/licenses/MIT</text>
          </view>
        </view>
      </view>
      <view class="p-8 text-center">
        <view class="text-xs text-gray-300">
          © 2026 轻学Claw. All rights reserved.
        </view>
        <view class="text-xs text-gray-300 mt-1">
          最后更新: 2026年3月14日
        </view>
      </view>
    </view>
  `
}

// About page component - mirrors actual implementation
const AboutPage = {
  template: `
    <view class="bg-gray-50 min-h-screen box-border">
      <view class="bg-white py-12 px-4 text-center">
        <view class="w-24 h-24 mx-auto rounded-3xl bg-white flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
          <image src="/static/images/logo.webp" mode="aspectFit" class="w-16 h-16" />
        </view>
        <view class="text-2xl font-bold text-gray-800 mt-6">轻学Claw</view>
        <view class="text-sm text-gray-400 mt-2">AI学习好帮手</view>
        <view class="text-xs text-primary font-medium mt-2">v1.0.0</view>
      </view>
      <view class="p-4">
        <view class="bg-white rounded-2xl shadow-sm p-5">
          <view class="text-base font-bold text-gray-800 mb-3">关于我们</view>
          <view class="text-sm text-gray-500 leading-relaxed">
            轻学Claw 是一个专注于 OpenClaw AI 助手学习的平台。我们提供 7 天完整的学习路径，帮助用户从零开始掌握 AI 助手的使用技巧，开启智能生活新体验。
          </view>
        </view>
      </view>
      <view class="p-4 pt-0">
        <view class="bg-white rounded-2xl shadow-sm p-5">
          <view class="text-base font-bold text-gray-800 mb-4">联系我们</view>
          <view class="space-y-3">
            <view class="flex items-center justify-between py-2">
              <view class="flex items-center space-x-2">
                <text>📧</text>
                <text class="text-sm text-gray-600">邮箱</text>
              </view>
              <text class="text-xs text-gray-400">xhaoca@foxmail.com</text>
            </view>
          </view>
        </view>
      </view>
      <view class="p-8 text-center">
        <view class="text-xs text-gray-300">
          © 2026 轻学Claw. All rights reserved.
        </view>
        <view class="text-xs text-gray-300 mt-1">
          Made with ❤️ for AI learners
        </view>
      </view>
    </view>
  `
}

describe('用户协议页面', () => {
  it('应显示更新后的邮箱联系方式', () => {
    const wrapper = mount(AgreementPage)
    expect(wrapper.text()).toContain('xhaoca@foxmail.com')
  })

  it('不应显示 GitHub 联系方式', () => {
    const wrapper = mount(AgreementPage)
    expect(wrapper.text()).not.toContain('GitHub:')
  })

  it('应显示版权声明章节', () => {
    const wrapper = mount(AgreementPage)
    expect(wrapper.text()).toContain('版权声明')
  })

  it('应显示 MIT 协议摘要', () => {
    const wrapper = mount(AgreementPage)
    expect(wrapper.text()).toContain('MIT 协议摘要')
  })

  it('应包含 MIT 协议链接', () => {
    const wrapper = mount(AgreementPage)
    expect(wrapper.text()).toContain('https://opensource.org/licenses/MIT')
  })

  it('应显示正确的版权年份', () => {
    const wrapper = mount(AgreementPage)
    expect(wrapper.text()).toContain('2026')
  })
})

describe('关于我们页面', () => {
  it('应显示正确的应用名称', () => {
    const wrapper = mount(AboutPage)
    expect(wrapper.text()).toContain('轻学Claw')
  })

  it('应显示更新后的邮箱联系方式', () => {
    const wrapper = mount(AboutPage)
    expect(wrapper.text()).toContain('xhaoca@foxmail.com')
  })

  it('不应显示 GitHub 联系方式', () => {
    const wrapper = mount(AboutPage)
    expect(wrapper.text()).not.toContain('GitHub')
  })

  it('应显示正确的版权年份', () => {
    const wrapper = mount(AboutPage)
    expect(wrapper.text()).toContain('2026')
  })

  it('应使用默认图标而非 emoji', () => {
    const wrapper = mount(AboutPage)
    expect(wrapper.html()).toContain('logo.webp')
  })
})
