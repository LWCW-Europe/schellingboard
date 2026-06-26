import { defineConfig, devices } from "@playwright/test";
import { spawnSync } from "node:child_process";

/**
 * Pick a free TCP port so E2E runs never collide with `make dev` (port 3000)
 * or with an E2E run in a different directory (workspace). Done synchronously
 * via a short-lived helper process because this config module has no top-level
 * await.  Override with E2E_PORT to point the tests at an already-running
 * server.
 */
function parsePort(raw: string): number {
  if (!/^\d+$/.test(raw.trim())) {
    throw new Error(`E2E_PORT must be a positive integer, got "${raw}"`);
  }
  const port = Number(raw.trim());
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`E2E_PORT must be between 1 and 65535, got "${raw}"`);
  }
  return port;
}

function findFreePort(): number {
  const result = spawnSync(
    process.execPath,
    [
      "-e",
      'const s=require("net").createServer();s.listen(0,()=>{process.stdout.write(String(s.address().port));s.close();});',
    ],
    { encoding: "utf8", timeout: 5000 }
  );
  if (result.error) {
    throw new Error(`Failed to spawn port-finder: ${result.error.message}`, {
      cause: result.error,
    });
  }
  if (result.status !== 0) {
    throw new Error(
      `Port-finder exited with status ${result.status}` +
        (result.stderr ? `\nstderr: ${result.stderr}` : "") +
        (result.stdout ? `\nstdout: ${result.stdout}` : "")
    );
  }
  const port = Number.parseInt(result.stdout.trim(), 10);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Failed to determine a free port (got "${result.stdout}")`);
  }
  return port;
}

// This config module is re-evaluated in every Playwright worker process, so the
// chosen port is frozen into E2E_PORT (inherited by workers) to keep baseURL and
// the web server in agreement. E2E_PORT can also be set by hand to target an
// already-running server.
const port = process.env.E2E_PORT
  ? parsePort(process.env.E2E_PORT)
  : findFreePort();
process.env.E2E_PORT = String(port);
const baseURL = `http://localhost:${port}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Create required test data. */
  globalSetup: "./tests/e2e/init.ts",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    //  {
    //    name: 'chromium',
    //    use: { ...devices['Desktop Chrome'] },
    //  },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    //  {
    //    name: 'webkit',
    //    use: { ...devices['Desktop Safari'] },
    //  },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run a production build before starting the tests. Testing against
   * `next dev` is flaky: chunks are compiled on demand and parallel
   * workers can race, causing intermittent ChunkLoadErrors. */
  webServer: {
    command: `bun set-env.ts test "next build && next start -p ${port}"`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },

  expect: { timeout: 10_000 },
});
