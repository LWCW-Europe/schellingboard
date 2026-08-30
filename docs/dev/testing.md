# Testing

## Test strategy

See [ADR 0002](adr/0002-testing-strategy.md) for the full rationale. Three tiers, each with a distinct role:

**Unit tests** (Vitest, `tests/unit/`) — pure functions and isolated business rules only. No DB, no I/O.

**Integration tests** (Vitest, `tests/integration/`) — server actions and API route handlers against a real in-memory SQLite DB. Verify post-condition state through a read surface in order of preference: (1) the corresponding GET endpoint, (2) repo read methods, (3) direct DB rows (last resort). Only `redirect()` and `revalidatePath()` are mocked.

**E2E tests** (Playwright, `tests/e2e/`) — behavior that only manifests in a browser: routing, phase-dependent UI, modals, form interaction, mobile layout. Prefer fewer, high-confidence tests over broad coverage.

## Test quality guardrails

- A test that breaks on an internal rename without a user-visible behavior change is a bad test. Rewrite or delete it.
- Never assert on call counts of internal helpers.
- If making a test pass requires reaching into a private, the test is wrong.
- Factories produce minimal entities; tests override only the fields they care about. If a test sets 12 fields, the factory is wrong.
- No cross-test state. Each test builds what it needs.

## TDD workflow

Every code change must follow red → green → refactor. **Do not skip or reorder steps.**

1. Write a failing test that captures the expected behavior.
2. Run the test and confirm it actually fails (see commands below).
3. Implement the minimum code to make it pass.
4. Run the test again and confirm it is green.
5. Refactor if needed — do not touch the test during refactor.

**Exceptions** (apply conservatively):

- Pure UI/layout/styling changes with no behavior change
- Refactors where existing tests already fully cover the changed code

## Running tests

```bash
make test                # Run unit and integration tests (Vitest)
make test-e2e            # Run E2E tests (headless)
make test-e2e-headed     # Run E2E tests (headed, for local dev)
make test-e2e-docker     # Run E2E tests against the production Docker image
```

**Warning**: E2E tests reset the test database before each run. Do not run against production data.

Tests that send real email (in `make test` and `make test-e2e`) are opt-in:
they need a local [mailpit](https://mailpit.axllent.org/) (start it with
`make mailpit`) and the mail variables set in `.env.test.local`:

```bash
# .env.test.local
MAILPIT_API_URL=http://localhost:8025
SMTP_URL=smtp://localhost:1025
SMTP_FROM='Test <mailer-test@test.example>'
```

When these are unset (the default on a fresh checkout), the email tests are
reported as skipped; when they are set but mailpit is unreachable, the tests
fail. CI always sets them (in `.github/workflows/ci.yml` and
`.github/workflows/ci-e2e.yml`, where mailpit is started from
`docker-compose.dev.yml` so its image pin lives in one place) and the tests fail
there if the variables go missing, so they can never be silently skipped in CI.

E2E tests run in their own workflow so that they can be skipped for changes
that cannot affect the app — documentation, the landing page, repository
prose. Adding a top-level path that the app doesn't use? Add it to both
`paths-ignore` lists in `.github/workflows/ci-e2e.yml`.

Running another clone or workspace of this project alongside this one? See [Running Multiple Instances](multiple-instances.md) for the ports that have to be kept apart.

Install Playwright browsers before first use:

```bash
make install-playwright
```

Run a single E2E spec, or filter by test title with `-g`:

```bash
bun set-env.ts test bun x playwright test tests/e2e/proposals.spec.ts
bun set-env.ts test bun x playwright test tests/e2e/proposals.spec.ts:42   # single test by line
bun set-env.ts test bun x playwright test -g "creates a proposal"          # by title substring
```

The suite runs as two projects. `firefox` holds everything and runs in
parallel; `firefox-globals` holds the specs that change site-wide settings —
one row every other test reads — and depends on `firefox`, so it starts only
once the parallel bulk is done and has the site to itself. It runs on a single
worker, so its specs don't race each other either. `settings.spec.ts` is the
only member today; add a spec here (via `GLOBALS_MUTATING_SPECS` in
`playwright.config.ts`) when it mutates a singleton rather than data of its
own.

The price of the dependency: a failure anywhere in `firefox` skips
`firefox-globals` altogether, so those specs report nothing until the bulk is
green again. Run them on their own to see where they stand. That also pulls in
the whole project they depend on, so pass `--no-deps`:

```bash
bun set-env.ts test bun x playwright test tests/e2e/settings.spec.ts --no-deps
```

Run against a different environment (e.g. dev database — still resets it):

```bash
bun set-env.ts dev bun x playwright test
```

## Testing the Docker image

`make test-e2e` runs the suite against `next build && next start`, which is not
what we ship. The image runs the standalone build as `node server.js`, as a
different user, with the database, migrations and uploads on a mounted `/data`
volume. `make test-e2e-docker` runs the same suite against a container built
from the working tree, which is the only tier that covers that gap:

```bash
make test-e2e-docker                     # build the image, then run the suite against it
IMAGE=schellingboard/schellingboard:v3.1.0 \
  bun set-env.ts test bash scripts/e2e-docker.sh    # test an existing image instead of building

# A subset, same arguments as `playwright test`:
bun set-env.ts test bash scripts/e2e-docker.sh tests/e2e/proposals.spec.ts
```

It is not part of `make precommit` — it builds an image and takes a few
minutes. Run it before a release (see [Releasing a New Version](releasing.md))
and after changing the `Dockerfile`, the standalone build, or anything touching
paths, uploads or migrations.

What it does, and why each piece is there:

- **Picks a free port** and starts the container on it, then waits for
  `/api/health`.
- **Builds through `scripts/docker-build.sh`**, the script `make docker-build`
  runs too — same build arguments, same `:<version>` tag, so the release build
  is a cache hit of this one and what gets published is what was tested here.
  The version is the one `scripts/app-version.js` prints, which is also what
  the footer shows.
- **Bind-mounts `.e2e-docker/`** (gitignored) as `/data`. Seeding runs on the
  host, as usual, and writes to the same SQLite file and uploads directory the
  container reads — so no seeding code has to exist inside the image. The
  directory is deleted at the start of every run, since a stale database hides
  exactly the failures this run looks for. Seeding migrates the database first,
  so what the container's own migration run covers is that `drizzle/` shipped
  and loads, not applying migrations to an empty database.
- **Runs the container as your own uid** (`--user`), so the files it writes
  into the bind mount don't end up owned by the image's uid 1001 and
  unremovable. As a consequence `/app` isn't writable, so Next's image
  optimizer gets a tmpfs for its cache — otherwise every optimized image logs
  an `EACCES`.
- **Starts mailpit if it isn't already running**, because once the mail
  variables are set the email specs fail rather than skip. One it started
  itself is stopped again afterwards, unless the run failed — then it is left
  up, since its web UI is where a failing email test is diagnosed.
- **Points `SITE_URL` and the SMTP host at the container's view of the host**
  (`host.docker.internal`), so emails link back to the right port and reach
  mailpit.

Playwright starts no server of its own here: the script sets
`E2E_EXTERNAL_SERVER=1` and `E2E_PORT`, and `playwright.config.ts` omits its
`webServer` when it sees them.

**The container runs in UTC.** That is what makes this tier worth having: with
`next start`, the server and the browser share your machine's timezone, so a
component that formats a date in the ambient zone renders identically on both
sides and its hydration mismatch stays invisible. In the image it does not.
Dates must be formatted in an explicit zone — the event's — never the process's.

## Flake hunting

A test that fails once in twenty runs is invisible to a normal `make test-e2e`.
`scripts/e2e-flake-hunt.sh` runs the suite repeatedly and keeps the evidence, so
flakes can be ranked by failure rate instead of by whoever noticed one last:

```bash
scripts/e2e-flake-hunt.sh                      # 20 runs of the whole suite
scripts/e2e-flake-hunt.sh 5 -- tests/e2e/voting.spec.ts --repeat-each=3
nohup scripts/e2e-flake-hunt.sh 20 > flake-hunt.log 2>&1 &   # overnight
```

Everything lands in `.flake-hunt/<UTC timestamp>/` (gitignored): `meta.json`
(commit, worker count, machine), then one `run-NNN/` per iteration holding that
run's `results.json` (the Playwright JSON report), its console log, and traces
of whatever failed. Traces are recorded with `--trace=retain-on-failure`, so a
failure comes with network log, console and per-action DOM snapshots — open one
with `bun x playwright show-trace <path>`.

The app is built and started **once** for the whole hunt, not per run: a
`next build` per iteration would dominate the runtime, while the part that has
to repeat — reseeding the database in `globalSetup` — still happens once per
run. Retries are forced to 0: the hunt wants raw failure rates, not
Playwright's own flake classification.

Two knobs, both environment variables:

- `E2E_WORKERS=N` — passed on as `--workers`. Setting it at or above the core
  count overloads the CPU deliberately, which makes timing-dependent flakes
  surface in far fewer runs.
- `HUNT_KEEP_PASSING=0` — shrink green runs' `results.json` to their stats
  block. Only worth it for very long hunts: the report still counts those runs
  as passes, but their per-test durations are gone, so the duration-outlier
  section is left looking at the red runs alone.

The hunt ends by aggregating itself. To re-aggregate, or to compare a hunt from
before a fix with one from after:

```bash
bun scripts/e2e-flake-report.ts .flake-hunt/<ts>
bun scripts/e2e-flake-report.ts .flake-hunt/<before> .flake-hunt/<after>
```

The report — printed and written to `report.md` in the last directory given —
lists flaky tests (failed in some runs, passed in others) with their failure
rate, normalized error signature and the runs whose traces to open; persistent
failures separately, since failing every time is a breakage rather than a
flake; tests whose p95 duration is within striking distance of their timeout;
and failures grouped by signature, which is what reveals that several tests
share one root cause.

If the mail variables are set in `.env.test.local`, start mailpit (`make
mailpit`) before a hunt — otherwise the email specs fail identically in every
run and clutter the report as persistent failures.

## Flaky tests on CI

CI runs the suite with `retries: 2`, so a test that fails once and passes on the
next attempt leaves a green check. The E2E workflow makes that visible instead:

- **Error annotations** — Playwright's own `github` reporter annotates every
  failed attempt with its error message and location, flaky tests included. So
  a green run can carry red annotations: they are a failed attempt, not a
  failed run.
- **Warning annotations** — `scripts/ci-flaky-summary.ts` reads the JSON report
  and emits one `::warning` per test Playwright classified as flaky, plus a
  table in the job summary — the part the reporter cannot do, and the one that
  survives being scrolled past.
- **The `playwright-report` artifact** (14 days) holds the html report, the JSON
  report and `test-results/` — including the trace of the failed attempt, since
  `trace: on-first-retry` records exactly that one. Download it, unzip it and
  open the trace with `bun x playwright show-trace <path>`.

A flaky warning is a test that failed for a reason; treat it as a bug to be
diagnosed from that trace, not as noise. Retries stay at 2 until the suite is
stable — the aim is to measure flakiness, not to start failing on it.

## E2E conventions

- Imitate human behavior — click visible elements, navigate naturally
- Use semantic locators (`getByRole`, `getByText`, `getByLabel`), not IDs or CSS classes
- Never construct URLs with internal IDs or replay raw API payloads
- Never assert on a global aggregate of shared data — an exact total, "first in the list". The
  whole suite shares one database and runs in parallel, so another spec creating a user or editing
  a profile can move any of them. Assert within data the test created itself, or between two named
  seeded rows ("Alice sorts above Ahmad"), which stays true however many rows appear around them.
  Comparing one count against another (fewer after a filter than before) holds only where no row a
  parallel spec can add moves the two the same way
- Give anything a test creates a name of its own (`E2E Admin User ${uniqueSuffix()}`), distinctive
  enough that no other spec's search or filter can match it. Take the suffix from
  `tests/e2e/helpers/unique.ts`, never a bare `Date.now()`: workers are separate processes sharing
  one database, and two of them can land in the same millisecond
- A cross-test invariant that only a comment states ("no other test votes on this proposal") is
  enforced by nothing. Put it in the seed or the fixture where it can be relied on, or write the
  assertion so it does not need the invariant
- Nothing a page does in an effect is covered by an assertion the server render already satisfies.
  `toHaveCount(0)` on something the markup never contained passes instantly, and a click on a
  server-rendered control satisfies every actionability check a moment before React attaches its
  handler — so both come up green while hydration is still pending. Where the behavior under test
  lives in an effect, wait for that effect's own result before acting on it: `kiosk.spec.ts` polls
  until the `kiosk` cookie is gone before it navigates on, `helpers/user.ts` taps the chip again

## Test data

Each E2E run starts from a clean database with 3 events (Alpha/Beta/Gamma) in different phases, plus pre-created proposals, sessions, users, and auth. See `tests/reset-database.ts` for details. Auth helpers: `tests/helpers/auth.ts` (`login`, `loginAndGoto`).
