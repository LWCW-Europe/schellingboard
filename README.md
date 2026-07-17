# SchellingBoard

test1
test2

A web app for managing event scheduling — attendees can propose sessions, vote on them, and view the final schedule. Built with Next.js and SQLite.

The name is a tongue-in-cheek reference to [**Schelling points**](<https://en.wikipedia.org/wiki/Focal_point_(game_theory)>) — focal points that people naturally converge on _without_ explicit coordination. SchellingBoard is the ironic opposite: a tool that enables explicit coordination. Attendees propose sessions and vote, creating a concrete consensus that wouldn't emerge on its own.

This is a public open-source fork of [rachelweinberg12/scheduling-app](https://github.com/rachelweinberg12/scheduling-app). Rachel Weinberg, the original author, does not wish to maintain a public open-source project herself but agreed to this fork serving that role. See [LICENSING_HISTORY.md](LICENSING_HISTORY.md) for details.

## Features

- **Session proposals** — attendees submit and browse session ideas
- **Voting** — attendees express interest (interested / maybe / skip) before the schedule is set
- **Scheduling board** — drag sessions onto a time/location grid
- **Event phases** — proposal, voting, and scheduling phases with configurable date ranges
- **Multi-event support** — host multiple events from one deployment
- **Kiosk mode** — append `?kiosk=1` to a schedule URL for large screens at the venue: a red line marks the current time, the schedule auto-scrolls to it and refreshes periodically, and the screen is kept awake. The schedule stays fully interactive. Combine with `loc` filters (e.g. `?kiosk=1&loc=Main+Hall`) to show only some rooms.
- **Site password protection** — optional single-password gate for the whole app

![Scheduling board](https://schellingboard.org/screenshots/schedule-grid.png)

More screenshots at [schellingboard.org](https://schellingboard.org).

## Hosting

See [docs/hosting](docs/hosting/README.md) for deployment and administration instructions.

## Attendees

See the [attendee guide](docs/attendee-guide.md) for how to propose, vote, and use the schedule — worth sharing with your event's attendees.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE.txt](LICENSE.txt) and [LICENSING_HISTORY.md](LICENSING_HISTORY.md).
