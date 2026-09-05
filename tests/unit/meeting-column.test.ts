import { describe, it, expect } from "vitest";

import { meetingColumnRows } from "@/utils/meeting-column";
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

  it("leaves every free slot its own row, so each is bookable on its own", () => {
    const free = rows([], [at(0), at(30), at(60), at(90)]);

    expect(free.map((r) => r.kind)).toEqual(["free", "free", "free", "free"]);
    expect(free.map((r) => r.row)).toEqual([1, 2, 3, 4]);
  });

  // The slots the viewer cleared say why there is nothing to book there, and
  // one band reads better than four identical cells.
  it("merges the slots the viewer is not open for into one band", () => {
    const declared = rows([], [at(0), at(90)]);

    expect(declared).toEqual([
      { row: 1, span: 1, kind: "free", meetings: [] },
      { row: 2, span: 2, kind: "unavailable", meetings: [] },
      { row: 4, span: 1, kind: "free", meetings: [] },
    ]);
  });

  it("keeps a meeting in a slot the viewer has since cleared", () => {
    const mixed = rows([meeting(30)], [at(0)]);

    expect(mixed.map((r) => r.kind)).toEqual([
      "free",
      "meetings",
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
