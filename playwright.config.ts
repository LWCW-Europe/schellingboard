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

// `make test-e2e-docker` starts the production image itself and points this run
// at it (see scripts/e2e-docker.sh), so no server may be started here — not even
// on CI, where reuseExistingServer is off.
const externalServer = process.env.E2E_EXTERNAL_SERVER === "1";
if (externalServer && !process.env.E2E_PORT) {
  throw new Error(
    "E2E_EXTERNAL_SERVER=1 requires E2E_PORT — the port the running server listens on"
  );
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

// Emails link back to the site via SITE_URL. Point it at this run's server —
// the web server command inherits this process's environment, and real
// environment variables beat the .env.test value in set-env.ts — so the specs
// that follow links out of sent mail reach this run rather than whatever port
// .env.test names.
process.env.SITE_URL = baseURL;

// Specs that mutate the site-settings singleton, run apart from everything
// else (see the "firefox-globals" project below). Anchored: an unanchored
// pattern would swallow user-settings.spec.ts, which only touches one guest's
// own preferences.
const GLOBALS_MUTATING_SPECS = /[\\/]settings\.spec\.ts$/;

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
  /* One retry locally, purely for the evidence: `trace: on-first-retry` records
   * nothing at all when a failure is never retried, so a local flake used to
   * leave an error message and no way to look into it. The retry also says
   * whether the test is flaky or broken. It buys no leniency —
   * `failOnFlakyTests` keeps the run red — so precommit still stops here.
   * CI retries twice and stays green (see the flaky reporting below); dropping
   * that before the suite is stable would only make CI red noise. */
  retries: process.env.CI ? 2 : 1,
  failOnFlakyTests: !process.env.CI,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters
   * On CI the run is only worth as much as the record it leaves behind: the
   * JSON report is what scripts/ci-flaky-summary.ts reads to name the tests
   * that passed on retry, and the html report is uploaded as an artifact
   * (`open: never` — nothing can open a browser there anyway). `github` puts
   * each failed attempt next to the line that failed — for flaky tests too, so
   * a green run can carry red annotations. */
  reporter: process.env.CI
    ? [
        ["html", { open: "never" }],
        ["json", { outputFile: "playwright-results.json" }],
        ["github"],
      ]
    : "html",
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
      testIgnore: GLOBALS_MUTATING_SPECS,
    },

    /* Specs that change site-wide settings — one row every other test reads.
     * They restore what they changed, but only after asserting on it, and
     * nothing stops a future test from looking at the site title while that
     * window is open. `dependencies` holds them until the parallel bulk above
     * is done, so they have the site to themselves; `workers: 1` keeps them
     * from racing each other once there is more than one such spec (a file's
     * own `serial` mode only orders the tests within it).
     *
     * A failure anywhere in `firefox` skips this project entirely — Playwright
     * does not run a project whose dependency failed. The run fails either
     * way, but the site-settings specs go unreported until the bulk is green. */
    {
      name: "firefox-globals",
      use: { ...devices["Desktop Firefox"] },
      testMatch: GLOBALS_MUTATING_SPECS,
      dependencies: ["firefox"],
      fullyParallel: false,
      workers: 1,
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
  webServer: externalServer
    ? undefined
    : {
        command: `bun set-env.ts test "next build && next start -p ${port}"`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },

  expect: { timeout: 10_000 },
});
