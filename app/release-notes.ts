// What the footer's version button shows: a few plain sentences per recent
// release, for an organizer who wants to know what changed without leaving the
// app. Written by hand rather than derived from CHANGELOG.md, which is
// exhaustive and far too long to read in a modal.
//
// Newest first, and one entry per release: the dates are what tells a reader
// how old the deployment in front of them is, so a release left out makes the
// newest one look older than it is. tests/unit/release-notes.test.ts fails
// until the newest release named in CHANGELOG.md has an entry here.
//
// The first entry may be the release being prepared — "Unreleased", with no
// date, written as the changes land. A deployment built from `main` is running
// exactly those changes, so it is shown like any other entry; cutting the
// release turns it into one by giving it its version and date.

export type ReleaseNote = {
  /**
   * Without the `v`, as CHANGELOG.md's heading writes it — or "Unreleased"
   * while the release it belongs to is still being prepared.
   */
  version: string;
  /**
   * The release date, `YYYY-MM-DD`, as CHANGELOG.md's heading writes it. Unset
   * on the unreleased entry, and the one thing that marks it as unreleased.
   */
  date?: string;
  /**
   * Inline markdown, rendered as such — as in CHANGELOG.md, a **bold** phrase
   * naming what changed, so a reader finds the entry that concerns them
   * without reading every line. Block markdown (lists, headings) is dropped:
   * one highlight is one bullet.
   */
  highlights: string[];
};

/** How many of the entries below the modal shows. */
export const SHOWN_RELEASES = 3;

export const releaseNotes: ReleaseNote[] = [
  {
    version: "Unreleased",
    highlights: [
      "**Notifications in the app**: a bell in the header counts what is waiting, and clicking one takes you to it. Everything that emails you appears here too, even where email is not set up.",
      "**Meetings**: an event's Config tab can switch on 1-on-1s between attendees — the places you suggest people meet, and a cap on how many unanswered requests one person may have out.",
      "**Picking your name** works however many events a site runs: past about seven, the header's event links crowded the name chip off the row and there was no way to say who you are.",
      "**Say when you're free**: with meetings on, attendees get a 1-on-1s page to mark which slots they're open for. Turning the switch off clears it and keeps them unbookable.",
      "**Ask for a 1-on-1**: attendees book one of the slots someone is open for from their profile, and say where to meet. The person asked accepts or declines, warned about anything it clashes with.",
      '**A red line marks the current time on the schedule** while the event is running, with a "Now" button to jump to it — previously only kiosk displays showed it.',
    ],
  },
  {
    version: "3.5.0",
    date: "2026-08-30",
    highlights: [
      "**Comments on sessions and on attendee profiles**, with threaded replies, likes and editing — the section proposals already had.",
      "**A session booked into the hours after midnight** lands on the right date, instead of disappearing from the schedule.",
      "**What a room offers is easier to find**, just click/tap on the room name.",
      "**Clicking the version** at the bottom of any page says what the last few releases changed.",
    ],
  },
  {
    version: "3.4.2",
    date: "2026-08-24",
    highlights: [
      "**Sessions can only be booked in the event's own rooms**, so one can no longer end up in another event's room and vanish from the schedule.",
      "**The session form says why a save was refused**, instead of only that it failed.",
    ],
  },
  {
    version: "3.4.1",
    date: "2026-08-21",
    highlights: [
      "**Long attendee profiles scroll again**, instead of being cut off at the bottom.",
    ],
  },
  {
    version: "3.4.0",
    date: "2026-08-21",
    highlights: [
      "**Dark mode**, chosen with the System / Light / Dark switch at the bottom of every page.",
      "**Attendee profiles open over the directory**, with Prev and Next — or arrow keys and swiping — to read through them.",
      "**The directory can be sorted** by who updated their profile last, and narrowed to attendees who have filled something in.",
      "**Hosts see how the vote went** on their own proposal, ending with a rough range for how many people to expect.",
    ],
  },
];
