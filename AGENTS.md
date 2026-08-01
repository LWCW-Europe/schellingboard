# Project Instructions

Read [CONTRIBUTING.md](CONTRIBUTING.md) for architecture, code style, common patterns, and version control conventions. It indexes the longer chapters under `docs/dev/`.

## Project Overview

Next.js scheduling app for managing conference/event sessions with three phases: proposal, voting, and scheduling. Uses SQLite as the database backend.

## Key Considerations

1. **Authentication**: Site-wide password protection via `SITE_PASSWORD`
2. **Phase Management**: Event phases control available features
3. **Time Zones**: Use proper timezone handling for scheduling
4. **Mobile Responsive**: All UI must work on mobile
5. **E2E Testing**: Tests must imitate real user behavior — navigate through the UI by clicking visible elements and following links, not by constructing URLs with internal IDs (e.g. `?sessionID=`, `?proposalId=`). Never extract IDs from URLs or replay raw API payloads. Use semantic locators (`getByRole`, `getByLabel`, `getByText`) instead of CSS ID/class selectors.

## Changelog

Update `CHANGELOG.md` under `[Unreleased]` for any user-facing change — audience is event organizers, so keep it non-technical. Dev-only changes go under `Internal`. See [CONTRIBUTING.md § Changelog](CONTRIBUTING.md#changelog) for section types and conventions.

## Documentation

- **Attendee/organizer docs**: `docs/public/` — one copy, documenting the _next_
  release. Edit in the same commit as the change they describe, and run
  `make docs-validate` after changing links.
- **Developer docs**: `docs/dev/` (ADRs, design notes, the long chapters split
  out of CONTRIBUTING.md). Never published.
- **Screenshots**: `docs/screenshots/` — the project's only copy. Reference them
  relatively from markdown (`../screenshots/x.webp`), never root-relative.
- **The landing page** (schellingboard.org): hand-written HTML in `www/`. Don't
  move it to docmd.
- Details: [docs/dev/documentation.md](docs/dev/documentation.md).

## GitHub Issues

When creating or editing GitHub issues, set Issue Type and the Priority field to match existing
conventions — see [docs/dev/github-issues.md](docs/dev/github-issues.md) for the required `gh api
graphql` commands (neither field is settable via plain `gh issue create`/`edit`).

## Version Control

- Use `jj` (jujutsu) if available, otherwise `git`
- Pre-commit: run `make precommit` to format, lint, type check, and run tests
- See [docs/dev/migrations.md](docs/dev/migrations.md) for resolving `drizzle` migration conflicts

### jj paths with special characters

Paths like `app/(site)/[eventSlug]/...` break jj's default parsing: `()` are fileset grouping
operators, and `[eventSlug]` is read as a glob character class (matches nothing). Fix: use `file:`
(exact match) and quote it:

```
jj commit -m "message" -- 'file:"app/(site)/[eventSlug]/session-block.tsx"'
```

### Splitting commits

Don't use `jj split` (opens an interactive editor, breaks non-interactive shells). Instead:

- **Uncommitted changes**: `jj commit -m "message" -- <path>` once per group of paths.
- **Already-committed commit**: insert an empty commit after it, then squash paths into it:

```
jj new -A <commit>
jj squash --from <commit> --to @ -m "message" -- <path>
```

## Testing

- Always run tests with `make test` (not `bun test`); E2E tests with `make test-e2e`
- Run a single E2E spec/test instead of the whole suite:
  - `bun set-env.ts test bun x playwright test tests/e2e/proposals.spec.ts` (one file)
  - `bun set-env.ts test bun x playwright test tests/e2e/proposals.spec.ts:42` (one test by line)
  - `bun set-env.ts test bun x playwright test -g "creates a proposal"` (by title substring)
- Full test strategy and TDD rules are in [docs/dev/testing.md](docs/dev/testing.md) — read it before writing any test
- Before running tests for the first time in a session, check whether mailpit is running (`docker compose -f docker-compose.dev.yml $(test -f .env.dev.local && echo --env-file .env.dev.local) ps mailpit` — mirrors the `mailpit` Makefile target, including its `--env-file` conditional, since `.env.dev.local` can set a per-clone `COMPOSE_PROJECT_NAME`); if not, ask the user whether to start it (`make mailpit`)

### Test tiers (short form)

- **E2E** (Playwright): important user workflows only — quality over quantity
- **E2E against the Docker image** (`make test-e2e-docker`): the same suite against a container. Not part of `make precommit` — run it before a release and after touching the `Dockerfile`, the standalone build, or anything path-, upload- or migration-related. The container runs in UTC, so it catches dates formatted in the ambient time zone; format in the event's zone
- **Integration** (Vitest, real DB): high coverage of business logic via repositories/server actions
- **Unit** (Vitest): only for complex isolated functions; never duplicate integration-test coverage

### Mandatory TDD for agents

Follow red → green → refactor strictly. **No skipping steps.**

1. Write the failing test.
2. Run `make test` or `make test-e2e` and **confirm the failure output**.
3. Implement the minimum code to pass.
4. Run again and confirm green.
5. Refactor without touching the test.

Exceptions (be very conservative): pure UI/styling-only changes; refactors where existing tests already give full coverage.

## Coding Guidelines

**Comments: read [docs/dev/coding-guidelines.md](docs/dev/coding-guidelines.md#comments) before writing any.**
The short version: comment the WHY, not the WHAT. Default to no comment. Never
restate what the code plainly says (`// toggle the like` above `toggleLike`), and
never add doc blocks or `@param`/`@returns` that only repeat the signature.
Comment a line only when it looks wrong or arbitrary without the reason behind it.

This rule **overrides consistency with the surrounding code** — if the
neighbouring code is over-commented, do not match its density, write the sparse
version.

## Misc

When adding a link to session/proposal modal, see `modal-nav.ts`, there are gotchas (anchor: MnpjIo7Y).
