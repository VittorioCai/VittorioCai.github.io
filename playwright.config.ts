import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    env: { ASTRO_DEV_BACKGROUND: '1' },
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});
