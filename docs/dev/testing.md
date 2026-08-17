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

## E2E conventions

- Imitate human behavior — click visible elements, navigate naturally
- Use semantic locators (`getByRole`, `getByText`, `getByLabel`), not IDs or CSS classes
- Never construct URLs with internal IDs or replay raw API payloads

## Test data

Each E2E run starts from a clean database with 3 events (Alpha/Beta/Gamma) in different phases, plus pre-created proposals, sessions, users, and auth. See `tests/reset-database.ts` for details. Auth helpers: `tests/helpers/auth.ts` (`login`, `loginAndGoto`).
