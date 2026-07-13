# Contributing

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3) with Drizzle ORM
- **Testing**: Playwright for E2E tests
- **Package Manager**: Bun

## Architecture

- **Frontend**: React components in `app/` using App Router
- **Database Layer**: `db/` — `schema.ts`, `container.ts`, repositories in `db/repositories/sqlite/`
- **API Routes**: Server actions in `app/actions/`, API routes in `app/api/`
- **Utils**: Shared utilities in `utils/`
- **Migrations**: Drizzle-managed SQL migrations in `migrations/`

## Getting Started

### Prerequisites

- **Bun** (package manager and script runner)
- **Node.js 22** (or higher), installed and on your `PATH`. Although Bun runs
  the app, the tooling shells out to a real `node` — `bun x tsx` for
  migrations/scripts, and Vitest's test workers — so `node` must be directly on
  your `PATH`. Check with `node -v`.

### Setup

1. Clone the repo and install dependencies:

   ```bash
   make install
   ```

2. (Optional) Create `.env.dev.local` to customize environment variables:

   ```bash
   DATABASE_URL=file:./data.db
   SITE_PASSWORD=your-password
   ADMIN_PASSWORD=your-admin-password
   AUTH_SECRET=<generated via openssl rand -base64 32>
   ```

   See [Environment Variables](#environment-variables) for all options. Note: `AUTH_SECRET` is required only when `SITE_PASSWORD` or `ADMIN_PASSWORD` is set. Omitting this file uses sensible defaults.

3. (Optional) Seed the database with test data:

   ```bash
   make dev-db-seed
   ```

4. Start the dev server:

   ```bash
   make dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin UI

A web admin UI is available at `/admin` for managing all core records: events
(basic info, phases, days), the global pools of users and locations, event↔guest
and event↔location assignments, moderation of proposals, sessions, and RSVPs, and
site settings (title, description, and the optional venue map).
It requires `ADMIN_PASSWORD` (and `AUTH_SECRET`) to be set; without
`ADMIN_PASSWORD` the admin routes are disabled and return a diagnostic message
explaining how to enable them. It is fully separate from the normal user UI: it
has its own layout and only requires the admin password (not `SITE_PASSWORD`).

## Environment Variables

See [docs/hosting](docs/hosting/README.md#environment-variables) for the full list and descriptions.

For local development, `DATABASE_URL` is the only required variable — unlike
Docker, no default is provided (e.g. `file:./data.db`). `AUTH_SECRET` is
additionally required when `SITE_PASSWORD` or `ADMIN_PASSWORD` is set;
generate one with:

```bash
openssl rand -base64 32
```

`NEXT_PUBLIC_` variables are exposed to the browser; all others are server-side only.

## Development Commands

Run `make` to see all available commands:

```bash
make          # List all commands
make dev      # Start dev server
make test     # Run tests
make lint     # Lint code
make format   # Format code
```

Before committing or pushing, run:

```bash
make precommit  # Format, lint, type check, and run tests
```

## Database Migrations

`make dev-migrate-create` (`drizzle-kit generate`) diffs `db/schema.ts` against the latest
snapshot in `drizzle/meta/` and writes a new `NNNN_*.sql` file plus an updated
`drizzle/meta/NNNN_snapshot.json` and `drizzle/meta/_journal.json`.

### Resolving migration conflicts

When two branches each add a migration, `drizzle/meta/_journal.json` and the latest
`drizzle/meta/NNNN_snapshot.json` conflict — both branches claim the same index. Don't hand-edit
the conflicted JSON; regenerate it instead:

1. Move your own new `.sql` migration file out of the way (e.g. to `/tmp`) so it doesn't confuse
   `drizzle-kit`. Note its name.
2. Restore `drizzle/meta/` to the stable version (`main`), discarding your branch's snapshot/journal
   changes — `db/schema.ts` is unaffected, only the generated meta files reset:

   ```bash
   # jj
   jj restore --from main -- drizzle/meta

   # Git
   git checkout main -- drizzle/meta
   ```

3. Regenerate against the restored snapshot, in a real terminal (not piped/non-interactive — see
   below):

   ```bash
   make dev-migrate-create NAME=<original-migration-name>
   ```

   `--name` gets you the right filename directly; without it you'd rename the auto-generated file
   afterward (keep drizzle-kit's index, drop the random suffix). If your change looks like a column
   rename to drizzle-kit (e.g. drop one column, add another), it opens an interactive prompt asking
   whether to treat it as a rename or a create+drop — it needs a real TTY, so this step can't run
   from a script or CI.

4. Diff the regenerated `.sql` file against the copy you moved aside in step 1. For a plain
   mechanical schema change they'll match — delete the moved-aside copy. But if your original
   migration had hand-written SQL beyond what `schema.ts` alone implies (a data backfill, a value
   transform, choosing "rename" over "create+drop"), the regenerated file won't reproduce it —
   drizzle-kit only knows what it can infer from the schema diff. In that case keep the _regenerated_
   `drizzle/meta/*_snapshot.json` and journal entry (they carry the correct index), but replace the
   regenerated file's SQL body with your original hand-written SQL.
5. Run `make dev-migrate-up` to confirm the migration applies cleanly, then continue resolving the
   rest of the conflict as usual.

## Code Style

- TypeScript strict mode throughout
- Prefer server components; use server actions for mutations
- Tailwind CSS for all styling
- All UI must be mobile-responsive

## Testing

### Test strategy

See [ADR 0002](docs/adr/0002-testing-strategy.md) for the full rationale. Three tiers, each with a distinct role:

**Unit tests** (Vitest, `tests/unit/`) — pure functions and isolated business rules only. No DB, no I/O.

**Integration tests** (Vitest, `tests/integration/`) — server actions and API route handlers against a real in-memory SQLite DB. Verify post-condition state through a read surface in order of preference: (1) the corresponding GET endpoint, (2) repo read methods, (3) direct DB rows (last resort). Only `redirect()` and `revalidatePath()` are mocked.

**E2E tests** (Playwright, `tests/e2e/`) — behavior that only manifests in a browser: routing, phase-dependent UI, modals, form interaction, mobile layout. Prefer fewer, high-confidence tests over broad coverage.

### Test quality guardrails

- A test that breaks on an internal rename without a user-visible behavior change is a bad test. Rewrite or delete it.
- Never assert on call counts of internal helpers.
- If making a test pass requires reaching into a private, the test is wrong.
- Factories produce minimal entities; tests override only the fields they care about. If a test sets 12 fields, the factory is wrong.
- No cross-test state. Each test builds what it needs.

### TDD workflow

Every code change must follow red → green → refactor. **Do not skip or reorder steps.**

1. Write a failing test that captures the expected behavior.
2. Run the test and confirm it actually fails (see commands below).
3. Implement the minimum code to make it pass.
4. Run the test again and confirm it is green.
5. Refactor if needed — do not touch the test during refactor.

**Exceptions** (apply conservatively):

- Pure UI/layout/styling changes with no behavior change
- Refactors where existing tests already fully cover the changed code

### Running tests

```bash
make test                # Run unit and integration tests (Vitest)
make test-e2e            # Run E2E tests (headless)
make test-e2e-headed     # Run E2E tests (headed, for local dev)
```

**Warning**: E2E tests reset the test database before each run. Do not run against production data.

By default, `make test` tests that we can successfully send email to a local [mailpit](https://mailpit.axllent.org/) (start it with `docker compose up mailpit`). You can skip that test by setting `MAILPIT_API_URL` to blank in `.env.test.local`.

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

### E2E conventions

- Imitate human behavior — click visible elements, navigate naturally
- Use semantic locators (`getByRole`, `getByText`, `getByLabel`), not IDs or CSS classes
- Never construct URLs with internal IDs or replay raw API payloads

### Test data

Each E2E run starts from a clean database with 3 events (Alpha/Beta/Gamma) in different phases, plus pre-created proposals, sessions, users, and auth. See `tests/reset-database.ts` for details. Auth helpers: `tests/helpers/auth.ts` (`login`, `loginAndGoto`).

## Changelog

Update `CHANGELOG.md` under `[Unreleased]` alongside any user-facing change.

**Audience**: event organizers, not developers. Plain language, no jargon (framework names, file/function names, library versions) — describe what changed for them, not how it was implemented.

**Sections** (Keep a Changelog order; use only what applies):

- `Added` — new features
- `Changed` — changes to existing behavior
- `Deprecated` — features being phased out
- `Removed` — removed features
- `Fixed` — bug fixes
- `Security` — vulnerability fixes
- `Internal` — dev-only changes (tooling, tests, refactors, CI) with no visible effect on organizers

**Conventions**:

- One bullet per change: short **bold** phrase naming the feature/area, then a plain-language explanation
- Order bullets within a section roughly by importance
- Breaking changes: `> **Breaking change**: ...` blockquote at the top of the release
- Skip internal refactors/tests unless they materially affect the dev workflow — then use `Internal`

## Releasing a New Version

1. **Finalize the changelog** — in `CHANGELOG.md`, rename `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` (no `v` prefix in the header) and add a fresh empty `## [Unreleased]` section above it. Update the compare links at the bottom of the file: the new version's link should point from the previous release's endpoint to the new tag (`vX.Y.Z`), and `[Unreleased]` should point from the new tag to `HEAD`. Commit and merge this like any other change.
2. **Tag the resulting commit on `main`**. jj cannot push tags to a Git remote, so use `git` for this step:
   ```bash
   VERSION=v3.0.0
   MINOR=${VERSION%.*}   # v3.0
   MAJOR=${MINOR%.*}     # v3

   git fetch origin main
   git tag $VERSION origin/main
   git push origin $VERSION
   ```
3. **Publish the Docker images** — see below.

### Publishing Docker Images

Image: `schellingboard/schellingboard` on Docker Hub.

For a release, push four tags: the full version, `major.minor`, `major`, and `latest`. Skip `latest` when publishing a patch for an older major/minor (i.e. when it wouldn't be the newest release).

```bash
docker login
git checkout $VERSION
make docker-build   # builds and locally tags :latest and :$VERSION (via git describe)
docker tag schellingboard/schellingboard:$VERSION schellingboard/schellingboard:$MINOR
docker tag schellingboard/schellingboard:$VERSION schellingboard/schellingboard:$MAJOR

docker push schellingboard/schellingboard:$VERSION
docker push schellingboard/schellingboard:$MINOR
docker push schellingboard/schellingboard:$MAJOR
docker push schellingboard/schellingboard:latest   # omit if not the newest release
```

`make docker-build` derives `$VERSION` from `git describe --tags`, so the release commit must already be tagged with the exact version (e.g. `v3.0.0`) before running it.

## Version Control

- Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
- Subject line ≤ 72 chars; explain WHY in the body if not obvious
- Before committing, run `make precommit`
- When working on a GitHub issue, add a footer: `issue #123` (partial work) or `fixes #123` (fully resolves it)

## Pull Requests

Self-review before submitting is mandatory — read your own diff, check for obvious mistakes, and make sure the PR description is accurate. Do not offload that work onto the reviewer. This is especially important when using AI agents, which can produce plausible-looking but incorrect code. Draft PRs are fine for sharing work-in-progress without that expectation.
