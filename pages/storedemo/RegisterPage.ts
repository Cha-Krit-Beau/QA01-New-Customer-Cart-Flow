import { expect, Locator, Page } from '@playwright/test';
import { StoreRoutes } from '../../constants/storedemo/routes';

export interface RegistrationDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** https://storedemo.testdino.com/signup */
export class RegisterPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.locator('[data-testid="signup-firstname-input"]');
    this.lastNameInput = page.locator('[data-testid="signup-lastname-input"]');
    this.emailInput = page.locator('[data-testid="signup-email-input"]');
    this.passwordInput = page.locator('[data-testid="signup-password-input"]');
    this.submitButton = page.locator('[data-testid="signup-submit-button"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(StoreRoutes.SIGNUP);
    await expect(this.firstNameInput).toBeVisible();
  }

  async register(details: RegistrationDetails): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.passwordInput.fill(details.password);
    await this.submitButton.click();
  }
}
