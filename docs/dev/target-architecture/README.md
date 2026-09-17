# Target architecture

A from-scratch design for SchellingBoard, written knowing the features that exist,
the ones in the issue tracker, and what attendees asked for after the 2026 event.
It deliberately ignores how the current code is laid out. It is a target, not a plan:
[10-path-from-here.md](10-path-from-here.md) sketches how to get there, but nothing
here is committed to until an ADR under `../adr/` adopts it.

**Status:** proposal, September 2026.

## The design on one screen

| Decision                   | Choice                                                                                                                                                                    | Why (short)                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Shape                      | One process serving an OpenAPI-described HTTP API, an SSE change feed, and a static React single-page app. No server-side rendering.                                      | Bots, admin automation and live updates all need the API; SSR adds a second runtime for a one-time cold-load gain. [D1](08-decisions.md#d1) |
| Boundaries                 | Workspace packages `domain` → `contracts` → `server` / `web`; feature modules inside `server` guarded by dependency-cruiser.                                              | A package cannot import what it does not declare. [D5](08-decisions.md#d5)                                                                  |
| Backbone                   | Every state change is committed together with a **change** record in an append-only change log. The log feeds the live UI, notifications, reactions and the audit trail.  | One mechanism instead of four. [D8](08-decisions.md#d8)                                                                                     |
| Client data                | The web app holds a **replica** of one event, loaded as a snapshot and kept current by the change feed, persisted for offline use.                                        | Every cross-cutting view (agenda, clashes, unfilled shifts) is a pure function over local data. [D3](08-decisions.md#d3)                    |
| Rules                      | Phase gating, edit rights, booking rules, capacity and visibility are **policies**: pure functions in `domain`, run by the server to decide and by the client to predict. | One place per rule; the same code answers "may I?" on both sides. [02](02-domain.md#policies)                                               |
| Identity                   | Persons with an **assurance level** per session (claimed / verified); organizers pick the event's minimum. Verification is passwordless first: join link, code, passkey.  | Picking a name stays viable; private features are honest about what they protect. [D2](08-decisions.md#d2)                                  |
| Agenda model               | `Session` with kinds (session, shift, fixture) and structured attributes; `Meeting` (1-on-1) a separate aggregate; the client merges both into the personal agenda.       | Shifts and meals are sessions with extra rules; meetings have their own lifecycle. [D4](08-decisions.md#d4)                                 |
| Persistence                | SQLite in WAL mode, repositories behind ports. One process, one file. Multi-replica deployment is a non-goal.                                                             | Self-hosting simplicity is a feature. [D6](08-decisions.md#d6)                                                                              |
| Transport for live updates | Server-Sent Events, resumable by sequence number.                                                                                                                         | Clients never push over the socket; SSE reconnects itself and needs no proxy configuration. [D7](08-decisions.md#d7)                        |
| Background work            | One scheduler loop in the same process: reactions, scheduled jobs, delivery attempts. Leased, idempotent, driven by the change log and a jobs table.                      | No queue to operate; the fake clock still works. [03](03-server.md#jobs)                                                                    |

## How to read this

Each level links down to the next. Stop when you have what you need.

| Level | Document                                     | Answers                                                                                     |
| ----- | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 0     | this page                                    | What was decided                                                                            |
| 1     | [01-overview.md](01-overview.md)             | Goals, non-goals, the containers, how a request flows, why the change log is the spine      |
| 2     | [02-domain.md](02-domain.md)                 | Modules, aggregates, invariants, policies, state machines, the time model                   |
| 2     | [03-server.md](03-server.md)                 | Application layer, ports and adapters, API, change feed, jobs, notifications                |
| 2     | [04-client.md](04-client.md)                 | The replica, commands and optimistic updates, offline, PWA, kiosk, UI structure             |
| 2     | [05-security.md](05-security.md)             | Threat model, identity and sessions, authorization, hardening, privacy                      |
| 2     | [06-data-and-time.md](06-data-and-time.md)   | Schema principles, the change log table, migrations, backups, time and zones                |
| 2     | [07-repo-and-rules.md](07-repo-and-rules.md) | Monorepo layout, the enforced rules and their tools, testing per package, agent affordances |
| 3     | [08-decisions.md](08-decisions.md)           | Each decision with the alternatives that lost, in ADR form                                  |
| 3     | [09-feedback-map.md](09-feedback-map.md)     | Every piece of attendee feedback and issue theme mapped to the element that serves it       |
| 3     | [10-path-from-here.md](10-path-from-here.md) | A strangler-style route from the current code                                               |
| —     | [glossary.md](glossary.md)                   | The words, used consistently everywhere else                                                |
| —     | [open-questions.md](open-questions.md)       | What still needs a decision                                                                 |
| —     | [diagrams/](diagrams/README.md)              | The LikeC4 model behind the C4 diagrams and flows                                           |

Diagrams: the C4 model and the flows live in [diagrams/](diagrams/) as LikeC4
sources. Run `make arch-diagrams` for an interactive view; `make arch` checks that
the sources parse. State machines are inline Mermaid in the documents.
