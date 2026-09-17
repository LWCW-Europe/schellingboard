# 7 · Repository, enforced rules, testing, agents

## Layout

```
schellingboard/
  packages/
    domain/          src/<module>/{entities,policies,changes,views}.ts, src/time/, src/apply.ts
    contracts/       src/<module>/*.ts (zod), src/feed.ts, src/snapshot.ts, openapi.json (generated, committed)
    api-client/      generated; do not edit
  apps/
    server/          see 03-server.md
    web/             see 04-client.md
  tools/
    seed/            fixtures and generated data (small / large profiles)
    e2e/             Playwright suite, run against the built app and against the Docker image
    scripts/         release, docs, dump-release-db
  docs/
    dev/             ADRs, this design, chapters; CONTEXT.md (glossary + module map, for agents)
    public/          attendee, organizer and self-hosting docs (published)
  Dockerfile, docker-compose.yml, Makefile, package.json (workspaces), bunfig.toml
```

Bun workspaces. One `tsconfig` per package with project references so `tsc -b`
checks the graph in dependency order and a package cannot see another's internals.

## Enforced rules

Conventions that only live in a document decay. Each rule below names its tool and
the message the author reads.

| Rule                                                                       | Tool                       | Message (abridged)                                                                          |
| -------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------- |
| `domain` imports nothing but itself                                        | package.json + tsc refs    | (cannot resolve)                                                                            |
| `server` and `web` never import each other                                 | package.json + tsc refs    | (cannot resolve)                                                                            |
| `application/` never imports `adapters/`, `http/`, `feed/`, `jobs/`, `db/` | dependency-cruiser         | "Use cases depend on ports; adapters are wired in main.ts"                                  |
| Modules import other modules only via `module.ts`                          | dependency-cruiser         | "Other modules' internals are private; call a use case or react to a change"                |
| No dependency cycles among modules                                         | dependency-cruiser         | "Cycle between modules: one of these should be a reaction"                                  |
| Every command use case calls a `policies.*` function before `save`         | ESLint (local rule, typed) | "Authorize with a domain policy before mutating"                                            |
| Every HTTP route declares request and response contracts                   | ESLint (local rule)        | "Routes are typed by contracts; the OpenAPI document is generated from them"                |
| Change types are only constructed via `changes.X()` in `domain`            | ESLint                     | "Audience and payload shape are decided in domain"                                          |
| No `new Date()`, no locale-dependent formatting outside `domain/time`      | ESLint                     | "Use the Clock port / domain/time"                                                          |
| No palette colour class, only role tokens                                  | ESLint + contrast test     | "Name the role: bg-surface, text-fg-muted …"                                                |
| `features/` never imports `api-client`                                     | dependency-cruiser         | "Mutations go through commands/; reads through the replica"                                 |
| Committed `openapi.json` matches the contracts                             | CI diff                    | "Regenerate and review the API change"                                                      |
| LikeC4 model parses                                                        | `make arch` (CI)           |                                                                                             |
| Repository methods returning private subjects take an owner argument       | ESLint (naming + typed)    | "Private data is queried per owner; there is no list-all"                                   |
| Snapshot per role matches golden files                                     | test                       | "A field became visible to <role>; confirm in visibility policy and update the golden file" |

Exemptions are per line with a reason, as today.

## Testing

| Package / tier       | What                                                                                                                                                       | How                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| domain · unit        | Policies, state machines, `apply`, grid maths, derived views, prediction                                                                                   | Vitest; property tests for `apply` (any change sequence keeps invariants) and for clashes  |
| contracts · unit     | Every schema round-trips its fixtures; OpenAPI generation is deterministic                                                                                 | Vitest                                                                                     |
| server · integration | Use cases against a real in-memory SQLite: authorization per role, phase gating, changes recorded with correct audience, reactions idempotent, feed resume | Vitest with the db test factory; this is where most coverage lives                         |
| server · contract    | Each route validates against `openapi.json` in and out; problem details codes stable                                                                       | Vitest + an OpenAPI validator                                                              |
| server · golden      | Snapshot per role for a fixed world                                                                                                                        | Vitest golden files                                                                        |
| web · component      | Features rendered from replica fixtures; commands' predict/reconcile/rollback with a fake API                                                              | Vitest browser mode + Testing Library                                                      |
| e2e                  | The important attendee and organizer journeys by clicking through the UI with semantic locators                                                            | Playwright against the built app; the same suite against the Docker image before a release |
| release-upgrade      | Migrate a released database forward and exercise CRUD                                                                                                      | Vitest, fixtures dumped at release time                                                    |

TDD stays mandatory. Integration tests are cheap because a use case is a function
with injected ports and an in-memory database; there is no HTTP to spin up for
most of them.

## What makes this navigable for agents (and people)

- **One place per concern**, and a table saying which:

  | I want to …                         | Go to                                                                                                                        |
  | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
  | change a rule about who may do what | `packages/domain/src/<module>/policies.ts` + its test                                                                        |
  | add a field to a session            | domain entity → contract → migration → adapter → `apply` fixture → golden snapshots; the compiler walks you through the rest |
  | add a mutation                      | `make new-use-case module=scheduling name=pinSession` → fills application, contract, route, command, tests                   |
  | tell someone about something        | a change type + a reaction in `notifications/reactions/`                                                                     |
  | reach people a new way              | one adapter implementing `ChannelPort`                                                                                       |
  | add a screen                        | `apps/web/src/features/<name>/`, selectors from the replica                                                                  |
  | know what a word means              | `docs/dev/CONTEXT.md` (the glossary) and the module README                                                                   |

- **Module READMEs** with a fixed template: purpose, aggregates and invariants,
  use cases, changes recorded, changes reacted to, open questions. Short, and
  checked in the same commit as a change to the module.
- **Scaffolds** (`make new-use-case`, `make new-reaction`, `make new-feature`)
  generate the files and the failing test, so the shape is always the same.
- **Reason codes, not sentences**, from policies; **contracts, not prose**, for
  the API; **golden files, not judgement**, for visibility. An agent can verify
  each of these without understanding the whole system.
- Small files, one export each in `application/`, names from the glossary. The
  comment rules from `coding-guidelines.md` apply unchanged.
- The **ADR directory** stays the place a decision is made; this design becomes
  ADRs as parts of it are adopted.

## Documentation

Unchanged in principle: `docs/public/` for attendees, organizers and self-hosters,
edited in the same commit as the change; `docs/dev/` for developers, with ADRs and
this design; `docs/dev/CONTEXT.md` as the agent entry point (glossary, module
map, the table above).
