import { Locator, Page } from '@playwright/test';
import { Routes } from '../constants/testConstants';

/**
 * https://the-internet.herokuapp.com/dynamic_content
 *
 * The public demo site has no real user-management screen, so this page
 * object targets its "Dynamic Content" page (a list of avatar + text rows)
 * as a stand-in for a typical Users/records listing page — the same POM
 * pattern (row locator + per-row accessors) applies to a real user list.
 *
 * Note: the page's markup reuses `id="content"` on two different elements
 * (a real bug in the site itself), so `#content` is not a reliable scope —
 * this instead anchors on the unique class combination of the inner
 * container that actually wraps the repeating rows.
 */
export class UserPage {
  private readonly container: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.container = page.locator('.large-10.columns.large-centered');
    this.rows = this.container.locator('> .row');
  }

  async goto(): Promise<void> {
    await this.page.goto(Routes.DYNAMIC_CONTENT);
  }

  async getRowCount(): Promise<number> {
    return this.rows.count();
  }

  async getRowText(index: number): Promise<string> {
    return (await this.rows.nth(index).locator('.large-10.columns').textContent())?.trim() ?? '';
  }
}
