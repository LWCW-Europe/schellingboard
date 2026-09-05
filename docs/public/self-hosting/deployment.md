---
title: "Deployment"
description: "Self-host SchellingBoard with Docker or docker compose."
type: guide
---

# Deployment

The recommended way to self-host SchellingBoard is via Docker.

```bash
docker run -d \
  --name schellingboard \
  -p 3000:3000 \
  -v schellingboard_data:/data \
  -e SITE_PASSWORD=changeme \
  -e ADMIN_PASSWORD=changeme \
  -e AUTH_SECRET=$(openssl rand -hex 32) \
  schellingboard/schellingboard
```

Or with `docker compose` — copy `docker-compose.yml` and `.env.docker.example` from the
[repository](https://github.com/LWCW-Europe/schellingboard) into the same directory, then:

```bash
cp .env.docker.example .env
# edit .env and fill in SITE_PASSWORD, ADMIN_PASSWORD, AUTH_SECRET, etc.
docker compose up -d
```

`docker compose` automatically reads a `.env` file in the same directory as
`docker-compose.yml`, so you don't need to pass variables on the command line.

See [Configuration](configuration.md) for every environment variable, including
how to set up email, and [Backup and restore](backup.md) for keeping a copy of
your data.

## Serve it over HTTPS

Put the container behind a reverse proxy with a certificate. Two attendee-facing
features only work on an `https://` address, because browsers refuse them
anywhere else:

- **Adding the site to a phone's home screen**, and with it
- **notifications on a phone or laptop** while the site isn't open.

Everything else works over plain HTTP, so a laptop on the venue's wifi is fine
for a trial run — just not for an event people will install.

Nothing needs configuring for notifications beyond the certificate: the keys
they are signed with are generated the first time an attendee turns them on and
kept in the database, so a restored backup keeps working.

## Administration

Events, guests, locations, and content moderation are managed through the web
admin UI at `/admin`. Set `ADMIN_PASSWORD` (and `AUTH_SECRET`) to enable it.
See the [Admin UI guide](../organizers/admin-guide.md) for what's configurable,
and [How it works](../organizers/how-it-works.md) for the phase model and
attendee-facing behavior.
