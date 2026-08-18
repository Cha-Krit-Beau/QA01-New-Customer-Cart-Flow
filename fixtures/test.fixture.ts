import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { UserPage } from '../pages/UserPage';
import { ApiClient } from '../utils/apiClient';
import { UserApi } from '../api/user.api';

interface Fixtures {
  loginPage: LoginPage;
  homePage: HomePage;
  userPage: UserPage;
  apiClient: ApiClient;
  userApi: UserApi;
}

/**
 * Custom fixture: every spec imports `test`/`expect` from here (not
 * directly from @playwright/test) so Page Objects and API clients are
 * ready to use without each spec constructing them by hand.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  userPage: async ({ page }, use) => {
    await use(new UserPage(page));
  },

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  userApi: async ({ apiClient }, use) => {
    await use(new UserApi(apiClient));
  },
});

export { expect };
