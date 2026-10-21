import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', testMatch: '08-store-live-qa.spec.ts', workers: 1, retries: 0,
  timeout: 45000, expect: { timeout: 8000 },
  outputDir: '/tmp/opencode/store-live-results',
  reporter: [['list'], ['html', { outputFolder: '/tmp/opencode/store-live-report', open: 'never' }]],
  use: { trace: 'on', screenshot: 'only-on-failure', launchOptions: {
    executablePath: '/usr/bin/microsoft-edge-stable', args: ['--no-sandbox', '--disable-dev-shm-usage']
  } }
});
