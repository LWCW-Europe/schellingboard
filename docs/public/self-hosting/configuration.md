---
title: "Configuration"
description: "Every environment variable SchellingBoard reads, and how to enable email."
type: reference
---

# Configuration

SchellingBoard is configured entirely through environment variables. Only
`AUTH_SECRET` is required; everything else has a sensible default or switches
a feature off when unset.

## Environment variables

| Variable                 | Required | Description                                                                                                              |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `SITE_PASSWORD`          | No       | Password gate for the whole site (leave unset to disable)                                                                |
| `ADMIN_PASSWORD`         | No       | Password for the `/admin` UI (leave unset to disable)                                                                    |
| `AUTH_SECRET`            | Yes      | Signs all login cookies — site, admin, and attendee name protection. Random, min 32 chars. Changing it logs everyone out |
| `DATABASE_URL`           | No       | SQLite path (default: `file:/data/data.db`)                                                                              |
| `SB_UPLOADS_DIR`         | No       | Dir for admin-uploaded files (default: `./uploads`, `/data/uploads` in Docker)                                           |
| `HOST_PORT`              | No       | Host port to bind (default: `3000`, compose only)                                                                        |
| `SCHELLINGBOARD_VERSION` | No       | Image tag to run, e.g. a release tag (default: `latest`, compose only)                                                   |
| `SMTP_FROM`              | No       | Sender address for outgoing email                                                                                        |
| `SMTP_URL`               | No       | SMTP connection URL (see below)                                                                                          |
| `SMTP_HOST`              | No       | SMTP server hostname (see below)                                                                                         |
| `SMTP_PORT`              | No       | SMTP server port                                                                                                         |
| `SMTP_USER`              | No       | SMTP username                                                                                                            |
| `SMTP_PASSWORD`          | No       | SMTP password                                                                                                            |
| `SMTP_SECURE`            | No       | `true`, `false`, or `requireTLS` (default)                                                                               |
| `SITE_URL`               | No\*     | Public base URL of the site, e.g. `https://sessions.example.org`                                                         |
| `SB_ENABLE_DEV_TOOLS`    | No       | Set to `1` to enable the dev fake clock on a staging/demo instance. Leave unset in production                            |

## Email

Email is optional — leave the SMTP variables unset to disable it. To enable
email, set `SMTP_FROM` plus either `SMTP_URL` (a single connection string,
e.g. `smtp://user:pass@localhost:1025`, which already includes the host,
port, user, password, and security settings) **or** `SMTP_HOST` together
with `SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD`/`SMTP_SECURE` — not both.

\* `SITE_URL` is required when email is enabled, so that emails can link back
to the site.

Leaving email unconfigured also disables
[attendee name protection](../organizers/how-it-works.md#attendee-identity),
since it relies on emailed login codes. For which messages SchellingBoard
sends and when, see
[How it works § Email](../organizers/how-it-works.md#email).
