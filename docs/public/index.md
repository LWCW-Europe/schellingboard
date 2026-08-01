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

- [Attendee guide](attendee-guide.md) — pick your name, propose a session,
  vote, RSVP, and protect your name so nobody else can act as you.

Organizers: this is the page worth sharing with your attendees.

## For organizers

- [How it works](organizers/how-it-works.md) — the phase model, who may
  change what, voting and scheduling rules, kiosk mode, multi-event installs,
  and exactly which emails get sent.
- [Admin UI guide](organizers/admin-guide.md) — every setting in `/admin` and
  why it's there: events, days, locations, guests, proposals, and sessions.

## Self-hosting

- [Deployment](self-hosting/deployment.md) — running SchellingBoard with
  Docker or `docker compose`.
- [Configuration](self-hosting/configuration.md) — every environment
  variable, plus how to set up email.
- [Backup and restore](self-hosting/backup.md) — what to back up, how to do
  it without stopping the site, and how to restore.

SchellingBoard is open source (MIT). The code lives on
[GitHub](https://github.com/LWCW-Europe/schellingboard).
