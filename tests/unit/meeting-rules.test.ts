import { describe, it, expect } from "vitest";

import {
  blockStatus,
  blockTimeLabel,
  canCancel,
  slotSummaryLine,
  statusLine,
} from "@/utils/meeting-rules";

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

// The one line a collapsed slot has room for, under "4 1-on-1s".
describe("slotSummaryLine", () => {
  const pending = (role: "requester" | "recipient") =>
    ({ status: "pending", role }) as const;

  it("leads with what is waiting on the viewer", () => {
    expect(
      slotSummaryLine([
        { status: "accepted", role: "requester" },
        pending("requester"),
        pending("recipient"),
      ])
    ).toBe("1 needs your reply");
    expect(slotSummaryLine([pending("recipient"), pending("recipient")])).toBe(
      "2 need your reply"
    );
  });

  it("counts what the viewer is waiting on when nothing is theirs to answer", () => {
    expect(slotSummaryLine([pending("requester")])).toBe("1 waiting for reply");
    expect(slotSummaryLine([pending("requester"), pending("requester")])).toBe(
      "2 waiting for reply"
    );
  });

  it("says so when there is nothing left to answer", () => {
    expect(
      slotSummaryLine([
        { status: "accepted", role: "requester" },
        { status: "accepted", role: "recipient" },
      ])
    ).toBe("all confirmed");
  });
});

// What a block of several is named by, when the block is all the reader sees.
describe("blockTimeLabel", () => {
  const BERLIN = "Europe/Berlin";
  const slot = (start: string, end: string) => ({
    slotStart: `2026-10-01T${start}:00.000Z`,
    slotEnd: `2026-10-01T${end}:00.000Z`,
  });

  it("reads as the meeting's own time when it is alone", () => {
    expect(blockTimeLabel([slot("08:00", "08:30")], BERLIN)).toBe(
      "10:00 – 10:30"
    );
  });

  // Overlapping meetings of unequal length share one block, so naming it after
  // the first of them puts a time on the block the rest do not have.
  it("covers the earliest start and the latest end", () => {
    const uneven = [slot("08:00", "09:00"), slot("08:30", "09:30")];

    expect(blockTimeLabel(uneven, BERLIN)).toBe("10:00 – 11:30");
    expect(blockTimeLabel([...uneven].reverse(), BERLIN)).toBe("10:00 – 11:30");
  });
});

describe("blockStatus", () => {
  it("tells each side whose turn it is", () => {
    expect(blockStatus({ status: "pending", role: "recipient" })).toBe(
      "needs your reply"
    );
    expect(blockStatus({ status: "pending", role: "requester" })).toBe(
      "waiting for reply"
    );
  });

  it("names what became of it, the same to both sides", () => {
    for (const role of ["requester", "recipient"] as const) {
      expect(blockStatus({ status: "accepted", role })).toBe("confirmed");
      expect(blockStatus({ status: "declined", role })).toBe("declined");
      expect(blockStatus({ status: "canceled", role })).toBe("canceled");
      expect(blockStatus({ status: "expired", role })).toBe("unanswered");
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
