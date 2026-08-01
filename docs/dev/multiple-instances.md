# Running Multiple Instances

Several clones or `jj` workspaces of this project on one machine compete for the
same ports. The recommended pattern is to give each clone explicit, distinct
ports in its two local env files, rather than leaning on defaults or automatic
port selection — then nothing depends on which instance you happened to start
first. Neither file is committed:

| File              | Read by                      | Sets                                                          |
| ----------------- | ---------------------------- | ------------------------------------------------------------- |
| `.env.dev.local`  | `make dev`, `make mailpit`   | dev server port, mailpit's host ports, email                  |
| `.env.test.local` | `make test`, `make test-e2e` | email (opt-in, see [Running tests](testing.md#running-tests)) |

Start mailpit with `make mailpit` rather than a bare `docker compose up mailpit`:
mailpit is defined in `docker-compose.dev.yml` (not in the `docker-compose.yml`
self-hosters copy), and on its own compose reads only a file literally named
`.env`, so the make target passes both `-f` and `--env-file .env.dev.local`. That
keeps each clone's ports in one place.

## Example: two clones side by side

Clone A in `~/src/sb-a` keeps the defaults:

```bash
# .env.dev.local
DATABASE_URL=file:./data.db
AUTH_SECRET=<openssl rand -base64 32>
PORT=3000
SITE_URL=http://localhost:3000
COMPOSE_PROJECT_NAME=sb-a
MAILPIT_SMTP_PORT=1025
MAILPIT_UI_PORT=8025
SMTP_FROM=dev@example.test
SMTP_URL=smtp://localhost:1025
```

```bash
# .env.test.local
SMTP_URL=smtp://localhost:1025
MAILPIT_API_URL=http://localhost:8025
SMTP_FROM='Test <mailer-test@test.example>'
```

Clone B in `~/src/sb-b` shifts every port by one:

```bash
# .env.dev.local
DATABASE_URL=file:./data.db
AUTH_SECRET=<openssl rand -base64 32>
PORT=3001
SITE_URL=http://localhost:3001
COMPOSE_PROJECT_NAME=sb-b
MAILPIT_SMTP_PORT=1026
MAILPIT_UI_PORT=8026
SMTP_FROM=dev@example.test
SMTP_URL=smtp://localhost:1026
```

```bash
# .env.test.local
SMTP_URL=smtp://localhost:1026
MAILPIT_API_URL=http://localhost:8026
SMTP_FROM='Test <mailer-test@test.example>'
```

Each clone can now run `make mailpit`, `make dev`, `make test`, and
`make test-e2e` at the same time as the other. Not every line is always needed:
`COMPOSE_PROJECT_NAME`, `MAILPIT_SMTP_PORT`, and `MAILPIT_UI_PORT` are consumed
by `docker compose` rather than the app, and the `SMTP_*`/`SITE_URL` lines only
matter if you want the dev server itself to send email — `PORT` alone is enough
otherwise.

## What each variable is for

Mailpit publishes two host ports, and the two app-side variables that point at
them are unrelated to each other — each tracks a different one:

| Compose variable    | Default | Mailpit port for            | App-side variable to match |
| ------------------- | ------- | --------------------------- | -------------------------- |
| `MAILPIT_SMTP_PORT` | `1025`  | receiving mail over SMTP    | `SMTP_URL`                 |
| `MAILPIT_UI_PORT`   | `8025`  | the web UI and its REST API | `MAILPIT_API_URL`          |

- `SMTP_URL` (`utils/mailer.ts`) is how schellingboard **sends** mail: an
  ordinary SMTP connection string, with mailpit merely one possible server
  behind it.
- `MAILPIT_API_URL` (`tests/helpers/mailpit.ts`) is how the **test suite** reads
  mail back out of mailpit to assert on it. It is test-only and
  mailpit-specific; the app itself never reads it.

`PORT` is read by `next dev`. Without it a second `make dev` won't fail — it
quietly retries the next free port (3001, 3002, …), which is easy to miss.
`SITE_URL` must then agree with `PORT`, since it's the base URL emails use to
link back to the site; a stale value sends readers to the _other_ instance.

`COMPOSE_PROJECT_NAME` only matters when two clones share a directory name —
compose derives the project from the directory, so `~/a/sb` and `~/b/sb` would
otherwise fight over a single mailpit container. Setting it is cheap insurance.
Note that mailpit lives in its own compose file, so a bare `docker compose down`
won't stop it; use the same two flags `make mailpit` passes —
`docker compose -f docker-compose.dev.yml --env-file .env.dev.local down` —
since without the env file compose looks for the container under the
directory-derived project name instead. (Or just Ctrl-C the foreground
`make mailpit`.)

Some things need no attention: `DATABASE_URL` and `SB_UPLOADS_DIR` are relative
paths, so each clone already gets its own database and uploads. E2E runs pick a
free port per run and override `SITE_URL` to match (`playwright.config.ts`), so
don't set `SITE_URL` in `.env.test.local` expecting it to apply — only `SMTP_URL`
and `MAILPIT_API_URL` matter there. `make test` binds no port at all.
