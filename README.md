# SchellingBoard

A web app for managing event scheduling — attendees can propose sessions, vote on them, and view the final schedule. Built with Next.js and SQLite.

The name is a tongue-in-cheek reference to [**Schelling points**](<https://en.wikipedia.org/wiki/Focal_point_(game_theory)>) — focal points that people naturally converge on _without_ explicit coordination. SchellingBoard is the ironic opposite: a tool that enables explicit coordination. Attendees propose sessions and vote, creating a concrete consensus that wouldn't emerge on its own.

This is a public open-source fork of [rachelweinberg12/scheduling-app](https://github.com/rachelweinberg12/scheduling-app). Rachel Weinberg, the original author, does not wish to maintain a public open-source project herself but agreed to this fork serving that role. See [LICENSING_HISTORY.md](LICENSING_HISTORY.md) for details.

## Features

- **Session proposals** — attendees submit and browse session ideas
- **Voting** — attendees express interest (interested / maybe / skip) before the schedule is set
- **Scheduling board** — drag sessions onto a time/location grid
- **Event phases** — proposal, voting, and scheduling phases with configurable date ranges
- **Multi-event support** — host multiple events from one deployment
- **Site password protection** — optional single-password gate for the whole app

![Scheduling board](docs/screenshot-schedule.png)

More screenshots at [schellingboard.org](https://schellingboard.org).

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

Or with `docker compose` — copy `docker-compose.yml` and `.env.docker.example` from this
repo into the same directory, then:

```bash
cp .env.docker.example .env
# edit .env and fill in SITE_PASSWORD, ADMIN_PASSWORD, AUTH_SECRET, etc.
docker compose up -d
```

`docker compose` automatically reads a `.env` file in the same directory as
`docker-compose.yml`, so you don't need to pass variables on the command line.

### Environment variables

| Variable         | Required | Description                                                      |
| ---------------- | -------- | ---------------------------------------------------------------- |
| `SITE_PASSWORD`  | No       | Password gate for the whole site (leave unset to disable)        |
| `ADMIN_PASSWORD` | No       | Password for the `/admin` UI (leave unset to disable admin UI)   |
| `AUTH_SECRET`    | Yes      | Secret key for session signing (use a random 32-byte hex string) |
| `DATABASE_URL`   | No       | SQLite path (default: `file:/data/data.db`)                      |
| `HOST_PORT`      | No       | Host port to bind (default: `3000`, compose only)                |

### Admin UI

Events, guests, locations, and content moderation are managed through the web
admin UI at `/admin`. Set `ADMIN_PASSWORD` (and `AUTH_SECRET`) to enable it.

## Event Phases

Events can progress through three optional phases:

| Phase          | What it enables                                                        |
| -------------- | ---------------------------------------------------------------------- |
| **Proposal**   | Attendees submit and browse session proposals                          |
| **Voting**     | Attendees vote on proposals (votes hidden from hosts until scheduling) |
| **Scheduling** | Hosts see vote counts and can place sessions on the schedule grid      |

Phase dates are set directly on the Event record in the database. If no dates are set, the app skips phases and goes straight to scheduling.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE.txt](LICENSE.txt) and [LICENSING_HISTORY.md](LICENSING_HISTORY.md).
