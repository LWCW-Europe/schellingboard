# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- **Comments on attendee profiles**: a profile now ends with the same comment section sessions and proposals already
  have — threaded replies, likes, editing and deleting your own comments. Open anyone in the directory to say hi or
  arrange to meet up
- **Comments on sessions**: a session's details now have the same comment section proposals already had — threaded
  replies, likes, editing and deleting your own comments. Open any session in the schedule to discuss times, rooms or
  last-minute changes
- **Moving between attendee profiles slides instead of jumping**: Prev, Next and the arrow keys now slide one profile
  out as the next slides in, the way a swipe already moves between them

### Changed

- **What a room offers is easier to find**: room names on the schedule grid that have a description now carry an ⓘ,
  and tapping or hovering the name opens it. Before, the description only appeared when a mouse happened to rest on
  the name, with nothing to suggest it was there, and on a phone it was cut off at the edge of the screen
- **"Back to ..." links look the same everywhere**: on the session form, the proposal form and the user import page
  they were red buttons or gray buttons that competed with the page's real action. All of them are now the same quiet
  "← Proposals" style already used elsewhere
- **The session form starts where every other form does**: the add and edit session pages left an empty band above the
  form that no other page has

### Internal

- Split the comments repository into a scope-agnostic core plus separate proposal-comment and session-comment
  repositories
- Session and profile comments now have integration and end-to-end test coverage mirroring the proposal comment suites

### Fixed

- **Deleting a proposal goes straight to the list**: the delete could throw an error into the browser
  on the way out, because the page of the proposal just deleted was rendered once more before the
  list appeared
- **The session form shows which day owns the small hours**: a day that runs past midnight is now labelled with the
  hour it ends ("Friday, June 13 (until 03:00 Sat)"), and its start times after midnight carry their weekday ("Sat
  01:10"), so it's clear that the late slots belong to the evening's day. Day names also follow the event's timezone
  instead of the reader's, which could show the day before or after near midnight
- **Sessions after midnight are scheduled on the right date**: on a day that runs past midnight (say Friday 09:00 to
  Saturday 03:00), booking a session at 01:00 saved it on the Friday morning instead — almost a day early — where it
  vanished from the schedule entirely. Late-night times now land on the following calendar date, including on the last
  night of an event
- **Interrupting a profile slide no longer restarts it**: pressing Next or Prev (or swiping again) while a profile was
  still sliding into place used to snap the card back to the start and replay the whole slide, putting off the arrival a
  little more with every press. Repeated presses in the same direction now let the first slide simply finish, a press
  the other way turns the card around smoothly from wherever it is, and catching a sliding card with a finger picks it
  up where it is instead of teleporting it
- **Setting a password no longer leaves your name stuck in the header**: after protecting your name from the same browser
  you had already picked it in, the header kept showing your name while the site had stopped recognising it — so "Edit
  profile" and "Settings" both answered that no name was selected, and the chip for picking one again was nowhere to be
  found. Setting a password now signs that browser out on the spot, so the header offers "Select your name" straight
  away and you pick your name again with the password you just set. A password reset signs you out the same way
- **A protected name is asked to log in, not to pick a name it already picked**: if you protected your name from your
  phone while your laptop still had that name selected, Settings and Edit profile on the laptop told you to select who
  you are — advice that could not help, since your name was selected. Both pages now say the name is protected and point
  you at the header chip to switch to it with your password or emailed code

### Security

- **Sessions can only be booked in the hours their day allows**: a session's times were taken on trust from the form,
  so a hand-crafted request could place one at any hour of the day it named — before bookings opened, after they
  closed, running on into the hours you kept for yourself, or off the schedule grid. The day is now looked up in the
  site's own records and the session required to start and finish inside its booking window. Organizers are
  unaffected: the admin pages place sessions as before
- **A booked session can't outlast the event's maximum**: the length also came from the form and was never rechecked,
  so a hand-crafted request could hold a room for the whole booking window. Hosts booking for themselves are now held
  to the longest duration the form offers

### Internal

- `scripts/e2e-flake-hunt.sh` runs the E2E suite N times against one build and keeps every run's JSON
  report plus traces of what failed; `scripts/e2e-flake-report.ts` aggregates those into a report
  ranking flaky tests by failure rate and grouping them by error signature. See
  [docs/dev/testing.md § Flake hunting](docs/dev/testing.md#flake-hunting)
- Throwaway names in E2E tests carry the worker's process id and a counter, not just `Date.now()`:
  two parallel workers can land in the same millisecond, and the duplicate name would surface as an
  unreproducible locator failure somewhere else entirely
- E2E specs that change site-wide settings run in their own Playwright project, after the parallel
  bulk and with the site to themselves. `settings.spec.ts` restored what it changed, but only after
  asserting on it, and nothing stopped a future test from reading the site title in that window
- The attendee-directory E2E tests assert the order of two named seeded attendees instead of who
  sits first in the whole list, which a user created by a parallel admin test could take. The rule
  behind it — never assert on a global aggregate of shared data — is written down in
  [docs/dev/testing.md § E2E conventions](docs/dev/testing.md#e2e-conventions)
- The schedule-layout E2E tests scroll until what they assert on has moved, instead of wheeling a
  fixed amount and waiting 300–500ms for it. The room-details hover retries too: under load the
  mouse could arrive before the grid had hydrated, and that first hover was simply lost
- E2E tests settle the page before reloading it rather than after. The kiosk tests wait for the
  dev clock's refresh to finish streaming, and the view-session test for the fetches the session
  modal starts; a reload aborts whatever is still in flight, which logs the RSC-payload and
  `NetworkError` failures the console guard fails on. Waiting only afterwards was too late
- Mail E2E tests wait for the mail they triggered by its identity instead of counting how many
  match its subject. Mailpit answers a search with the newest 50 matches and keeps only the newest
  500 messages, so once a few suite runs had filled those the count of "Set your password" mails
  for one guest stopped growing and every test waiting for one failed. The waits are also 15s now:
  rendering, SMTP and indexing all stretch under parallel load
- E2E tests no longer decide what to assert from a single `isVisible()` sample (quick voting, the
  voting-disabled state, admin login, the RSVP capacity test). Each now waits for the state it
  expects, and the RSVP capacity test books a slot that overlaps nothing, so whether it has to
  confirm a clash warning no longer depends on what else is scheduled
- The session modal cancels its RSVP request when it closes and ignores one the browser kills on the
  way out of the page. The rejection had nowhere to go and surfaced as an uncaught "NetworkError
  when attempting to fetch resource" — noise in the browser console, and a failed E2E run whenever a
  reload caught the request in flight
- The kiosk E2E test waits for the `kiosk` cookie to be gone before it navigates on. `?kiosk=0`
  leaves the now line out of the server render, so the assertion after it could pass before the page
  had hydrated and run the effect that clears the cookie — and the page after that came up in kiosk
  mode again. The rule behind it — an assertion the server render already satisfies says nothing
  about what a page does on hydration — is written down in
  [docs/dev/testing.md § E2E conventions](docs/dev/testing.md#e2e-conventions)
- The E2E name-switcher helper taps the header chip again when neither the menu nor the modal
  opened. The header comes from the server render, so the chip satisfies every check Playwright
  makes a moment before React has attached its handler, and a click in that window is dropped — the
  test then sat out its full 90s waiting for a modal that was never going to open
- The emoji, label and display order of a vote live only in `app/(site)/votes.ts`, and `VotesContext` exposes
  `proposalVoteLabel` beside `proposalVoteEmoji`. The choice→label mapping had been copied into three components, each
  free to drift from the emoji next to it
- The ❤️/⭐ tally against a proposal is one `VoteTally` component instead of three hand-written copies, and the vote
  breakdown lists its rows from `VOTE_CHOICES`. Both had the emoji spelled out inline, so a change in `votes.ts` would
  have left them behind
- The proposal table's sortable column headers, filter buttons and Edit/Schedule pair are each written once rather than
  copied five, three and two times. Copies had already drifted: the "Host(s)" header was the only one not left-aligned,
  only "My proposals" announced itself as pressed to a screen reader, and the "No proposals found" row stopped one
  column short of the table during the scheduling phase
- `date-fns` is gone from the dependencies. The day picker held its last import; every other date is formatted with
  luxon, which is what the timezone-aware formatting needs anyway
- The admin cookie check for server actions and server components is one `isAdminRequest` in
  `utils/acting-admin.ts`, the counterpart to `utils/acting-guest.ts`, instead of the same private
  helper copied into all eleven admin action modules, the admin layout and `require-admin.ts`
- `update-session` establishes that the caller hosts the session before it judges the times sent
  with the request, so a stranger gets `403 Only a host may edit this session` rather than a
  complaint about the booking window
- The session routes check that the day id they were sent is a string before looking it up: any
  other JSON value reached the query as an unbindable parameter and failed the request as a server
  error

## [3.4.2] - 2026-08-24

### Fixed

- **Only the event's own rooms can be booked**: the location list when adding or editing a session offered every bookable room in the system, so a session scheduled from the proposal list could end up in a room belonging to another event — and then never appear on the schedule. Attendees are now offered exactly the rooms assigned to that event, that are bookable and not hidden, and a session saved in any other room is refused
- **The session form says why it was refused**: adding or editing a session that the site turned down showed only "Failed to update session". It now shows the actual reason, such as the name protection or room message

### Security

- **A session's capacity always comes from its room**: the session form sent the room's capacity along with the session, so a hand-crafted request could claim any capacity and get past a hard RSVP limit. Capacity is now read from the room itself

## [3.4.1] - 2026-08-21

### Fixed

- **Long profiles scroll again**: a profile with more in it than fits the window was cut off at the bottom with no way to reach the rest. Only a phone held upright was unaffected

## [3.4.0] - 2026-08-21

### Added

- **Hosts see how their proposal did**: during the scheduling phase your own proposal shows a vote breakdown — how many attendees voted, and how the votes split between ❤️ Interested, ⭐ Maybe and 👋🏽 Skip — ending with a rough range for how many people to expect. That range comes from a formula fitted to 13 sessions at a single event, so it can be well out in either direction: use it to pick a room, not to plan handouts. Expect it to change as more events are recorded. No figure is shown when fewer than one attendee in ten voted, when nobody voted ❤️, or before the event has attendees. Only a proposal's hosts see it; a proposal nobody has taken on shows it to everyone. Who voted which way is still never shown
- **Dark mode**: chosen with the System / Light / Dark switch at the bottom of every page (and under "Appearance" in settings). "System" — the default — follows your phone or laptop. The choice is remembered per device and applies on the login screen and on a kiosk display too
- **Read through the attendees one after another**: a profile now opens over the list instead of replacing it, with **Prev** and **Next** at the top, so closing puts you back exactly where you were with your search and filters intact. Arrow keys do the same, Escape closes, and on a phone you swipe sideways. Prev and Next follow whatever the list is showing, and the count at the top ("12 of 87 attendees") says where you are. Profiles opened from a session, proposal or comment work the same way, over the full attendee list. Each profile is a step in browser history, so Back retraces the ones you read
- **Sort the attendee directory by who edited their profile last**: a "Sort by" choice switches between "Name (A–Z)" and "Recently updated", and each row shows when that profile was last edited. Nothing recorded edit times before this version, so every profile that already has something in it is dated from the upgrade and they rank together, ahead of the empty ones. While a search is active the list stays ordered by match quality and the choice is unavailable
- **Show only the attendees who have filled something in**: a "Has profile" filter hides the names that carry nothing but a name, and combines with "Session host". Anything an attendee entered counts — bio, pronouns, location, languages, photo, an answered conversation starter or a contact detail
- **Formatting and clickable links in the rest of your profile**: conversation-starter answers and contact details now accept Markdown, like "About me" already did, and a plainly pasted web or email address becomes clickable

### Fixed

- **The link button now guesses which half of the link you selected**: selecting a word and pressing the link button (or Ctrl+K) used to put it where the web address belongs, leaving `[](my blog)`. It now becomes the link's visible text, `[my blog](url)`, with `url` left to replace. A selected web address still goes where the address belongs
- **The vote you picked is now unmistakable**: a chosen vote button was marked only by a pale blue tint, nearly invisible with a dark-mode browser extension or for anyone who has trouble telling colours apart. It is now filled solid blue with a check mark, and screen readers announce it as selected
- **Proposal search reads the whole description**: "Search proposals" only looked at titles and the opening words of a description, so a term further down found nothing. Descriptions are now searched all the way through, bold or italic text is matched as it reads on screen, and matching is stricter — the handful of proposals that genuinely match, not half the list. A small typo is still forgiven
- **Searching a long proposal list no longer makes the page stutter**: with a couple of hundred proposals, every letter typed into "Search proposals" left the page unresponsive for a moment, as did sorting, filtering or voting from the list. Searching now keeps up with typing
- **Room colours on the schedule are readable**: a session block was filled with its room's colour at full strength and lettered in white, leaving titles all but invisible on yellow, lime or amber. Blocks are now a light wash of the colour with a strong border in it and ordinary text, so all 22 room colours read equally well

### Changed

- **Profiles show the photo big**: instead of a small round thumbnail, with name, pronouns, location and languages under it and the bio, prompts and contact details beside it on a wide screen. Photo and name stay in view while scrolling; on a phone everything stacks as before. Photos are cropped to a square around their centre, so upload one with the face roughly in the middle
- **The attendee directory shows who people are, not just their names**: each row now carries the first couple of lines of the bio — or, failing that, the first conversation starter answered — so the list can be read straight through. Faces are bigger, and the whole directory is on one page instead of 25 names at a time
- **Searching and filtering the attendee directory is instant**: it no longer reloads the list from the server and drops you at the top. The address bar still carries what you are looking at, so a filtered or searched list can be bookmarked and shared as before
- **The attendee directory is wider on a large screen**: update times no longer crowd the names. On a phone the update time sits under the name, and a "Session host" badge no longer squeezes the name into two lines
- **"Back to attendees" is now a small link, not a big red button**: on the edit-profile and settings pages it is a quiet "← Attendees" link in the corner, the same as everywhere else
- **The documentation is shorter and easier to skim**: walls of prose became bullet lists, the important warnings — an RSVP is a commitment, the name picker is not a login, don't copy a live database — are now highlighted boxes, and the background on how the attendance prediction was fitted is down to a sentence. The attendee guide is a fifth shorter without losing anything you need to use the app. See [the documentation](https://docs.schellingboard.org/)
- **Attendee search now looks at the whole profile**: it also matches the contact details attendees chose to publish (handles, usernames, websites, and the service they belong to) and the prompt questions themselves, not only their answers. Private email addresses are never searched

### Internal

- A fitted model for predicting session attendance from voting results, in `docs/dev/attendance-model/`, based on 13 sessions from a 259-attendee event. It predicts a range rather than a number, and the write-up is anonymised so it can be shared with hosts. With 13 sessions the vote–attendance correlation is not statistically significant, so it is a best guess — counting attendance at the next event is what would settle it
- Comments and the likers of a comment are ordered by when they were written, falling back to insertion order rather than their random id on a tie. `tests/integration/comment-likes.test.ts` failed intermittently because of it, and the same coin flip could reorder a thread in production
- Groundwork for dark mode: colours are named by role (`bg-surface`, `text-fg-muted`) and defined once in `app/globals.css`, where a `@variant dark` block holds the values that differ. A unit test holds both themes to a WCAG contrast ratio per pair, so a washed-out colour fails the build. See [ADR 0005](docs/dev/adr/0005-dark-mode.md)
- The schedule, the session and proposal forms and the admin locations page name colours by role instead of by palette shade. A location's colour is derived from its hue with `color-mix()` against the current surface and foreground, so a single `loc-<name>` class works in both themes and the `@source inline(...)` safelist is gone; `tests/unit/location-colors.test.ts` recomputes the contrast of all 22 hues in both themes. The rest of the app still uses palette shades
- Dependabot now keeps the mailpit image up to date. Its pin was repeated in `docker-compose.dev.yml` and both CI workflows, and Dependabot cannot see a workflow's `services:` image ([dependabot-core#5819](https://github.com/dependabot/dependabot-core/issues/5819)), so CI starts mailpit from the compose file and the pin has a single home. The image carries a tag as well as a digest, since a digest alone gives Dependabot no version to compare
- Seeded guests with a profile now carry a last-edited date spread over the past month, instead of all being undated — "Recently updated" had nothing to sort in dev and demos
- The dev seed (`make dev-db-seed`) defaults to a `large` profile: 400 guests, ~750 proposals and a mostly filled Gamma schedule, generated deterministically on top of the unchanged curated fixtures, so slow list rendering surfaces before a real event hits it. The E2E suite always seeds the curated-only `small` profile (`SEED_PROFILE` selects one explicitly), so tests stay fast and cannot come to depend on bulk data. The seed script is split into `scripts/seed/`: curated data under `data/`, the bulk generator in `bulk.ts`
- All screenshots on the landing page and in the docs recaptured against the large seed profile, so lists scroll and the schedule looks like a real event. The settings shot is in dark mode, which is the one place both sites show that the app has themes
- Conference Gamma gets four more seeded proposals: two hosted by Hana Kobayashi, the most complete seeded profile, and two with no host yet. Both cases were previously only reachable through random host assignment, which made them awkward to point a screenshot at

## [3.3.1] - 2026-08-08

### Fixed

- **A greyed-out button now says why it is greyed out**: for a greyed-out vote button, "Go to Quick Voting!", "View Schedule", "Add Proposal", "Schedule" or one of the proposal filters, the reason — "Voting will be enabled at …", "Select a user first" — used to appear only when hovering with a mouse, which a phone cannot do, so there the button just looked broken. Tapping or clicking one now shows the reason at the bottom of the screen for a few seconds. Those buttons also keep their place in the Tab order, and a screen reader now announces that they are unavailable together with the reason, instead of skipping past them in silence
- **Quick Voting reads better on a phone**: the text no longer runs into the edges of the screen. The big "Back to Proposals" button at the top has become a small "← Proposals" link, so the proposal you are voting on is the first thing you see, and the "You are: …" line is gone — your name is already in the header
- **The "← Events" link in the admin area is easier to hit**: it was too small to tap reliably with a thumb

### Added

- **Every documentation page says when it was last updated**: pages on [docs.schellingboard.org](https://docs.schellingboard.org) now end with the date of the last change to that page, and hovering it lists the recent ones — so it's clear at a glance whether what you're reading has kept up. Each version of the documentation is dated from its own release, not from the newest
- **The attendee guide now explains the parts attendees kept asking about**: what the three phases are and what each one lets you do; why the vote buttons are greyed out before voting opens (the most common source of confusion); that vote counts stay hidden until voting closes, so nobody's vote sways anyone else's; that Quick Voting is the fast way through and your votes can be changed at any time; both routes for putting a proposal on the schedule, including that hostless proposals are up for grabs and the same proposal can be scheduled twice; that only vote counts are ever shown and never who voted which way; a rough rule of thumb for reading vote counts as expected attendance; and that proposing and voting commit you to nothing while an RSVP does. See the [attendee guide](https://docs.schellingboard.org/attendee-guide/)
- **A guide to backing up your instance**: self-hosters now have a documented way to take a copy of their data — the database and everything uploaded through the admin UI — while the site keeps running, along with how to restore it and what else to keep safe. See [Backup and restore](https://docs.schellingboard.org/self-hosting/backup/)

### Internal

- `scripts/docmd-git-history.js` dates the docs pages from git. docmd's own git plugin was configured for it and worked in `make docs`, but it asks the build engine for the log and the engine runs `git log` in the working directory — so the worktrees `build-docs.sh` builds each published version from were all rejected as outside the repository, the error was swallowed, and every page of the live site shipped undated. `build-docs.sh` now fails the build if any page comes out without a date, since nothing else notices. Avatars are left off so readers aren't sent to Gravatar. See [docs/dev/documentation.md § Dating each page](docs/dev/documentation.md#dating-each-page)

## [3.3.0] - 2026-08-01

### Added

- **Comments on proposals**: attendees can discuss a proposal by leaving a comment on it. Replies are threaded and can be folded away; you can like a comment and see who else liked it, edit or delete your own comments, and link to any single comment. Deleting discards the text for good — there is no history and no undo.
- **Emails when a session is deleted**: hosts and RSVP'd attendees are now told when a session disappears, not only when it moves. It uses the same two settings attendees already have for session changes, so nobody has anything new to turn on
- **Emails on new comments**: proposal hosts are emailed when someone comments on their proposal (on by default), and anyone can opt in to be emailed about later comments on a proposal they commented on (off by default). Both are in Settings
- **`SCHELLINGBOARD_VERSION` in `docker-compose.yml`**: self-hosters can now pin the image to a specific release tag instead of always running `latest`

### Changed

- **A proposal without a host is now clearly a request, not an oversight**: leaving the host field empty has always meant "I'd like someone to offer this", but nothing said so. The proposal form now explains it, a proposal with nobody hosting it shows "No host yet" in italics in the list and on its own page instead of a dash, and its page invites anyone who could give the session to add themselves as a host. The attendee guide explains it too
- **A simpler `docker-compose.yml` for self-hosting**: the file you copy to run SchellingBoard now describes only SchellingBoard itself. It used to also include a mail-catching tool that only developers of SchellingBoard need, and instructions for building the app from source rather than using the published image — both of which invited the question of whether you were supposed to run them. `.env.docker.example` also drops `COMMIT_HASH`, a setting that had no effect. Nothing to do if you already run it: your existing file and settings keep working
- **Saving a form that has errors now says why, right where you clicked**: on longer forms — editing your profile, proposing a session, adding or editing a location — a summary of everything that needs fixing appears next to the Save button, instead of the page simply not moving because the message sits somewhere further up. Each entry is clickable and takes you to the field it belongs to, opening the "Languages", "Contact details" or "Conversation starters" section first if the field is hidden inside it

### Fixed

- **The "Scheduling will be enabled at …" note is no longer cut off**: on a proposal's page, hovering the greyed-out Schedule button showed a note that was clipped at the left edge of the window it opened in, so it started mid-word. It is now shown in full
- **"Voting will be enabled at …" now shows the time on your own clock**: on the proposals list and a proposal's page, the note saying when voting or scheduling opens was given in the time zone of the machine running the site, so a site hosted abroad announced the wrong time. It now shows the time in your own time zone — useful when you are reading it weeks before travelling to the venue — and names that zone whenever it differs from the event's, the same way comment timestamps do

### Internal

- Dev-only services moved to `docker-compose.dev.yml`, so `docker-compose.yml` is purely the deployment file self-hosters copy. `make mailpit` is unchanged; a bare `docker compose up mailpit` now needs `-f docker-compose.dev.yml`. `make docker-build` builds via `docker build`, since the deployment file no longer carries a build context, and tags only `:$VERSION` — `:latest` is now tagged in the release checklist next to the `major` and `major.minor` tags, so a build from an arbitrary working tree can't claim to be the newest release. That build now lives in `scripts/docker-build.sh`, which `make docker-build` and `scripts/e2e-docker.sh` both run, so the release build stays a cache hit of the image the E2E suite tested
- `tests/unit/docker-compose-env.test.ts` guards the environment variables in `docker-compose.yml` against the Configuration reference and `.env.docker.example`. Nothing executes that file — its only user is a self-hoster — so a variable the app started needing could be documented and set in a `.env` yet never reach the container, with nothing to say why the feature was inert
- `docs/dev/coding-guidelines.md` states when a comment earns its place: comment the WHY, default to none, never restate the code or repeat a signature in a doc block. It explicitly outranks consistency with surrounding code, so an agent asked to match the local style doesn't reproduce noisy comments. `CONTRIBUTING.md § Code Style` and `AGENTS.md` both point at it
- `CONTRIBUTING.md` was split: it keeps the day-to-day material and now indexes five longer chapters moved to `docs/dev/` — testing, database migrations, running multiple instances, the documentation and landing-page build, and the release checklist. `AGENTS.md` links to them directly instead of restating them
- `make test-e2e-docker` runs the E2E suite against a container built from the working tree, instead of the `next start` server the other E2E runs use — the only tier that exercises the image we actually publish, including its standalone build, its `/data` volume and its UTC clock. It is a step in the release checklist, between tagging and pushing the tag, and it is what found the time zone bug fixed above. See [docs/dev/testing.md § Testing the Docker image](docs/dev/testing.md#testing-the-docker-image)

## [3.2.0] - 2026-07-29

### Added

- **Documentation website**: the attendee guide and the organizer and self-hosting documentation now live at [docs.schellingboard.org](https://docs.schellingboard.org), searchable and readable on a phone. A version selector lets you read the documentation for the release you're actually running, rather than whatever is newest
- **Help link in the footer**: every page, including `/admin`, now links to the documentation next to "Report a Bug". On narrow phones the footer wraps onto a second line instead of squeezing the links together
- **A logo**: SchellingBoard now has one — two schedule grid lines crossing at a single filled slot. It appears on [schellingboard.org](https://schellingboard.org) and [docs.schellingboard.org](https://docs.schellingboard.org), and replaces the generic calendar icon that used to show in the browser tab and on a phone home screen. In the browser tab it switches to a light version when your browser is in dark mode, so it doesn't disappear against a dark toolbar
- **Formatting toolbar for descriptions**: every box that accepts Markdown — session and proposal descriptions, "About me", and the event description in the admin area — now has a small toolbar for bold, italics, links, bullet and numbered lists, quotes and code, with keyboard shortcuts (Ctrl+B, Ctrl+I, …). A **Preview** tab shows how the text will look before saving
- **Bigger profile photos**: on an attendee's page, click their profile picture to see it enlarged; press Escape, tap outside it, or use the close button to dismiss. Profile pictures are now kept at a higher resolution so the enlarged view stays sharp — photos uploaded before this release keep their old, smaller size until the attendee uploads a new one. Small pictures are never blown up: one uploaded at, say, 300×300 is still stored at 300×300, and a long, flat one that can't be cropped to a square of at least 256×256 is now refused with an explanation instead of being stretched

### Changed

- **Search ignores accents**: searching the schedule or the attendee list for "Jose", "Munchen" or "Espanol" now finds "José", "München" and "Español" — and the other way round, so a name typed with accents still finds it. The same applies to the suggestion lists when editing your profile and to picking session hosts
- **Footer always visible in the text and RSVP'd schedule views**: on a large screen it now stays at the bottom of the window instead of following the last session, so it no longer floats mid-page when there is little to show — the same as the proposals list. On phones it still ends the page, and the grid view keeps it at the end of the schedule, where a fixed footer would add an extra scrollbar
- **One less click after creating/updating/deleting a session**: now goes straight back to the schedule, replacing the intermediate confirmation page with a message you dismiss when you've read it
- **Clearer errors when adding or editing users**: the admin users page now points at the field that's wrong — "Name is required" under the name, "Invalid email address" or "A user with this email already exists" under the email — instead of showing one message above the whole list
- **Clearer errors when adding or editing locations**: the admin locations page now points at the field that's wrong — "Name is required" under the name, "Capacity must be a non-negative whole number" under the capacity, the reason a photo was rejected under the image — instead of showing one message above the whole list

### Fixed

- **Email configuration in Docker Compose**: `SITE_URL` now reaches the app when it is set in the Docker environment file, so enabling email no longer prevents the container from starting
- **"RSVP'd" view no longer shows every session**: before you had RSVP'd to anything, the RSVP'd view listed the whole schedule instead of nothing. It now always shows only the sessions you have RSVP'd to or are hosting
- **Saved passwords no longer get mixed up**: browsers couldn't tell this site's different passwords apart — the site password, the organizer password, and each attendee's own password all looked like the same login — so a saved password could be overwritten or offered in the wrong place. Each is now saved as its own entry
- **Emails about a session's time now match the schedule**: when a session was rescheduled or you were added as a co-host, the emailed start time didn't account for the break at the start of the slot, showing a time earlier than what the schedule actually displayed

### Internal

- Flaky E2E tests fixed at the source rather than by retrying: the shared `selectUser` helper now waits for the name switch to actually land (it used to return while the picker was still open over the page, so the next click could be swallowed), the phase tests assert that vote buttons are _disabled_ outside the voting phase instead of absent — they are always rendered for a non-host, so the old assertion only passed by beating the name switch — the attendee-search test waits for the query to reach the URL before following a link, and the profile-prompt test matches the prompt pool with one locator instead of sixty round trips per poll
- E2E tests moved to their own CI workflow (`.github/workflows/ci-e2e.yml`), skipped for changes that cannot reach the app — `docs/`, `www/`, and repository prose. Documentation-only pull requests no longer wait for a browser run; lint, build, type check and the unit and integration tests still run on everything
- The displayed app version now describes the parent of the jj working-copy commit instead of `@` itself, preferring a tag on it over its hash, with `-dirty` appended when `@` has changes. `jj new v3.1.0` therefore shows `v3.1.0`, so screenshots and demos of a released version aren't labelled with an anonymous working-copy hash
- **Admin API auth hardened**: the `/api/admin/*` seeding endpoints are now authenticated in the proxy rather than in each route, so they reply with JSON (401/403/404) instead of an HTML login redirect, no longer require a site cookie alongside the admin one, and reject cross-site requests (CSRF). Scripts that only handled a 401 should also handle 403 (cross-site) and 404 (admin API disabled)
- The [schellingboard.org](https://schellingboard.org) landing page moved into this repository as `www/`, and its screenshots into `docs/screenshots/` as the project's single copy — the documentation site can use the same files, so a screenshot is recaptured once instead of twice. `make www` builds it; a workflow publishes it to the `schellingboard.org` repository on every push to `main`, since GitHub Pages allows only one custom domain per repository and this one serves `docs.schellingboard.org`. See [docs/dev/documentation.md § The landing page](docs/dev/documentation.md#the-landing-page)
- The [schellingboard.org](https://schellingboard.org) landing page now points visitors at [docs.schellingboard.org](https://docs.schellingboard.org): a sticky top bar on both pages, a documentation call to action in the hero, and a section linking each guide directly. The two pages' duplicated CSS moved into a shared `www/style.css`
- Documentation is built with [docmd](https://docmd.io) from `docs/public/`, which holds a single copy — the next release's documentation — with no per-version snapshots in the working tree. Published versions are reconstructed from release tags at build time, so releasing documentation is tagging the repository, and a published version can be corrected without a release by pushing a `docs-<version>` branch. Developer documentation (ADRs, design notes) moved to `docs/dev/` and stays out of the published site. See [CONTRIBUTING.md § Documentation](CONTRIBUTING.md#documentation)

### Security

- **Login attempts are now rate limited**: repeated wrong passwords (site password, admin password, or an attendee's name password) temporarily block further attempts, so passwords can no longer be guessed by brute force. An attendee locked out this way can still sign in with an emailed one-time code, and the message they see says so
- **Emailed codes and reset links are harder to knock out**: entering wrong codes against an attendee's name used to use up the code or reset link that attendee had just been emailed after only ten tries, locking them out of their own name. Reset links can no longer be used up this way at all; a login code now takes ten times as many wrong tries, is unaffected by a mistyped password, and an attendee whose code was used up is told so and can request a new one a minute later
- Framing the site in other pages is now blocked (clickjacking protection), along with other standard browser hardening headers

## [3.1.0] - 2026-07-24

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

- **Dev fake clock**: with `SB_ENABLE_DEV_TOOLS=1`, a `?dev=1` toolbar lets you time-travel the app (real time / +1h / +1d / +7d / pick a date) so an event can be walked through its proposal → voting → scheduling phases without editing dates in the database. The override is a request-scoped cookie honoured only when the env var is set, so it is inert in production; the phase helpers now take an explicit `now` instead of reading `Date.now()`. See [ADR 0004](docs/dev/adr/0004-dev-fake-clock.md)
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

[Unreleased]: https://github.com/LWCW-Europe/schellingboard/compare/v3.4.2...HEAD
[3.4.2]: https://github.com/LWCW-Europe/schellingboard/compare/v3.4.1...v3.4.2
[3.4.1]: https://github.com/LWCW-Europe/schellingboard/compare/v3.4.0...v3.4.1
[3.4.0]: https://github.com/LWCW-Europe/schellingboard/compare/v3.3.1...v3.4.0
[3.3.1]: https://github.com/LWCW-Europe/schellingboard/compare/v3.3.0...v3.3.1
[3.3.0]: https://github.com/LWCW-Europe/schellingboard/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/LWCW-Europe/schellingboard/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/LWCW-Europe/schellingboard/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/LWCW-Europe/schellingboard/compare/9aa2a273...v3.0.0
[2.0.0]: https://github.com/LWCW-Europe/schellingboard/compare/babcd6275a853f1911cd48bbdaf4f2b1725c3d47...9aa2a273
[1.0.0]: https://github.com/rachelweinberg12/scheduling-app/commits/babcd6275a853f1911cd48bbdaf4f2b1725c3d47
