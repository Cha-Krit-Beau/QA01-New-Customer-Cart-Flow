import { expect, Locator, Page } from '@playwright/test';
import { StoreRoutes } from '../../constants/storedemo/routes';

/** https://storedemo.testdino.com/products */
export class ProductCatalogPage {
  readonly searchInput: Locator;
  readonly resultsCount: Locator;
  readonly productCardNames: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.locator('[data-testid="all-products-search-input"]');
    this.resultsCount = page.locator('[data-testid="all-products-results-count"]');
    this.productCardNames = page.locator('[data-testid="all-products-header"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(StoreRoutes.PRODUCTS);
    await expect(this.productCardNames.first()).toBeVisible();
  }

  /** Returns the name of the first product currently listed (no filter applied). */
  async getFirstAvailableProductName(): Promise<string> {
    return (await this.productCardNames.first().textContent())?.trim() ?? '';
  }

  /** Filters the catalog (client-side, live) down to products matching `term`. */
  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    // The result grid re-renders as you type — wait for it to settle on a
    // product card matching the search term rather than a fixed delay.
    await expect(this.page.getByRole('link', { name: term }).first()).toBeVisible();
  }

  async openProduct(productName: string): Promise<void> {
    await this.page.getByRole('link', { name: productName }).first().click();
  }
}
