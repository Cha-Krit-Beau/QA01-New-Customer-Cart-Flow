import { expect, Locator, Page } from '@playwright/test';
import { parseCurrency } from '../../utils/common';

/** The slide-out cart drawer, opened via HeaderComponent.openCart(). */
export class CartDrawerPage {
  readonly drawer: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantity: Locator;
  readonly increaseQuantityButton: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly subtotalValue: Locator;
  readonly totalValue: Locator;
  readonly checkoutButton: Locator;
  readonly viewCartButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.drawer = page.locator('[data-testid="cart-drawer"]');
    this.closeButton = page.locator('[data-testid="close-cart"]');
    this.itemName = page.locator('[data-testid="cart-item-header"]');
    this.itemPrice = page.locator('[data-testid="item-price"]');
    this.itemQuantity = page.locator('[data-testid="item-quantity"]');
    this.increaseQuantityButton = page.locator('[data-testid="increase-quantity"]');
    this.decreaseQuantityButton = page.locator('[data-testid="decrease-quantity"]');
    this.subtotalValue = page.locator('[data-testid="subtotal-value"]');
    this.totalValue = page.locator('[data-testid="total-value"]');
    this.checkoutButton = page.locator('[data-testid="checkout-button"]');
    this.viewCartButton = page.locator('[data-testid="view-cart-button"]');
  }

  async waitUntilOpen(): Promise<void> {
    await expect(this.drawer).toBeVisible();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    // The drawer slides off-screen via a CSS transform rather than being
    // removed/display:none'd, so toBeHidden() wouldn't detect the close —
    // the subsequent header click's own actionability check (Playwright
    // waits for it to be unobscured) is what actually proves it's out of
    // the way.
  }

  async getItemName(): Promise<string> {
    return (await this.itemName.first().textContent())?.trim() ?? '';
  }

  async getItemUnitPrice(): Promise<number> {
    const text = (await this.itemPrice.first().textContent())?.trim() ?? '';
    return parseCurrency(text);
  }

  async getItemQuantity(): Promise<number> {
    const text = (await this.itemQuantity.first().textContent())?.trim() ?? '';
    return Number(text);
  }

  async getSubtotal(): Promise<number> {
    const text = (await this.subtotalValue.textContent())?.trim() ?? '';
    return parseCurrency(text);
  }

  async increaseQuantity(): Promise<void> {
    await this.increaseQuantityButton.first().click();
  }

  async setQuantity(target: number): Promise<void> {
    const current = await this.getItemQuantity();
    for (let i = current; i < target; i++) {
      await this.increaseQuantity();
    }
    await expect(this.itemQuantity.first()).toHaveText(String(target));
  }
}
