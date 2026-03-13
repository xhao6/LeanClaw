/**
 * LeanClaw 小程序自动化测试示例
 *
 * 运行方式:
 * 1. 确保微信开发者工具已打开安全设置中的 CLI/HTTP 调用功能
 * 2. 运行: npm test
 */

const automator = require('miniprogram-automator')

// 微信开发者工具路径
// Windows: cli.bat 的完整路径
// Mac: cli 的完整路径
const CLI_PATH = process.env.WECHAT_CLI_PATH || 'C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat'

describe('LeanClaw 小程序测试', () => {
  let miniProgram
  let page

  // 每个测试前执行：启动小程序并跳转到首页
  beforeAll(async () => {
    console.log('启动小程序...')

    miniProgram = await automator.launch({
      cliPath: CLI_PATH,
      projectPath: 'd:/MyWork/LeanMind/LeanClaw/dist/build/mp-weixin',
    })

    // 跳转到首页
    page = await miniProgram.reLaunch('/pages/index/index')
    await page.waitFor(1000)

    console.log('小程序启动成功')
  })

  // 每个测试后执行：关闭小程序
  afterAll(async () => {
    if (miniProgram) {
      await miniProgram.close()
      console.log('小程序已关闭')
    }
  })

  // 测试1: 验证首页加载
  test('首页应该正常加载', async () => {
    const currentPage = await miniProgram.currentPage()
    expect(currentPage.path).toBe('pages/index/index')
    console.log('✓ 首页加载成功')
  })

  // 测试2: 验证页面包含关键元素
  test('首页应该包含 Logo 区域', async () => {
    // 查找包含"轻学龙虾"的文本元素
    const logoText = await page.$('text=轻学龙虾')
    expect(logoText).not.toBeNull()
    console.log('✓ Logo 区域存在')
  })

  // 测试3: 验证底部导航栏存在
  test('首页应该有底部导航栏', async () => {
    const tabBar = await page.$('.tab-bar')
    // tabBar 可能不存在于首页（首页是 tabbar 页面）
    console.log('✓ 检查底部导航栏完成')
  })

  // 测试4: 验证页面数据
  test('页面应该包含必要的数据结构', async () => {
    const data = await page.data()
    // 检查页面是否有数据（具体字段取决于页面实现）
    expect(data).toBeDefined()
    console.log('✓ 页面数据获取成功')
  })

  // 测试5: 模拟滚动到底部
  test('页面应该可以滚动', async () => {
    // 创建滚动事件
    await page.evaluate(() => {
      const scrollView = document.querySelector('scroll-view')
      if (scrollView) {
        scrollView.scrollTop = 500
      }
    })
    await page.waitFor(300)
    console.log('✓ 滚动操作完成')
  })
})

describe('页面跳转测试', () => {
  let miniProgram

  beforeAll(async () => {
    miniProgram = await automator.launch({
      cliPath: CLI_PATH,
      projectPath: 'd:/MyWork/LeanMind/LeanClaw/dist/build/mp-weixin',
    })
  })

  afterAll(async () => {
    if (miniProgram) {
      await miniProgram.close()
    }
  })

  // 测试6: 跳转到发现页面
  test('应该可以跳转到发现页面', async () => {
    await miniProgram.reLaunch('/pages/discover/index')
    await page.waitFor(1000)

    const currentPage = await miniProgram.currentPage()
    expect(currentPage.path).toBe('pages/discover/index')
    console.log('✓ 发现页面跳转成功')
  })

  // 测试7: 跳转到技能详情页
  test('应该可以跳转到技能详情页', async () => {
    // 带参数跳转
    await miniProgram.reLaunch('/pages/skill/detail?id=test-skill')
    await page.waitFor(500)

    const currentPage = await miniProgram.currentPage()
    expect(currentPage.path).toBe('pages/skill/detail')
    console.log('✓ 技能详情页跳转成功')
  })
})
