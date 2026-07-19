import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createProposal as createProposalFixture,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  createProposal,
  updateProposal,
} from "@/app/(site)/[eventSlug]/proposals/actions";

describe("createProposal", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("creates a proposal with hosts and duration, readable via listByEvent", async () => {
    const event = await createEvent();
    const host = await createGuest({ name: "Host", eventId: event.id });

    const result = await createProposal({
      eventId: event.id,
      eventSlug: "test-event",
      title: "My Proposal",
      description: "A description",
      hostIds: [host.id],
      durationMinutes: 60,
    });
    expect(result).toEqual({ success: true });

    const proposals = await getRepositories().sessionProposals.listByEvent(
      event.id
    );
    expect(proposals).toHaveLength(1);
    expect(proposals[0]).toMatchObject({
      title: "My Proposal",
      description: "A description",
      durationMinutes: 60,
    });
    expect(proposals[0].hosts.map((h) => h.id)).toEqual([host.id]);
  });

  it("rejects a host who is not part of the event", async () => {
    const event = await createEvent();
    const outsider = await createGuest({ name: "Outsider" }); // not assigned

    const result = await createProposal({
      eventId: event.id,
      eventSlug: "test-event",
      title: "My Proposal",
      hostIds: [outsider.id],
    });
    expect(result).toHaveProperty("error");

    const proposals = await getRepositories().sessionProposals.listByEvent(
      event.id
    );
    expect(proposals).toHaveLength(0);
  });

  it("rejects a missing title and leaves the event's proposals unchanged", async () => {
    const event = await createEvent();

    const result = await createProposal({
      eventId: event.id,
      eventSlug: "test-event",
      title: "",
    });
    expect(result).toHaveProperty("error");

    const proposals = await getRepositories().sessionProposals.listByEvent(
      event.id
    );
    expect(proposals).toHaveLength(0);
  });

  it("rejects a missing event", async () => {
    const result = await createProposal({
      eventSlug: "test-event",
      title: "No Event",
    } as never);
    expect(result).toHaveProperty("error");
  });
});

describe("updateProposal", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => resetTestDb());

  it("updates title, description, hosts, and duration", async () => {
    const event = await createEvent();
    const alice = await createGuest({ name: "Alice", eventId: event.id });
    const bob = await createGuest({ name: "Bob", eventId: event.id });
    const proposal = await createProposalFixture(event.id, [alice.id], {
      title: "Original",
      durationMinutes: 30,
    });

    const result = await updateProposal(proposal.id, {
      eventSlug: "test-event",
      title: "Updated",
      description: "New description",
      hostIds: [alice.id, bob.id],
      durationMinutes: 90,
    });
    expect(result).toEqual({ success: true });

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after).toMatchObject({
      title: "Updated",
      description: "New description",
      durationMinutes: 90,
    });
    expect(after?.hosts.map((h) => h.id).sort()).toEqual(
      [alice.id, bob.id].sort()
    );
  });

  it("removes all hosts and clears the duration", async () => {
    const event = await createEvent();
    const host = await createGuest({ name: "Host" });
    const proposal = await createProposalFixture(event.id, [host.id], {
      durationMinutes: 60,
    });

    const result = await updateProposal(proposal.id, {
      eventSlug: "test-event",
      title: proposal.title,
      durationMinutes: undefined,
    });
    expect(result).toEqual({ success: true });

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.hosts).toEqual([]);
    expect(after?.durationMinutes).toBeUndefined();
  });

  it("rejects a missing title and leaves the proposal unchanged", async () => {
    const event = await createEvent();
    const proposal = await createProposalFixture(event.id, [], {
      title: "Keep Me",
    });

    const result = await updateProposal(proposal.id, {
      eventSlug: "test-event",
      title: "",
    });
    expect(result).toHaveProperty("error");

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.title).toBe("Keep Me");
  });

  it("rejects a host who is not part of the event", async () => {
    const event = await createEvent();
    const alice = await createGuest({ name: "Alice", eventId: event.id });
    const outsider = await createGuest({ name: "Outsider" }); // not assigned
    const proposal = await createProposalFixture(event.id, [alice.id]);

    const result = await updateProposal(proposal.id, {
      eventSlug: "test-event",
      title: proposal.title,
      hostIds: [outsider.id],
    });
    expect(result).toHaveProperty("error");

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.hosts.map((h) => h.id)).toEqual([alice.id]);
  });
});
