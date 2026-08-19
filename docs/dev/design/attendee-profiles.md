# Attendee profiles: browsing and navigation

This document is meant to guide implementation and to be removed afterwards.

Requirements for reworking the attendee list and profile view, covering
[#703](https://github.com/LWCW-Europe/schellingboard/issues/703) (filter to
non-empty profiles),
[#712](https://github.com/LWCW-Europe/schellingboard/issues/712) (sort order),
[#764](https://github.com/LWCW-Europe/schellingboard/issues/764) (read
profiles without clicking through each one) and
[#806](https://github.com/LWCW-Europe/schellingboard/issues/806) (see the photo
big without clicking it).

Assumed scale: 150–400 attendees per event, 30–60% with a filled-in profile,
`aboutMe` typically one to three paragraphs.

## Status

Keep this list current — it is how the next agent knows where to pick up.

| Slice                                                                          | Issue      | State                                                                                              |
| ------------------------------------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------- |
| [Sorting](#sorting-712)                                                        | #712       | Done, on today's list: `profileUpdatedAt` column, "Sort by" dropdown, per-row relative update time |
| [The photo](#the-photo-806)                                                    | #806       | Not started                                                                                        |
| [The list](#the-list) (cards, excerpt, "Has profile")                          | #703, #764 | Not started                                                                                        |
| [The profile as a modal](#the-profile) + [Prev/Next](#moving-between-profiles) | #772, #764 | Not started                                                                                        |
| [Back links](#back-links)                                                      | —          | Not started                                                                                        |

The slices are in dependency order but not in strict sequence: the photo lands
on today's profile page and is carried over unchanged when that page becomes a
modal.

## Core user flow

The list serves two jobs, and **the read-through is the primary one**: before
the event, someone wants an idea of who is coming. Lookup ("who was that person
who does X") is served entirely by search and needs no further design. Today's
list is built for lookup, which is why #703, #712 and #764 exist.

### The list

One continuous list of cards at `/guests`. Page size is **1000** (up from the
server-paginated 25 in `app/(site)/guests/page.tsx:12`), matching
`proposal-table.tsx`'s `ITEMS_PER_PAGE`, so at realistic attendee counts the
list never paginates and no pager is rendered. Above 1000 it becomes ordinary
pagination — and there, Prev/Next crossing a page boundary has to advance the
list behind the modal, or dismissing lands on a page that no longer contains
the person being read. All of this depends on `next/image` lazy loading, so 400
cards do not mean 400 avatar requests.

Each card shows:

- 64px avatar (up from 48px — "see all the faces" is #764's literal ask)
- name, "Session host" badge, `pronouns · based in`
- **two lines of `aboutMe`** (`line-clamp-2`), markdown stripped to plain text,
  the same treatment `proposal-table.tsx` gives `plainDescription`
- if `aboutMe` is empty but the profile is not, the first answered prompt as
  `Prompt — answer`, so a filled profile never looks like an empty one
- `profileUpdatedAt` as a relative time ("updated 3 days ago"), small and gray
  in the card's top-right, omitted when NULL — a recency sort with no visible
  dates is opaque. Deliberately not in the `pronouns · based in` line, which is
  identity rather than metadata

The excerpt is the only thing visible without opening anything, so it is what
actually resolves #764.

Toolbar: **"Session host"** and **"Has profile"** toggles, plus a **"Sort by"**
dropdown. "Has profile" means _any_ self-entered field is set — the CSV
importer only writes `name` and `email`, so everything else is genuinely
self-entered.

### The profile

A profile is **always a modal**, at the single canonical URL
`/guests/[guestId]`. That route renders the list with the modal over it; there
is no separate full-page rendering, and no intercepting routes. Eight places in
the app already link to `/guests/<id>` (session hosts, proposal hosts, comment
authors, comment likers, the header), and they all keep working unchanged.

The ninth link is the list's own, which today appends `?from=<list query>` so
the profile page can rebuild the view behind it (`attendee-list.tsx:24`). That
mechanism goes away: the list is no longer unmounted, so there is nothing to
rebuild, and the URL already carries the search/filter/sort.

Modal chrome is a **sticky header bar**, one layout on desktop and mobile:

```
‹ Prev          12 of 87 attendees          Next ›   ×
```

Chosen over lightbox-style edge arrows because it needs no width fallback, and
because `×` must stay permanently on screen — see "browser history" below.

Body, in the existing order: photo, name, pronouns, host badge, based in,
About me, prompts, Languages, Contacts, then Hosting and Proposals. On mobile
the modal is a **full-screen sheet**, not a centred dialog.

Avatar zoom becomes an **in-place size swap**. It must not be a second modal
layer: a modal inside a modal means two focus traps and an Escape key that has
to disambiguate them.

### The photo (#806)

The 112px round avatar is too small for the job the photo actually does:
recognising someone. #806 asks for the Names & Faces treatment — a big picture,
visible without clicking. Its mockup is two columns: a large portrait on the
left with the name under it, About me and prompts on the right.

- **256px, and no click required.** On desktop the photo takes a left column
  (`w-64`) with the name, pronouns, host badge and based-in stacked beneath it;
  the text sections run alongside. On mobile it is centred above the name, at
  the same 256px cap rather than full-bleed — a 375px-wide photo plus the name
  pushes the first line of About me off a phone screen, which trades one of
  #764's wins for #806's.
- **Rounded square, not a circle.** Stored avatars are already a centred square
  crop, and a circle discards ~21% of it; at 48px that is invisible, at 256px it
  eats hair and shoulders. The list keeps round thumbnails: round reads as an
  identity chip beside text, and the shape difference marks "thumbnail" against
  "the picture itself".
- **Zoom stays but is demoted.** At 256px most faces are already legible, so the
  enlarged view is for looking closely rather than the only way to see the
  person. It keeps earning its place: the stored image is up to 1024px.
- **Rendition ladder becomes 64 / 256 / 512 CSS px** (card, profile, zoom).
  Each is a separate `next/image` URL — see the avatar note under
  [§ Implementation shape](#implementation-shape).

The mockup's portrait aspect ratio is deliberately not adopted; see
[§ Explicit non-goals](#explicit-non-goals).

#### Answers to the questions in #806

- **Round preview in the list?** Yes — 64px, round.
- **Where is a rectangular picture centred?** It already is, at upload:
  `AvatarImageResourceRepository.decodeImage` (`utils/images.ts:196`)
  cover-crops to a centred square, so every stored avatar is square and the
  list, the profile and the zoom all show the same crop. There is nothing left
  to decide per view. What the centred crop cannot do is rescue an off-centre
  face — that needs a crop/reposition control at upload time, which is an
  upload problem, not a browsing one, and belongs in its own issue.
- **Size and aspect-ratio limits?** Unchanged, and no new ones needed: any
  aspect ratio is accepted, the square crop must be at least
  `MIN_AVATAR_WIDTH` (256px) so a panorama with a short side under that is
  rejected, the upload is capped at `MAX_IMAGE_BYTES` (5MB), and the result is
  stored at up to `AVATAR_MAX_SIZE` (1024px) without ever being upscaled. 1024
  is exactly a 512 CSS px zoom on a 2× screen, so it stays sufficient as long
  as the zoom does not grow.

### Moving between profiles

Prev/Next are **always shown**, even when the profile was opened from a session
rather than from the list — hiding them would make the feature undiscoverable
to exactly the people who arrive that way. They traverse the collection implied
by the list's active search/filter/sort, and the position label (`12 of 87
attendees`) names what is being traversed, so the collection is never invisible
state. With no list context, the collection is all attendees, alphabetically.

Accelerators: **←/→ on desktop**, **swipe on mobile**. The visible buttons
remain the accessible baseline — a touch user who never discovers swipe and a
screen-reader user must both still get there.

Swipe mechanics:

- direction lock decided from the first ~10px of movement, then committed —
  profiles scroll vertically, and without a lock every scroll flickers a drag
- the card tracks the finger; neighbours are prefetched, so render them
  offscreen rather than detecting a threshold and jumping
- gestures starting within ~25px of the left edge are ignored (iOS Safari's
  back gesture)
- rubber-band and snap back at the first and last profile
- no navigation while the avatar is zoomed

Keyboard: ←/→ ignored when the event target is an input, textarea, select or
contenteditable; Escape closes the zoom if zoomed, otherwise the modal; ↑/↓
keep their default scrolling meaning. On profile change, update the dialog's
accessible name and announce it, or arrow traversal is silent for screen
readers.

**Browser history: every profile pushes an entry.** Back retraces the profiles
actually viewed. The alternative — push on open, replace on traverse, so Back
always means "close" — was considered and rejected. Two accepted costs:

1. On iOS, swipe-right _from the edge_ is Back (previous **viewed** profile)
   while swipe-right _from the middle_ is Prev (previous **in list order**).
   They coincide while moving forward, which is the common case.
2. There is no Escape key on a phone, so after 40 profiles the only cheap way
   out is `×` — hence the sticky header.

### Sorting (#712)

Two options: **Name (A–Z)** (default) and **Recently updated**.

This needs a new nullable `profileUpdatedAt` column; `guests` currently has no
timestamps at all, and the only `created_at` in the schema is on `auth_codes`,
so there is no history to date existing rows from. The migration backfills
every profile that has any self-entered field to its own instant, so they all
tie and rank ahead of the untouched ones, which stay NULL and sort last. That
is the one distinction the data supports; dating them apart would be fiction.
The sort therefore means "recently updated since we started tracking", and
self-heals within an event cycle.

The column is touched only when a **public profile field** changes (`name`,
`aboutMe`, `pronouns`, `basedIn`, `prompts`, `languages`, `contacts`,
`avatarUrl`) — not email preferences, not password changes. `name` counts:
people do rename themselves, and that is a profile edit like any other.

### Back links

Every "Back to X" in this app is a fixed destination, not history — it is the
**Up** pattern mislabelled as Back, which is why a profile reached from a
session offers "Back to attendees". The fix is the label and the weight, not
the destination.

Replace the rose `px-12` button with a small gray `← Attendees` breadcrumb,
top-left — already the pattern in `app/admin/events/[id]/layout.tsx:27`. This
applies to `/guests/edit` and `/settings`; profiles no longer need it, since
the modal shows its destination behind the backdrop.

## Implementation shape

These follow from the UX decisions and are easy to lose.

- **The list is a client component holding all attendees**, doing search,
  filter and sort in memory — as `proposal-table.tsx` already does. A server
  round trip per profile makes swipe feel broken; `modal-nav.ts:45` documents
  the same tension for the session modal.
- **The list lives in `app/(site)/guests/layout.tsx`**, so it is one instance
  shared by `/guests` and `/guests/[guestId]`. Rendering it from each page
  would unmount it on every profile open, losing scroll position — #764's pain,
  reintroduced.
- **Search, filters and sort stay in the URL**, read with `useSearchParams()`
  from inside that client component. A _server_ layout does not receive
  `searchParams`, but a client component within it can call the hook — so URL
  state and a persistent layout are not in conflict. This preserves what
  `useTableParams` gives today: shareable, bookmarkable, reload-proof filtered
  views. It diverges from `proposal-table.tsx`, which keeps filters in
  `useState` and therefore cannot share a filtered view; the attendees list is
  the one that is right.
- **Layout and children share a context**, so the modal can see the active
  filter and sort — that is what makes Prev/Next honour them and `12 of 87`
  accurate.
- **Hosting and Proposals load lazily** with a skeleton. They need joins and
  sit below the fold; everything else ships with the list payload.
- **The list payload grows to the whole public profile**, reversing a
  deliberate constraint. `app/(site)/guests/page.tsx:42` and
  `attendee-list.tsx:8` currently strip each row to the six fields it renders,
  precisely so a full profile never crosses to the client. The excerpt, the
  prompt fallback and in-memory search (`searchAttendees` reads `aboutMe`,
  `languages`, `prompts`, `basedIn`) all need more than that. The limit that
  stays is `sanitizeGuest`'s: `email` must still never cross. Rewrite those two
  comments in the same change, or they will contradict the code.
- **Avatars**: three renditions (64px list, 256px profile, 512px zoom) are three
  different `next/image` URLs, so the thumbnail never satisfies the profile from
  cache. `Avatar` only has `sm` (48px) and `lg` (112px), so the card size is a
  new variant, not a class override — `renderedSize` has to match it or
  `next/image` picks the wrong srcset entry. The profile photo is square rather
  than round, so it is its own component, not a third `Avatar` size; the
  initials fallback is the part worth sharing. Scale the already-decoded
  thumbnail up as a blurred placeholder so the swap reads as sharpening,
  prefetch the ±1 neighbours' profile-size images along with their data, and
  fetch the zoom rendition only on zoom.
- **E2E tests** must reach profiles by clicking cards, never by constructing
  `/guests/<id>` — see `AGENTS.md § Key Considerations`.

## Edge cases

- **Unknown or deleted guest id** — the modal shows "This person is no longer
  listed", matching `proposal-modal.tsx:77`. Not a 404: someone following a
  stale link from a session lands somewhere useful.
- **Viewing someone outside the active collection** (e.g. "Has profile" is on
  and you open someone without one) — Prev/Next fall back to the canonical
  all-attendees ordering, labelled honestly (`12 of 400 attendees`). Same rule
  as the no-context case, so there is one rule rather than two.
- **Sort while searching** — relevance wins and the sort control is genuinely
  disabled, not merely dimmed. `proposal-table.tsx:406-417` does the weaker
  version: while a search is active it greys the column headers and drops the
  sort arrows, but they stay clickable and still call `handleSort`. Copy the
  signal, not the behaviour. `searchAttendees` ranks by tier then name; an
  explicit sort would discard that ranking.
- **Empty search result** — keep the existing `No attendees match.`
- **"Has profile" on, nobody qualifies** — message plus a nudge to fill in your
  own, mirroring the proposals empty state's "Be the first to suggest a
  session!"
- **No avatar** — existing initials placeholder, unchanged.
- **Very long `aboutMe`** — scrolls inside the modal; no truncation there.
- **NULL `profileUpdatedAt` under "Recently updated"** — sorts last.

## Explicit non-goals

- **Spreadsheet export of all attendee info** (#764's alternative suggestion).
  Organizers already have admin export (`listFull`); a per-attendee dump of
  everyone's bios and contact details is a different feature for a different
  audience, and browsing is what the issue actually needed. Data export is also
  explicitly discouraged for data privacy reasons.
- **Sorting by "based in"** (#712's secondary suggestion). Free text sorts
  `Berlin`, `berlin, germany`, `DE` and `near Munich` into unrelated places —
  the appearance of grouping without the substance. If location grouping
  matters, it needs a structured location field and its own issue.
- **"New"/"Updated since your last visit" badges.** This is what #703's comment
  thread actually asked for, and the recency sort only approximates it. Judged
  not worth the cost (last-visit state, cleared storage, multiple devices).
- **Keeping each photo's original aspect ratio** (#806's mockup shows a
  portrait). Uploads have been cover-cropped to a square since avatars existed,
  so stored files no longer have an original to restore; keeping the ratio would
  only apply to future uploads, split the collection into two shapes, and give
  the list ragged rows and the profile a photo box whose height depends on who
  you are looking at. Uniform squares are what make "see all the faces" scan.
- **A crop/reposition control at upload.** The centred square crop is wrong for
  an off-centre face, and today the only workaround is to pre-crop the photo
  elsewhere. Real, but an upload-flow problem; needs its own issue.
- **Hover-to-enlarge on list avatars** (#764's suggestion) — superseded by the
  modal, which is one click away and works on mobile. No desktop-only affordance
  duplicating it.
- **Language chips on cards** — search already covers "who speaks German", and
  chips would fight the excerpt for attention.
- **Migrating proposals onto this modal mechanism.** Worth doing eventually;
  out of scope here.
- **Scoping the list to your own event.** `listAttendees` is not event-scoped
  and `/guests` sits outside `[eventSlug]`, so the list is global and profiles
  of people attending other events are visible. In practice every attendee
  currently attends every event, so nothing is wrong today. Both scoping the
  list and restricting profile visibility to your own event are future
  improvements with their own issues.

## Open questions

- **Square instead of the mockup's portrait** (#806). The reasoning is above,
  but it is a visible deviation from what was asked for.
- **256px on mobile rather than full-bleed.** Chosen so About me stays on the
  first screen; worth checking on a real phone.
- **Should the off-centre-crop problem get its own issue?** It is the one thing
  the #806 comment thread raised that this design does not fix.
