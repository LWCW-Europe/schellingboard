# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

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

### Changed

- **Project renamed to SchellingBoard**: playful nod to Schelling points (coordination without communication), ironically applied to a tool that enables explicit coordination
- Upgraded to Next.js 16, React 19, Tailwind CSS v4, and headlessui v2
- Times now display in 24-hour format
- Session details now open in a modal directly from the schedule, with real, shareable links, and open instantly instead of waiting on the server

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

[Unreleased]: https://github.com/LWCW-Europe/schellingboard/compare/9aa2a273...HEAD
[2.0.0]: https://github.com/LWCW-Europe/schellingboard/compare/babcd6275a853f1911cd48bbdaf4f2b1725c3d47...9aa2a273
[1.0.0]: https://github.com/rachelweinberg12/scheduling-app/commits/babcd6275a853f1911cd48bbdaf4f2b1725c3d47
