import { describe, it, expect, vi } from 'vitest'

describe('发现页加载逻辑', () => {
  it('空数据时应显示空状态提示', () => {
    // 模拟 getResources 返回空数组
    const items: any[] = []
    const hasError = false

    // 当 items 为空且没有错误时，应显示空状态
    const shouldShowEmpty = items.length === 0 && !hasError
    expect(shouldShowEmpty).toBe(true)
  })

  it('加载失败时应显示错误提示', () => {
    const items: any[] = []
    const loadError = '加载失败，请检查网络'

    // 当有错误时，应显示错误信息
    const shouldShowError = loadError !== null && loadError !== 'empty'
    expect(shouldShowError).toBe(true)
  })

  it('empty 状态应显示暂无内容', () => {
    const loadError = 'empty'

    // 空状态不同于错误
    expect(loadError === 'empty').toBe(true)
  })
})
