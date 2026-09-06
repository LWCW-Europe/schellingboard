import { describe, it, expect } from "vitest";
import {
  followUpDueTime,
  followUpEligible,
  headsUpDueTime,
  headsUpEligible,
} from "@/utils/reminder-schedule";

const at = (time: string) => new Date(`2026-09-01T${time}:00Z`);

// The reference session: stored start 10:00 with a 10-minute break, so the
// displayed start is 10:10, the heads-up is due at 09:10 and the follow-up at
// 11:15.
const BREAK_MINUTES = 10;
const startTime = at("10:00");
const endTime = at("11:00");

const headsUp = {
  now: at("09:10"),
  startTime,
  endTime,
  breakMinutes: BREAK_MINUTES,
  storedDueTime: null,
  alreadyNotifiedHost: false,
};

const followUp = {
  now: at("11:15"),
  endTime,
  hasRecordedCount: false,
  storedDueTime: null,
  storedClaimedAt: null,
};

describe("due times", () => {
  it("puts the heads-up an hour before the displayed start, break included", () => {
    expect(headsUpDueTime(startTime, BREAK_MINUTES)).toEqual(at("09:10"));
  });

  it("puts the heads-up an hour before the stored start when there is no break", () => {
    expect(headsUpDueTime(startTime, 0)).toEqual(at("09:00"));
  });

  it("puts the follow-up a quarter hour after the end", () => {
    expect(followUpDueTime(endTime)).toEqual(at("11:15"));
  });
});

describe("headsUpEligible", () => {
  it("is not due a minute early", () => {
    expect(headsUpEligible({ ...headsUp, now: at("09:09") })).toBe(false);
  });

  it("is due exactly an hour before the displayed start", () => {
    expect(headsUpEligible(headsUp)).toBe(true);
  });

  it("still goes out late while the session is under way", () => {
    expect(headsUpEligible({ ...headsUp, now: at("10:30") })).toBe(true);
  });

  it("is dropped once the session has ended", () => {
    expect(headsUpEligible({ ...headsUp, now: at("11:00") })).toBe(false);
    expect(headsUpEligible({ ...headsUp, now: at("11:01") })).toBe(false);
  });

  it("is not repeated for a due time the host was already notified of", () => {
    expect(
      headsUpEligible({
        ...headsUp,
        now: at("09:20"),
        storedDueTime: at("09:10"),
        alreadyNotifiedHost: true,
      })
    ).toBe(false);
  });

  it("is retried when the claim for this due time was re-armed", () => {
    expect(
      headsUpEligible({
        ...headsUp,
        now: at("09:20"),
        storedDueTime: at("09:10"),
        alreadyNotifiedHost: false,
      })
    ).toBe(true);
  });

  describe("a session moved three hours out", () => {
    // Displayed start 13:10, so the new heads-up is due at 12:10.
    const moved = {
      ...headsUp,
      startTime: at("13:00"),
      endTime: at("14:00"),
      storedDueTime: at("09:10"),
      alreadyNotifiedHost: true,
    };

    it("waits for the new due time", () => {
      expect(headsUpEligible({ ...moved, now: at("09:31") })).toBe(false);
    });

    it("sends a fresh heads-up an hour before the new start", () => {
      expect(headsUpEligible({ ...moved, now: at("12:10") })).toBe(true);
    });
  });

  describe("a session moved to start 45 minutes from now", () => {
    // Displayed start 10:30, so the new heads-up came due at 09:30 and is
    // already overdue.
    const moved = {
      ...headsUp,
      now: at("09:45"),
      startTime: at("10:20"),
      endTime: at("11:20"),
    };

    it("sends nothing to a host who was already reminded", () => {
      expect(
        headsUpEligible({
          ...moved,
          storedDueTime: at("09:10"),
          alreadyNotifiedHost: true,
        })
      ).toBe(false);
    });

    it("still sends the first heads-up to a host who was not", () => {
      expect(headsUpEligible(moved)).toBe(true);
    });

    // The defect the rename fixes. The host was notified at 09:10 and the
    // matching email then failed, which clears the delivery marker that gates
    // a retry but never `notified_at`. Asked whether they already received a
    // heads-up, the old input (fed from that cleared marker) answered "no" and
    // let a second one through 35 minutes later.
    it("sends nothing to a host whose heads-up mail failed before the move", () => {
      expect(
        headsUpEligible({
          ...moved,
          storedDueTime: at("09:10"),
          alreadyNotifiedHost: true,
        })
      ).toBe(false);
    });
  });

  describe("the reschedule guard boundary", () => {
    const reminded = {
      ...headsUp,
      now: at("09:45"),
      storedDueTime: at("09:10"),
      alreadyNotifiedHost: true,
    };

    it("suppresses a heads-up sent exactly 90 minutes before the new start", () => {
      // Displayed start 10:40, 90 minutes after the 09:10 heads-up.
      expect(
        headsUpEligible({
          ...reminded,
          startTime: at("10:30"),
          endTime: at("11:40"),
        })
      ).toBe(false);
    });

    it("sends again one minute past that", () => {
      // Displayed start 10:41.
      expect(
        headsUpEligible({
          ...reminded,
          startTime: at("10:31"),
          endTime: at("11:41"),
        })
      ).toBe(true);
    });
  });
});

describe("followUpEligible", () => {
  it("is not due a minute early", () => {
    expect(followUpEligible({ ...followUp, now: at("11:14") })).toBe(false);
  });

  it("is due a quarter hour after the end", () => {
    expect(followUpEligible(followUp)).toBe(true);
  });

  it("is never dropped for being late", () => {
    expect(
      followUpEligible({ ...followUp, now: new Date("2026-09-08T09:00:00Z") })
    ).toBe(true);
  });

  it("is suppressed by a count that is already recorded", () => {
    expect(followUpEligible({ ...followUp, hasRecordedCount: true })).toBe(
      false
    );
  });

  // Claimed, not sent: a reminder can settle with nothing to mail, so the
  // field that always means "this due time is spoken for" is the claim.
  it("is not repeated for a due time already claimed", () => {
    expect(
      followUpEligible({
        ...followUp,
        now: at("11:30"),
        storedDueTime: at("11:15"),
        storedClaimedAt: at("11:15"),
      })
    ).toBe(false);
  });

  it("is retried when the claim for this due time was re-armed", () => {
    expect(
      followUpEligible({
        ...followUp,
        now: at("11:30"),
        storedDueTime: at("11:15"),
        storedClaimedAt: null,
      })
    ).toBe(true);
  });

  describe("a session whose end time moved to 12:00", () => {
    const moved = {
      ...followUp,
      endTime: at("12:00"),
      storedDueTime: at("11:15"),
      storedClaimedAt: at("11:15"),
    };

    it("waits for the new due time", () => {
      expect(followUpEligible({ ...moved, now: at("11:30") })).toBe(false);
    });

    it("becomes owed again against the new end", () => {
      expect(followUpEligible({ ...moved, now: at("12:15") })).toBe(true);
    });
  });
});
