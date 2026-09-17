# 3 · Server

One process: `apps/server`. Three drivers (HTTP, feed, jobs), nine modules, one
kernel. View `server` in the [diagrams](diagrams/README.md).

[![L3 server: infrastructure components and modules](diagrams/export/server.png)](diagrams/export/server.png)

## Layout

```
apps/server/src/
  main.ts                     composition root: build adapters, wire modules, start HTTP + jobs
  kernel/                     UnitOfWork, ChangeLog, Clock, Ids, ActorContext, errors, Result
  http/                       Hono app, middleware (actor, rate limit, CSRF origin check, problem details), OpenAPI mount
  feed/                       SSE hub, audience filter, snapshot assembly
  jobs/                       scheduler loop, consumer cursors, leases, scheduled_jobs
  db/                         drizzle schema, migrations, connection (WAL, pragmas), test factory
  modules/<name>/
    module.ts                 public surface: use cases, queries, reactions, routes. The only import other code may take.
    application/              one file per use case or query
    ports.ts                  interfaces this module needs (its repositories, mailer, push …)
    adapters/                 sqlite repositories and other implementations of ports.ts
    http/                     route handlers: contract in, use case, contract out
    reactions/                handlers for other modules' changes
    README.md                 purpose, aggregates, invariants, use cases, changes in/out
```

Rules (enforced, see [07](07-repo-and-rules.md#enforced-rules)): `application` may
import `domain`, `contracts`, `kernel`, its own `ports.ts`, and other modules'
`module.ts`. It may not import any `adapters/`, `http/`, `feed/`, `jobs/` or `db/`.
Adapters are constructed only in `main.ts`.

View `modules` in the [diagrams](diagrams/README.md) draws these rules: solid arrows
are direct use-case calls (downward only), dashed arrows are reactions to recorded
changes, where the reacting module depends on the other and never the reverse.

[![L3 server: module dependencies](diagrams/export/modules.png)](diagrams/export/modules.png)

## Use cases

A use case is a function built from its dependencies, taking an actor and a
validated input, returning a `Result` and recording changes through the unit of
work:

```ts
export const moveSession =
  (deps: Deps) =>
  async (actor: Actor, input: MoveSessionInput): Promise<Result<SessionView>> =>
    deps.uow.run(async (tx) => {
      const session = await tx.sessions.get(input.sessionId);
      if (!session) return notFound();
      const ctx = await loadPlacementContext(tx, session, input); // day, place, rules, clashes
      const verdict = policies.scheduling.canPlace(
        actor,
        session,
        input,
        ctx,
        deps.clock
      );
      if (!verdict.allow) return forbidden(verdict.reason);
      const moved = session.moveTo(input.start, input.end, input.placeId); // checks version
      await tx.sessions.save(moved);
      tx.record(changes.SessionMoved({ session: moved, from: session, actor }));
      return ok(toView(moved));
    });
```

- **Authorize before validating deeper state**, always with a policy from
  `domain`. The actor is resolved by middleware; a use case never reads a cookie.
- **Version check** on every edit (`expectedVersion` in the input, `409` on
  mismatch) so two hosts editing one session cannot silently overwrite each other.
- **One transaction** per use case. SQLite's single writer makes this cheap and
  serial; nothing here holds a transaction across I/O to another system.
- Errors are values (`Result`), mapped to HTTP problem details in one place.

Queries are the same shape without a transaction and without changes.

## Change log

```
changes(seq INTEGER PK AUTOINCREMENT, id TEXT UNIQUE, event_id, type, subject_type, subject_id,
        actor_type, actor_id, occurred_at, payload JSON, audience JSON, correlation_id, command_key)
```

- Written by `tx.record()` inside the use case's transaction. If the transaction
  rolls back, so does the change: state and log cannot disagree.
- `audience` is computed by `policies.visibility.audienceOf(change)` at write
  time and stored: `{ kind: 'public' }`, `{ kind: 'event' }`,
  `{ kind: 'persons', ids }`, `{ kind: 'sessionHosts', sessionId }`,
  `{ kind: 'organizers' }`. The feed and the
  snapshot use the stored audience, so changing a visibility rule later cannot
  retroactively expose old changes.
- `payload` is the **full new state** of the subject as the audience may see it,
  plus the fields that changed. A client applies a change by upserting the
  subject; it never needs to fetch. Deletions carry only ids.
- `correlation_id` links a reaction's changes to the change that caused them.
- `command_key` is the `Idempotency-Key` of the command that caused the change,
  echoed on the feed, so the client can match its own prediction whether the feed
  message or the HTTP response arrives first.
- After commit the kernel calls `publish(change)` in-process. Subscribers: the
  feed hub (synchronous fan-out to connected clients) and the jobs loop (a nudge;
  the loop reads from the table, not from memory, so nothing is lost on a crash).
  Publishing happens before the write lock is released, so the feed sends changes
  in `seq` order; the client ignoring `seq ≤ replica.seq` depends on it. A viewer's
  `seq`s have gaps (changes outside their audience), so gaps are never a signal.

Retention: payloads older than a configurable window (default 7 days) are pruned
to headers so the audit trail stays and the table stays small. The window only
bounds how long a client can resume the feed instead of reloading the snapshot;
since a snapshot is one cheap request, a short window costs nothing. A resume older
than the window gets `410 Gone`.

## Change feed and snapshot

```
GET /api/v1/events/{slug}/snapshot            → { seq, event, days, places, sessions, rsvps, proposals (public fields),
                                                  people (public profiles), me: { participation, votes, marks, meetings,
                                                  notifications (unread), availability, preferences } }
GET /api/v1/events/{slug}/feed?since={seq}    → text/event-stream of changes with id = seq, filtered by audience
```

- The snapshot is assembled from the same repository queries the use cases use,
  filtered by the same `audienceOf`/`canView` policies, and stamped with the
  current `seq` **read inside one read transaction** so it is consistent with the
  feed that continues from it.
- The hub keeps one entry per connection: `{ viewer, eventId, lastSeq }`. Fan-out
  is a filter over the audience, O(connections) per change; a few thousand
  connections and a few changes per second are trivial for one process.
- Heartbeat comment every 25 s keeps proxies from closing idle streams. The
  client reconnects with `Last-Event-ID`; the server replays from the table.
- Private data reaches only its person: a change with `audience.persons` is sent
  to those connections alone. There is no "unfiltered" stream, not even for site
  admins (they query the log instead).
- An event with the `publicSchedule` setting on serves the snapshot and feed
  without a session, reduced to the `public` audience: days, places, sessions
  and RSVP counts, never names or the `me` section. Off by default.

## HTTP API

- **REST, versioned by path** (`/api/v1`), resources named as in the glossary;
  non-CRUD commands are `POST /sessions/{id}/move`, `/rsvp`, `/meetings/{id}/accept`.
- The **contract is the source of truth**: each route declares its zod request and
  response schemas from `packages/contracts`; Hono's OpenAPI integration emits the
  document; `api-client` is generated from it in the build. A change to a contract
  changes the committed `openapi.json` and fails CI until reviewed (#677 done for
  good).
- **Errors** are RFC 9457 problem details with a stable `code` (the policy's reason
  code, e.g. `scheduling.reservedWindow`) the client translates.
- **Idempotency**: mutations accept `Idempotency-Key`; the key and response are
  stored for 24 h so a retry after a lost response does not RSVP twice or create two
  proposals (#141).
- **Pagination** is cursor-based everywhere a list can grow (#831).
- **Rate limiting** per actor or IP with an in-memory token bucket; strict
  defaults on `/auth/*` (#679).
- The **admin API** is the same API with organizer or site-admin roles, so the
  admin section of the SPA, a script with a token, and an attendee all go through
  one set of use cases (#1006).
- Uploads (`POST /people/{id}/avatar`, `/events/{slug}/venue/map`) go through one
  file adapter: size cap, re-encode with sharp to fixed formats, content-hash
  filename, served from `/files/{hash}` with immutable caching.

## Jobs

One loop, one process, everything a queue would do:

| Kind       | Source                                          | Examples                                                                                                                                   |
| ---------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Reactions  | `changes` table, one cursor per reaction name   | SessionMoved → notify hosts and RSVPs; HostRemoved leaving no host → notify RSVPs; RsvpAdded on a shift → recompute headcount notification |
| Scheduled  | `scheduled_jobs(due_at, type, payload, dedupe)` | reminders 1 h before a session, attendance-count nudge, meeting lapse at slot start, notification digest                                   |
| Deliveries | `delivery_attempts` with `next_at`              | email, push, chat — per channel binding, with backoff and a dead-letter state                                                              |

- **Exactly one loop** holds a lease row (`leases(name, owner, expires_at)`),
  renewed every few seconds. A second accidental process (someone running the
  server twice against one file) idles instead of double-sending.
- Every handler is **idempotent** keyed by `(reaction, change.seq)` or the job's
  dedupe key; at-least-once is the guarantee.
- All scheduling goes through the `Clock` port, so the dev fake clock advances
  reminders too.
- Reactions run **after** the causing transaction committed and record their own
  changes with the causing `correlation_id`.

[![Sequence diagram: organizer moves a session, attendees are told](diagrams/export/flowSessionMoved.png)](diagrams/export/flowSessionMoved.png)

This replaces the ad-hoc reminder dispatch and the proposed email outbox (#1005)
with one mechanism.

## Notifications and channels

```
NotificationCreated ──► deliveries for each binding the person has for that category
                                 │
             ┌───────────────────┼───────────────────┐
         EmailChannel        PushChannel        ChatChannel(telegram | matrix | signal)
         (SMTP adapter)   (web-push adapter)   (one adapter per platform behind one port)
```

- In-app is always on. A **binding** is a verified address on a channel: an email
  (verified by code), a push subscription (per device, listed and revocable in
  settings, #969), a chat account (linked by sending a one-time token to the bot).
- Preferences are per category per channel; the category enum lives in `domain`.
- Every attempt is logged (#580) and visible to site admins.
- Chat platforms are **outbound only** in this design; an inbound bot command is
  just an API token call and can be added as a separate integration later.

## Configuration and bootstrap

- Environment variables for infrastructure only: data directory, port, SMTP,
  public URL, log level. Everything an organizer would change is in the database
  and editable in the admin section.
- **Secrets** the app needs (cookie signing key, VAPID keys) are generated on
  first start into the data directory, never defaulted in code.
- **First site admin**: created by `server bootstrap-admin` printing a one-time
  join link, or by an env var consumed once. There is no shared admin password.
- `GET /health` reports database and jobs-loop liveness.

## Capacity

Sizing for the largest event the project should expect, so nobody designs for
scale that is not coming: 2 000 attendees, 500 sessions, 20 000 RSVPs. Snapshot
under 1 MB gzipped; feed fan-out of a few changes per second to 2 000 SSE
connections is well within one Node process; SQLite in WAL mode sustains hundreds of
small write transactions per second. Beyond that, the ports allow a Postgres
adapter and a Redis-backed hub, and nothing else needs to change; nothing here
prepares for it further.
