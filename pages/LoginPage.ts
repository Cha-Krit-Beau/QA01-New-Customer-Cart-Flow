import { expect, Locator, Page } from '@playwright/test';
import { Routes } from '../constants/testConstants';

/**
 * https://the-internet.herokuapp.com/login
 * Page Object only knows *how* to drive the login form — assertions about
 * what a given scenario should result in belong in the spec file.
 */
export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.flashMessage = page.locator('#flash');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.LOGIN);
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getFlashMessageText(): Promise<string> {
    return (await this.flashMessage.textContent())?.trim() ?? '';
  }
}
