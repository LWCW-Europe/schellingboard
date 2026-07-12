# Project Instructions

Read [CONTRIBUTING.md](CONTRIBUTING.md) for architecture, code style, common patterns, testing guidelines, and version control conventions.

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

## Version Control

- Use `jj` (jujutsu) if available, otherwise `git`
- Pre-commit: run `make precommit` to format, lint, type check, and run tests
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for resolving `drizzle` migration conflicts

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
- Full test strategy and TDD rules are in [CONTRIBUTING.md § Testing](CONTRIBUTING.md#testing) — read it before writing any test

### Test tiers (short form)

- **E2E** (Playwright): important user workflows only — quality over quantity
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

# Misc

When adding a link to session/proposal modal, see `modal-nav.ts`, there are gotchas (anchor: MnpjIo7Y).
