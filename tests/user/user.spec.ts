import { test, expect } from '../../fixtures/test.fixture';
import { Tags } from '../../constants/testConstants';

test.describe('User listing (Dynamic Content page)', () => {
  test.beforeEach(async ({ userPage }) => {
    await userPage.goto();
  });

  test(`should display at least one content row ${Tags.REGRESSION}`, async ({ userPage }) => {
    const rowCount = await userPage.getRowCount();

    expect(rowCount).toBeGreaterThan(0);
  });

  test(`each row should contain non-empty text ${Tags.REGRESSION}`, async ({ userPage }) => {
    const rowCount = await userPage.getRowCount();

    for (let i = 0; i < rowCount; i++) {
      const text = await userPage.getRowText(i);
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test(`content should still render valid rows after a reload ${Tags.REGRESSION}`, async ({
    userPage,
    page,
  }) => {
    // This page renders random text/images per request, so asserting an
    // exact value (or that it differs from a previous load) would be
    // flaky — instead verify the row structure remains valid after reload.
    await page.reload();

    const rowCount = await userPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    const text = await userPage.getRowText(0);
    expect(text.length).toBeGreaterThan(0);
  });
});
