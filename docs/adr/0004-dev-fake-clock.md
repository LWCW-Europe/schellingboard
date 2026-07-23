# ADR 0004: Dev fake clock for time-traveling event phases

- **Status:** Accepted
- **Date:** 2026-07-23

## Context

An event moves through three time-gated phases — proposal → voting →
scheduling — plus time-dependent UI such as bookable-slot checks, the schedule
"now" line, and the kiosk display. Previewing any of this used to require
editing phase dates in the database, which is slow, error-prone, and can't be
done on a shared staging/demo instance without disrupting other viewers.

We want a development-only way to make the app believe it is at a different
point in time so an organizer can walk an event through its phases and see the
time-dependent UI, without touching the data. Constraints that shape the
decision:

- It must work on a **deployed** staging/demo instance, which runs in
  production mode — so gating on `NODE_ENV !== "production"` would be wrong.
- Next.js serves concurrent requests, so the simulated time of one viewer must
  never leak into another's request.
- Time-dependent decisions are spread across Server Components, Server Actions,
  Route Handlers, and client components, each of which reads request state
  differently.

## Decision

Add a fake clock gated by the `SB_ENABLE_DEV_TOOLS` env var (not `NODE_ENV`).
When it is unset the override is ignored server-side and the toolbar never
renders, so the feature is inert in production even if a client forges the
cookie.

### A single time offset

The override is one number: `offsetMs`, an integer stored in the
`time-override` cookie. Effective time is always `Date.now() + offsetMs`.

- Real time → no cookie (offset `0`).
- Jump forward → `+1h` / `+1d` / `+7d` add to the current offset.
- Pick a date/time → `offset = target − Date.now()`; time then keeps ticking
  forward from there.

We deliberately do **not** implement a separate "frozen" mode. Freezing only
matters for exact-boundary assertions, which belong in automated tests
(Vitest's `vi.setSystemTime`), not this manual toolbar. A single offset keeps
the client ticker trivial — it just adds `offsetMs`.

### Request-scoped, never a global `Date` mock

Because requests are concurrent, we never mock `Date` globally; a shared
mutable clock would leak one viewer's simulated time into another request. The
override is request-scoped (read from the cookie per request) and, on the
client, a per-tab offset.

`utils/dev-clock.ts` (client-safe — no `next/headers`) holds the cookie name,
the `SB_ENABLE_DEV_TOOLS` gate, offset parsing, and the Route Handler reader.
`utils/dev-clock-server.ts` adds the Server Component / Server Action reader
that pulls the cookie via `next/headers`.

### Thread `now` into the phase logic

The phase helpers in `app/(site)/utils/events.ts` take a **required**
`now: Date` parameter instead of calling `Date.now()` internally. A required
parameter (rather than an optional `= new Date()` default) is intentional: the
compiler then forces every call site to supply the effective clock, so faking
can never be silently ignored. Callers obtain `now` from:

- Server Components / Server Actions: `serverNow()`.
- Route Handlers: `requestNow(req)`.
- Client components: `EventContext.now`.

### Reuse the existing client clock

`EventContext` already carries `now`, seeded from the server and ticked forward
by `startNowTicker`. It is now seeded from the override (via `serverNow()`), and
the ticker is offset-aware so it keeps the fake time instead of snapping back to
real time on the next tick. `EventProvider` derives the offset once from the
server-seeded value (`value.now.getTime() − Date.now()`) — ~0 in normal
operation, the simulated jump under an override. Because all client phase checks
already read `EventContext.now`, they follow the fake clock for free after a
`router.refresh()`.

### Toolbar

A client component (`app/(site)/dev-toolbar.tsx`) gated by `SB_ENABLE_DEV_TOOLS`
(checked in the server layout, so no `NEXT_PUBLIC_` is needed) and shown when
`?dev=1` is present. It offers _real time_ (clear cookie), `+1h` / `+1d` /
`+7d`, a date/time picker, and dismiss (to hide for screenshots). Each control
writes the `time-override` cookie via `document.cookie` and calls
`router.refresh()` so Server Components re-render with the new time.

## Consequences

### Positive

- An organizer can preview any phase and time-dependent UI on staging/demo
  without editing the database.
- A required `now` parameter makes it a compile error to bypass the effective
  clock in phase logic.
- The client reuses the existing `EventContext` clock rather than adding a
  parallel one.

### Negative

- Every phase-logic call site must now supply `now`, a small amount of extra
  threading.
- The override only shifts "now"; it does not accelerate `setTimeout` and does
  not affect real-time systems (see below).

### Neutral

- The offset itself is timezone-agnostic; the picker stores/displays UTC ISO.

## Caveats

- **SQLite / `NOW()`**: the DB uses real time. Time-dependent queries must take
  the effective time as a parameter rather than relying on DB time. Today the
  phase logic runs in app code, not SQL, so this is a note for future queries.
- **External services** (email, etc.) still use real time.
- **Caching**: force-dynamic on time-sensitive routes so cached output doesn't
  preserve a stale clock. The affected phase routes already set
  `dynamic = "force-dynamic"`.
- **Timers don't accelerate**: an offset shifts "now" but does not make
  `setTimeout` fire faster. Fine for phase testing.
