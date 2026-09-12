import { describe, it, expect } from "vitest";

import { newEmptySession } from "@/app/(site)/session_utils";
import type { MeetingView } from "@/utils/meeting-views";
import { describeRsvpClash, findRsvpClash } from "@/utils/rsvp-clash";

const at = (hour: number, minute = 0) =>
  new Date(Date.UTC(2026, 9, 1, hour, minute));

const session = (id: string, start: Date, end: Date, title = id) => ({
  ...newEmptySession("ev"),
  id,
  title,
  startTime: start,
  endTime: end,
});

function meeting(
  id: string,
  start: Date,
  patch?: Partial<MeetingView>
): MeetingView {
  return {
    id,
    status: "accepted",
    role: "requester",
    otherId: "grace",
    otherName: "Grace",
    slotStart: start.toISOString(),
    slotEnd: new Date(start.getTime() + 30 * 60 * 1000).toISOString(),
    dayLabel: "Thu 1 Oct",
    timeLabel: "10:00 – 10:30",
    meetingPoint: "Coffee bar",
    message: "",
    cancelNote: "",
    clashes: [],
    ...patch,
  };
}

const candidate = session("s", at(10), at(11), "Design Systems");

describe("findRsvpClash", () => {
  it("names an accepted 1-on-1 in the session's slot", () => {
    const m = meeting("m", at(10, 30));
    expect(findRsvpClash(candidate, [], [m])).toEqual({
      kind: "meeting",
      meeting: m,
    });
  });

  it("ignores 1-on-1s that are not confirmed or do not overlap", () => {
    expect(
      findRsvpClash(
        candidate,
        [],
        [
          meeting("pending", at(10), { status: "pending" }),
          meeting("declined", at(10), { status: "declined" }),
          meeting("before", at(9, 30)),
          meeting("after", at(11)),
        ]
      )
    ).toBeNull();
  });

  it("reports a clashing session ahead of a 1-on-1", () => {
    const busy = session("b", at(10, 30), at(12));
    expect(findRsvpClash(candidate, [busy], [meeting("m", at(10))])).toEqual({
      kind: "session",
      session: busy,
    });
  });

  it("copes with the 1-on-1s not having loaded yet", () => {
    expect(findRsvpClash(candidate, [], null)).toBeNull();
  });
});

describe("describeRsvpClash", () => {
  it("says who the 1-on-1 is with", () => {
    expect(
      describeRsvpClash(
        { kind: "meeting", meeting: meeting("m", at(10)) },
        "me"
      )
    ).toBe("your 1-on-1 with Grace");
  });

  it("says whether the viewer hosts or attends the session", () => {
    const hosted = {
      ...session("h", at(10), at(11), "Hosted"),
      hosts: [{ id: "me", name: "Me" }],
    };
    expect(describeRsvpClash({ kind: "session", session: hosted }, "me")).toBe(
      '"Hosted", which you are hosting'
    );
    expect(
      describeRsvpClash({ kind: "session", session: candidate }, "me")
    ).toBe('"Design Systems", which you are attending');
  });
});
