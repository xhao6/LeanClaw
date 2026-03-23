import { defineConfig, devices } from '@playwright/test'

const isDemoMode = process.env.DEMO === 'true'

export default defineConfig({
  testDir: './tests/e2e',
  // DEMO模式：串行执行，方便围观
  fullyParallel: !isDemoMode,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // DEMO模式：单worker串行执行
  workers: isDemoMode ? 1 : (process.env.CI ? 1 : undefined),
  // DEMO模式：无限时间（用户手动关闭）
  timeout: isDemoMode ? 0 : 30000,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    // DEMO模式：动作间隔延迟
    actionTimeout: isDemoMode ? 10000 : 5000,
  },

  /* Demo mode options - uncomment to debug with visible browser
  {
    ...devices['Desktop Chrome'],
    launchOptions: {
      devtools: true,
    },
  },
  */

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // DEMO模式：每个动作后延迟500ms
        slowMo: isDemoMode ? 500 : 0,
      },
    },
  ],

  webServer: {
    command: 'npm run dev:h5',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
