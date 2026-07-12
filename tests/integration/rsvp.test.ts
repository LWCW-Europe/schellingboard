import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createSession } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import type { Rsvp } from "@/db/repositories/interfaces";
import { POST as toggleRsvp } from "@/app/api/toggle-rsvp/route";
import { GET as getRsvps } from "@/app/api/rsvps/route";

function makeToggleReq(payload: unknown): Request {
  return new Request("http://test/api/toggle-rsvp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Read surface: GET /api/rsvps?user=<guestId>
async function rsvpsForGuest(guestId: string): Promise<Rsvp[]> {
  const res = await getRsvps(
    new NextRequest(`http://test/api/rsvps?user=${guestId}`)
  );
  expect(res.ok).toBe(true);
  return (await res.json()) as Rsvp[];
}

describe("POST /api/toggle-rsvp", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("adds an RSVP when absent and removes it when remove is set", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest();
    const session = await createSession(event.id);
    await getRepositories().guests.assignToEvent(event.id, [guest.id]);

    const addRes = await toggleRsvp(
      makeToggleReq({ sessionId: session.id, guestId: guest.id })
    );
    expect(addRes.ok).toBe(true);

    const afterAdd = await rsvpsForGuest(guest.id);
    expect(afterAdd).toHaveLength(1);
    expect(afterAdd[0]).toMatchObject({
      sessionId: session.id,
      guestId: guest.id,
    });

    const removeRes = await toggleRsvp(
      makeToggleReq({ sessionId: session.id, guestId: guest.id, remove: true })
    );
    expect(removeRes.ok).toBe(true);

    expect(await rsvpsForGuest(guest.id)).toHaveLength(0);
  });

  it("removing an absent RSVP is a no-op", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest();
    const session = await createSession(event.id);
    await getRepositories().guests.assignToEvent(event.id, [guest.id]);

    const res = await toggleRsvp(
      makeToggleReq({ sessionId: session.id, guestId: guest.id, remove: true })
    );
    expect(res.ok).toBe(true);
    expect(await rsvpsForGuest(guest.id)).toHaveLength(0);
  });

  it("adding twice keeps a single RSVP per (guest, session)", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest();
    const session = await createSession(event.id);
    await getRepositories().guests.assignToEvent(event.id, [guest.id]);

    for (let i = 0; i < 2; i++) {
      const res = await toggleRsvp(
        makeToggleReq({ sessionId: session.id, guestId: guest.id })
      );
      expect(res.ok).toBe(true);
    }

    expect(await rsvpsForGuest(guest.id)).toHaveLength(1);
  });

  it("rejects toggling an RSVP for a nonexistent session", async () => {
    const guest = await createGuest();

    const res = await toggleRsvp(
      makeToggleReq({ sessionId: "does-not-exist", guestId: guest.id })
    );
    expect(res.status).toBe(404);
    expect(await rsvpsForGuest(guest.id)).toHaveLength(0);
  });

  it("rejects RSVPs from a guest who isn't assigned to the event", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const guest = await createGuest();
    const session = await createSession(event.id);
    // Deliberately not assigning the guest to the event.

    const res = await toggleRsvp(
      makeToggleReq({ sessionId: session.id, guestId: guest.id })
    );
    expect(res.status).toBe(403);
    expect(await rsvpsForGuest(guest.id)).toHaveLength(0);
  });

  describe("capacity hard limit", () => {
    it("rejects a new RSVP when the session is full and the event enforces capacity", async () => {
      const event = await createEvent({
        phase: "scheduling",
        rsvpCapacityHardLimit: true,
      });
      const alice = await createGuest({ name: "Alice" });
      const bob = await createGuest({ name: "Bob" });
      const session = await createSession(event.id, { capacity: 1 });
      await getRepositories().guests.assignToEvent(event.id, [
        alice.id,
        bob.id,
      ]);

      const first = await toggleRsvp(
        makeToggleReq({ sessionId: session.id, guestId: alice.id })
      );
      expect(first.ok).toBe(true);

      const second = await toggleRsvp(
        makeToggleReq({ sessionId: session.id, guestId: bob.id })
      );
      expect(second.status).toBe(409);
      expect(await rsvpsForGuest(bob.id)).toHaveLength(0);

      // Removal must still work on a full session.
      const remove = await toggleRsvp(
        makeToggleReq({
          sessionId: session.id,
          guestId: alice.id,
          remove: true,
        })
      );
      expect(remove.ok).toBe(true);
      expect(await rsvpsForGuest(alice.id)).toHaveLength(0);
    });

    it("allows exceeding capacity when the event does not enforce it", async () => {
      const event = await createEvent({ phase: "scheduling" });
      const alice = await createGuest({ name: "Alice" });
      const bob = await createGuest({ name: "Bob" });
      const session = await createSession(event.id, { capacity: 1 });
      await getRepositories().guests.assignToEvent(event.id, [
        alice.id,
        bob.id,
      ]);

      for (const guest of [alice, bob]) {
        const res = await toggleRsvp(
          makeToggleReq({ sessionId: session.id, guestId: guest.id })
        );
        expect(res.ok).toBe(true);
        expect(await rsvpsForGuest(guest.id)).toHaveLength(1);
      }
    });

    it("treats capacity 0 as unlimited even when enforcement is on", async () => {
      const event = await createEvent({
        phase: "scheduling",
        rsvpCapacityHardLimit: true,
      });
      const alice = await createGuest({ name: "Alice" });
      const bob = await createGuest({ name: "Bob" });
      const session = await createSession(event.id, { capacity: 0 });
      await getRepositories().guests.assignToEvent(event.id, [
        alice.id,
        bob.id,
      ]);

      for (const guest of [alice, bob]) {
        const res = await toggleRsvp(
          makeToggleReq({ sessionId: session.id, guestId: guest.id })
        );
        expect(res.ok).toBe(true);
        expect(await rsvpsForGuest(guest.id)).toHaveLength(1);
      }
    });

    it("re-adding an existing RSVP on a full session succeeds", async () => {
      const event = await createEvent({
        phase: "scheduling",
        rsvpCapacityHardLimit: true,
      });
      const alice = await createGuest({ name: "Alice" });
      const session = await createSession(event.id, { capacity: 1 });
      await getRepositories().guests.assignToEvent(event.id, [alice.id]);

      for (let i = 0; i < 2; i++) {
        const res = await toggleRsvp(
          makeToggleReq({ sessionId: session.id, guestId: alice.id })
        );
        expect(res.ok).toBe(true);
      }
      expect(await rsvpsForGuest(alice.id)).toHaveLength(1);
    });

    it("enforces capacity atomically for concurrent requests", async () => {
      const event = await createEvent({
        phase: "scheduling",
        rsvpCapacityHardLimit: true,
      });
      const alice = await createGuest({ name: "Alice" });
      const bob = await createGuest({ name: "Bob" });
      const session = await createSession(event.id, { capacity: 1 });
      await getRepositories().guests.assignToEvent(event.id, [
        alice.id,
        bob.id,
      ]);

      const [first, second] = await Promise.all([
        toggleRsvp(makeToggleReq({ sessionId: session.id, guestId: alice.id })),
        toggleRsvp(makeToggleReq({ sessionId: session.id, guestId: bob.id })),
      ]);

      const oks = [first, second].filter((res) => res.ok);
      expect(oks).toHaveLength(1);
      const rsvps = await getRepositories().rsvps.listBySession(session.id);
      expect(rsvps).toHaveLength(1);
    });
  });

  it("GET /api/rsvps lists by guest or by session and rejects missing params", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const alice = await createGuest({ name: "Alice" });
    const bob = await createGuest({ name: "Bob" });
    const session = await createSession(event.id);
    const otherSession = await createSession(event.id, {
      title: "Other Session",
    });
    await getRepositories().guests.assignToEvent(event.id, [alice.id, bob.id]);

    for (const guest of [alice, bob]) {
      await toggleRsvp(
        makeToggleReq({ sessionId: session.id, guestId: guest.id })
      );
    }
    await toggleRsvp(
      makeToggleReq({ sessionId: otherSession.id, guestId: alice.id })
    );

    const aliceRsvps = await rsvpsForGuest(alice.id);
    expect(aliceRsvps.map((r) => r.sessionId).sort()).toEqual(
      [session.id, otherSession.id].sort()
    );

    const bySession = await getRsvps(
      new NextRequest(`http://test/api/rsvps?session=${session.id}`)
    );
    expect(bySession.ok).toBe(true);
    const sessionRsvps = (await bySession.json()) as Rsvp[];
    expect(sessionRsvps.map((r) => r.guestId).sort()).toEqual(
      [alice.id, bob.id].sort()
    );

    const missing = await getRsvps(new NextRequest("http://test/api/rsvps"));
    expect(missing.status).toBe(400);
  });
});
