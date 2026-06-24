import { describe, it, expect, beforeAll, beforeEach } from "vitest";

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createProposal,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";

describe("guest profile repositories", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  describe("guests.updateProfile", () => {
    it("updates name and aboutMe, leaving email intact", async () => {
      const { guests } = getRepositories();
      const guest = await createGuest({ name: "Old", email: "g@test.example" });

      const updated = await guests.updateProfile(guest.id, {
        name: "New Name",
        aboutMe: "I love unconferences.",
        avatarUrl: "/media/uploads/avatar.png",
      });

      expect(updated).toMatchObject({
        id: guest.id,
        name: "New Name",
        aboutMe: "I love unconferences.",
        avatarUrl: "/media/uploads/avatar.png",
        info: { email: "g@test.example" },
      });
      const fetched = await guests.findById(guest.id);
      expect(fetched).toMatchObject({
        name: "New Name",
        aboutMe: "I love unconferences.",
        avatarUrl: "/media/uploads/avatar.png",
      });
    });
  });

  describe("sessions.listHostedByGuest", () => {
    it("returns only sessions the guest hosts", async () => {
      const { sessions } = getRepositories();
      const event = await createEvent();
      const guest = await createGuest();
      const other = await createGuest();

      const hosted = await createSession(event.id, {
        title: "Mine",
        hostIds: [guest.id],
      });
      await createSession(event.id, { title: "Theirs", hostIds: [other.id] });

      const result = await sessions.listHostedByGuest(guest.id);
      expect(result.map((s) => s.id)).toEqual([hosted.id]);
      expect(result[0].hosts.map((h) => h.id)).toContain(guest.id);
    });
  });

  describe("sessions.listRsvpdByGuest", () => {
    it("returns only sessions the guest RSVP'd to", async () => {
      const { sessions, rsvps } = getRepositories();
      const event = await createEvent();
      const guest = await createGuest();

      const attended = await createSession(event.id, { title: "Going" });
      await createSession(event.id, { title: "Not going" });
      await rsvps.create({ sessionId: attended.id, guestId: guest.id });

      const result = await sessions.listRsvpdByGuest(guest.id);
      expect(result.map((s) => s.id)).toEqual([attended.id]);
    });
  });

  describe("sessionProposals.listByHost", () => {
    it("returns only proposals the guest hosts", async () => {
      const { sessionProposals } = getRepositories();
      const event = await createEvent();
      const guest = await createGuest();
      const other = await createGuest();

      const mine = await createProposal(event.id, [guest.id], {
        title: "My proposal",
      });
      await createProposal(event.id, [other.id], { title: "Their proposal" });

      const result = await sessionProposals.listByHost(guest.id);
      expect(result.map((p) => p.id)).toEqual([mine.id]);
    });
  });
});
