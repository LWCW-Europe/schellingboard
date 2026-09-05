import { describe, it, expect } from "vitest";

import {
  meetingColumnRows,
  meetingsForDay,
  takesPartInMeetings,
} from "@/utils/meeting-column";
import type { MeetingView } from "@/utils/meeting-views";

const DAY = {
  start: new Date("2026-10-01T09:00:00.000Z"),
  end: new Date("2026-10-01T11:00:00.000Z"),
};
const SLOT = 30;

/** Four slots: 09:00, 09:30, 10:00, 10:30. */
const at = (minutesIn: number) =>
  new Date(DAY.start.getTime() + minutesIn * 60 * 1000).toISOString();

function meeting(minutesIn: number, patch?: Partial<MeetingView>): MeetingView {
  return {
    id: `m-${minutesIn}`,
    status: "accepted",
    role: "requester",
    otherName: "Grace",
    slotStart: at(minutesIn),
    slotEnd: at(minutesIn + SLOT),
    dayLabel: "Thu 1 Oct",
    timeLabel: "09:00 – 09:30",
    meetingPoint: "Coffee bar",
    message: "",
    clashes: [],
    ...patch,
  };
}

const rows = (
  meetings: MeetingView[],
  availability: string[]
): ReturnType<typeof meetingColumnRows> =>
  meetingColumnRows({ meetings, availability, day: DAY, slotIncrement: SLOT });

describe("meetingColumnRows", () => {
  it("places a meeting in the row its slot starts", () => {
    const booked = rows([meeting(30)], []).filter((r) => r.kind === "meetings");

    expect(booked).toHaveLength(1);
    expect(booked[0]).toMatchObject({ row: 2, span: 1 });
    expect(booked[0].meetings).toHaveLength(1);
  });

  // Nothing stops a guest having an agreed meeting and an unanswered request
  // in one slot, and two blocks in one grid cell would sit on top of each other.
  it("groups two meetings that share a slot into one row", () => {
    const both = rows([meeting(0), meeting(0, { id: "second" })], []).filter(
      (r) => r.kind === "meetings"
    );

    expect(both).toHaveLength(1);
    expect(both[0].meetings).toHaveLength(2);
  });

  // An event whose slot increment changed leaves older meetings longer than
  // one row.
  it("spans a meeting longer than one slot", () => {
    const [long] = rows([meeting(0, { slotEnd: at(60) })], []);

    expect(long).toMatchObject({ row: 1, span: 2, kind: "meetings" });
  });

  // A 09:30 meeting on a grid that has since gone hourly: drawn in the row
  // that contains it, never in a later one asserting a time it does not have.
  it("draws a meeting off the grid in the row it falls within", () => {
    const hourly = meetingColumnRows({
      meetings: [meeting(30), meeting(90, { slotEnd: at(150) })],
      availability: [],
      day: {
        start: DAY.start,
        end: new Date(DAY.start.getTime() + 3 * 3600e3),
      },
      slotIncrement: 60,
    });

    expect(hourly.filter((r) => r.kind === "meetings")).toEqual([
      expect.objectContaining({ row: 1, span: 1 }),
      // 10:30 – 11:30 reaches into the 11:00 row, so it covers both.
      expect.objectContaining({ row: 2, span: 2 }),
    ]);
  });

  it("leaves every free slot its own row, so each is bookable on its own", () => {
    const free = rows([], [at(0), at(30), at(60), at(90)]);

    expect(free.map((r) => r.kind)).toEqual(["free", "free", "free", "free"]);
    expect(free.map((r) => r.row)).toEqual([1, 2, 3, 4]);
  });

  // A slot the viewer cleared is one nobody may book *them* into -- they can
  // still arrange a 1-on-1 there themselves, so it stays a row of its own
  // rather than merging into an unbookable band.
  it("leaves each slot the viewer is not open for bookable on its own", () => {
    const declared = rows([], [at(0), at(90)]);

    expect(declared).toEqual([
      { row: 1, span: 1, kind: "free", meetings: [] },
      { row: 2, span: 1, kind: "unavailable", meetings: [] },
      { row: 3, span: 1, kind: "unavailable", meetings: [] },
      { row: 4, span: 1, kind: "free", meetings: [] },
    ]);
  });

  it("keeps a meeting in a slot the viewer has since cleared", () => {
    const mixed = rows([meeting(30)], [at(0)]);

    expect(mixed.map((r) => r.kind)).toEqual([
      "free",
      "meetings",
      "unavailable",
      "unavailable",
    ]);
  });

  // Being asked needs no availability of your own, so a guest can hold
  // meetings while having declared nothing. Their empty slots are still free
  // rather than unavailable: what they declared governs who may book *them*,
  // not whom they may ask.
  it("paints nothing unavailable for a viewer who declared nothing", () => {
    const none = rows([meeting(0)], []);

    expect(none.map((r) => r.kind)).toEqual([
      "meetings",
      "free",
      "free",
      "free",
    ]);
  });

  // A day nobody is bookable in and nothing is booked in has no column at all,
  // so it costs no width on a phone for everyone else.
  it("has no rows at all for a viewer with neither", () => {
    expect(rows([], [])).toEqual([]);
  });
});

describe("meetingsForDay", () => {
  const day = { start: DAY.start, end: DAY.end, sessions: [] };

  it("keeps a meeting starting at the day's first instant, not its last", () => {
    const firstAndLast = [meeting(0), meeting(120)];

    expect(meetingsForDay(firstAndLast, day).map((m) => m.id)).toEqual(["m-0"]);
  });

  it("keeps what is agreed or still open, and drops the rest", () => {
    const every = (
      ["pending", "accepted", "declined", "canceled", "expired"] as const
    ).map((status) => meeting(0, { id: status, status }));

    expect(meetingsForDay(every, day).map((m) => m.id)).toEqual([
      "pending",
      "accepted",
    ]);
  });
});

// Whether the viewer gets the column at all -- and then on every day, so the
// rooms line up from one day to the next.
describe("takesPartInMeetings", () => {
  it("is true for anyone bookable, or with a live meeting anywhere", () => {
    expect(takesPartInMeetings([], [at(0)])).toBe(true);
    expect(takesPartInMeetings([meeting(0, { status: "pending" })], [])).toBe(
      true
    );
  });

  it("is false with nothing declared and nothing live", () => {
    expect(takesPartInMeetings([], [])).toBe(false);
    expect(takesPartInMeetings([meeting(0, { status: "declined" })], [])).toBe(
      false
    );
  });
});
