import { Locator, Page } from '@playwright/test';
import { Routes } from '../constants/testConstants';

/**
 * https://the-internet.herokuapp.com/secure
 * The page a user lands on after a successful login ("Secure Area" /
 * dashboard equivalent for this demo site).
 */
export class HomePage {
  readonly heading: Locator;
  readonly flashMessage: Locator;
  readonly logoutButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Secure Area', exact: true });
    this.flashMessage = page.locator('#flash');
    this.logoutButton = page.getByRole('link', { name: /Logout/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.SECURE_AREA);
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
