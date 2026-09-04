import { describe, it, expect } from "vitest";
import { validateSession } from "@/app/api/session-form-utils";
import type { Session, SessionCreateInput } from "@/db/repositories/interfaces";

const LOC_A = "loc-a";
const LOC_B = "loc-b";

// Deliberately behind real time: a session an hour after NOW is in the wall
// clock's past, so every "accepts" case below fails if the validator ever goes
// back to reading Date.now() instead of the clock it is handed.
const NOW = new Date("2026-06-01T10:00:00.000Z");

// minutes from NOW, the clock the validator is handed
const fromNow = (minutes: number) => new Date(NOW.getTime() + minutes * 60_000);

function makeInput(
  overrides?: Partial<SessionCreateInput>
): SessionCreateInput {
  return {
    title: "Test Session",
    description: "",
    capacity: 30,
    adminManaged: false,
    blocker: false,
    closed: false,
    hostIds: ["host-1"],
    locationIds: [LOC_A],
    startTime: fromNow(60),
    endTime: fromNow(120),
    eventId: "111",
    ...overrides,
  };
}

function makeExisting(
  start: Date,
  end: Date,
  locationId: string = LOC_A
): Session {
  return {
    id: "existing-1",
    title: "Existing",
    description: "",
    capacity: 30,
    adminManaged: false,
    blocker: false,
    closed: false,
    hosts: [],
    locations: [{ id: locationId, name: "Room", color: "#000" }],
    numRsvps: 0,
    startTime: start,
    endTime: end,
    eventId: "111",
  };
}

describe("validateSession", () => {
  it("accepts a valid session with no existing sessions", () => {
    expect(validateSession(makeInput(), [], NOW)).toBeTruthy();
  });

  it("rejects when start >= end", () => {
    const input = makeInput({
      startTime: fromNow(120),
      endTime: fromNow(60),
    });
    expect(validateSession(input, [], NOW)).toBeFalsy();
  });

  it("rejects when start equals end", () => {
    const t = fromNow(60);
    expect(
      validateSession(makeInput({ startTime: t, endTime: t }), [], NOW)
    ).toBeFalsy();
  });

  it("rejects when start is in the past", () => {
    const input = makeInput({
      startTime: fromNow(-60),
      endTime: fromNow(60),
    });
    expect(validateSession(input, [], NOW)).toBeFalsy();
  });

  // The other direction, which the NOW-based cases can't show: a start still in
  // the wall clock's future, rejected because the caller's clock has travelled
  // past it. A time-travelled organizer can't book into their own past.
  it("rejects a start that is past only for the clock it was given", () => {
    const realFuture = new Date(Date.now() + 60 * 60_000);
    const input = makeInput({
      startTime: realFuture,
      endTime: new Date(realFuture.getTime() + 60 * 60_000),
    });
    const travelledPastIt = new Date(realFuture.getTime() + 30 * 60_000);
    expect(validateSession(input, [], travelledPastIt)).toBeFalsy();
  });

  it("rejects when title is missing", () => {
    expect(validateSession(makeInput({ title: "" }), [], NOW)).toBeFalsy();
  });

  it("rejects when hostIds is empty", () => {
    expect(validateSession(makeInput({ hostIds: [] }), [], NOW)).toBeFalsy();
  });

  it("rejects when locationIds is empty", () => {
    expect(
      validateSession(makeInput({ locationIds: [] }), [], NOW)
    ).toBeFalsy();
  });

  it("rejects partial overlap in same location (start-overlap)", () => {
    const existing = makeExisting(fromNow(30), fromNow(90));
    const input = makeInput({ startTime: fromNow(60), endTime: fromNow(120) });
    expect(validateSession(input, [existing], NOW)).toBeFalsy();
  });

  it("rejects partial overlap in same location (end-overlap)", () => {
    const existing = makeExisting(fromNow(90), fromNow(150));
    const input = makeInput({ startTime: fromNow(60), endTime: fromNow(120) });
    expect(validateSession(input, [existing], NOW)).toBeFalsy();
  });

  it("rejects when existing session is fully contained within new session", () => {
    const existing = makeExisting(fromNow(70), fromNow(110));
    const input = makeInput({ startTime: fromNow(60), endTime: fromNow(120) });
    expect(validateSession(input, [existing], NOW)).toBeFalsy();
  });

  it("accepts back-to-back sessions in same location", () => {
    const existing = makeExisting(fromNow(0), fromNow(60));
    const input = makeInput({ startTime: fromNow(60), endTime: fromNow(120) });
    expect(validateSession(input, [existing], NOW)).toBeTruthy();
  });

  it("accepts overlapping sessions in different locations", () => {
    const existing = makeExisting(fromNow(60), fromNow(120), LOC_B);
    const input = makeInput({
      startTime: fromNow(60),
      endTime: fromNow(120),
      locationIds: [LOC_A],
    });
    expect(validateSession(input, [existing], NOW)).toBeTruthy();
  });

  it("rejects identical interval in same location", () => {
    const existing = makeExisting(fromNow(60), fromNow(120));
    const input = makeInput({ startTime: fromNow(60), endTime: fromNow(120) });
    expect(validateSession(input, [existing], NOW)).toBeFalsy();
  });

  it("rejects same-start longer-end in same location", () => {
    const existing = makeExisting(fromNow(60), fromNow(180));
    const input = makeInput({ startTime: fromNow(60), endTime: fromNow(120) });
    expect(validateSession(input, [existing], NOW)).toBeFalsy();
  });

  it("rejects same-end earlier-start in same location", () => {
    const existing = makeExisting(fromNow(30), fromNow(120));
    const input = makeInput({ startTime: fromNow(60), endTime: fromNow(120) });
    expect(validateSession(input, [existing], NOW)).toBeFalsy();
  });
});
