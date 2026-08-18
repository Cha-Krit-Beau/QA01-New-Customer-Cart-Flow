# QA Automate Project

Production-ready end-to-end and API test automation framework built with **Playwright + TypeScript**.

## Project Overview

This framework demonstrates a standard, maintainable Playwright test architecture: Page Object
Model, environment-driven configuration, custom fixtures, tagged test suites (`@smoke`,
`@regression`, ...), API testing, storageState-based authentication reuse, and a GitHub Actions
CI pipeline that lints, type-checks, runs tests, and uploads reports/traces as artifacts.

The UI tests run against [the-internet.herokuapp.com](https://the-internet.herokuapp.com) and the
API tests run against [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) — both are public sandboxes built
specifically for test-automation practice, used here in place of a real internal application so
the framework runs and is verifiable out of the box. Point `BASE_URL` / `API_BASE_URL` at your
own application to reuse it for real.

## Technology Stack

- [Playwright Test](https://playwright.dev/) — test runner, browser automation, API testing
- TypeScript (strict mode)
- Node.js / npm
- ESLint (flat config) + `eslint-plugin-playwright`
- Prettier
- `dotenv` for environment management
- Playwright HTML + JUnit reporters
- GitHub Actions for CI/CD

## Prerequisites

- Node.js 18+ and npm
- Git

## Installation

```bash
npm install
npx playwright install
```

## Environment Setup

Copy the template and fill in real values for the environment you're targeting:

```bash
cp .env.example .env.dev
```

| Variable             | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `TEST_ENV`           | Which `.env.<name>` file to load: `dev`/`sit`/`uat`/`prod`        |
| `BASE_URL`           | UI base URL under test                                            |
| `API_BASE_URL`       | API base URL under test                                           |
| `TEST_USERNAME`      | Test account username                                             |
| `TEST_PASSWORD`      | Test account password                                             |
| `API_KEY`            | Optional API auth token                                           |
| `HEADLESS`           | `true`/`false` — browser headless mode                            |
| `STOREDEMO_BASE_URL` | Base URL for the TestDino Demo Store scenario (`tests/storedemo`) |

`.env.*` files are gitignored — **only `.env.example` is committed.** Never hardcode URLs,
credentials, tokens or secrets in test code; always read them from `config/environments.ts`.

In CI, these variables are provided via repository **Secrets/Variables** instead of a committed
file (see `.github/workflows/playwright.yml`).

## Project Structure

```text
├── tests/
│   ├── setup/auth.setup.ts   # logs in once, saves storageState for reuse
│   ├── login/                # login.spec.ts + login.data.ts
│   ├── user/                 # user.spec.ts
│   ├── smoke/                # smoke.spec.ts
│   ├── api/                  # user.spec.ts (API-only tests)
│   └── storedemo/            # registration-checkout-flow.spec.ts (separate app, see below)
├── pages/                     # Page Objects (LoginPage, HomePage, UserPage)
│   └── storedemo/             # Page Objects for the TestDino Demo Store scenario
├── fixtures/                  # test.fixture.ts + storedemo.fixture.ts
├── api/                       # endpoint-specific API wrappers (UserApi)
├── utils/                     # apiClient, testData, dateUtils, common helpers
│   └── storedemo/             # test data for the storedemo scenario
├── config/                    # environments.ts, testConfig.ts
├── data/                      # users.json, testData.json
├── constants/                 # testConstants.ts (tags, routes, messages)
│   └── storedemo/             # routes.ts for the TestDino Demo Store
├── auth/                      # generated storageState (gitignored)
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── .env.example
└── .github/workflows/playwright.yml
```

Every folder has one responsibility: Page Objects only drive the UI, specs only express test
scenarios, test data lives outside test logic, and utilities hold shared, reusable functions.

### A second application under test: TestDino Demo Store

`tests/storedemo/` exercises a completely different app
([storedemo.testdino.com](https://storedemo.testdino.com)) than the rest of the suite (which
targets the-internet.herokuapp.com as the framework's own reference target). It has its own
Playwright **project** (`storedemo`), its own `baseURL` (`STOREDEMO_BASE_URL`), its own Page
Objects (`pages/storedemo/`), and its own fixture (`fixtures/storedemo.fixture.ts`) — it does not
depend on the `setup` project or `auth/user.json`, since that session belongs to the other app.
`chromium`/`firefox`/`webkit` explicitly `testIgnore` the `storedemo` folder so nothing runs twice.

`registration-checkout-flow.spec.ts` is one continuous customer journey — register → sign in →
search a product → add to cart → change quantity → verify subtotal → sign out — implemented as a
single test broken into `test.step()` blocks (each step depends on state the previous step built
up, so it's one scenario, not several independent tests). Run it with:

```bash
npm run test:storedemo
```

It deliberately avoids hardcoding a product name or price: it reads the first available product
from the live catalog and captures its price from the UI, so it keeps passing if the store's
product data changes. Selectors use the app's own `data-testid` attributes throughout (confirmed
by inspecting the rendered app — it's a client-rendered React SPA, so view-source/curl won't show
them).

## Running Tests

```bash
npm test                  # run everything (chromium, firefox, webkit)
npm run test:headed       # run with a visible browser
npm run test:ui           # Playwright's interactive UI mode
npm run test:debug        # step through with the Playwright inspector
npm run test:chromium     # single browser
npm run test:firefox
npm run test:webkit
npm run test:api          # API-only tests (tests/api)
npm run test:storedemo    # TestDino Demo Store registration-to-checkout journey
```

## Running Smoke Tests

```bash
npm run test:smoke
```

Runs everything tagged `@smoke` — fast checks that the environment and critical path (auth) work.

## Running Regression Tests

```bash
npm run test:regression
```

Runs everything tagged `@regression`. Combine tags directly with the Playwright CLI when needed,
e.g. `npx playwright test --grep "@regression.*@critical"`.

## Debugging

- `npm run test:debug` — opens the Playwright Inspector, step through actions
- `npm run test:ui` — interactive UI mode with time-travel debugging
- `npx playwright show-trace test-results/<test>/trace.zip` — inspect a failed test's trace
- On failure, screenshots/videos/traces are automatically captured (see `playwright.config.ts`,
  `use: { screenshot, video, trace }`) — never rely on `page.waitForTimeout()`; use Playwright's
  auto-waiting or explicit `expect(...).toBeVisible()` / `locator.waitFor()` instead.

## Reports

```bash
npm run report
```

Opens the last HTML report (`playwright-report/`) with pass/fail status, duration, screenshots,
traces and error messages. A JUnit XML report is also written to `test-results/junit.xml` for
CI dashboards that consume JUnit format.

## CI/CD

`.github/workflows/playwright.yml` runs on every push/PR to `main`/`master`:

```text
checkout → setup Node → npm ci → lint → typecheck →
install browsers → run tests → upload HTML report + test-results artifacts
```

Configure `TEST_USERNAME` / `TEST_PASSWORD` / `API_KEY` as repository **Secrets**, and
`TEST_ENV` / `BASE_URL` / `API_BASE_URL` as repository **Variables** (Settings → Secrets and
variables → Actions) so CI runs without any committed credentials.

## Coding Standards

- DRY, SOLID, KISS, single responsibility, maintainability, reusability, scalability
- No `any` (enforced by `@typescript-eslint/no-explicit-any`)
- No hardcoded fixed waits (`playwright/no-wait-for-timeout` lint rule enforces this)
- No hardcoded test data, URLs, or credentials — use `config/`, `utils/testData.ts`, `.env.*`
- Prefer stable locators in this order: `getByRole` → `getByLabel` → `getByPlaceholder` →
  `getByTestId` → CSS → XPath (last resort only)
- Test names describe the scenario in plain language (not `TC_Login_001`)

```bash
npm run lint          # ESLint
npm run lint:fix       # ESLint with autofix
npm run format         # Prettier write
npm run format:check   # Prettier check (CI-safe, no writes)
npm run typecheck      # tsc --noEmit
```

## Authentication / Session Reuse

`tests/setup/auth.setup.ts` runs first (as the `setup` project in `playwright.config.ts`), logs
in once, and saves the session to `auth/user.json` via `storageState`. The `chromium`/`firefox`/
`webkit` projects then depend on `setup` and reuse that session — this is the standard Playwright
pattern for avoiding a repeated UI login in every test. `login.spec.ts` explicitly overrides this
with `test.use({ storageState: ... })` since it needs to test the login flow itself. `auth/*.json`
is gitignored — it contains live session cookies and must never be committed.

> **Note on this specific demo target:** the-internet.herokuapp.com's session cookie is
> short-lived — verified by hand to be rejected a few minutes after issuance even though the
> cookie itself has no client-side expiry. Against a real application with a normal session
> lifetime, the smoke/regression suites would reuse the saved storageState directly. Here, the
> smoke and user/API suites intentionally don't assert on carried-over auth state from `setup`
> (they either don't need auth, or log in explicitly) so the suite stays reliable regardless of
> how much time passes between the `setup` project and the tests that depend on it.

## Troubleshooting

| Symptom                                             | Likely cause / fix                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Missing required environment variable "..."`       | Copy `.env.example` to `.env.<TEST_ENV>` and fill in values                                |
| Browsers not found / launch errors                  | Run `npx playwright install`                                                               |
| Tests pass locally but fail in CI                   | Check repository Secrets/Variables are set; compare `TEST_ENV`/`BASE_URL`                  |
| Flaky test around navigation/dynamic content        | Replace any `waitForTimeout` with `expect(...).toBeVisible()` or `waitFor`                 |
| `auth/user.json` missing when running a single spec | Run the `setup` project too, e.g. `npx playwright test --project=setup --project=chromium` |
