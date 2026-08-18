import { test, expect } from '../../fixtures/storedemo.fixture';
import { buildNewCustomer } from '../../utils/storedemo/testData';
import { Tags } from '../../constants/testConstants';
import { testConfig } from '../../config/testConfig';

/**
 * End-to-end customer journey: register -> sign in -> search a product ->
 * add to cart -> update quantity -> verify subtotal -> sign out.
 *
 * This is one continuous scenario (each step depends on state built up by
 * the previous one), so it's a single test broken into test.step() blocks
 * rather than several independent tests — the Playwright HTML/trace report
 * still shows a clear step-by-step breakdown of exactly where it failed.
 */
test.describe('TestDino Demo Store - registration to checkout journey', () => {
  test(`new customer can register, buy a product, and sign out ${Tags.REGRESSION} ${Tags.CRITICAL}`, async ({
    page,
    header,
    registerPage,
    storeLoginPage,
    accountPage,
    catalogPage,
    productDetailPage,
    cartDrawer,
  }) => {
    const customer = buildNewCustomer();
    let productName = '';
    let unitPrice = 0;

    await test.step('1. Open https://storedemo.testdino.com', async () => {
      await page.goto('/');
      await expect(page.locator('[data-testid="home-page"]')).toBeVisible();
    });

    await test.step('2. Register a new customer account using a unique email address', async () => {
      await registerPage.goto();
      await registerPage.register(customer);

      // The app redirects to /login rather than auto-signing the user in —
      // registration and sign-in are deliberately verified as two steps.
      // This redirect follows the account-creation API call, which can take
      // noticeably longer than a client-side route change, so it gets the
      // navigation timeout instead of the default 5s expect timeout.
      await expect(page).toHaveURL(/\/login$/, {
        timeout: testConfig.timeout.navigation,
      });
    });

    await test.step('3. Verify that registration/login is successful and that the authenticated user state is visible', async () => {
      await storeLoginPage.login(customer.email, customer.password);
      await expect(page).toHaveURL(/storedemo\.testdino\.com\/?$/);

      // While signed out, this same icon routes to /login (see step 10) —
      // landing on /account here is itself proof of the authenticated state.
      await header.openAccountArea();
      await expect(page).toHaveURL(/\/account$/);
      await expect(accountPage.profileName).toContainText(
        `${customer.firstName} ${customer.lastName}`,
      );
      await expect(accountPage.profileEmail).toContainText(customer.email);
    });

    await test.step('4. Navigate to the product catalog and search for one available product', async () => {
      await catalogPage.goto();
      // Read a real product name from the catalog instead of hardcoding one,
      // so this test keeps working if the store's product data changes.
      productName = await catalogPage.getFirstAvailableProductName();

      await catalogPage.searchFor(productName);
      await expect(catalogPage.resultsCount).toContainText('1');
    });

    await test.step('5. Open the product detail page and capture the product name and unit price from the UI', async () => {
      await catalogPage.openProduct(productName);
      await productDetailPage.waitUntilLoaded();

      await expect(productDetailPage.productName).toHaveText(productName);
      unitPrice = await productDetailPage.getUnitPrice();
      expect(unitPrice).toBeGreaterThan(0);
    });

    await test.step('6. Add the product to the cart and open the cart', async () => {
      await productDetailPage.addToCart();
      await header.openCart();
      await cartDrawer.waitUntilOpen();
    });

    await test.step('7. Verify the product name, unit price, and initial quantity', async () => {
      expect(await cartDrawer.getItemName()).toBe(productName);
      expect(await cartDrawer.getItemUnitPrice()).toBe(unitPrice);
      expect(await cartDrawer.getItemQuantity()).toBe(1);
    });

    await test.step('8. Change the quantity to 2', async () => {
      await cartDrawer.setQuantity(2);
    });

    await test.step('9. Calculate the expected subtotal as Unit Price x 2 and verify it against the cart value', async () => {
      const expectedSubtotal = unitPrice * 2;
      expect(await cartDrawer.getSubtotal()).toBe(expectedSubtotal);
    });

    await test.step('10. Log out and verify that the authenticated session is cleared', async () => {
      // Close the drawer first so its overlay can't intercept the header click.
      await cartDrawer.close();

      await header.openAccountArea();
      await expect(page).toHaveURL(/\/account$/);

      await accountPage.logOut();
      await expect(page).toHaveURL(/\/login$/);
      await expect(storeLoginPage.emailInput).toBeVisible();

      // Stronger proof the session is really cleared: the same header icon
      // that led to /account in step 3 now routes to /login again.
      await header.openAccountArea();
      await expect(page).toHaveURL(/\/login$/);
    });
  });
});
