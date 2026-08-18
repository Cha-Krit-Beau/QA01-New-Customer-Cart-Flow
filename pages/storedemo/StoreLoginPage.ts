import { expect, Locator, Page } from '@playwright/test';
import { StoreRoutes } from '../../constants/storedemo/routes';

/**
 * https://storedemo.testdino.com/login
 * Named `StoreLoginPage` (rather than `LoginPage`) to avoid any ambiguity
 * with pages/LoginPage.ts, which drives an entirely different application
 * (the-internet.herokuapp.com) used by the framework's own reference tests.
 */
export class StoreLoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly signUpLink: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.locator('[data-testid="login-email-input"]');
    this.passwordInput = page.locator('[data-testid="login-password-input"]');
    this.submitButton = page.locator('[data-testid="login-submit-button"]');
    this.signUpLink = page.locator('[data-testid="login-signup-link"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(StoreRoutes.LOGIN);
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
