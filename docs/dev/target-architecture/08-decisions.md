# 8 · Decisions

Each in ADR form: context, decision, alternatives, consequences. When one is adopted
it moves to `../adr/` with a number and a status.

<a id="d1"></a>

## D1 · API server plus static SPA, no server-side rendering

**Context.** Today's app is Next.js App Router with server components and server
actions as the primary data path, plus some route handlers. The requirements that
motivated this redesign, live updates, bots, an admin API, an OpenAPI document, a
clear frontend/backend line, all need a real HTTP API. The question was whether to
keep SSR alongside it.

**What SSR is and what it buys.** The server runs the React tree per request and
returns finished HTML; the browser shows it, then downloads the JavaScript and
hydrates. React Server Components additionally let components run only on the
server and read the database directly. The benefits, measured against this app:

| Benefit                            | Applies here?                                                                                                                                                                                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content visible before JS loads    | On a **cold** visit, about one to two seconds on a slow phone. On every later open an installed PWA serves the shell and the last replica from disk with no round trip, which SSR cannot beat, and works offline. During an event the app is opened dozens of times a day. |
| Search engines and link previews   | No: the app is behind a login.                                                                                                                                                                                                                                             |
| Less client JS, no API to design   | Only until a second consumer of the data exists. Bots, admin automation and the feed are that consumer, so the API exists anyway and SSR becomes a second data path to keep consistent.                                                                                    |
| Auth-gated rendering on the server | The API enforces the same at the endpoint, in one place that is easier to audit than per-component rules.                                                                                                                                                                  |

**What SSR costs here.**

- Two runtimes for one UI: components must run on the server and in the browser,
  props must be serializable, `"use client"` boundaries are placed by hand.
  The timezone hydration mismatch (#734) and the Suspense-boundary freeze are this
  class of bug, and they are the hard kind: "which code ran where, and when".
- A snapshot that is stale on arrival: live updates need client state anyway,
  which overwrites the server HTML on load. The optimistic-RSVP mess (#463) is
  server-rendered truth plus client mutation plus revalidation.
- No offline path unless the client render path exists too, which is the SPA.
- Convention churn: the framework's own agent notice in this repo warns that this
  Next.js is not the one agents know.

**Decision.** One process serving an OpenAPI-described HTTP API, an SSE change
feed, and a static React SPA built with Vite. The initial HTML is a static shell;
there is no SSR. React stays; only the Next-specific parts (routing, server
actions, image and link components) are replaced.

**Alternatives.** (a) Meta-framework rendering from the API (Next or TanStack
Start, no server actions): keeps the hydration cost and still needs the client
store, for the cold-load second. (b) Keep Next full-stack with a side API for
bots: two data paths, the weakest separation.

**Consequences.** An API contract, a generated client and a client store to
maintain, each with one job and one runtime. Cold first load is slower by the
bundle download; mitigated by code-splitting per feature and precaching.

<a id="d2"></a>

## D2 · Persons with assurance levels; picking a name stays viable

**Context.** Attendees valued having nothing to remember. Half the new feature
requests are private data, which is meaningless if anyone can pick a name. Some
future events will want to require verification for everyone.

**Decision.** Identity is per person; each session has an assurance level
(claimed / verified); verification is passwordless first (join link, emailed code,
passkey), with a password as one more option. The event's identity mode sets the
minimum; a person can raise their own by protecting their name. Roles are data on
persons and participations; there is no shared site or admin password.

**Alternatives.** Verified only (rejected: friction for events without emails or
time to distribute links). Today's model with protection opt-in as the only
mechanism (rejected: no way for an organizer to require it, and admin as a shared
password).

**Consequences.** Organizers need a way to distribute join links (CSV export,
QR sheet, or emailing everyone at once). Private features in `open` mode show a
one-time notice.

<a id="d3"></a>

## D3 · Per-event replica kept current by a change feed

**Context.** The schedule must update without reloads; the requested views
(agenda, clashes, filters, unfilled shifts) cut across sessions, RSVPs, marks and
meetings; the venue wifi drops.

**Decision.** The client loads a snapshot of everything in its audience for one
event and applies changes from an SSE feed by sequence number; the replica is
persisted for offline opening. Derived views are pure functions in `domain`.
Paged or role-restricted data (directory search, vote breakdowns, notification
history, admin lists) uses ordinary queries.

**Alternatives.** Query cache with invalidation (TanStack Query): no custom sync,
but every cross-cutting view needs an endpoint or client-side joins, and offline
is partial. A third-party sync engine (Replicache, Zero, Electric): strongest
offline story, heavy dependency, usually Postgres.

**Consequences.** About a thousand lines of purpose-built sync (`apply`, feed
client, persistence) with property tests; a visibility model that decides
audience at write time; payloads that carry full subject state.

<a id="d4"></a>

## D4 · Session kinds plus a separate Meeting aggregate

**Decision.** `Session` carries `kind` (session, shift, fixture) and structured
attributes; `Meeting` is its own aggregate with its own lifecycle and two-party
privacy; the client merges both into the agenda.

**Alternatives.** One calendar-item type including meetings (privacy and lifecycle
become optional fields everywhere); separate aggregates per kind (four grids).

<a id="d5"></a>

## D5 · Workspace packages as the boundary mechanism

**Decision.** `domain`, `contracts`, `api-client`, `server`, `web` as Bun
workspace packages with TypeScript project references; dependency-cruiser and
local ESLint rules for the boundaries inside `server` and `web`.

**Alternative.** Directories in one package with lint rules only: less tooling,
every boundary exemptable.

<a id="d6"></a>

## D6 · SQLite only, behind ports

**Decision.** SQLite in WAL mode is the only supported database. Repositories are
ports so a Postgres adapter is possible; it is not promised, and multi-replica
deployment is a non-goal.

**Alternatives.** Both databases (double the persistence maintenance); Postgres
only (a second container for self-hosters, harder backups).

<a id="d7"></a>

## D7 · Server-Sent Events, not WebSockets

**Decision.** The feed is SSE with `Last-Event-ID` resume. Mutations go over HTTP.

**Why.** The client never needs to push over the socket; SSE reconnects itself,
works through HTTP/2 and ordinary proxies, and needs no library. WebSockets would
be justified by a bidirectional need such as typing indicators, which nothing
planned has.

<a id="d8"></a>

## D8 · The change log as the single backbone

**Decision.** Every use case records changes in the same transaction as its state.
The log serves the feed, notifications, reactions between modules, scheduled work
triggers and the audit trail.

**Alternatives.** Event sourcing (state rebuilt from events: a large mental-model
cost for no need here); separate mechanisms per concern (an email outbox, a
notification table, a pub/sub for the UI, no history), which is where the current
code was heading.

**Consequences.** Payload shapes are part of the contract and versioned; retention
is a setting; reactions must be idempotent.

<a id="d9"></a>

## D9 · Vite, TanStack Router, a small reactive store

**Decision.** Vite builds the SPA; TanStack Router for typed routes with search
params (modals as URL state); a Zustand-style store for the replica with memoized
selectors. Tailwind and the existing token system stay.

**Why.** Stable, widely known, minimal API surface. Any equivalent would do; the
point is to pick boring tools and not revisit.

<a id="d10"></a>

## D10 · One jobs loop in the process

**Decision.** Reactions, scheduled jobs and deliveries run in one leased loop in
the server process, reading from tables, idempotent, through the `Clock` port.

**Alternatives.** An external queue (something to operate for a self-hoster);
a separate worker process (two things to run and a second database writer).

<a id="d11"></a>

## D11 · Node in the image, Bun for tooling

**Decision.** The Docker image runs the server on Node. Bun stays the package
manager and script runner; Vitest and Playwright stay the test runners.

**Why.** The SQLite driver and `sharp` are native modules with Node as their
first-class target; Bun's compatibility with them changes between releases.
Revisit yearly.

## Resolved product questions

Settled while reviewing this design, recorded so they are not reopened by
accident:

- A new event defaults to identity mode `verified` ([05](05-security.md#identity-and-assurance)).
- The vote breakdown is fetched on demand, not streamed ([02](02-domain.md#proposal-vote)).
- Change payload retention defaults to 7 days ([03](03-server.md#change-log)).
- Suggesting a 1-on-1 for a proposal that was never scheduled is **not** a feature.
- Fixtures may carry a capacity and take RSVPs ([02](02-domain.md#session)).
- A public read-only schedule is a per-event setting, off by default
  ([03](03-server.md#change-feed-and-snapshot)).
- Which chat channel to build first is a product question outside this design.
