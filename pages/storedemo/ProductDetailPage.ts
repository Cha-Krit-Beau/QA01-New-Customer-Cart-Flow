import { expect, Locator, Page } from '@playwright/test';
import { parseCurrency } from '../../utils/common';

/** https://storedemo.testdino.com/product/<slug> */
export class ProductDetailPage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.productName = page.locator('[data-testid="product-name"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.addToCartButton = page.locator('[data-testid="add-to-cart-button"]');
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.productName).toBeVisible();
  }

  async getName(): Promise<string> {
    return (await this.productName.textContent())?.trim() ?? '';
  }

  async getUnitPrice(): Promise<number> {
    const text = (await this.productPrice.textContent())?.trim() ?? '';
    return parseCurrency(text);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
