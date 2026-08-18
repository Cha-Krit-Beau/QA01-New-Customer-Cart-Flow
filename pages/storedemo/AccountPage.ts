import { Locator, Page } from '@playwright/test';

/**
 * https://storedemo.testdino.com/account
 * Only reachable while authenticated — an unauthenticated user clicking the
 * same header icon lands on /login instead, which is what the tests rely on
 * to prove sign-in/sign-out actually changed auth state.
 */
export class AccountPage {
  readonly profileName: Locator;
  readonly profileEmail: Locator;
  readonly logOutMenuItem: Locator;

  constructor(page: Page) {
    this.profileName = page.locator('[data-testid="user-profile-name"]');
    this.profileEmail = page.locator('[data-testid="user-profile-email-value"]');
    // "Log Out" shares a generic `menu-item-label` testid with the other
    // account nav entries (My Profile, My Orders, Addresses), so it's
    // targeted by its visible text instead.
    this.logOutMenuItem = page.getByText('Log Out', { exact: true });
  }

  async logOut(): Promise<void> {
    await this.logOutMenuItem.click();
  }
}
