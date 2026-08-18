import { defineConfig, devices } from '@playwright/test';
import { environment } from './config/environments';
import { testConfig } from './config/testConfig';

/**
 * See https://playwright.dev/docs/test-configuration.
 * Environment-specific values (baseURL, credentials, ...) live in
 * config/environments.ts, loaded from .env.<TEST_ENV>. Run-behaviour values
 * (timeouts, retries) live in config/testConfig.ts.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? testConfig.retries.ci : testConfig.retries.local,
  workers: process.env.CI ? testConfig.workers.ci : testConfig.workers.local,
  timeout: testConfig.timeout.test,

  expect: {
    timeout: testConfig.timeout.expect,
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL: environment.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: testConfig.timeout.action,
    navigationTimeout: testConfig.timeout.navigation,
  },

  projects: [
    {
      // Logs in once and saves a session to auth/user.json for the other
      // projects to reuse (see tests/setup/auth.setup.ts).
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /storedemo/,
      use: { ...devices['Desktop Chrome'], storageState: 'auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /storedemo/,
      use: { ...devices['Desktop Firefox'], storageState: 'auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /storedemo/,
      use: { ...devices['Desktop Safari'], storageState: 'auth/user.json' },
      dependencies: ['setup'],
    },
    {
      // Separate application under test (TestDino Demo Store) — its own
      // baseURL, no dependency on the the-internet.herokuapp.com auth setup.
      name: 'storedemo',
      testDir: './tests/storedemo',
      use: { ...devices['Desktop Chrome'], baseURL: environment.storedemoBaseURL },
    },
  ],
});
