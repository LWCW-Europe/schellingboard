# Matrix chat integration — feasibility notes

**Status:** exploratory, not decided. This is not an ADR — no decision has been made
to build any of this. It records what's technically possible and what it costs, as
input to that decision.

## Goal

Let attendees jump from a profile/session in SchellingBoard to a chat with that
person, without requiring an existing Signal/Telegram/WhatsApp contact. Scope
agreed so far:

- One chat server per event, not shared across events, not federated with the
  public Matrix network.
- Accounts auto-provisioned/synced from event participants.
- 1:1 chats and group chats (subset or all attendees).
- Rooms with elevated permissions (e.g. an orga-only room).
- A no-install web client is required; native/desktop clients are a bonus, not a
  replacement for it.
- Chat is reached via a link to a separate URL (e.g. `chat.sb.example.com`) — it does
  **not** need to be embedded in the SchellingBoard UI itself.
- Voice/video: opt-in only, useful mainly for organizers, not part of the default
  feature.
- Server-initiated notifications (e.g. "session moved to a different slot") sent
  into Matrix, targeted at attendees who RSVP'd.

## Architecture

**Server:** [Synapse](https://github.com/element-hq/synapse) (Matrix's reference
homeserver, AGPL-3.0, open source), one container per event, alongside the existing
`app` container. Isolation from the public Matrix network: remove/firewall the
federation listener (port 8448) and set `federation_domain_whitelist: []`. No single
config flag does this; it's a combination, and Synapse may still be able to originate
some outbound federation traffic unless the listener is actually blocked at the
network level. ([synapse#6401](https://github.com/matrix-org/synapse/issues/6401))

**Provisioning:** SchellingBoard's server calls Synapse's admin API
(`/_synapse/admin/v1/register`, HMAC-signed with a shared secret held only by the
app container) to create/sync a Matrix account when a guest is created. This is a
server-to-server call; the shared secret is never exposed to a browser.
([Register API](https://matrix-org.github.io/synapse/latest/admin_api/register_api.html))

**1:1 chat:** a [`matrix.to`](https://matrix.to) link
(`https://matrix.to/#/@alice:sb.example.com`) on the attendee's profile opens
whatever Matrix client the visitor is signed into and starts/opens a DM. No
embedding needed to satisfy "jump from a profile to a chat."

**Group / orga rooms:** created via the Client-Server API; membership managed by
inviting/removing the mapped Matrix IDs of the guests in the group. Elevated
permissions (who can invite, redact, change room settings) are native Matrix
room [power levels](https://spec.matrix.org/v1.12/client-server-api/#permissions)
— no extra tooling required.

**Server-initiated notifications:** a bot/service account (created the same way as
regular accounts) posts into either a per-attendee DM or a per-session room, using
the RSVP list SchellingBoard already has server-side to decide who's invited/
targeted. This slots in next to the existing `sessionHeadsUp` email trigger in
`model/guest.ts` — same trigger point, an additional send instead of/alongside the
email.

## Hosting under `sb.example.com/messaging`?

**Not for the homeserver API.** Synapse's client/server API paths are hardcoded to
start at `/_matrix` and `/_synapse/client` from the root of whatever (sub)domain it's
served on; the official reverse-proxy docs explicitly warn against inserting a path
prefix in `proxy_pass`, since it breaks URL canonicalisation (and, when federation is
on, signature verification).
([reverse_proxy.html](https://matrix-org.github.io/synapse/latest/reverse_proxy.html))
A subdirectory setup is DIY, undocumented, and risks subtly breaking media URLs and
`.well-known` discovery. The supported shape is a dedicated (sub)domain, e.g.
`chat.sb.example.com`.

**Clean-looking Matrix IDs are still possible** via
[well-known delegation](https://matrix-org.github.io/synapse/develop/delegate.html):
`sb.example.com` can serve a static `/.well-known/matrix/client` (and `/server`, if
federation were ever wanted) JSON file pointing `base_url` at
`https://chat.sb.example.com`, giving IDs like `@alice:sb.example.com` while the
actual homeserver runs on its own subdomain. This is a static file the Next.js app (or
the reverse proxy in front of it) can serve trivially, and doesn't conflict with
anything else on the main domain.

**The web client UI** (Element Web or similar) is a static SPA and _can_ be built for
a subpath (`<base href>` + matching web-server root), but the simplest and best-tested
option is to serve it from the same subdomain as the homeserver
(`chat.sb.example.com`) rather than fight subpath rewriting for no real benefit, given
embedding isn't required.

## Embedding a chat UI directly in SchellingBoard (not required, but asked about)

Possible, but a real subproject, not a dependency you add:

- [`matrix-js-sdk`](https://www.npmjs.com/package/matrix-js-sdk) is headless
  (protocol/sync/E2EE only) — a custom message list, composer, and room list would
  need to be built on top of it.
- [`matrix-react-sdk`](https://github.com/matrix-org/matrix-react-sdk) is **not** an
  embeddable component library — by its own docs it only works as part of Element
  Web's own "skin" and isn't usable standalone.

Given chat can live at its own URL, this is not worth building unless attendees
specifically ask for it after using the link-out version.

## Can this replace Signal/Telegram?

Mostly, with real gaps:

| Area                                   | Status                                                                                                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1:1/group text, files, reactions, E2EE | Works out of the box                                                                                                                                                                                    |
| Search                                 | Weaker — encrypted rooms aren't server-searchable, client-side only                                                                                                                                     |
| Voice/video                            | Opt-in (per current scope): Element Call is now production-grade (MatrixRTC + LiveKit SFU), but needs its own LiveKit + JWT-auth-sidecar + TURN/UDP relay — a second stateful service, not just Synapse |
| Push notifications                     | See below — the hard part                                                                                                                                                                               |
| Mobile client                          | Element/Element X work, but are heavier UX than Signal/Telegram, and users must point them at a non-default homeserver                                                                                  |

### Push notifications collide with an existing, deliberate project decision

[ADR 0006](adr/0006-push-notifications.md) chose Web Push over a native app
specifically to avoid **any relay a self-hoster doesn't control**: no Apple
Developer account, no App Store, "nothing for a self-hoster to configure." Matrix
mobile push normally goes through a push gateway (Sygnal/UnifiedPush) wired to
FCM/APNs, which is either a third-party relay (often Element's own `sygnal.im`) or
another service every self-hoster has to stand up and configure themselves. Either
way it reintroduces the exact problem ADR 0006 solved. Without it, messages still
arrive next time the client is opened — just no OS-level alert.

This is the main reason "fully replace Signal/Telegram" is a materially bigger
project than "stand up a chat container": it needs either accepting the relay
dependency ADR 0006 rejected, or shipping text-only-when-open as the default and
treating real push as a distinct, later increment.

## Tradeoffs worth weighing before deciding

- **Deployment model mismatch:** `docker-compose.yml` is deliberately one app
  container + SQLite — the whole self-hosting pitch. Synapse (and, if ever added,
  LiveKit/TURN) makes every self-hoster run and maintain a second (or third)
  stateful service, not just this project's own deployments.
- **Data lifecycle:** chat history and media accumulate in Synapse's own store, with
  no existing end-of-event policy (wipe? export? keep running?). This becomes a
  retention/GDPR question the moment real conversations happen in it.
- **Onboarding friction:** attendees already have Signal/Telegram installed; a new
  per-event account (and possibly a new app) is friction those don't have. The
  win — auto-linked contacts, orga rooms — has to outweigh that for adoption.
- **Identity is only as strong as SchellingBoard's own:** most guests are
  unauthenticated by default (an unsigned cookie lets anyone "become" any
  unprotected guest — see `utils/acting-guest.ts`). A Matrix login minted from
  "current guest" inherits that weakness. Fine for casual chat matching the app's
  existing trust level; gating the orga room specifically behind
  `isVerifiedAsGuest` (the signed-cookie path) avoids letting that weakness reach
  the one room where it matters.
- **"Must not sync with other servers" doesn't fully hold once mobile push is in
  scope:** even with federation off, third-party push gateways/APNs/FCM still see
  device tokens and notification metadata (though not room content, if E2EE'd).
- **Per-event ops burden compounds:** one more container to patch and monitor,
  multiplied by however many events run.

## Open Questions

- Is this an opt-in feature per event, or something every deployment gets by
  default? (Given the deployment-model mismatch above, opt-in seems necessary.)
- Is text-only (no push, no calls) an acceptable v1, with push treated as a
  separate later decision?
- What's the retention/deletion policy for chat data after an event ends?
- Is a wildcard-DNS/one-subdomain-per-event setup ("chat.sb.example.com") acceptable
  operationally, or does each event need its own domain?
- Does the orga-room use case justify the isolation/permissions work on its own,
  independent of whether general attendee chat ships?
