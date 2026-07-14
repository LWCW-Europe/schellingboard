import { describe, it, expect, afterEach, vi } from "vitest";
import { EventPhase, getCurrentPhase } from "@/app/(site)/utils/events";
import type { Event } from "@/db/repositories/interfaces";

const DAY_MS = 24 * 60 * 60 * 1000;
const ago = (days: number) => new Date(Date.now() - days * DAY_MS);
const ahead = (days: number) => new Date(Date.now() + days * DAY_MS);

function makeEvent(overrides: Partial<Event>): Event {
  return {
    id: "e1",
    name: "Test",
    slug: "Test",
    description: "",
    website: "",
    start: ahead(30),
    end: ahead(31),
    maxSessionDuration: 120,
    breakMinutes: 10,
    slotIncrementMinutes: 30,
    timezone: "UTC",
    rsvpCapacityHardLimit: false,
    ...overrides,
  };
}

describe("getCurrentPhase with implicit phase ends", () => {
  it("ends an open-ended proposal phase when voting starts", () => {
    const event = makeEvent({
      proposalPhaseStart: ago(3),
      // no proposalPhaseEnd -> implicitly ends when voting starts
      votingPhaseStart: ago(1),
    });
    expect(getCurrentPhase(event)).toBe(EventPhase.VOTING);
  });

  it("ends an open-ended proposal phase at voting start even when scheduling is also configured", () => {
    // proposalPhaseEnd is unset, and BOTH votingPhaseStart and
    // schedulingPhaseStart are set. The implicit proposal end must be the
    // *earliest* successor (voting start), not scheduling start; otherwise an
    // open-ended proposal phase would mask the voting phase.
    const event = makeEvent({
      proposalPhaseStart: ago(3),
      // no proposalPhaseEnd
      votingPhaseStart: ago(1),
      schedulingPhaseStart: ahead(1),
    });
    expect(getCurrentPhase(event)).toBe(EventPhase.VOTING);
  });

  it("ends an open-ended voting phase when scheduling starts", () => {
    const event = makeEvent({
      proposalPhaseStart: ago(5),
      votingPhaseStart: ago(3),
      // no votingPhaseEnd -> implicitly ends when scheduling starts
      schedulingPhaseStart: ago(1),
    });
    expect(getCurrentPhase(event)).toBe(EventPhase.SCHEDULING);
  });

  it("falls through to scheduling when voting is unset", () => {
    const event = makeEvent({
      proposalPhaseStart: ago(3),
      // no proposalPhaseEnd, no voting -> implicit end is scheduling start
      schedulingPhaseStart: ago(1),
    });
    expect(getCurrentPhase(event)).toBe(EventPhase.SCHEDULING);
  });

  it("keeps an open-ended scheduling phase active (no successor)", () => {
    const event = makeEvent({
      proposalPhaseStart: ago(5),
      votingPhaseStart: ago(3),
      schedulingPhaseStart: ago(1),
      // no schedulingPhaseEnd -> stays active
    });
    expect(getCurrentPhase(event)).toBe(EventPhase.SCHEDULING);
  });

  it("respects an explicit gap between phases as INACTIVE", () => {
    const event = makeEvent({
      proposalPhaseStart: ago(5),
      proposalPhaseEnd: ago(3),
      votingPhaseStart: ahead(1),
    });
    expect(getCurrentPhase(event)).toBe(EventPhase.INACTIVE);
  });

  it("respects an explicit scheduling end as INACTIVE afterwards", () => {
    const event = makeEvent({
      proposalPhaseStart: ago(5),
      votingPhaseStart: ago(4),
      schedulingPhaseStart: ago(3),
      schedulingPhaseEnd: ago(1),
    });
    expect(getCurrentPhase(event)).toBe(EventPhase.INACTIVE);
  });

  describe("at the exact boundary instant between touching phases", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("selects the next phase, not the ending one", () => {
      const now = new Date("2026-06-26T12:00:00.000Z");
      vi.useFakeTimers();
      vi.setSystemTime(now);

      const event = makeEvent({
        proposalPhaseStart: ago(1),
        // open-ended -> implicit end equals votingPhaseStart, which is "now"
        votingPhaseStart: now,
      });

      expect(getCurrentPhase(event)).toBe(EventPhase.VOTING);
    });
  });
});
