# Screenshots

The screenshots in this directory are the only copies in the project. Two
sites use them:

- **[schellingboard.org](https://schellingboard.org)** — the hand-written
  marketing site in `www/`, which references them as `screenshots/<name>.webp`.
  `scripts/build-www.sh` copies this directory next to the HTML.
- **[docs.schellingboard.org](https://docs.schellingboard.org)** —
  `scripts/build-docs.sh` copies this directory into each published version, so
  every release keeps the interface it shipped with. Reference them
  **relatively** from markdown (`../screenshots/<name>.webp`); a root-relative
  path would point every old version at the newest images.

Recapturing a screenshot therefore updates both sites at once, which is why
they live here rather than in either site's own directory.

Images are stored as WebP, not PNG — a raw Firefox capture of this UI runs
5-10x larger as PNG for no visible quality gain at the sizes these are
displayed. Keeping the repo's history free of multi-hundred-KB PNGs matters
more than the last few % of image quality.

## Taking screenshots

General setup:

- Firefox
- Responsive Design Mode (Ctrl+Shift+M)
- Desktop shots: "Laptop with touch" device, 1280x950
- Mobile shots: "Galaxy Note 9 / Android 7" device
- Hide the Next.js developer tools overlay before capturing
- Select the attendee **Hana Kobayashi** before capturing, so the "logged in
  as" state is consistent across all screenshots

Firefox saves captures as PNG. Convert before committing — never commit a
`.png` here:

```sh
# Desktop shots
cwebp -q 80 ~/Downloads/capture.png -o docs/screenshots/<name>.webp

# Mobile shots — also resize. Firefox's full-page capture is taken at the
# device's pixel ratio, so a mobile shot can come out ~1450x2960px (1.4 MB+)
# even though the gallery only ever displays it at 280px wide. -resize 900 0
# keeps it sharp at that size (and in the lightbox, capped at 1000px) while
# cutting the file down to roughly a tenth of the raw capture.
cwebp -q 80 -resize 900 0 ~/Downloads/capture.png -o docs/screenshots/<name>.webp
```

`cwebp` ships with `webp-pixbuf-loader` / `libwebp-tools` on most distros
(`apt install webp`, `brew install webp`).

If `schedule-grid.webp` changed, also regenerate `www/og-image.jpg` — the
Open Graph / Twitter card image on the marketing site. It's a separate JPEG
copy rather than a reference to the WebP because link-preview crawlers
(Slack, iMessage, older scrapers) have inconsistent WebP support:

```sh
magick docs/screenshots/schedule-grid.webp -quality 85 www/og-image.jpg
```

Save files here using the exact file names below, then update the captions in
`www/screenshots.html` (and `www/index.html`'s hero image and OpenGraph tags,
if the hero shot changed). `make www` fails if the HTML references a file that
is not here, so a rename cannot silently break the site.

## Screenshot checklist

Go through the app end-to-end and (re)capture each of these when the UI
changes materially. Check off `[ ]` as you go.

### Desktop (1280x950)

- [ ] `home-multi-event.webp` — Home page listing multiple events with phase, dates, and quick links
- [ ] `proposals-browse.webp` — Proposal list with search, filters, and sortable columns
- [ ] `proposal-edit.webp` — Session proposal form (title, description, hosts, duration)
- [ ] `proposals-vote.webp` — Proposal list with Interested / Maybe / Skip voting
- [ ] `quick-voting.webp` — Quick Voting mode, one proposal at a time
- [ ] `schedule-grid.webp` — Drag-and-drop scheduling grid with room photos (also used as the site hero; also regenerates `www/og-image.jpg`, see above)
- [ ] `session-details.webp` — Session detail popup (host, location, time, attendees, description)
- [ ] `add-session.webp` — Form for adding a session directly to the schedule
- [ ] `attendees.webp` — Searchable attendee directory with avatars and host badges
- [ ] `participant-profile.webp` — Participant profile page (bio, proposals, sessions attending)
- [ ] `edit-profile.webp` — Edit profile form (name, pronouns, avatar, Markdown bio)
- [ ] `admin-events.webp` — Admin panel listing all events with a Manage button
- [ ] `admin-event-settings.webp` — Admin event configuration form (name, dates, timezone, rules)
- [ ] `user-settings.webp` — Settings page (email notification preferences, account protection)
- [ ] `kiosk-mode.webp` — Schedule grid in kiosk mode, with the red current-time line visible

### Mobile (Galaxy Note 9)

- [ ] `mobile-schedule.webp` — Scheduling grid rendered on a phone screen
- [ ] `mobile-session-details.webp` — Mobile session detail popup with closed-session warning

After capturing, run `make www`, open `www-site/screenshots.html`, and click
through the lightbox to confirm captions still match what's on screen.
