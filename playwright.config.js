const { defineConfig, devices } = require('@playwright/test');
const { loadConfig } = require('./src/config/loadConfig');

const config = loadConfig();

const projects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } }
];

module.exports = defineConfig({
  testDir: './tests',
  testIgnore: '**/unit/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : config.retries,
  workers: process.env.CI ? 1 : config.workers,
  timeout: config.timeout,
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/test-results.xml' }]
  ],
  use: {
    baseURL: config.baseUrl,
    headless: config.headless,
    trace: config.trace,
    screenshot: config.screenshot,
    video: config.video
  },
  webServer: {
    command: 'node demo/server.js',
    url: config.baseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  },
  projects: process.env.BROWSER
    ? projects.filter((project) => project.name === config.browser)
    : projects
});
