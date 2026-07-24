# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- **Protect your name**: attendees can secure the name they act as with a password, so on a shared device others can't pick it and act as them. A protected name shows a small lock in the name selector; choosing it asks for the password, or for a one-time code emailed to the attendee (each code works only once). To turn protection on, the attendee sets their first password from a link emailed to them — proving the address is really theirs, which is what stops anyone else from claiming the name. Forgot the password? The same emailed link resets it, from either the name selector's "Forgot your password?" or Settings. The password is changed, or protection turned off, from Settings using the current password — no email needed to start, and a heads-up email is sent afterwards so an unexpected change doesn't go unnoticed. Requires SMTP
- **Email notifications**: attendees are emailed when a session they've RSVP'd to changes time or location, hosts are emailed when a session they're hosting changes time or location, and guests are emailed when they're added as a co-host of a session. Each notification can be turned on or off individually from the new settings page (requires SMTP and `SITE_URL` to be configured)
- **Profile and settings in the header**: once attendees pick their name, the name chip in the header opens a menu with quick links to their own profile, profile editing, and a new Settings page
- **Richer attendee profiles**: attendees can now share where they're based, the languages they speak, contact details (email, phone, WhatsApp, Signal, Telegram, Discord, website, or anything else), and conversation starters — answers to prompts like "Ask me about", "Looking for", and "Offering", with a button that suggests more playful prompts to pick from
- **Smarter attendee search**: searching the attendees page now looks through whole profiles (name, languages, location, bio, and prompt answers) and shows the best matches first — searching "Italian" finds Italian speakers before someone who merely mentions Italian food

### Changed

- **Kiosk mode stays on while browsing**: opening a schedule with `?kiosk=1` used to only stay in kiosk mode on that exact page — clicking any link (e.g. to Proposals) dropped back to the normal view. It now stays on across the whole site until turned off with `?kiosk=0`
- **RSVPs are private to each attendee**: a profile no longer lists the sessions that person is going to — you can still see who's coming on each session's own details, but their RSVPs are no longer gathered together on their profile, and only they can pull up their own full list. When scheduling, a host who is already busy at the chosen time still triggers a clash warning, but it now just says they're busy at that time rather than naming the session they're attending
- **Settings separated from the public profile**: email notification preferences moved from the profile edit page to the dedicated Settings page, so private preferences are clearly apart from what other attendees can see
- **Your name is always visible**: the attendee you're acting as now shows as a chip in the header on every page — proposals, voting, and schedule — so it's always clear who "you" are, and you can switch attendee from there (handy for a shared device)
- **Attendee list shows location, not bio**: rows on the attendees page now show each person's pronouns and where they're based instead of a preview of their bio
- **Smoother schedule scrolling**: the grid view now has a single scroll area instead of nested scrollbars, and wide schedules can be dragged sideways with the mouse. The view controls (Grid, Text, RSVP'd) sit on one bar alongside an "Event details" popup and a "Proposals" link; the bar scrolls away with the schedule while the room headers stay pinned. The redundant schedule title is gone, since the header already shows the current event

### Fixed

- **Host RSVPs cleared on edit**: adding an attendee as a session host now removes their RSVP to that session, including when an organizer edits the session from the admin panel
- **Hosts can no longer RSVP to their own session**: this was already prevented everywhere in the interface, but a direct request could still add the RSVP
- **Alphabetical sorting ignores case**: attendee, session, and proposal lists now sort names and titles case-insensitively, so e.g. "bob" no longer sorts after "Zoe"
- **"Back to attendees" keeps your place**: returning from an attendee's profile now goes back to the same page, search, and filter you were viewing, instead of resetting to the top of the list
- **Session and proposal editing is now enforced everywhere, not just hidden in the interface**: only a session or proposal's hosts (or, for an unclaimed proposal, anyone) can create, edit, or delete it — previously the interface hid those actions from everyone else, but a direct request could still make the change. Creating or editing as a protected name now always requires that name's password or emailed code, matching the rule already documented

### Security

- **Logging out now clears your selected name too**: previously it only ended the site login, so on a shared device the next person past the password screen was still acting as whoever came before — including a still-verified protected name, selectable without a password. "Log out" in the name-chip menu is now the only way to end a session or switch names (the separate header logout button and the "Switch name" menu entry are gone); logging out then picking a new name is how you switch, and on a password-protected site that now means re-entering the password — a deliberate speed bump against casually acting as someone else on a shared device

### Internal

- **Dev fake clock**: with `SB_ENABLE_DEV_TOOLS=1`, a `?dev=1` toolbar lets you time-travel the app (real time / +1h / +1d / +7d / pick a date) so an event can be walked through its proposal → voting → scheduling phases without editing dates in the database. The override is a request-scoped cookie honoured only when the env var is set, so it is inert in production; the phase helpers now take an explicit `now` instead of reading `Date.now()`. See [ADR 0004](docs/adr/0004-dev-fake-clock.md)
- **Single guest-identity cookie**: the plain `user` name-selection cookie and the signed `user-auth` proof cookie are merged into one httpOnly `guest` cookie carrying the selected name plus a level (`open` for a mere selection, `verified` for a password/code-checked session). This removes the forgeable plaintext `user` cookie that server code could accidentally trust, and routes every read through the `acting-guest` helpers. Only the `verified` level is signed, so a passwordless site with no protected guests still needs no `AUTH_SECRET`. All behaviour is unchanged; the split cookies were never in a release
- **More seed locations**: dev seed data now includes 5 additional locations (reading room, boardroom, auditorium, courtyard, rooftop terrace) with photos, for a more realistic local dev environment
- **Richer seed profiles**: dev/test seed guests now come with realistic based-in, languages, contact details, and conversation-starter data, with a few guests still left blank to keep the "empty profile" case covered
- **Configurable mailpit ports**: mailpit's host ports can now be overridden with `MAILPIT_SMTP_PORT`/`MAILPIT_UI_PORT`, so multiple project instances (e.g. separate clones or workspaces) can run on one machine without port clashes. New `make mailpit` target starts it, reading these from `.env.dev.local`; CONTRIBUTING.md documents the recommended per-clone setup
- **Email tests are opt-in locally**: tests that need mailpit are skipped (and reported as skipped) unless the mail variables are set in `.env.test.local`, so a fresh checkout passes without Docker. CI sets the variables explicitly and the tests fail there if they go missing, so they can never be silently skipped in CI. `make precommit` now includes the e2e tests
- **Consistent verified-session checks**: three pages (profile edit, public profile, attendee directory) checked who's "logged in" by reading the plain name-selection cookie instead of the verified session, so a protected name without a verified session could still see edit controls meant only for a proven session. They now go through the same verified-session check used elsewhere
- **Seed data exercises account protection**: 10 dev/test seed guests now have account protection enabled with a shared demo password (`seed-password`), so the lock icon and protected-name flows have real data to show off locally

## [3.0.0] - 2026-07-13

> **Breaking change**: the database backend has switched from Airtable to SQLite. There is no automated migration path — data must be re-entered manually or migrated via a custom script.

### Added

- **SQLite replaces Airtable**: the database backend is now SQLite (via Drizzle ORM); no Airtable account is needed. `DATABASE_URL` defaults to `./data.db` and migrations run automatically on startup
- **Full admin web UI**: create, edit, and delete events, locations, guests, users, sessions, and proposals at `/admin`, with search, pagination, and bulk actions throughout
- **Dedicated admin password**: `/admin` requires its own `ADMIN_PASSWORD`, separate from the site-wide password, so admin access can be granted independently
- **Kiosk mode** (`?kiosk=1`): an unattended schedule view for screens at the venue — auto-scrolls back to the current time (marked with a red line), refreshes itself so it never goes stale, and keeps the display awake, while staying fully interactive for RSVPs
- **Markdown support**: profile bios and session/proposal/event/site descriptions can now use markdown formatting
- **Editable user profiles**: attendees can add an avatar and pronouns to their profile, with inline validation on the form
- **Configurable break time and schedule increment**: the break time between sessions and the schedule's time grid (15/30/45/60 min) are now configurable per event
- Admins can send an email directly to a user from the admin panel (requires SMTP configuration)
- The schedule folds past days by default, keeping the view focused on what's coming up
- **Per-event timezone**: each event stores its own timezone, selectable from a dropdown; hardcoded offsets are gone
- **Configurable maximum session duration**: set per event; duration buttons in forms are generated dynamically (30-minute increments up to the configured limit)
- **Location images**: images can be attached to locations via the admin UI
- **Dynamic navigation from database**: nav items are generated from events stored in the database, with an optional icon per event
- **Configurable site settings**: the site title, description, and an optional venue map are stored in the database and editable at `/admin/settings`; the map modal appears only when a map has been uploaded
- **Production Docker Compose setup**: `compose.yml`, `Dockerfile`, and `.env.example` for running the app in production
- **MIT License**: the project is now explicitly MIT-licensed
- Sticky schedule header for a cleaner mobile view
- **Optional hard RSVP capacity limit**: admins can enable a per-event setting that closes RSVPs once a session's capacity is reached, instead of only using capacity as a soft suggestion
- **HTTP API for scripting**: sessions, votes, and RSVPs can be created, updated, or removed over plain HTTP (`/api/*`), and an admin-authenticated API (`/api/admin/*`) supports seeding events, days, locations, guests, users, proposals, sessions, and RSVPs from external scripts

### Changed

- **Project renamed to SchellingBoard**: playful nod to Schelling points (coordination without communication), ironically applied to a tool that enables explicit coordination
- Upgraded to Next.js 16, React 19, Tailwind CSS v4, and headlessui v2
- Times now display in 24-hour format
- Session details now open in a modal directly from the schedule, with real, shareable links, and open instantly instead of waiting on the server
- The nav bar now shows the event icon and name even when there is only one event, so it's easy to jump back to the event's main page (e.g. from the attendees list)

### Fixed

- Session overlap validation incorrectly allowing boundary-coincident sessions
- `SelectHosts` Combobox switching between controlled and uncontrolled when no host is selected
- Several Next.js 15/16 compatibility issues (params and searchParams are now async)
- React 19 compatibility: `useFormState` replaced with `useActionState`
- Empty location `imageUrl` causing a render error
- RSVPing twice on the same session no longer creates duplicate entries or inflates the attendee count
- Voting twice in quick succession no longer creates duplicate votes
- Vote and RSVP counts could show outdated numbers due to caching; responses are no longer cached
- Header no longer overlays page content when only one event exists
- Various mobile layout issues fixed (footer, overscroll, sticky headers, stretching grid cells)
- Login sessions last longer before requiring re-authentication
- Proposal form no longer shows a stray error message after a successful submit
- Event URLs are now guaranteed unique and no longer misresolve for events with similar names
- "Attendees" nav link is now reachable from the mobile menu instead of being squeezed out of the header
- Session details now show max capacity (previously only visible on hover from the schedule overview)
- Session description field couldn't be resized, making it hard to edit longer text
- The schedule now shows only the locations assigned to that event, instead of every location across all events
- Guests who are not part of an event can no longer add or edit sessions, create or edit proposals, or vote in it (previously only RSVPs were blocked)

### Security

- **HMAC-signed auth cookie**: the static cookie value was replayable by any client, bypassing `SITE_PASSWORD`. The value is now HMAC-SHA256-signed with `AUTH_SECRET` and freshness-checked on every request. `AUTH_SECRET` is required whenever `SITE_PASSWORD` is set.

### Internal

- Unit tests with Vitest (coverage floor enforced in CI)
- Integration tests for API routes
- E2E tests on Firefox added to CI alongside Chromium
- E2E suite now also runs against a production build, not just dev mode
- ESLint now covers all files (previously only `app/`, `db/`, `utils/`)
- CONTRIBUTING.md added with architecture overview and development workflow
- Dependabot update grouping with cooldown to reduce PR noise

## [2.0.0] - 2025-08-29

The version number 2.0.0 is a retroactive label assigned here purely as a reference point — it was never designated as such. It is chosen to signal the significant deviation from the upstream baseline accumulated since the fork was created.

This version corresponds to commit [9aa2a273](https://github.com/LWCW-Europe/schellingboard/commit/9aa2a273). It was never properly released since it was deployed directly from the Git repository.

### Added

- **Session proposals**: Attendees can submit session ideas (title, description, duration, hosts) before scheduling begins
- **Voting on proposals**: Three-option voting (interested / maybe / skip) with vote counts displayed in a sortable table during and after the voting phase
- **Event phases**: Configurable proposal, voting, and scheduling phases that control which features are active at any given time
- **Site-wide password authentication**: Optional single-password gate to restrict access to the entire app
- **RSVP clash detection**: Users are warned when RSVPing to a session that overlaps with another they are already attending or hosting
- **Blocker sessions**: Organizers can place fixed, non-attendable blocks on the schedule (e.g. meals) that reserve time slots
- **Closed sessions**: Sessions can be marked as closed (no latecomers)
- **Session attendee list**: Session details show the full list of people who RSVPd
- **Break enforcement**: Sessions display 5 minutes shorter (10 for sessions > 60 min) to reserve break time; stored duration is unchanged
- **Proposal-to-session linking**: Sessions created from a proposal retain the link, navigable in both directions
- **Schedule-from-proposal button**: Proposals can be directly scheduled from the proposals view, pre-filling the session form
- **Session details modal**: Clicking a session opens a modal with full details plus dedicated RSVP and Edit buttons
- **Host icon on session blocks**: Session blocks show a distinct icon when the current user is the host (vs. just attending)
- **Session location badge**: Location shown as a badge directly on schedule session blocks
- **Proposal table sorting**: Sort by vote count, creation time, duration, and more — on both desktop and mobile
- **Quick voting**: Streamlined voting directly from the proposals list without opening each proposal individually
- **Footer with build info**: Configurable footer displaying the commit hash and other deployment metadata

### Changed

- Session blocks: clicking anywhere opens session details; clicking the RSVP count in the corner RSVPs/un-RSVPs
- Session form pre-fills the current user as host when creating a new session
- Improved mobile layout throughout (reduced padding, better button sizing, no fixed footer on landscape phones)
- User selector closes automatically after a selection when only a single user can be chosen

### Fixed

- RSVP toggle bug: clicking RSVP was adding a duplicate entry instead of toggling
- Un-RSVP not decrementing the displayed RSVP count
- RSVPing broken on mobile (tapping a session block was opening the user-select modal instead)
- Session creation crashing when the current user had an RSVP in a different event
- Session clash validation incorrectly including sessions from the next calendar day
- Session clash validation incorrectly flagging sessions from different events
- Schedule grid breaking when 13 or more locations were shown (Tailwind CSS `grid-cols` limitation)
- Tooltips rendering behind other elements instead of on top
- Updating a nonexistent session returning 500 instead of 404
- Deleting a session not removing all associated RSVPs
- Remove-guest button in the host selector causing a browser console error
- Modals not dismissible with the Esc key

### Internal

- Airtable schema migrations: a migration system for evolving the Airtable schema over time
- E2E tests: Playwright-based end-to-end tests covering core user flows
- GitHub Actions CI: automated PR checks (lint, build)
- Dependabot: automated dependency update PRs

## [1.0.0] - 2025-04-07

The version number 1.0.0 is a retroactive label assigned here purely as a reference point to mark the upstream baseline — it was never designated as such. This is the upstream codebase at the point the fork was created, taken from commit [babcd627](https://github.com/rachelweinberg12/scheduling-app/commit/babcd6275a853f1911cd48bbdaf4f2b1725c3d47) of [rachelweinberg12/scheduling-app](https://github.com/rachelweinberg12/scheduling-app) ([full log](https://github.com/rachelweinberg12/scheduling-app/commits/babcd6275a853f1911cd48bbdaf4f2b1725c3d47/)). It was never properly released since it was deployed directly from the Git repository.

[Unreleased]: https://github.com/LWCW-Europe/schellingboard/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/LWCW-Europe/schellingboard/compare/9aa2a273...v3.0.0
[2.0.0]: https://github.com/LWCW-Europe/schellingboard/compare/babcd6275a853f1911cd48bbdaf4f2b1725c3d47...9aa2a273
[1.0.0]: https://github.com/rachelweinberg12/scheduling-app/commits/babcd6275a853f1911cd48bbdaf4f2b1725c3d47
