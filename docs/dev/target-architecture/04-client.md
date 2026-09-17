# 4 · Web app

`apps/web`: a static single-page app built with Vite, React and TypeScript, served by
the server as files, installable as a PWA. View `web` in the
[diagrams](diagrams/README.md).

[![L3 web app components](diagrams/export/web.png)](diagrams/export/web.png)

## Layout

```
apps/web/src/
  app/            router, layout shell, auth gate, theme, error boundary. Knows no domain.
  replica/        store (applies changes with domain's apply), snapshot loader, feed client, IndexedDB persistence, sync status
  commands/       one file per mutation: predict → call api-client → reconcile / roll back
  features/       one folder per screen family: schedule, agenda, proposals, voting, people, meetings, notifications, settings, admin, venue
  ui/             design system: tokens, primitives, form fields, modal stack, toasts
  pwa/            service worker, install prompt, push subscription, kiosk keep-awake
  i18n/           catalogs and formatting helpers that wrap domain/time
```

Rules: `features` read from `replica` and `domain` and call `commands`; they never
call `api-client` directly. `replica` and `commands` know nothing about React
components. `app` imports `features`; nothing imports `app`.

## The replica

One event at a time. Shape mirrors the snapshot contract:

```ts
type Replica = {
  seq: number;
  event: Event;
  days: Map<Id, Day>;
  places: Map<Id, Place>;
  sessions: Map<Id, Session>;
  rsvps: Map<Id, Rsvp>;
  proposals: Map<Id, ProposalPublic>;
  people: Map<Id, ProfilePublic>;
  me: {
    participation;
    votes: Map;
    marks: Map;
    meetings: Map;
    notifications: Map;
    availability;
    preferences;
  };
  sync: {
    state: "live" | "reconnecting" | "offline" | "stale";
    lastSyncedAt: Instant;
  };
};
```

- **Loading**: `GET snapshot` → store → `GET feed?since=seq`. If a persisted
  replica exists, render it first with `sync.state = 'stale'`, then resume the
  feed from its `seq`; the snapshot is only refetched on `410 Gone`.
- **`apply(replica, change)`** is a pure reducer in `domain` (it is also how the
  server's tests check that a change payload is sufficient). It upserts the
  subject from the payload, deletes on `*Deleted`, and bumps `seq`. Changes with
  `seq ≤ replica.seq` are ignored, which makes replay after a reconnect safe.
- **Persistence**: the replica is written to IndexedDB (debounced) keyed by
  `(event, person)`; cleared on logout. A different person on the same browser
  never sees a previous person's replica.
- The store is a small reactive store (Zustand-style) with memoized selectors;
  derived views (`agenda`, `grid`, `shiftsBelowMinimum`, filters) come from
  `domain` and are memoized per input identity. Components subscribe to selectors,
  so a change to one session re-renders the blocks that show it, not the grid.

This answers the reservation in ADR 0006 that a stale schedule is worse than none:
the replica is never presented as current unless the feed is live, and once it is,
staleness lasts as long as the reconnect.

[![Sequence diagram: back online after a wifi drop](diagrams/export/flowReconnect.png)](diagrams/export/flowReconnect.png)

## Commands and optimistic updates

```ts
export const rsvp = command({
  predict: (replica, actor, input) => {
    const verdict = policies.scheduling.canRsvp(actor, input, contextFrom(replica), clock);
    return verdict.allow ? [changes.RsvpAdded.predict(input, actor)] : deny(verdict);
  },
  call: (api, input, key) => api.POST('/events/{slug}/sessions/{id}/rsvp', { ..., headers: { 'Idempotency-Key': key } }),
});
```

1. **Predict** with the same policy the server will run. A denial disables the
   control and shows the reason code translated; nothing is sent.
2. **Apply** the predicted change locally, keyed by a client-generated
   idempotency key and flagged `pending`. The UI shows it at once.
3. **Call** the API with that key. The confirmed change carries the key
   (`command_key`), so whichever arrives first, the feed message or the response,
   `apply` replaces the pending change with the real one. On a network error the
   command retries with the same key; on a `4xx` it removes the prediction and
   shows the problem's code.
4. Only `commands/` may write to the replica outside `apply`. There is exactly one
   optimistic mechanism, used by every mutation, which is what ends the class of
   bugs in #463.

Edits carry `expectedVersion`; a `409` shows "changed by someone else" with the
current values.

## Screens as functions of the replica

Every feature renders from selectors plus local UI state (open modal, filter,
scroll). Notable consequences:

- **Schedule grid and agenda** are two projections of the same `sessions`,
  `rsvps`, `marks`, `meetings`. The **clash view** attendees asked for is
  `agenda().clashGroups`; the **unfilled shifts** list is
  `shiftsBelowMinimum()`; **filters** (mine, starred, not hidden, place, tag,
  text) are pure and instant. No endpoint is added for any of them.
- The **grid on a phone** uses a column-count strategy (visible places chosen by
  the viewer, saved as a preference) and wraps titles, instead of a fixed column
  width; a "now" strip shows what is running across all places at this minute.
- **Modals** are routes (`?session={id}` as a search param over the current
  screen), so back returns to the previous modal and deep links open the
  right screen behind them (#856, #994).
- **Venue**: a place popover shows floor and directions; the venue screen shows the
  map with pins; a session block's place chip opens the popover.
- **Kiosk** is `?kiosk=1` on the schedule: the same replica, auto-scroll to now,
  keep-awake, a place filter. It never needs a page refresh because the feed keeps
  it current.
- **Admin** is a section of the same app, shown when the actor has an organizer or
  site-admin role. It uses the same commands.

## PWA

- Service worker precaches the shell (hashed assets) and serves it offline;
  API responses are never cached by the worker, because the replica already is the
  cache and knows its own staleness.
- Push: one subscription per device, bound to the person, listed in settings.
  A push carries only a notification id; the app fetches the record when opened,
  so push payloads hold no content.
- An update check compares the served version with the running one and offers a
  reload (#788).

## UI foundations

- Design tokens (surface, fg, line, brand, semantic, chrome) as today, contrast-
  tested in both themes; state never encoded by colour alone.
- Every control has an accessible name; E2E tests locate by role and name.
- Time is formatted only through `i18n/format`, which wraps `domain/time` with the
  person's zone, locale and 12/24-hour preference.
- Forms validate against the same zod contract the server uses, per field, with
  the server's problem details mapped back onto fields (#639).
