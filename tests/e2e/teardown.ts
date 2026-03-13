import type { TeardownFixtures } from '@playwright/test'

export const teardown: TeardownFixtures = async ({ }, run) => {
  await run()

  // Demo模式：测试结束后等待5秒再关闭浏览器
  if (process.env.DEMO === 'true') {
    console.log('\n\n⏳ 测试完成，5秒后关闭浏览器...\n')
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
}
