import { Locator, Page } from '@playwright/test';

/**
 * The header (logo, nav, wishlist/cart/account icons) appears on every page
 * of the store, so it's a shared component rather than duplicated per Page
 * Object. `userIcon` routes to /login when signed out and /account when
 * signed in — that difference is what the tests use to prove auth state.
 */
export class HeaderComponent {
  readonly userIcon: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.userIcon = page.locator('[data-testid="header-user-icon"]');
    this.cartIcon = page.locator('[data-testid="header-cart-icon"]');
  }

  /** Signed out: goes to /login. Signed in: goes to /account. */
  async openAccountArea(): Promise<void> {
    await this.userIcon.click();
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
  }
}
