import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL: 'http://localhost:5173', viewport: { width: 1440, height: 1000 }, headless: true },
  webServer: { command: 'npm run dev -- --host 0.0.0.0', url: 'http://localhost:5173', reuseExistingServer: true, timeout: 30_000 },
});