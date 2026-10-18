import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  expect: {
    timeout: 8000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    actionTimeout: 10000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    launchOptions: {
      executablePath: '/usr/bin/microsoft-edge-stable',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    },
  },
  webServer: [
    {
      command: 'npm run dev:store',
      url: 'http://localhost:3000/',
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: 'npm run dev:admin',
      url: 'http://localhost:3001/admin/',
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
});
