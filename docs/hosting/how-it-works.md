# How SchellingBoard works

## Attendee identity

There's no per-attendee login. After entering the site password (if set),
attendees pick their own name from the guest list assigned to that event.
This is a convenience selector, **not authentication** — anyone who knows the
site password can select any attendee's name and vote/RSVP/edit proposals as
them. Don't rely on it for anything sensitive.

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

The only email SchellingBoard ever sends is the admin's "Send test email"
button next to a guest in the Users admin page. There are **no automatic
notifications** — nothing is emailed on votes, RSVPs, session changes, or
phase transitions. Don't assume attendees get notified of schedule changes.
