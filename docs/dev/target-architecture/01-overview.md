# 1 · Overview

## What the system is for

An unconference runs in three phases: attendees propose sessions, vote on them, and
then place them on a shared grid and RSVP. Around that core the app has grown a
people directory with profiles and comments, 1-on-1 meetings, notifications in the
app, by email and by push, a kiosk mode, an admin UI, and an installable phone app.
The 2026 event produced a clear next layer of wants: a **personal agenda** that is
mine and private (stars, hides, notes), a schedule that **updates live**, **venue
guidance** (floors, maps, gathering points), **volunteer shifts** with a visible
headcount gap, **organizer rules** the software enforces (reserved windows), and
**more ways to be reached** (chat bots). The full mapping is in
[09-feedback-map.md](09-feedback-map.md).

## Qualities, in priority order

1. **Secure by default.** Nothing sensitive is reachable without an explicit,
   audited decision; every mutation is authorized in one place by one policy; the
   defaults of a fresh install are the safe ones.
2. **Understandable by people and agents.** One place per concern, boring
   technology, boundaries the tooling enforces, names that match the glossary, and
   documentation that reads top-down.
3. **Live and offline-tolerant.** What one person changes, everyone sees within a
   second; a wifi drop degrades to "last synced at 14:02", not to a blank page.
4. **Self-hostable in one container.** One process, one database file, one
   directory of uploads. A backup is a file copy.
5. **Cheap to extend.** A new rule is a policy plus a test; a new notification
   channel is one adapter; a new agenda item kind is data, not a new grid.

## Non-goals

- Horizontal scaling. One process handles an event of a few thousand attendees
  (see [03-server.md § capacity](03-server.md#capacity)); more than that is a
  different product.
- A database other than SQLite. Ports keep it possible; nothing promises it.
- Native mobile apps. The PWA is the phone app.
- Server-side rendering. See [D1](08-decisions.md#d1).
- A general chat product. Attendee-to-attendee chat (#776) fits the change log and
  feed if it is ever wanted, but nothing here is designed around it.

## The containers

```
 ┌──────────────────────────┐   HTTPS/JSON (OpenAPI)   ┌────────────────────────────────────┐
 │  Web app (static SPA)    │ ───────────────────────► │  Server (one process)              │
 │  React · Vite · PWA      │   SSE change feed        │  HTTP API · change feed · jobs     │
 │  replica of one event    │ ◄─────────────────────── │  9 modules · kernel                │
 └──────────────────────────┘                          └──────┬─────────────────┬───────────┘
                                                              │ SQL via ports   │ files
                                                       ┌──────▼──────┐   ┌──────▼──────┐
                                                       │ SQLite (WAL)│   │ uploads dir │
                                                       │ state +     │   └─────────────┘
                                                       │ change log  │
                                                       └─────────────┘
 external: SMTP · browser push services · chat platforms (Telegram/Matrix/Signal) · a reverse proxy for TLS
```

LikeC4 views `index` and `containers` in [diagrams/](diagrams/README.md) are the same
picture with the people and external systems drawn.

[![L1 system context diagram](diagrams/export/index.png)](diagrams/export/index.png)
[![L2 container diagram](diagrams/export/containers.png)](diagrams/export/containers.png)

- **Web app.** Static files. On opening an event it loads a snapshot, subscribes
  to the feed, and renders everything from the local replica. Mutations are
  commands: predict locally with the same policy the server will run, call the
  API, reconcile with the confirmed change. Installed as a PWA it opens offline.
  [04-client.md](04-client.md)
- **Server.** A Hono application on Node. Three drivers: the HTTP API, the
  change feed, and the jobs loop. Nine feature modules, each hexagonal: use cases
  in the middle, ports outward, adapters at the edge. A kernel with the unit of
  work and change log that every module shares. [03-server.md](03-server.md)
- **Database and files.** SQLite in WAL mode holding state tables and the
  append-only change log; a directory for re-encoded uploads.
  [06-data-and-time.md](06-data-and-time.md)

## Packages

```
packages/domain      pure TypeScript: entities, value objects, policies, change types, state machines, time model. No I/O, no framework.
packages/contracts   zod schemas for every request, response, snapshot and feed message; the OpenAPI document is generated from them.
packages/api-client  generated from the OpenAPI document. Typed fetch, nothing else.
apps/server          the process. Depends on domain and contracts.
apps/web             the SPA. Depends on domain (policies, derived views), contracts (types) and api-client.
```

The direction is strict and enforced by package manifests: `domain` imports
nothing; `contracts` imports `domain`; `server` and `web` import both and never each
other. Inside `server`, dependency-cruiser enforces the module rules in
[07-repo-and-rules.md](07-repo-and-rules.md).

## How a request flows

Every mutation, whether from the web app, a bot, or the admin section, takes the
same road:

1. **HTTP** parses and validates the body against the contract, resolves the
   **actor** (session cookie or API token → person, assurance, roles, scopes),
   applies rate limits, and calls one use case.
2. The **use case** loads what it needs through repository ports, asks the
   **policy** whether this actor may do this to this subject in this phase, applies
   the domain operation, and hands the unit of work the new state and the
   **changes** it produced.
3. The **unit of work** writes state and changes in one SQLite transaction. The
   change gets a sequence number.
4. After commit the kernel **publishes** the change in-process: the feed pushes it
   to every subscriber in its audience; the jobs loop will run the reactions of
   other modules and any deliveries.
5. HTTP returns the result plus the change id. The change also carries the
   caller's idempotency key, so the caller recognises its own change on the feed
   even when the feed delivers it before the response arrives.

[![Sequence diagram: RSVP with optimistic update and live propagation](diagrams/export/flowRsvp.png)](diagrams/export/flowRsvp.png)

Reads are either the snapshot and feed (for everything in the viewer's audience of
one event) or explicit queries for paged, searched, or role-restricted data (the
people directory search, a host's vote breakdown, notification history, admin lists).

## Why the change log is the spine

Five things the app must do are all "something happened, and someone else needs to
know": the live UI, in-app notifications, email/push/chat delivery, cross-module
reactions such as clearing the marks that pointed at a deleted session, and the
audit trail that answers "who moved this session" or "who proposed this". Building
each on its own mechanism is how the current code ended up with optimistic-update
bugs, an email path that blocks RSVP-heavy edits, and no history at all.

One append-only log, written in the same transaction as the state it describes,
serves all five. It is not event sourcing: state lives in ordinary tables and the
log is derived from operations, not the other way round. It is the transactional
outbox pattern, with the outbox promoted to a first-class, queryable table.
[03-server.md § change log](03-server.md#change-log) has the shape;
[06-data-and-time.md](06-data-and-time.md) the table; [D8](08-decisions.md#d8) the
alternatives.
