# 5 · Security

"Secure by default" here means three concrete things: a fresh install has no
unsafe defaults to fix; every sensitive operation is decided by one policy the
tests can name; and private data is private by construction of the audience model,
not by remembering a filter.

## Threat model

| Actor                            | Wants                                                    | Countered by                                                                                          |
| -------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Another attendee                 | Act as me, read my marks/votes/meetings, edit my session | Assurance levels and protection; audience model; edit policies with version checks                    |
| Someone with the event link only | Read the schedule and the people directory               | Participation required for any read beyond the event's `publicSchedule` setting; join code / links    |
| A malicious link or page         | CSRF a mutation, steal a session                         | SameSite cookies, Origin check, httpOnly, CSP, no token in URLs after the join redirect               |
| A bot with a leaked token        | Bulk-read or bulk-write                                  | Scoped tokens, rate limits, revocation, token events in the audit log                                 |
| A hostile upload                 | Stored XSS, oversized files                              | Re-encode to fixed formats, no SVG, size caps, hash names, immutable serving, CSP                     |
| A self-hoster's mistake          | Open admin, default secret                               | No admin password; secrets generated on first run; bootstrap link consumed once                       |
| The project itself               | Accidental data leak in a new endpoint                   | Contracts define response shapes; snapshot and feed use stored audiences; tests assert per-role views |

## Identity and assurance

- A **Person** may hold zero or more credentials: password (argon2id), passkeys
  (WebAuthn), and a verified email for codes. **Join tokens** are per person per
  event, single-use, expiring, delivered by the organizer as a link or QR code.
- A browser **login session** is a server-side row (`login_sessions(id, person,
event?, assurance, created, expires, device)`; `sessions` is the schedule's
  table) referenced by an httpOnly, Secure, SameSite=Lax cookie. Nothing about the person is in the cookie; revocation is a
  row delete. Login sessions are listed and revocable in settings.
- **Assurance** is per login session: `claimed` (the person picked their name),
  `verified` (join token, emailed code, password or passkey). A verified session
  is the only way to act as a person who has **protected** their name.
- The event's **identity mode** sets the minimum for acting:

  | Mode       | Picking a name              | Verification                                                 | Private features (marks, meetings, anonymous RSVPs)                 |
  | ---------- | --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
  | `open`     | enough to act               | optional, per person ("protect my name")                     | available, with a one-time notice that a claimed name is not a lock |
  | `verified` | shows the verification step | required; passwordless by default (join link, code, passkey) | available                                                           |

  Organizers choose the mode per event. A new event defaults to `verified`: the
  organizer imports the participants and sends everyone their join link (or a
  QR sheet), and can lower the mode to `open` for an event that wants zero
  friction. Nobody has to remember a password in either mode, because a join link
  or an emailed code is always an option.

[![Sequence diagram: first login through a personal join link](diagrams/export/flowJoin.png)](diagrams/export/flowJoin.png)

- **Roles**: `siteAdmin` on the person; `organizer` or `attendee` on the
  participation. **Host** is derived from the session or proposal. Roles are data,
  never inferred from a password.
- **API tokens** for bots and automation: hashed at rest, scoped (`read:event`,
  `write:sessions`, `admin`), tied to a person or to the site, revocable,
  every use of `admin` scope recorded as a change with audience `organizers`.

## Authorization

- Every use case calls a policy before it mutates, with the actor the middleware
  resolved. A use case without a policy call fails a lint rule
  ([07](07-repo-and-rules.md#enforced-rules)).
- UI gating is a convenience that uses the same policy; it is never the control.
- Read authorization is the audience model: `audienceOf` decides at write time who
  may ever see a change, `canView` decides per query. The snapshot is assembled
  through `canView`. Tests build a fixed world and assert the snapshot for each
  role (attendee, host, organizer, site admin, bot) as a golden file, so a new
  field that leaks shows up as a diff.
- Private subjects (marks, meetings, votes, notifications, channel bindings) have
  no repository method that returns rows for anyone but the owner; the "list all"
  method does not exist, so it cannot be called by mistake.

## Transport and browser hardening

- Cookies: httpOnly, Secure, SameSite=Lax, path-scoped. Mutations additionally
  require `Sec-Fetch-Site` same-origin or a matching `Origin`, and token calls
  require the `Authorization` header (never a cookie), so a token cannot be
  CSRF'd and a cookie cannot be used cross-site.
- CSP with no inline scripts (the SPA is hashed static files), `frame-ancestors
'none'`, `object-src 'none'`; HSTS at the reverse proxy, documented.
- Rate limits: strict on `/auth/*` and `/join`, moderate per actor elsewhere;
  responses carry `Retry-After`.
- Join links land on a page that exchanges the token for a session and then
  redirects, so the token never sits in a referer or a history entry the next
  person on a shared phone can reuse.

## Input and output

- Every request body and query is parsed by its contract before the use case
  sees it; unknown fields are rejected, strings have caps, markdown is rendered
  with a fixed allowlist on the client and never as raw HTML.
- Every response is produced through its contract, which is a positive allowlist
  of fields. A repository row never reaches the wire.
- Uploads are re-encoded (sharp) to WebP/JPEG at fixed sizes, capped, stored under
  a content hash, served with `Content-Type` fixed and `X-Content-Type-Options:
nosniff`.

## Audit and observability

- The change log is the audit trail: who, what, when, from which correlation.
  Organizers can see it per event; site admins per site.
- Logs are structured, carry request and correlation ids, and hold no personal
  data beyond ids. Errors optionally go to a self-hosted error tracker.

## Privacy

- **Data minimization** in the schema: no field without a screen that shows it.
- A person can **export** their data and **delete** their account; deletion
  anonymizes their changes (actor becomes `deleted`) rather than breaking the log,
  and removes profile, credentials, marks, meetings, bindings.
- A per-site **data collection statement** page is generated from the schema's
  data classes (#801), so it cannot drift.
- Retention: change payload pruning, delivery logs and idempotency keys expire;
  all windows are settings with safe defaults.

## Dependencies and build

- Lockfile committed, `bun audit` in CI, automated bump PRs, a single pinned
  runtime version in the Dockerfile. The image runs as a non-root user with a
  read-only filesystem except the data directory.
- Secrets never appear in the image or in compose defaults; the compose file ships
  with the variables listed and empty, and the server refuses to start with a
  public URL of `localhost` in production mode.
