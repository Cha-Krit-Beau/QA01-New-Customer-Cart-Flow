import { test, expect } from '../../fixtures/test.fixture';
import { validUser } from '../../utils/testData';
import { Tags } from '../../constants/testConstants';

/**
 * Fast, high-value checks that the environment under test is up and the
 * critical path (auth) works end to end. Run with: npm run test:smoke
 *
 * These log in explicitly rather than relying on the project-level
 * storageState (see tests/setup/auth.setup.ts) — this demo target's session
 * is short-lived (see README "Authentication / Session Reuse"), so a smoke
 * check needs to be independent of how much time has passed since setup ran.
 */
test.describe('Smoke', () => {
  test(`login page should load ${Tags.SMOKE} ${Tags.CRITICAL}`, async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test(`valid user can log in and reach the secure area ${Tags.SMOKE} ${Tags.CRITICAL}`, async ({
    loginPage,
    homePage,
  }) => {
    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);

    await expect(homePage.heading).toBeVisible();
    await expect(homePage.logoutButton).toBeVisible();
  });

  test(`dynamic content page should load ${Tags.SMOKE}`, async ({ userPage }) => {
    await userPage.goto();

    expect(await userPage.getRowCount()).toBeGreaterThan(0);
  });
});
