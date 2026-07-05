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
  -e AUTH_SECRET=$(openssl rand -hex 32) \
  schellingboard/schellingboard
```

Or with `docker compose` — copy `docker-compose.yml` from this repo and run:

```bash
SITE_PASSWORD=changeme AUTH_SECRET=$(openssl rand -hex 32) docker compose up -d
```

### Environment variables

| Variable        | Required | Description                                                      |
| --------------- | -------- | ---------------------------------------------------------------- |
| `SITE_PASSWORD` | No       | Password gate for the whole site (leave unset to disable)        |
| `AUTH_SECRET`   | Yes      | Secret key for session signing (use a random 32-byte hex string) |
| `DATABASE_URL`  | No       | SQLite path (default: `file:/data/data.db`)                      |
| `HOST_PORT`     | No       | Host port to bind (default: `3000`, compose only)                |

### Admin CLI

Events, guests, and locations are managed through an interactive CLI:

```bash
docker exec -it <container_name> scripts/admin.js
```

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
