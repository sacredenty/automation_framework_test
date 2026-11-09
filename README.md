# Frontend Automation Framework

A small Playwright example that behaves like a framework you can extend: shared config, page objects, a local demo shop, and reports you can actually open after a failure.

Playwright Test is the runner. `TestRunner` and `BrowserManager` stay available for scripts that are not specs, but `npm test` goes through fixtures so retries, projects, traces, and the HTML report all apply.

## Layout

```
config/            test-config.json plus an optional YAML overlay
src/config/        loads JSON, YAML, then environment variables
src/pages/         page objects (locators, not raw CSS wrappers)
src/core/          programmatic browser and suite helpers
demo/              local shop the specs run against
tests/fixtures.js  Playwright fixtures that build the page objects
tests/specs/       catalog, login, and API examples
tests/unit/        config and catalog checks that do not need a browser
```

## Setup

```bash
npm install
npx playwright install
cp .env.example .env   # optional
```

## Run

```bash
npm test                 # chromium, firefox, and webkit
npm run test:chromium   # one browser
npm run test:headed
npm run test:ui
npm run test:unit
npm run lint
npm run demo             # shop only, http://127.0.0.1:4173
```

`npm test` starts the demo server for you. Override the target with `BASE_URL` if you want to point the same specs at another host.

## Configuration

[src/config/loadConfig.js](src/config/loadConfig.js) merges, in order:

1. Built-in defaults
2. [config/test-config.json](config/test-config.json)
3. [config/test-config.yaml](config/test-config.yaml)
4. Environment variables: `BROWSER`, `HEADLESS`, `TIMEOUT`, `RETRIES`, `BASE_URL`, `DEMO_PORT`, `DEMO_HOST`

[playwright.config.js](playwright.config.js) and the demo server both call `loadConfig()`, so the CLI and the app stay on the same base URL and port.

The demo user is `ada@example.com` / `lightning`.

## Writing a spec

```javascript
const { test, expect } = require('../fixtures');

test('filters the catalog', async ({ homePage }) => {
  await homePage.open();
  await homePage.search('lamp');
  await expect(homePage.product('Aurora Lamp')).toBeVisible();
});
```

Page objects live next to the feature. Add a class under `src/pages/`, register it in [tests/fixtures.js](tests/fixtures.js), and keep selectors as `getByRole` / `getByLabel` locators.

## Reading a failure

On failure Playwright keeps a screenshot, a video, and (after a retry) a trace. The HTML report lands in `reports/html`:

```bash
npx playwright show-report reports/html
```

Open the failed test, then the trace. The trace viewer shows each locator action, the DOM at that moment, and the network call. JUnit output for CI is `reports/test-results.xml`. Logs from the programmatic runner go to `logs/` and are not committed.

## Programmatic runner

For a script outside Playwright Test:

```javascript
const { TestRunner } = require('./src');

const results = await new TestRunner().runTestSuite({
  tests: [{
    name: 'home loads',
    async execute(page) {
      await page.goto('/');
    }
  }]
});
```

Prefer the fixtures above for anything you want retried and reported.
