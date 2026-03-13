import type { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  // Demo模式
  if (process.env.DEMO === 'true') {
    // 打印提示消息
    const msg = `
╔════════════════════════════════════════════════════════════╗
║                    🎬 测试执行完成！                          ║
╠════════════════════════════════════════════════════════════╣
║  浏览器已打开并保持在屏幕上                                   ║
║  您可以自由浏览页面内容                                       ║
║                                                            ║
║  关闭浏览器窗口后进程会自动退出                               ║
╚════════════════════════════════════════════════════════════╝
`
    console.log(msg)
  }
}

export default globalTeardown
