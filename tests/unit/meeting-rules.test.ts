import { describe, it, expect } from "vitest";

import { canCancel, statusLine } from "@/utils/meeting-rules";

const NOW = new Date("2026-10-01T09:00:00.000Z");
const LATER = "2026-10-01T10:00:00.000Z";
const EARLIER = "2026-10-01T08:00:00.000Z";

describe("canCancel", () => {
  it("lets either party call off a confirmed meeting still to come", () => {
    for (const role of ["requester", "recipient"] as const) {
      expect(
        canCancel({ status: "accepted", role, slotStart: LATER }, NOW)
      ).toBe(true);
    }
  });

  // The person asked has Decline; "canceled" where they declined would
  // misdescribe what happened.
  it("lets only the requester take back a pending request", () => {
    expect(
      canCancel({ status: "pending", role: "requester", slotStart: LATER }, NOW)
    ).toBe(true);
    expect(
      canCancel({ status: "pending", role: "recipient", slotStart: LATER }, NOW)
    ).toBe(false);
  });

  // The server refuses a slot that has begun, and an accepted meeting stays on
  // the grid after its slot passes -- so without this every past 1-on-1 would
  // offer a button that can only fail.
  it("offers nothing once the slot has begun", () => {
    expect(
      canCancel(
        { status: "accepted", role: "requester", slotStart: EARLIER },
        NOW
      )
    ).toBe(false);
    expect(
      canCancel(
        { status: "accepted", role: "requester", slotStart: NOW.toISOString() },
        NOW
      )
    ).toBe(false);
  });

  it("offers nothing on a meeting that is already over with", () => {
    for (const status of ["declined", "canceled", "expired"] as const) {
      expect(
        canCancel({ status, role: "requester", slotStart: LATER }, NOW)
      ).toBe(false);
    }
  });
});

describe("statusLine", () => {
  const them = { otherName: "Yuki" };

  it("tells each side whose turn it is", () => {
    expect(statusLine({ ...them, status: "pending", role: "recipient" })).toBe(
      "Yuki is waiting for your answer."
    );
    expect(statusLine({ ...them, status: "pending", role: "requester" })).toBe(
      "Waiting for Yuki to answer."
    );
  });

  it("names who declined", () => {
    expect(statusLine({ ...them, status: "declined", role: "recipient" })).toBe(
      "You declined this."
    );
    expect(statusLine({ ...them, status: "declined", role: "requester" })).toBe(
      "Yuki declined this."
    );
  });

  // Nobody is at fault for an unanswered request (issue #392, section 1.4).
  it("blames nobody for a lapsed request", () => {
    expect(statusLine({ ...them, status: "expired", role: "recipient" })).toBe(
      "Nobody answered before the slot began."
    );
  });

  it("says the same to both sides once it is settled", () => {
    for (const role of ["requester", "recipient"] as const) {
      expect(statusLine({ ...them, status: "accepted", role })).toBe(
        "Confirmed — see you there."
      );
      expect(statusLine({ ...them, status: "canceled", role })).toBe(
        "This 1-on-1 was canceled."
      );
    }
  });
});
