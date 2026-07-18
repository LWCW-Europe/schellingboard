# Hosting SchellingBoard

Documentation for event hosts deploying and administering SchellingBoard.

- [How it works](how-it-works.md) — phases, voting, scheduling, kiosk mode, multi-event
- [Admin UI guide](admin-guide.md) — what's configurable and why
- [Attendee guide](../attendee-guide.md) — share this with your event's attendees

## Deployment

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
repo into the same directory, then:

```bash
cp .env.docker.example .env
# edit .env and fill in SITE_PASSWORD, ADMIN_PASSWORD, AUTH_SECRET, etc.
docker compose up -d
```

`docker compose` automatically reads a `.env` file in the same directory as
`docker-compose.yml`, so you don't need to pass variables on the command line.

### Environment variables

| Variable         | Required | Description                                                                                                              |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `SITE_PASSWORD`  | No       | Password gate for the whole site (leave unset to disable)                                                                |
| `ADMIN_PASSWORD` | No       | Password for the `/admin` UI (leave unset to disable)                                                                    |
| `AUTH_SECRET`    | Yes      | Signs all login cookies — site, admin, and attendee name protection. Random, min 32 chars. Changing it logs everyone out |
| `DATABASE_URL`   | No       | SQLite path (default: `file:/data/data.db`)                                                                              |
| `SB_UPLOADS_DIR` | No       | Dir for admin-uploaded files (default: `./uploads`, `/data/uploads` in Docker)                                           |
| `HOST_PORT`      | No       | Host port to bind (default: `3000`, compose only)                                                                        |
| `SMTP_FROM`      | No       | Sender address for outgoing email                                                                                        |
| `SMTP_URL`       | No       | SMTP connection URL (see below)                                                                                          |
| `SMTP_HOST`      | No       | SMTP server hostname (see below)                                                                                         |
| `SMTP_PORT`      | No       | SMTP server port                                                                                                         |
| `SMTP_USER`      | No       | SMTP username                                                                                                            |
| `SMTP_PASSWORD`  | No       | SMTP password                                                                                                            |
| `SMTP_SECURE`    | No       | `true`, `false`, or `requireTLS` (default)                                                                               |
| `SITE_URL`       | No\*     | Public base URL of the site, e.g. `https://sessions.example.org`                                                         |

Email is optional — leave the SMTP variables unset to disable it. To enable
email, set `SMTP_FROM` plus either `SMTP_URL` (a single connection string,
e.g. `smtp://user:pass@localhost:1025`, which already includes the host,
port, user, password, and security settings) **or** `SMTP_HOST` together
with `SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD`/`SMTP_SECURE` — not both.

\* `SITE_URL` is required when email is enabled, so that emails can link back
to the site.

Leaving email unconfigured also disables
[attendee name protection](how-it-works.md#attendee-identity), since it
relies on emailed login codes.

## Administration

Events, guests, locations, and content moderation are managed through the web
admin UI at `/admin`. Set `ADMIN_PASSWORD` (and `AUTH_SECRET`) to enable it.
See the [Admin UI guide](admin-guide.md) for what's configurable, and
[How it works](how-it-works.md) for the phase model and attendee-facing
behavior.
