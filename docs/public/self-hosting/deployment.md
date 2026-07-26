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
how to set up email.

## Administration

Events, guests, locations, and content moderation are managed through the web
admin UI at `/admin`. Set `ADMIN_PASSWORD` (and `AUTH_SECRET`) to enable it.
See the [Admin UI guide](../organizers/admin-guide.md) for what's configurable,
and [How it works](../organizers/how-it-works.md) for the phase model and
attendee-facing behavior.
