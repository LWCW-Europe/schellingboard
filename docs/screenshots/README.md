# Screenshots

The screenshots in this directory are the only copies in the project. Two
sites use them:

- **[schellingboard.org](https://schellingboard.org)** — the hand-written
  marketing site in `www/`, which references them as `screenshots/<name>.png`.
  `scripts/build-www.sh` copies this directory next to the HTML.
- **[docs.schellingboard.org](https://docs.schellingboard.org)** —
  `scripts/build-docs.sh` copies this directory into each published version, so
  every release keeps the interface it shipped with. Reference them
  **relatively** from markdown (`../screenshots/<name>.png`); a root-relative
  path would point every old version at the newest images.

Recapturing a screenshot therefore updates both sites at once, which is why
they live here rather than in either site's own directory.

## Taking screenshots

General setup:

- Firefox
- Responsive Design Mode (Ctrl+Shift+M)
- Desktop shots: "Laptop with touch" device, 1280x950
- Mobile shots: "Galaxy Note 9 / Android 7" device
- Hide the Next.js developer tools overlay before capturing

Save files here using the exact file names below, then update the captions in
`www/screenshots.html` (and `www/index.html`'s hero image and OpenGraph tags,
if the hero shot changed). `make www` fails if the HTML references a file that
is not here, so a rename cannot silently break the site.

## Screenshot checklist

Go through the app end-to-end and (re)capture each of these when the UI
changes materially. Check off `[ ]` as you go.

### Desktop (1280x950)

- [ ] `home-multi-event.png` — Home page listing multiple events with phase, dates, and quick links
- [ ] `proposals-browse.png` — Proposal list with search, filters, and sortable columns
- [ ] `proposal-edit.png` — Session proposal form (title, description, hosts, duration)
- [ ] `proposals-vote.png` — Proposal list with Interested / Maybe / Skip voting
- [ ] `quick-voting.png` — Quick Voting mode, one proposal at a time
- [ ] `schedule-grid.png` — Drag-and-drop scheduling grid with room photos (also used as the site hero / OG image)
- [ ] `session-details.png` — Session detail popup (host, location, time, attendees, description)
- [ ] `add-session.png` — Form for adding a session directly to the schedule
- [ ] `attendees.png` — Searchable attendee directory with avatars and host badges
- [ ] `participant-profile.png` — Participant profile page (bio, proposals, sessions attending)
- [ ] `edit-profile.png` — Edit profile form (name, pronouns, avatar, Markdown bio)
- [ ] `admin-events.png` — Admin panel listing all events with a Manage button
- [ ] `admin-event-settings.png` — Admin event configuration form (name, dates, timezone, rules)

### Mobile (Galaxy Note 9)

- [ ] `mobile-schedule.png` — Scheduling grid rendered on a phone screen
- [ ] `mobile-session-details.png` — Mobile session detail popup with closed-session warning

After capturing, run `make www`, open `www-site/screenshots.html`, and click
through the lightbox to confirm captions still match what's on screen.
