import { describe, it, expect } from "vitest";
import {
  agendaGroups,
  nowMarkerIndex,
  shownStart,
  timeState,
  type AgendaGroup,
} from "@/utils/agenda";
import type { Location, Session } from "@/db/repositories/interfaces";
import type { MeetingView } from "@/utils/meeting-views";
import { newEmptySession } from "@/app/(site)/session_utils";

const at = (hour: number, minute = 0) =>
  new Date(Date.UTC(2026, 9, 1, hour, minute));

const session = (start: Date, end: Date, roomId = "a"): Session => ({
  ...newEmptySession("e"),
  id: `${start.toISOString()}-${roomId}`,
  title: "A session",
  locations: [{ id: roomId, name: roomId, color: "blue" }],
  startTime: start,
  endTime: end,
});

const room = (id: string, sortIndex: number): Location => ({
  id,
  name: id,
  capacity: 10,
  bookable: true,
  sortIndex,
  color: "blue",
  imageUrl: "",
  description: "",
  hidden: false,
});
const rooms = [room("a", 1), room("b", 2)];

const blocker = (roomId: string, end: Date, start = at(12, 30)): Session => ({
  ...session(start, end, roomId),
  title: "Lunch",
  blocker: true,
});

const meeting = (start: Date, otherName: string): MeetingView => ({
  id: otherName,
  status: "accepted",
  role: "requester",
  otherName,
  slotStart: start.toISOString(),
  slotEnd: new Date(start.getTime() + 30 * 60 * 1000).toISOString(),
  dayLabel: "",
  timeLabel: "",
  meetingPoint: "Coffee bar",
  message: "",
  cancelNote: "",
  clashes: [],
});

const group = (input: {
  sessions?: Session[];
  meetings?: MeetingView[];
  breakMinutes?: number;
}) =>
  agendaGroups({
    sessions: input.sessions ?? [],
    meetings: input.meetings ?? [],
    locations: rooms,
    breakMinutes: input.breakMinutes ?? 10,
  });

describe("shownStart", () => {
  it("is the slot start plus the break, except for a blocker", () => {
    expect(shownStart(session(at(9), at(10)), 10)).toEqual(at(9, 10));
    expect(shownStart(blocker("a", at(14)), 10)).toEqual(at(12, 30));
  });
});

describe("agendaGroups", () => {
  it("heads sessions by their shown start, in room order", () => {
    const groups = group({
      sessions: [session(at(9), at(10), "b"), session(at(9), at(10), "a")],
    });
    expect(groups.map((g) => g.start)).toEqual([at(9, 10)]);
    expect(groups[0].sessions.map((s) => s.locations[0].id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("keeps a blocker on its slot when a session shares the slot", () => {
    const groups = group({
      sessions: [session(at(9), at(10), "a"), blocker("b", at(9, 30), at(9))],
    });
    expect(groups.map((g) => [g.start, g.sessions.length])).toEqual([
      [at(9), 1],
      [at(9, 10), 1],
    ]);
    expect(groups[0].sessions[0].blocker).toBe(true);
  });

  it("keeps sessions whose shown start meets a blocker's slot", () => {
    const groups = group({
      sessions: [session(at(9), at(10), "a"), blocker("b", at(10), at(9, 30))],
      breakMinutes: 30,
    });
    expect(groups.map((g) => g.start)).toEqual([at(9, 30)]);
    expect(groups[0].sessions.map((s) => s.blocker).sort()).toEqual([
      false,
      true,
    ]);
  });

  it("merges same-titled blockers that start and end together", () => {
    const groups = group({
      sessions: [blocker("a", at(14)), blocker("b", at(14))],
    });
    expect(groups.map((g) => g.start)).toEqual([at(12, 30)]);
    expect(groups[0].sessions).toHaveLength(1);
    expect(groups[0].sessions[0].locations.map((l) => l.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("names a room once when merged blockers share it", () => {
    const groups = group({
      sessions: [
        { ...blocker("a", at(14)), locations: [...rooms] },
        blocker("b", at(14)),
      ],
    });
    expect(groups[0].sessions[0].locations.map((l) => l.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("keeps same-titled blockers apart when they end at different times", () => {
    const groups = group({
      sessions: [blocker("a", at(14)), blocker("b", at(13))],
    });
    expect(groups[0].sessions).toHaveLength(2);
  });

  it("gives a 1-on-1 its own time between the session groups", () => {
    const groups = group({
      sessions: [session(at(9), at(10)), session(at(11), at(12))],
      meetings: [meeting(at(10), "Leilani")],
    });
    expect(groups.map((g) => g.start)).toEqual([at(9, 10), at(10), at(11, 10)]);
    expect(groups[1].sessions).toEqual([]);
    expect(groups[1].meetings.map((m) => m.otherName)).toEqual(["Leilani"]);
  });

  it("lists 1-on-1s at an existing time under that heading", () => {
    const groups = group({
      sessions: [session(at(9), at(10))],
      meetings: [meeting(at(9, 10), "Sam"), meeting(at(9, 10), "Ana")],
    });
    expect(groups).toHaveLength(1);
    expect(groups[0].meetings.map((m) => m.otherName)).toEqual(["Sam", "Ana"]);
  });
});

describe("timeState", () => {
  it("is running from the start until the end", () => {
    expect(timeState(at(9, 10), at(10), at(9, 5))).toBe("upcoming");
    expect(timeState(at(9, 10), at(10), at(9, 10))).toBe("running");
    expect(timeState(at(9, 10), at(10), at(9, 59))).toBe("running");
    expect(timeState(at(9, 10), at(10), at(10))).toBe("ended");
  });
});

const groups: AgendaGroup[] = [
  { start: at(9), sessions: [session(at(9), at(10, 30))], meetings: [] },
  { start: at(11), sessions: [session(at(11), at(12))], meetings: [] },
  { start: at(14), sessions: [session(at(14), at(15))], meetings: [] },
];

describe("nowMarkerIndex", () => {
  it("heads the list before the day's first session", () => {
    expect(nowMarkerIndex(groups, at(8))).toBe(0);
  });

  it("sits after every group that has started, in time order", () => {
    expect(nowMarkerIndex(groups, at(9))).toBe(1);
    expect(nowMarkerIndex(groups, at(9, 40))).toBe(1);
    expect(nowMarkerIndex(groups, at(12, 40))).toBe(2);
  });

  it("ends the list once the last group has started", () => {
    expect(nowMarkerIndex(groups, at(16))).toBe(3);
  });

  it("is 0 for a day with no sessions", () => {
    expect(nowMarkerIndex([], at(12))).toBe(0);
  });
});
