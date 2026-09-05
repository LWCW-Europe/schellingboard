# ADR 0006: Push notifications through an installable web app

- **Status:** Accepted
- **Date:** 2026-09-05

## Context

Everything the app tells an attendee reaches them in two places: a row on the
notifications page, and — if they haven't turned that type off — an email. Both
require the attendee to come looking, or to be watching an inbox. During an
event, the things worth telling someone about are time-critical: a session they
RSVP'd to moved rooms, someone wants a 1-on-1 in the next slot.

The obvious answer is a notification on the phone, and the obvious way to get
one is an app in the App Store. That does not survive contact with how this
project is deployed. APNs credentials belong to an app bundle, not to a server,
so one SchellingBoard app would mean every self-hosted instance routing its
notifications through a relay the project operates — one that sees device
tokens and notification text for every event on every instance. Shipping the
APNs key to self-hosters instead is not an option, and neither is asking each
organizer to publish their own app.

Since iOS 16.4, Safari delivers Web Push to a web app that has been added to
the home screen. That removes the reason to have a native app at all.

## Decision

Ship the app as an installable PWA and push over the Web Push protocol, with
per-instance VAPID keys.

### A manifest and a service worker, and no offline support

`app/manifest.ts` is a dynamic metadata route, because the app's name is the
site title from the database — the image is built without one, and two
containers running it are different events. `public/sw.js` handles `push` and
`notificationclick` and nothing else.

Offline caching is deliberately absent. A schedule that keeps changing is worse
than useless served stale, and caching dynamic pages is a different and much
larger job (see the discussion on [#317]). The service worker exists because a
browser will only deliver a push to one.

### VAPID keys in the database, generated on first use

They are written the first time a guest opens Settings and never replaced: the
public half is baked into every subscription already handed out, and nothing
tells a browser to ask for a new one. Keeping them in the database rather than
the environment means a self-hoster gets working notifications without
generating anything, and a restored backup keeps working.

### The device is the subscription, not the guest

A row is keyed by the endpoint the push service hands out, which identifies a
browser. Picking a name is not a login here, so a shared laptop belongs to
whoever turned notifications on last, and what the browser holds is never on
its own an answer to "are notifications on for me" — the client asks the
server, which compares the endpoint against the current guest.

The guest who takes over a shared device and never opens Settings keeps
receiving the previous guest's notifications; nothing can tell the two apart.
The guest who does open Settings finds a subscription that isn't theirs, and
the client ends it there and then rather than showing "off" beside a device
that is still ringing for somebody else.

### A device is all or nothing

Push does not answer to the per-type email settings, and has no per-type
settings of its own. Email is the heavier channel — it lands in an inbox, it can
be classed as spam, and unwanted mail reflects on the organizer — so it keeps
its toggles. A phone notification is lighter, and the set of people who turn
their phone on and then want to prune particular types is expected to be tiny.
Per-type push settings are a strictly larger data model that can be added later
without invalidating anything, if that expectation turns out wrong.

The consequence is that a guest who has turned every email off still gets every
push on a device they turned on; the section in Settings says so.

### Endpoints are validated, not allowlisted

A subscription's endpoint is a URL the server later POSTs to, so a verified
guest can point it anywhere. That request is blind (nothing comes back to the
guest), https-only, carries only an encrypted payload, fires only for the
guest's own notifications, and sits behind the site password and guest
verification — a poor tool for anything. An allowlist of the known push
services would close even that, at the price of silently breaking the first
browser to use one nobody had listed, with no error anyone would see. Not
worth it at this exposure; revisit if the exposure changes.

## Consequences

### Positive

- No Apple Developer account, no App Store review, no relay to operate, and
  nothing for a self-hoster to configure.
- Subscriptions are scoped to an instance's own origin, so instances stay
  isolated from each other by construction.
- Android and desktop get the same feature for free.

### Negative

- **iOS requires the home-screen install.** Push does not work in a Safari tab,
  which is a real funnel loss and needs explaining in the UI and the attendee
  guide.
- **HTTPS is now load-bearing** for two attendee-facing features. An instance
  on plain HTTP silently offers neither.
- **Deleting the home screen icon ends the subscription** with no signal beyond
  the eventual `410` on the next send, which is the only moment the row can be
  cleaned up.
- **No silent pushes**: iOS revokes the subscription of a service worker that
  receives a push and shows nothing, so this can never double as a background
  sync channel.

[#317]: https://github.com/LWCW-Europe/schellingboard/issues/317
