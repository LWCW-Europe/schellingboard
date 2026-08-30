# Contributing

This file covers what you need day to day. Longer chapters live under
`docs/dev/` and are linked from the relevant section below:

| Document                                                        | For                                                                        |
| --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Coding guidelines](docs/dev/coding-guidelines.md)              | when to write a comment, and what never to put in one                      |
| [Testing](docs/dev/testing.md)                                  | test strategy, TDD workflow, running tests, the Docker tier                |
| [Database migrations](docs/dev/migrations.md)                   | generating migrations, resolving drizzle conflicts                         |
| [Running multiple instances](docs/dev/multiple-instances.md)    | ports and env files when several clones share a machine                    |
| [Documentation and the landing page](docs/dev/documentation.md) | how docs.schellingboard.org and schellingboard.org are built and published |
| [Releasing a new version](docs/dev/releasing.md)                | tagging, the release checklist, publishing Docker images                   |
| [GitHub issues](docs/dev/github-issues.md)                      | setting Issue Type and Priority via `gh api graphql`                       |
| [ADRs](docs/dev/adr/)                                           | why the significant decisions were made                                    |
| [Attendance model](docs/dev/attendance-model/)                  | predicting how many people show up to a session, from its voting results   |

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

   See [Environment Variables](#environment-variables) for all options. Note: `AUTH_SECRET` is required only when `SITE_PASSWORD` or `ADMIN_PASSWORD` is set or guests protect their name (it signs their session cookies). Omitting this file uses sensible defaults.

3. (Optional) Seed the database with test data:

   ```bash
   make dev-db-seed
   ```

   This seeds the `large` profile: the hand-curated fixtures the E2E suite
   uses plus a few hundred generated guests, proposals and sessions for
   realistic manual testing. `SEED_PROFILE=small make dev-db-seed` seeds only
   the curated fixtures (what the E2E suite always runs against).

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

### Dev fake clock

Set `SB_ENABLE_DEV_TOOLS=1` and visit any event page with `?dev=1` to get a
toolbar for time-traveling the app (real time / `+1h` / `+1d` / `+7d` / pick a
date), so you can walk an event through its proposal → voting → scheduling
phases without editing dates in the database. It's a request-scoped cookie,
inert unless the env var is set — safe to enable on a shared staging/demo
instance. See [ADR 0004](docs/dev/adr/0004-dev-fake-clock.md) for details.

## Environment Variables

See [Configuration](docs/public/self-hosting/configuration.md#environment-variables)
for the full list and descriptions.

For local development, `DATABASE_URL` is the only required variable — unlike
Docker, no default is provided (e.g. `file:./data.db`). `AUTH_SECRET` is
additionally required when `SITE_PASSWORD` or `ADMIN_PASSWORD` is set or
guests protect their name (it signs their session cookies); generate one
with:

```bash
openssl rand -base64 32
```

`NEXT_PUBLIC_` variables are exposed to the browser; all others are server-side only.

A new variable a self-hoster can set has to reach three files: the reference
table above, `docker-compose.yml` (which forwards it into the container) and
`.env.docker.example` (where they fill it in). Nothing runs `docker-compose.yml`
— it is the one file here whose only user is a stranger — so
`tests/unit/docker-compose-env.test.ts` compares the three and names whichever
variable fell out of step. If a variable deliberately doesn't go through
compose, record the reason in that test instead.

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
make precommit  # Format, lint, type check, and run all tests (incl. e2e)
```

## Running Multiple Instances

Several clones or `jj` workspaces on one machine compete for the same ports.
Give each clone explicit, distinct ports in `.env.dev.local` and
`.env.test.local` — see
[Running multiple instances](docs/dev/multiple-instances.md) for which variable
does what and a worked two-clone example.

## Database Migrations

`make dev-migrate-create` (`drizzle-kit generate`) diffs `db/schema.ts` against
the latest snapshot in `drizzle/meta/` and writes a new migration plus updated
meta files. When two branches each add one, the meta files conflict — don't
hand-edit them, regenerate as described in
[Database migrations](docs/dev/migrations.md#resolving-migration-conflicts).

## Code Style

- TypeScript strict mode throughout
- Prefer server components; use server actions for mutations
- Tailwind CSS for all styling
- All UI must be mobile-responsive

### Colours

**Never write a palette shade** (`bg-white`, `text-gray-500`, `border-gray-300`).
Name the role instead, and both themes follow for free:

| Role        | Tokens                                                                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backgrounds | `surface`, `surface-raised` (cards, menus, modals), `surface-sunken`, `surface-muted`, `surface-hover`, `surface-inverse`                                                        |
| Text        | `fg`, `fg-muted`, `fg-subtle`, `fg-faint` (decorative only), `fg-inverse`                                                                                                        |
| Borders     | `line` (controls), `line-subtle` (dividers), `line-strong`                                                                                                                       |
| Brand       | `brand` (fills), `brand-hover`, `brand-fg` (accent text), `brand-accent` (rings/borders), `brand-tint`, `brand-tint-hover`, `on-brand`                                           |
| Semantic    | `danger`, `danger-fg`, `danger-tint`, `danger-border`, `on-danger`, `warning`, `warning-fg`, `warning-tint`, `success-fg`, `link`, `link-hover`, `info`, `info-hover`, `on-info` |
| Chrome      | `bar`, `bar-fg`, `bar-fg-subtle` (admin header, toasts — dark in _both_ themes, so not `surface-inverse`), `overlay`                                                             |

Text that sits on a coloured fill uses the fill's own `on-*` token
(`bg-brand text-on-brand`), not `text-fg-inverse` — the latter flips with the
theme, while lettering on a brand button stays white in both.

Three rules that are easy to get wrong:

- **Elevation, not shadow.** A raised surface must use `bg-surface-raised`; a
  shadow alone is invisible in dark mode.
- **Never encode state in colour alone.** A selected or active state also needs
  a shape, an icon or an aria attribute — see
  [#802](https://github.com/LWCW-Europe/schellingboard/issues/802) for what
  happens otherwise.
- **`fg-subtle` and `line` only go on the page grounds** (`surface`,
  `surface-raised`, `surface-sunken`). On a filled panel — `surface-muted` or
  `surface-hover` — they drop under the required ratio, so use `fg-muted` and
  `line-strong` there.

The location colours on the schedule are the one exception to the rule above:
they stay palette names, because a location's colour is data. Put `loc-<name>`
on the element and add the role class for what you are drawing — `loc-block`,
`loc-block-dim`, `loc-badge`, `loc-tag`, `loc-swatch`. Each mixes the hue into
the surface and foreground tokens in `app/globals.css`, so the same class works
in both themes — never write `bg-${color}-500` again.

Token values live in `app/globals.css` and are the only place a colour is
chosen. `tests/unit/theme-contrast.test.ts` asserts the WCAG ratio of every pair
in both themes, and `tests/unit/location-colors.test.ts` does the same for all
22 location hues, so changing one tells you what it broke. See
[ADR 0005](docs/dev/adr/0005-dark-mode.md).

Comments: comment the WHY, not the WHAT, and default to writing none. The full
rules — when a comment earns its place, what never to write, and why they
outrank consistency with the surrounding file — are in
[Coding guidelines](docs/dev/coding-guidelines.md#comments).

## Authorization

**Every handler that modifies data must resolve the acting guest first —
before validation — and refuse to act as a protected guest without a
verified session.** This applies to REST routes, server actions, and server
components alike. Read-only surfaces are exempt.

Gating an action in the UI is never sufficient. Hiding an Edit button stops
the honest path only; the handler behind it is reachable directly. Where the
UI restricts an operation to certain guests (e.g. hosts), the handler must
enforce the same rule independently.

Helpers live in `utils/acting-guest.ts` (they hit the database, so they
can't live in `utils/auth.ts`, which must stay importable from the proxy).

## Testing

Read [Testing](docs/dev/testing.md) before writing any test — it has the full
strategy, the mandatory TDD loop, and the E2E conventions.

Three tiers: **unit** (Vitest, pure functions only), **integration** (Vitest
against a real in-memory SQLite DB — where most business logic is covered), and
**E2E** (Playwright, for behavior that only manifests in a browser). A fourth
run, [`make test-e2e-docker`](docs/dev/testing.md#testing-the-docker-image),
exercises the image we actually ship; it is not part of `make precommit`.
`make test` also carries the
[release-upgrade tests](docs/dev/testing.md#release-upgrade-tests), which
migrate a released version's database forward and exercise CRUD on it.

```bash
make test          # Unit and integration tests (Vitest)
make test-e2e      # E2E tests (headless)
```

**Warning**: E2E tests reset the test database before each run. Do not run
against production data. Tests that send real email are opt-in and need a local
mailpit — see [Running tests](docs/dev/testing.md#running-tests).

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

## Documentation

Two audiences, two places:

- **Developers** — this file plus the markdown under `docs/dev/` it links to
  (ADRs, `github-issues.md`, design notes). Not published anywhere; read it in
  the repo.
- **Attendees and organizers** — `docs/public/`, published to
  [docs.schellingboard.org](https://docs.schellingboard.org) from release tags.
  It holds one copy — the _next_ release's documentation — so edit it in the
  same commit as the change it describes.

`make docs` previews the site, `make docs-validate` checks internal links.
[Documentation and the landing page](docs/dev/documentation.md) explains how
both sites are built and published, how to correct already-published docs, and
where screenshots live.

## Releasing a New Version

Finalize the changelog, tag `main`, push the tag. The rest is CI: it builds the
image, runs the E2E suite against it, publishes it to Docker Hub and opens the
GitHub release, while the docs site rebuilds from the same tag. Full checklist:
[Releasing a new version](docs/dev/releasing.md).

## Version Control

- Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
- Subject line ≤ 72 chars; explain WHY in the body if not obvious
- Before committing, run `make precommit`
- When working on a GitHub issue, add a footer: `issue #123` (partial work) or `fixes #123` (fully resolves it)

## Pull Requests

Self-review before submitting is mandatory — read your own diff, check for obvious mistakes, and make sure the PR description is accurate. Do not offload that work onto the reviewer. This is especially important when using AI agents, which can produce plausible-looking but incorrect code. Draft PRs are fine for sharing work-in-progress without that expectation.
