import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: () =>
    Promise.resolve({
      get: (name: string) => {
        const value = cookieJar.get(name);
        return value === undefined ? undefined : { name, value };
      },
    }),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createProposal as createProposalFixture,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import {
  GUEST_COOKIE_NAME,
  openGuestValue,
  verifiedGuestValue,
} from "../helpers/guest-cookie";
import {
  createProposal,
  updateProposal,
} from "@/app/(site)/[eventSlug]/proposals/actions";

const VALID_SECRET = "0123456789abcdef0123456789abcdef";

async function protectGuest(guestId: string): Promise<void> {
  await getRepositories().guests.setAuthProtection(guestId, {
    authProtected: true,
    passwordHash: null,
  });
}

function proposalForm(fields: Record<string, string | string[]>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      for (const v of value) fd.append(key, v);
    } else {
      fd.set(key, value);
    }
  }
  return fd;
}

describe("createProposal", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("creates a proposal with hosts and duration, readable via listByEvent", async () => {
    const event = await createEvent();
    const host = await createGuest({ name: "Host", eventId: event.id });

    const result = await createProposal(
      proposalForm({
        event: event.id,
        eventSlug: "test-event",
        title: "My Proposal",
        description: "A description",
        hosts: [host.id],
        durationMinutes: "60",
      })
    );
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

    const result = await createProposal(
      proposalForm({
        event: event.id,
        eventSlug: "test-event",
        title: "My Proposal",
        hosts: [outsider.id],
      })
    );
    expect(result).toHaveProperty("error");

    const proposals = await getRepositories().sessionProposals.listByEvent(
      event.id
    );
    expect(proposals).toHaveLength(0);
  });

  it("rejects a missing title and leaves the event's proposals unchanged", async () => {
    const event = await createEvent();

    const result = await createProposal(
      proposalForm({ event: event.id, eventSlug: "test-event", title: "" })
    );
    expect(result).toHaveProperty("error");

    const proposals = await getRepositories().sessionProposals.listByEvent(
      event.id
    );
    expect(proposals).toHaveLength(0);
  });

  it("rejects a missing event", async () => {
    const result = await createProposal(
      proposalForm({ eventSlug: "test-event", title: "No Event" })
    );
    expect(result).toHaveProperty("error");
  });

  it("rejects creating as a protected guest without a verified session", async () => {
    const event = await createEvent();
    const guest = await createGuest({ name: "Host", eventId: event.id });
    await protectGuest(guest.id);
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(guest.id));

    const result = await createProposal(
      proposalForm({
        event: event.id,
        eventSlug: "test-event",
        title: "My Proposal",
        hosts: [guest.id],
      })
    );
    expect(result).toHaveProperty("error");

    const proposals = await getRepositories().sessionProposals.listByEvent(
      event.id
    );
    expect(proposals).toHaveLength(0);
  });

  it("creates as a protected guest with a verified session", async () => {
    const event = await createEvent();
    const guest = await createGuest({ name: "Host", eventId: event.id });
    await protectGuest(guest.id);
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(guest.id));

    const result = await createProposal(
      proposalForm({
        event: event.id,
        eventSlug: "test-event",
        title: "My Proposal",
        hosts: [guest.id],
      })
    );
    expect(result).toEqual({ success: true });

    const proposals = await getRepositories().sessionProposals.listByEvent(
      event.id
    );
    expect(proposals).toHaveLength(1);
  });
});

describe("updateProposal", () => {
  beforeAll(() => setupTestDb());
  beforeEach(() => {
    resetTestDb();
    cookieJar.clear();
    vi.stubEnv("AUTH_SECRET", VALID_SECRET);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("updates title, description, hosts, and duration", async () => {
    const event = await createEvent();
    const alice = await createGuest({ name: "Alice", eventId: event.id });
    const bob = await createGuest({ name: "Bob", eventId: event.id });
    const proposal = await createProposalFixture(event.id, [alice.id], {
      title: "Original",
      durationMinutes: 30,
    });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(alice.id));

    const result = await updateProposal(
      proposal.id,
      proposalForm({
        eventSlug: "test-event",
        title: "Updated",
        description: "New description",
        hosts: [alice.id, bob.id],
        durationMinutes: "90",
      })
    );
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
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(host.id));

    const result = await updateProposal(
      proposal.id,
      proposalForm({
        eventSlug: "test-event",
        title: proposal.title,
        durationMinutes: "",
      })
    );
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

    const result = await updateProposal(
      proposal.id,
      proposalForm({ eventSlug: "test-event", title: "" })
    );
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
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(alice.id));

    const result = await updateProposal(
      proposal.id,
      proposalForm({
        eventSlug: "test-event",
        title: proposal.title,
        hosts: [outsider.id],
      })
    );
    expect(result).toHaveProperty("error");

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.hosts.map((h) => h.id)).toEqual([alice.id]);
  });

  it("rejects a non-host attempting to edit", async () => {
    const event = await createEvent();
    const host = await createGuest({ name: "Host", eventId: event.id });
    const nonHost = await createGuest({ name: "NonHost", eventId: event.id });
    const proposal = await createProposalFixture(event.id, [host.id], {
      title: "Original",
    });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(nonHost.id));

    const result = await updateProposal(
      proposal.id,
      proposalForm({ eventSlug: "test-event", title: "Hijacked" })
    );
    expect(result).toHaveProperty("error");

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.title).toBe("Original");
  });

  it("rejects editing with no acting guest at all", async () => {
    const event = await createEvent();
    const host = await createGuest({ name: "Host", eventId: event.id });
    const proposal = await createProposalFixture(event.id, [host.id], {
      title: "Original",
    });

    const result = await updateProposal(
      proposal.id,
      proposalForm({ eventSlug: "test-event", title: "Hijacked" })
    );
    expect(result).toHaveProperty("error");

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.title).toBe("Original");
  });

  it("allows anyone to edit a hostless proposal", async () => {
    const event = await createEvent();
    const proposal = await createProposalFixture(event.id, [], {
      title: "Unclaimed",
    });

    const result = await updateProposal(
      proposal.id,
      proposalForm({ eventSlug: "test-event", title: "Claimed by nobody" })
    );
    expect(result).toEqual({ success: true });

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.title).toBe("Claimed by nobody");
  });

  it("rejects a protected host without a verified session", async () => {
    const event = await createEvent();
    const host = await createGuest({ name: "Host", eventId: event.id });
    await protectGuest(host.id);
    const proposal = await createProposalFixture(event.id, [host.id], {
      title: "Original",
    });
    cookieJar.set(GUEST_COOKIE_NAME, openGuestValue(host.id));

    const result = await updateProposal(
      proposal.id,
      proposalForm({ eventSlug: "test-event", title: "Hijacked" })
    );
    expect(result).toHaveProperty("error");

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.title).toBe("Original");
  });

  it("accepts a protected host with a verified session", async () => {
    const event = await createEvent();
    const host = await createGuest({ name: "Host", eventId: event.id });
    await protectGuest(host.id);
    const proposal = await createProposalFixture(event.id, [host.id], {
      title: "Original",
    });
    cookieJar.set(GUEST_COOKIE_NAME, await verifiedGuestValue(host.id));

    const result = await updateProposal(
      proposal.id,
      proposalForm({ eventSlug: "test-event", title: "Renamed" })
    );
    expect(result).toEqual({ success: true });

    const after = await getRepositories().sessionProposals.findById(
      proposal.id
    );
    expect(after?.title).toBe("Renamed");
  });
});
