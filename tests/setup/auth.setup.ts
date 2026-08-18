import { test as setup, expect } from '../../fixtures/test.fixture';
import { validUser, hasHerokuCredentials } from '../../utils/testData';

/**
 * Runs once before the other projects (see the `setup` project /
 * `dependencies` wiring in playwright.config.ts) and saves a logged-in
 * session to auth/user.json. Every other test then starts already
 * authenticated instead of repeating the login flow — except login.spec.ts,
 * which explicitly resets storageState since it needs to test login itself.
 */
const authFile = 'auth/user.json';

setup('authenticate', async ({ page, loginPage, homePage }) => {
  setup.skip(
    !hasHerokuCredentials,
    'TEST_USERNAME/TEST_PASSWORD not set — herokuapp login suite is disabled.',
  );

  await loginPage.goto();
  await loginPage.login(validUser.username, validUser.password);

  // Fail fast here (with a clear message) rather than letting every
  // dependent test fail later with a confusing "not logged in" symptom.
  await expect(homePage.heading).toBeVisible();

  await page.context().storageState({ path: authFile });
});
