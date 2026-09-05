import { describe, it, expect } from "vitest";

import { canCancel } from "@/utils/meeting-rules";

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
