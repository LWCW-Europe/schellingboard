---
title: "SchellingBoard"
description: "Documentation for attendees and organizers of events run on SchellingBoard."
type: concept
---

# SchellingBoard

SchellingBoard is a web app for running an unconference-style event: attendees
propose sessions, vote on the ones they want, and place them on a shared
schedule.

![Simple scheduling grid with rooms as columns and time slots as rows](../screenshots/schedule-grid.webp)

## For attendees

- [Attendee guide](attendee-guide.md) — pick your name, propose, vote, RSVP,
  and protect your name so nobody else can act as you.

:::note "Organizers"
The attendee guide is the page worth sharing with your attendees.
:::

## For organizers

- [How it works](organizers/how-it-works.md) — phases, who may change what,
  voting and scheduling rules, kiosk mode, multi-event installs, and which
  emails get sent.
- [Admin UI guide](organizers/admin-guide.md) — every setting in `/admin`:
  events, days, locations, guests, proposals, and sessions.

## Self-hosting

- [Deployment](self-hosting/deployment.md) — Docker or `docker compose`.
- [Configuration](self-hosting/configuration.md) — every environment variable,
  plus how to set up email.
- [Backup and restore](self-hosting/backup.md) — what to back up, without
  stopping the site.

SchellingBoard is open source (MIT). The code lives on
[GitHub](https://github.com/LWCW-Europe/schellingboard).
