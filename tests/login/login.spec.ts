import { test, expect } from '../../fixtures/test.fixture';
import { validUser, hasHerokuCredentials } from '../../utils/testData';
import { Messages, Tags } from '../../constants/testConstants';
import { negativeLoginCases } from './login.data';

test.describe('Login', () => {
  // The other projects reuse a logged-in storageState (see auth.setup.ts),
  // but a login-flow test must start unauthenticated regardless of that.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.skip(
    !hasHerokuCredentials,
    'TEST_USERNAME/TEST_PASSWORD not set — herokuapp login suite is disabled.',
  );

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(`should allow valid user to login successfully ${Tags.SMOKE} ${Tags.CRITICAL}`, async ({
    loginPage,
    homePage,
  }) => {
    await loginPage.login(validUser.username, validUser.password);

    await expect(homePage.heading).toBeVisible();
    await expect(homePage.flashMessage).toContainText(Messages.LOGIN_SUCCESS);
  });

  for (const scenario of negativeLoginCases) {
    test(`should reject login with ${scenario.name} ${Tags.REGRESSION}`, async ({
      page,
      loginPage,
    }) => {
      await loginPage.login(scenario.username, scenario.password);

      await expect(loginPage.flashMessage).toContainText(scenario.expectedMessage);
      await expect(page).toHaveURL(/\/login$/);
    });
  }

  test(`password field should not display password as plain text ${Tags.REGRESSION} ${Tags.SANITY}`, async ({
    loginPage,
  }) => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Login - session handling', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test(`unauthenticated user should not access the secure area directly ${Tags.REGRESSION} ${Tags.CRITICAL}`, async ({
    page,
  }) => {
    await page.goto('/secure');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('#flash')).toContainText(Messages.LOGIN_REQUIRED);
  });

  test(`user should be logged out after clicking logout ${Tags.REGRESSION}`, async ({
    loginPage,
    homePage,
  }) => {
    test.skip(
      !hasHerokuCredentials,
      'TEST_USERNAME/TEST_PASSWORD not set — herokuapp login suite is disabled.',
    );

    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);
    await expect(homePage.heading).toBeVisible();

    await homePage.logout();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.flashMessage).toContainText(Messages.LOGOUT_SUCCESS);
  });
});
