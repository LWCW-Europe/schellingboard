# 9 · Feedback and issues, mapped to the design

Every piece of attendee feedback from the 2026 event and every open-issue theme,
and the element of this design that serves it. Where the design changes what was
asked for, the row says so.

## Attendee feedback

| Ask                                                                                                        | Served by                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Where is the room? Floor in the room info; a venue map with points of interest                             | `Place.floor`, `Place.directions`, `Place.mapPin`; the venue screen and the place popover on every session block ([02](02-domain.md#place-venue), [04](04-client.md#screens-as-functions-of-the-replica)) |
| Privately mark things I am **not** interested in, as an exclusion list                                     | `Mark{kind: hide}`, private by audience ([02 § Mark](02-domain.md#mark-personal))                                                                                                                         |
| "Like" attendees to keep a shortlist of people to meet                                                     | `Mark{kind: star}` on a person                                                                                                                                                                            |
| Bookmark sessions, between RSVP and nothing; filter by "may be interested"                                 | `Mark{kind: star}` on a session; the agenda's `source: star`; filters as pure functions                                                                                                                   |
| My RSVPs for myself vs. for public information should be separate                                          | Star (private, uncounted) vs. RSVP (public commitment) vs. RSVP `anonymous` (counted, name hidden). Three explicit states instead of one overloaded one                                                   |
| Overlap view of my RSVP'd sessions                                                                         | `agenda().clashGroups` over host + RSVP + star + meetings, shown as a view and as all clashes on RSVP (#1042)                                                                                             |
| Personal schedule of hosted / RSVP'd / starred events; meals and opening on it by default                  | The agenda; `Session{kind: fixture}` is on everyone's agenda unless hidden                                                                                                                                |
| Which volunteer shifts still need people                                                                   | `Session{kind: shift, minHeadcount}`; `shiftsBelowMinimum()` as a list, a filter on the grid, and a reminder                                                                                              |
| Not updating without a reload is rough                                                                     | The replica and change feed; the kiosk never refreshes either                                                                                                                                             |
| Text me via a bot                                                                                          | `ChatChannel` adapters bound per person; same notification records                                                                                                                                        |
| Someone moved a scheduled session into the spontaneous slots                                               | `ReservedWindow{spontaneousOnly, bookableFrom}` enforced by `canPlace`                                                                                                                                    |
| Who added this proposal?                                                                                   | `Proposal.createdBy`, shown; the change log answers "who changed what" generally                                                                                                                          |
| A proposal that did not get scheduled should become a 1-on-1 suggestion                                    | Decided not to build (see [08 § resolved](08-decisions.md#resolved-product-questions)). If it ever is, it is a reaction in `meetings`; nothing else changes                                               |
| 1-on-1s should be on by default                                                                            | Event setting default `meetingsEnabled = true`                                                                                                                                                            |
| The times on the side did not match the times on the sessions                                              | One slot grid on the Day; sessions drawn at real instants; no second copy of the grid                                                                                                                     |
| Grid columns too wide on a phone; too much horizontal scrolling                                            | Viewer-chosen visible places, wrapped titles, a "now" strip across all places                                                                                                                             |
| The list view is noisy with volunteer slots                                                                | `kind` filter (hide shifts) and `hide` marks                                                                                                                                                              |
| More session metadata: latecomers welcome, RSVP required, limited slots, gathering location for "anywhere" | `Session.latecomers`, `Session.rsvp`, `capacity`, `gatheringPoint` required for `anywhere`                                                                                                                |
| A minimal affinity feature                                                                                 | Out of scope; the person star is the closest honest thing. A matching feature would be its own module reacting to marks and profiles, which the design allows without changing anything else              |

## Open issues by theme

| Theme (issues)                                                                      | Served by                                                                                             |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Favoriting and filtering on the grid (#864, #865, #264, #678)                       | Marks; filters as pure functions over the replica                                                     |
| Optimistic RSVP bugs, redundant fetching, hydration errors (#463, #381, #734)       | One optimistic mechanism in `commands/`; the replica; no SSR                                          |
| Email outbox, reminder dispatch, email log (#1005, #580)                            | The change log plus the jobs loop; `delivery_attempts`                                                |
| Admin API, OpenAPI, sessions/locations CRUD (#1006, #677)                           | One API for all roles; contracts generate the document                                                |
| Rate limiting, event-wide required auth, security review (#679, #682, #680)         | [05-security.md](05-security.md): rate limits by default, identity mode `verified`, audience model    |
| Domain types out of `db/` (#965)                                                    | The package split makes it structural                                                                 |
| Meal times on the schedule, sessions during meals (#861, #465)                      | Fixtures; `Day.mealWindows` overlap is a client warning, not a `canPlace` denial                      |
| Meetings: break offsets, opt-in, only in scheduling (#1049, #1046, #952)            | Slot grid on the Day used by meetings too; on by default; phase in meeting settings                   |
| Comments: see my own, remove from my profile (#993, #901)                           | `people.canEditProfile` for removal; a query over the viewer's comments                               |
| Notifications: devices listed, lost-host notice, co-host wording (#969, #953, #954) | Bindings per device; reactions for `HostRemoved` leaving zero hosts; templates per category           |
| Pagination, modal navigation, deep links (#831, #856, #994, #109)                   | Cursor pagination in the API; modals as URL state                                                     |
| Time format 12/24 h (#607)                                                          | Person preference honoured by `domain/time`                                                           |
| Attendee labels, badges, hover cards (#629, #793, #789)                             | `labels` on participations; profile public view in the replica                                        |
| Phase at a glance (#771)                                                            | `phaseAt` is in the replica's event; one component                                                    |
| Data collection policy (#801)                                                       | Generated from schema data classes                                                                    |
| Load test (#691)                                                                    | A `tools/loadtest` against the API and feed with the sizing in [03 § capacity](03-server.md#capacity) |
| Demo data for production (#373)                                                     | `tools/seed` profiles usable against any instance through the API                                     |
| Statistics (#389)                                                                   | Queries over the change log and state; no extra tracking                                              |
| In-app chat, spaced repetition (#776, #395)                                         | Not designed for; both fit as new modules with their own changes and audiences                        |

## Things nobody asked for that the design provides for

- **Calendar export**: an ICS feed of the agenda, signed per person, is a query
  over `agenda()`; attendees will ask for it the first time they open their phone
  calendar.
- **Organizer announcements**: a `fixture`-like notification to everyone in the
  event over all channels; a use case in `notifications` with organizer role.
- **Waitlists** when capacity is hard: an RSVP state, not a new concept.
- **Reporting** a comment or profile to organizers: a change with audience
  `organizers` and a queue in the admin section.
- **Import** of people and sessions from CSV or a call-for-papers tool through the
  API with an organizer token.
- **Session feedback after the fact** (in the backlog): a `feedback` module
  reacting to `SessionEnded`, private to hosts by audience.
- **A second language**: strings are keys and policies return codes from day one.
