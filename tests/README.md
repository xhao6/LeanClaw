# LeanClaw 小程序自动化测试

基于 miniprogram-automator 的微信小程序自动化测试。

## 环境要求

- Node.js ≥ 8.0
- 微信开发者工具 ≥ 1.02.1907232
- 小程序基础库 ≥ 2.7.3

## 快速开始

### 1. 配置开发者工具

1. 打开微信开发者工具
2. 设置 → 安全设置 → 开启 **CLI/HTTP 调用功能**

### 2. 配置工具路径

在 `jest.config.js` 或环境变量中配置开发者工具路径：

```javascript
// jest.config.js
module.exports = {
  // ...
}
```

或设置环境变量：
```bash
# Windows
set WECHAT_CLI_PATH=C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat

# Mac
export WECHAT_CLI_PATH=/Applications/wechatwebdevtools.app/Contents/MacOS/cli
```

### 3. 构建小程序

```bash
npm run build:mp-weixin
```

### 4. 运行测试

```bash
# 运行所有测试
npm run test:mp

# 或直接使用 jest
npx jest --config jest.config.js
```

## 测试用例说明

### 首页测试 (index.spec.js)

| 测试名称 | 说明 |
|---------|------|
| 首页应该正常加载 | 验证页面路径正确 |
| 首页应该包含 Logo 区域 | 验证 Logo 文本存在 |
| 页面应该包含必要的数据结构 | 验证页面数据可获取 |
| 页面应该可以滚动 | 验证滚动功能 |

### 页面跳转测试

| 测试名称 | 说明 |
|---------|------|
| 应该可以跳转到发现页面 | 测试页面跳转功能 |
| 应该可以跳转到技能详情页 | 测试带参数跳转 |

## 添加新测试

在 `tests/` 目录下创建 `.spec.js` 文件：

```javascript
const automator = require('miniprogram-automator')

describe('测试描述', () => {
  let miniProgram, page

  beforeAll(async () => {
    miniProgram = await automator.launch({
      cliPath: 'path/to/cli',
      projectPath: 'path/to/project',
    })
    page = await miniProgram.reLaunch('/pages/your-page/index')
    await page.waitFor(500)
  })

  afterAll(async () => {
    await miniProgram.close()
  })

  test('测试用例', async () => {
    // 查找元素
    const element = await page.$('.your-class')

    // 点击元素
    await element.tap()

    // 验证结果
    expect(element).not.toBeNull()
  })
})
```

## 常用 API

### 页面操作
```javascript
// 跳转页面
await miniProgram.reLaunch('/pages/index/index')
await miniProgram.switchTab('/pages/index/index')

// 获取当前页面
const currentPage = await miniProgram.currentPage()

// 获取页面数据
const data = await page.data()
```

### 元素操作
```javascript
// 查找元素
await page.$('.class')           // 单个
await page.$$('.class')          // 多个

// 元素属性
await element.attribute('class')
await element.text()

// 元素操作
await element.tap()
await element.longPress()
await element.input('text')
```

### 等待
```javascript
await page.waitFor(500)          // 等待毫秒
await page.waitForSelector('.class')  // 等待元素出现
```

## CI/CD 集成

可在 GitHub Actions 中运行：

```yaml
name: Mini Program Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:mp-weixin
      - run: npm run test:mp
        env:
          WECHAT_CLI_PATH: ${{ secrets.WECHAT_CLI_PATH }}
```

## 注意事项

1. 测试必须在微信开发者工具运行环境下执行
2. 每次测试前确保小程序已正确构建
3. 元素定位建议使用稳定的 id 或完整 XPath
4. 使用 waitFor 等待页面渲染完成
