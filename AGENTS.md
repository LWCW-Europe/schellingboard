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

## Version Control

- Use `jj` (jujutsu) if available, otherwise `git`
- Pre-commit: run `make precommit` to format, lint, type check, and run tests
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for resolving `drizzle` migration conflicts

## Testing

- Always run tests with `make test` (not `bun test`); E2E tests with `make test-e2e`
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
