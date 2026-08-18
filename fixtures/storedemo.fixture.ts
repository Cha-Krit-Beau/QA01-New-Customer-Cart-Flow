import { test as base, expect } from '@playwright/test';
import { HeaderComponent } from '../pages/storedemo/HeaderComponent';
import { RegisterPage } from '../pages/storedemo/RegisterPage';
import { StoreLoginPage } from '../pages/storedemo/StoreLoginPage';
import { AccountPage } from '../pages/storedemo/AccountPage';
import { ProductCatalogPage } from '../pages/storedemo/ProductCatalogPage';
import { ProductDetailPage } from '../pages/storedemo/ProductDetailPage';
import { CartDrawerPage } from '../pages/storedemo/CartDrawerPage';

interface Fixtures {
  header: HeaderComponent;
  registerPage: RegisterPage;
  storeLoginPage: StoreLoginPage;
  accountPage: AccountPage;
  catalogPage: ProductCatalogPage;
  productDetailPage: ProductDetailPage;
  cartDrawer: CartDrawerPage;
}

/** Custom fixture for the TestDino Demo Store scenario (tests/storedemo). */
export const test = base.extend<Fixtures>({
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  storeLoginPage: async ({ page }, use) => {
    await use(new StoreLoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new ProductCatalogPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartDrawer: async ({ page }, use) => {
    await use(new CartDrawerPage(page));
  },
});

export { expect };
