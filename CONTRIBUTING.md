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

- Node.js / Bun

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

A web admin UI is available at `/admin` for managing users and location. It requires `ADMIN_PASSWORD` (and `AUTH_SECRET`) to be set; without `ADMIN_PASSWORD` the admin routes are disabled and return a diagnostic message explaining how to enable them. It is fully separate from the normal user UI: it has its own layout and only requires the admin password (not `SITE_PASSWORD`). It will gradually replace the admin CLI ([#368](https://github.com/LWCW-Europe/schellingboard/issues/368)).

### Admin CLI

For records not yet covered by the admin UI, a terminal CLI is available for managing core records (events, guests, phase dates):

```bash
make dev-admin
```

This opens an interactive menu to create, edit, and delete events and guests, and to set event phase dates.

To run against a different environment (e.g. production):

```bash
bun set-env.ts production tsx scripts/admin.ts
```

## Environment Variables

### Required

| Variable       | Description                                       |
| -------------- | ------------------------------------------------- |
| `DATABASE_URL` | SQLite database file path (e.g. `file:./data.db`) |

### Optional

| Variable         | Description                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_PASSWORD`  | Enables site-wide password protection. Omit to disable.                                                                            |
| `ADMIN_PASSWORD` | Enables the admin UI at `/admin`. Omit to disable (admin routes return a diagnostic message).                                      |
| `AUTH_SECRET`    | HMAC secret used to sign auth cookies. Required when `SITE_PASSWORD` or `ADMIN_PASSWORD` is set. Use ≥32 random bytes.             |
| `UPLOADS_DIR`    | Directory for admin-uploaded files (location images). Defaults to `./uploads`; in Docker it is `/data/uploads` so uploads persist. |

`NEXT_PUBLIC_` variables are exposed to the browser; all others are server-side only.

Generate a fresh `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

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

Install Playwright browsers before first use:

```bash
make install-playwright
```

Run a single E2E spec:

```bash
bun set-env.ts test bun x playwright test tests/e2e/proposals.spec.ts
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

## Version Control

- Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
- Subject line ≤ 72 chars; explain WHY in the body if not obvious
- Before committing, run `bun lint`, `bun format`, and `bun typecheck`
- When working on a GitHub issue, add a footer: `issue #123` (partial work) or `fixes #123` (fully resolves it)

## Pull Requests

Self-review before submitting is mandatory — read your own diff, check for obvious mistakes, and make sure the PR description is accurate. Do not offload that work onto the reviewer. This is especially important when using AI agents, which can produce plausible-looking but incorrect code. Draft PRs are fine for sharing work-in-progress without that expectation.
