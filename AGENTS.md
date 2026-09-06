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

Update `CHANGELOG.md` under `[Unreleased]` for any user-facing change. The audience is
event organizers and attendees, so keep it non-technical. Dev-only changes go under
`Internal`. See [CONTRIBUTING.md § Changelog](CONTRIBUTING.md#changelog) for the section
types.

**Format**: `- **Bold lead phrase** (#123): what changed, and — only where it isn't
obvious — what was wrong before.`

**Hard limits** — limits, not targets:

- One bullet per change. **Two lines of prose, ~40 words, maximum.** No sub-bullets, no
  second paragraph. If it doesn't fit, you are explaining too much.
- Reference the GitHub issue where one exists — `(#123)`, straight after the lead
  phrase. Take the number from the commit's `fixes #123` / `issue #123` footer, never
  from the PR number GitHub appends to a squashed subject. No issue, no reference.
- Several commits that together deliver one feature get **one** bullet, not one each.
- `Internal` is **not a second commit history** — git already has that, in more detail
  and better indexed. It lists only internal changes that are particularly valuable,
  disruptive, or otherwise a highlight of the release: roughly **3 entries per release,
  one line each (~25 words)**. Everything else — test and flake fixes, refactors,
  dependency bumps, perf tweaks, lint config, tidy-ups — gets **no entry at all**. If
  you are unsure whether it qualifies, it doesn't.

**Never in the changelog**: rationale and trade-offs; how it was implemented; file,
function, library or framework names (outside `Internal`); edge cases; the story of how
a bug was found; future plans; anything the lead phrase already said. Those belong in
the commit message, an ADR or `docs/dev/`.

```
Bad  - **Interrupting a profile slide no longer restarts it**: pressing Next or Prev
       (or swiping again) while a profile was still sliding used to snap the card back
       to the start and replay the whole slide, putting off the arrival a little more
       with every press. Repeated presses in the same direction now let the first slide
       finish, a press the other way turns the card around from wherever it is, and
       catching a sliding card with a finger picks it up where it is.
Good - **Interrupting a profile slide no longer restarts it** (#123): pressing Next or
       Prev mid-slide used to replay the animation from the start.
```

## In-app release notes

`app/release-notes.ts` backs the footer's version button. Its first entry is the release
being prepared, and it holds **3–5 highlights of that release — no more**.

- A highlight is something a reader would want announced. If it wouldn't open a release
  announcement, it doesn't belong: bug fixes, polish and internal work almost never do.
- One sentence each, ~25 words, `**bold lead phrase**` first. No issue references.
- **The list is not append-only.** Add yours when the change lands, knowing what else is
  coming may displace it; when it is full, replace the weakest highlight rather than
  adding a sixth.
- Before finalizing a release, read the entry against `CHANGELOG.md` and check these
  really are the release's most representative changes for attendees and organizers.
  See [docs/dev/releasing.md](docs/dev/releasing.md).

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
- Work on a GitHub issue ends with a footer naming it: `fixes #123` when the commit fully resolves
  the issue (GitHub then closes it), `issue #123` when it is only part of the work
- See [docs/dev/migrations.md](docs/dev/migrations.md) for resolving `drizzle` migration conflicts

### jj paths with special characters

Paths like `app/(site)/[eventSlug]/...` break jj's default parsing: `()` are fileset grouping
operators, and `[eventSlug]` is read as a glob character class (matches nothing). Fix: use `file:`
(exact match) and quote it:

```
jj commit -m "message" -- 'file:"app/(site)/[eventSlug]/session-block.tsx"'
```

### Squashing

`jj squash` opens an interactive editor when both source and destination have a message, which
breaks non-interactive shells. Always pass either `-m "message"` or `--use-destination-message`.

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
  - add `--no-deps` for a spec in the `firefox-globals` project (`settings.spec.ts`), or the whole
    project it depends on runs first
- Full test strategy and TDD rules are in [docs/dev/testing.md](docs/dev/testing.md) — read it before writing any test
- Before running tests for the first time in a session, check whether mailpit is running (`docker compose -f docker-compose.dev.yml $(test -f .env.dev.local && echo --env-file .env.dev.local) ps mailpit` — mirrors the `mailpit` Makefile target, including its `--env-file` conditional, since `.env.dev.local` can set a per-clone `COMPOSE_PROJECT_NAME`); if not, ask the user whether to start it (`make mailpit`)

### Test tiers (short form)

- **E2E** (Playwright): important user workflows only — quality over quantity
- **E2E against the Docker image** (`make test-e2e-docker`): the same suite against a container. Not part of `make precommit`; the release workflow runs it against the image it is about to publish, so run it by hand after touching the `Dockerfile`, the standalone build, or anything path-, upload- or migration-related — well before a release. The container runs in UTC, so it catches dates formatted in the ambient time zone; format in the event's zone
- **Integration** (Vitest, real DB): high coverage of business logic via repositories/server actions
- **Release upgrade** (Vitest, part of `make test`): migrates a released version's seeded database forward and exercises CRUD on it. Add a fixture only when releasing (`make dump-release-db VERSION=vX.Y.Z`), never by hand
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

### Comments

**Read [docs/dev/coding-guidelines.md](docs/dev/coding-guidelines.md#comments) before
writing any comment.** The rule is: comment the WHY, not the WHAT. The short version,
with the limits agents keep overshooting:

**Default to zero.** Most changes should add no comments at all. Adding none is a normal,
correct outcome — not a gap to fill. Never add a comment merely because a function is long,
because you touched the file, or to summarise what you just wrote.

**Hard limits** — limits, not targets:

- **At most one comment per ~50 lines of new code**, and **two lines each, maximum**. Over
  either limit, delete the weakest until you are under it. A longer comment needs a reason
  a reader could not reconstruct (a subtle race, a spec constraint) and should be rare.
- **Never narrate the blocks of a function.** `// validation`, `// Add RSVP`,
  `// Make the actual API call`, `// Revert optimistic update on error` are all
  forbidden: the code under them says exactly that.
- **No doc blocks or `@param`/`@returns` that restate the signature.** TypeScript types are
  the documentation.
- **No section banners** (`// ---- helpers ----`), commented-out code, or notes about the
  change you are making (`// now also handles X`, `// new in v2`) — that goes in the commit
  message.
- **No comment that duplicates a value or behaviour defined elsewhere** — it goes stale
  silently.

**The delete test**: cover the comment and read the code under it. If the code tells you
the same thing, delete the comment. Apply this to every comment before you finish, and
again before committing.

This rule **overrides consistency with surrounding code**. Parts of this codebase are
over-commented; do not match their density, write the sparse version. Removing a redundant
comment from code you are already changing is welcome; a sweeping cleanup of untouched
files is not.

#### Examples from this codebase

Bad — `app/(site)/context.tsx` narrates itself; every one of these should be deleted:

```ts
// update RSVPs optimistically      <- the function is named updateRsvp
// Remove RSVP                      <- above rsvps.filter(...)
// Add RSVP                         <- above setRsvps([...prevRsvps, newRsvp])
// Make the actual API call         <- above fetch("/api/toggle-rsvp")
// Revert optimistic update on error
// Update existing vote / Add new vote if none exists
```

Good — each says something the code cannot (`app/api/votes/route.ts`,
`app/api/add-vote/route.ts`, `app/(site)/guests/avatar.tsx`):

```ts
// Without an explicit no-store, browsers heuristically cache this response
// and show stale votes after a reload.
const NO_STORE = { headers: { "cache-control": "no-store" } };

// Atomic upsert: concurrent requests for the same (guest, proposal)
// cannot produce duplicate votes.
await repos.votes.upsert({ proposalId, guestId, choice });

// Matches the box above (h-28 = 112px, ...). Stored avatars are up to 1024px, so
// declaring the displayed size is what keeps next/image's 2x srcset entry at a
// thumbnail-sized rendition instead of a 640px one.
const renderedSize = { lg: 112, md: 64, sm: 48 }[size];
```

## Misc

When adding a link to session/proposal modal, see `modal-nav.ts`, there are gotchas (anchor: MnpjIo7Y).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
