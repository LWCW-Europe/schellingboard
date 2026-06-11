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
   AUTH_SECRET=<generated via openssl rand -base64 32>
   ```

   See [Environment Variables](#environment-variables) for all options. Note: `AUTH_SECRET` is required only when `SITE_PASSWORD` is set. Omitting this file uses sensible defaults.

3. (Optional) Seed the database with test data:

   ```bash
   make dev-db-reset
   ```

4. Start the dev server:

   ```bash
   make dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin CLI

Until a full admin UI is built ([#368](https://github.com/omarkohl/schellingboard/issues/368)), a terminal CLI is available for managing core records (events, guests, phase dates):

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

| Variable        | Description                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `SITE_PASSWORD` | Enables site-wide password protection. Omit to disable.                                            |
| `AUTH_SECRET`   | HMAC secret used to sign auth cookies. Required when `SITE_PASSWORD` is set. Use ≥32 random bytes. |

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
make check-and-format  # Format, lint, type check, and run tests
```

## Code Style

- TypeScript strict mode throughout
- Prefer server components; use server actions for mutations
- Tailwind CSS for all styling
- All UI must be mobile-responsive

## Testing

```bash
make test                # Run unit and integration tests
make test-e2e            # Run E2E tests (headed, for local dev)
make test-e2e-ci         # Run E2E tests (headless)
```

**Warning**: E2E tests reset the test database before each run. Do not run against production data.

Install Playwright browsers before first use:

```bash
make install-playwright
```

Run a single E2E spec:

```bash
bun set-env.ts test bun x playwright test tests/proposals.spec.ts
```

Run against a different environment (e.g. dev database — still resets it):

```bash
bun set-env.ts dev bun x playwright test
```

### E2E test conventions

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
