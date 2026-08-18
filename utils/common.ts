/**
 * Small, generic helpers with no dependency on Playwright's `page`. Anything
 * that touches the DOM/browser belongs on a Page Object instead — keep this
 * file reusable from API tests, fixtures, or plain unit tests too.
 */

/** Redacts a secret for safe logging (keeps first/last char only). */
export function maskSecret(value: string): string {
  if (value.length <= 2) return '*'.repeat(value.length);
  return `${value[0]}${'*'.repeat(value.length - 2)}${value[value.length - 1]}`;
}

/** Generates a random alphanumeric string, e.g. for unique test emails/usernames. */
export function randomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** Generates a unique, disposable-looking test email address. */
export function randomEmail(domain = 'example.test'): string {
  return `qa.${randomString(10)}@${domain}`;
}

/** Parses a UI price string like "$1,560" or "$240" into a plain number (1560 / 240). */
export function parseCurrency(text: string): number {
  const numeric = text.replace(/[^0-9.-]+/g, '');
  const value = Number(numeric);
  if (Number.isNaN(value)) {
    throw new Error(`parseCurrency: could not parse a number out of "${text}"`);
  }
  return value;
}

/**
 * Retries an async operation with linear backoff. Intended for flaky
 * *external* calls (e.g. a third-party API), NOT as a substitute for
 * Playwright's built-in auto-waiting on the page.
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delayMs?: number } = {},
): Promise<T> {
  const { retries = 3, delayMs = 500 } = options;
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  throw lastError;
}
