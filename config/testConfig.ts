/**
 * Test-run behaviour that is independent of *which* environment (dev/sit/uat/
 * prod) is under test — timeouts, retry policy, parallelism. Keeping this
 * separate from environments.ts means "how the run behaves" and "what it
 * points at" can change independently.
 */
export const testConfig = {
  timeout: {
    /** Overall timeout per test. */
    test: 30_000,
    /** Default timeout for `expect(...)` assertions. */
    expect: 5_000,
    /** Default timeout for actions (click, fill, ...). */
    action: 10_000,
    /** Default timeout for navigations (goto, waitForURL, ...). */
    navigation: 15_000,
  },
  retries: {
    ci: 2,
    local: 0,
  },
  workers: {
    ci: 1,
    // undefined -> Playwright picks a sensible default based on CPU count.
    local: undefined as number | undefined,
  },
} as const;
