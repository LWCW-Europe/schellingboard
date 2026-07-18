# How SchellingBoard works

## Attendee identity

By default there's no per-attendee login. After entering the site password
(if set), attendees pick their own name from the guest list assigned to that
event. This is a convenience selector, **not authentication** — anyone who
knows the site password can select any attendee's name and vote/RSVP/edit
proposals as them.

Any attendee who wants more can **protect their name** from their own
settings page (see the [attendee guide](../attendee-guide.md#protect-your-name)).
Protection is opt-in and per-person; there is no way to require it
event-wide. Once a name is protected:

- Picking it from the name list asks for a password or an emailed code.
- Acting as that person — voting, RSVPing, editing their profile, creating
  or changing sessions — requires that verified browser session.
- Turning protection off, or changing the password, needs either the current
  password or an emailed code. The code path means a forgotten password is
  never a dead end.

Protection needs `AUTH_SECRET`, and enabling it needs working email
([SMTP settings](README.md#environment-variables)) so the attendee can
receive a code.

## Who can change a session or proposal

Only its hosts. Editing and deleting a session or proposal is restricted to
the people listed as hosts, with two exceptions: a proposal with no hosts at
all can be edited by anyone (so unclaimed ideas can be picked up), and an
admin-managed session can only be changed from the admin UI, not by its
hosts.

Name protection doesn't change _who_ may edit — it changes how hard it is to
_be_ that person. If a host hasn't protected their name, anyone can select it
and edit as them; that's the same trade-off as everywhere else in the app. If
a host has protected their name, editing as them requires their login.

So a session whose hosts are all unprotected is still effectively open to
anyone willing to pick one of their names. Attendees who want their sessions
to really be theirs need to protect their name.

## The three phases

Each event has three independent, optional phase windows (start/end), set in
the admin UI:

| Phase          | What attendees can do                                                              |
| -------------- | ---------------------------------------------------------------------------------- |
| **Proposal**   | Submit and edit session proposals                                                  |
| **Voting**     | Vote on proposals (Interested / Maybe / Skip); proposals can still be added/edited |
| **Scheduling** | Place proposals on the grid, book open slots, RSVP to sessions                     |

Rules:

- A phase with no explicit end runs until the _next_ configured phase's
  start. Giving a phase an earlier explicit end creates a dead gap where
  nothing is active.
- **If no phase dates are set at all**, the event is always in the
  scheduling phase — useful for a simple fixed schedule with no
  proposal/voting step.
- All gating is enforced server-side, not just hidden in the UI — attendees
  can't act out of phase via an old bookmarked link.

## Proposals, voting, and scheduling

- Voting has three choices (Interested / Maybe / Skip), one per guest per
  proposal; clicking the current choice again removes the vote. "Quick
  Voting" walks through unvoted proposals one at a time.
- A proposal's host can click "Schedule" (scheduling phase only) to place it
  on the grid as a real session. The same proposal can be scheduled more
  than once.
- Attendees can also book a blank slot directly in a "bookable" location
  during that day's booking window, without going through a proposal.
- RSVPs are only possible during the scheduling phase, only for guests
  assigned to the event. If the event enforces capacity as a hard limit,
  RSVPs are rejected once a session is full; otherwise capacity is
  advisory only.

## Kiosk mode

Append `?kiosk=1` to a schedule URL for an unattended screen at the venue: a
red line marks the current time, the view auto-scrolls back to it after a
minute of no interaction, the screen is kept awake, and the page refreshes
periodically. It stays fully interactive. Once set, kiosk mode sticks as
visitors browse the site — clicking through to Proposals and back keeps the
display in kiosk mode — until you turn it off with `?kiosk=0`. Add
`&loc=Main+Hall` (repeatable) to show only specific locations — handy for a
kiosk in one room or a shareable filtered link.

## Multi-event installs

One deployment can host multiple events. If more than one event exists, the
root URL shows a list of all events using the global site title/description/
map (set in [Site settings](admin-guide.md#site-settings)). With exactly one
event it redirects straight to it. Each event lives entirely under its own
`/{slug}` route — there's no cross-event attendee state beyond the shared
guest pool and the picked name.

## Email

Email is optional. With SMTP unconfigured, SchellingBoard sends nothing at
all and the features below are simply unavailable. When it is configured,
these are the only messages ever sent:

| Email                | Sent to                                                               | Opt-out                         |
| -------------------- | --------------------------------------------------------------------- | ------------------------------- |
| **Login code**       | An attendee who asked to protect or unlock their name                 | None — it's requested on demand |
| **Session moved**    | Hosts and RSVP'd attendees, when a session's time or location changes | Per-attendee, in their settings |
| **Added as co-host** | Attendees newly added as a co-host of a session                       | Per-attendee, in their settings |
| **Test email**       | One guest, from the admin Users page                                  | n/a                             |

Nothing is emailed on votes, RSVPs, phase transitions, or edits to a
session's title or description. Whoever made a change is never emailed about
their own change.

Enabling email requires `SITE_URL` as well as the SMTP settings, so the
messages can link back to the site.
