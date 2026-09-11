import { describe, it, expect } from "vitest";

import { dayTextEntries } from "@/utils/day-text-entries";
import type { MeetingView } from "@/utils/meeting-views";

const DAY = {
  start: new Date("2026-10-01T09:00:00.000Z"),
  end: new Date("2026-10-01T18:00:00.000Z"),
};

const at = (hour: number) =>
  new Date(DAY.start.getTime() + (hour - 9) * 60 * 60 * 1000).toISOString();

const session = (id: string, hour: number) => ({
  id,
  startTime: new Date(at(hour)),
});

function meeting(
  id: string,
  hour: number,
  patch?: Partial<MeetingView>
): MeetingView {
  return {
    id,
    status: "accepted",
    role: "requester",
    otherId: "grace",
    otherName: "Grace",
    slotStart: at(hour),
    slotEnd: at(hour + 1),
    dayLabel: "Thu 1 Oct",
    timeLabel: "10:00 – 11:00",
    meetingPoint: "Coffee bar",
    message: "",
    cancelNote: "",
    clashes: [],
    ...patch,
  };
}

const keys = (
  sessions: ReturnType<typeof session>[],
  meetings: MeetingView[],
  { search = "", rsvpOnly = false } = {}
) =>
  dayTextEntries({ sessions, meetings, day: DAY, search, rsvpOnly }).map(
    (entry) => entry.key
  );

describe("dayTextEntries", () => {
  it("puts the viewer's 1-on-1s in among the sessions by time", () => {
    expect(
      keys([session("s10", 10), session("s12", 12)], [meeting("m11", 11)])
    ).toEqual(["s10", "m11", "s12"]);
  });

  // The order the grid stacks a slot in, so both views list it alike.
  it("orders 1-on-1s that share a start by name", () => {
    expect(
      keys(
        [],
        [
          meeting("a", 10, { otherName: "Samuel" }),
          meeting("b", 10, { otherName: "Leilani" }),
        ]
      )
    ).toEqual(["b", "a"]);
  });

  it("leaves out 1-on-1s that are over with or on another day", () => {
    expect(
      keys(
        [],
        [
          meeting("declined", 10, { status: "declined" }),
          meeting("expired", 11, { status: "expired" }),
          meeting("tomorrow", 33),
          meeting("pending", 12, { status: "pending" }),
        ]
      )
    ).toEqual(["pending"]);
  });

  // RSVP'd lists what the viewer is committed to; a request is not that yet.
  it("keeps only the confirmed 1-on-1s in RSVP'd", () => {
    expect(
      keys(
        [],
        [
          meeting("confirmed", 10),
          meeting("asked", 11, { status: "pending", role: "recipient" }),
          meeting("asking", 12, { status: "pending", role: "requester" }),
        ],
        { rsvpOnly: true }
      )
    ).toEqual(["confirmed"]);
  });

  it("finds a 1-on-1 by its title, meeting point or message", () => {
    const one = [
      meeting("m", 10, {
        otherName: "Leilani",
        meetingPoint: "Library",
        message: "About the slides",
      }),
    ];

    for (const search of ["1-on-1 with leilani", "library", "slides"]) {
      expect(keys([], one, { search })).toEqual(["m"]);
    }
    expect(keys([], one, { search: "Samuel" })).toEqual([]);
  });
});
