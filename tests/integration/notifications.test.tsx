import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import type { ReactElement } from "react";

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { render } from "@react-email/render";
import { sendMail } from "@/utils/mailer";
import { notifyGuest, notifySessionChanged } from "@/utils/notifications";

const MESSAGE = {
  subject: "Session moved",
  body: <p>Your session moved.</p>,
};

describe("notifyGuest", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
  });

  it("sends the email when the guest has the setting on", async () => {
    const guest = await createGuest({
      email: "on@test.example",
      emailSettings: { rsvpChange: true, hostChange: false, cohostAdd: false },
    });
    await notifyGuest(guest.id, "rsvpChange", MESSAGE);
    expect(sendMail).toHaveBeenCalledExactlyOnceWith({
      to: "on@test.example",
      ...MESSAGE,
    });
  });

  it("does not send when the guest has the setting off", async () => {
    const guest = await createGuest({
      emailSettings: { rsvpChange: false, hostChange: true, cohostAdd: true },
    });
    await notifyGuest(guest.id, "rsvpChange", MESSAGE);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("consults the specific setting, not the others", async () => {
    const guest = await createGuest({
      email: "cohost@test.example",
      emailSettings: { rsvpChange: false, hostChange: false, cohostAdd: true },
    });
    await notifyGuest(guest.id, "cohostAdd", MESSAGE);
    expect(sendMail).toHaveBeenCalledExactlyOnceWith({
      to: "cohost@test.example",
      ...MESSAGE,
    });
  });

  it("does nothing for an unknown guest id", async () => {
    await expect(
      notifyGuest("does-not-exist", "rsvpChange", MESSAGE)
    ).resolves.toBeUndefined();
    expect(sendMail).not.toHaveBeenCalled();
  });
});

describe("notifySessionChanged", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
  });

  // React separates adjacent text nodes with `<!-- -->` comments in the
  // rendered html, which would break substring assertions.
  async function renderWithoutComments(body: ReactElement): Promise<string> {
    return (await render(body)).replace(/<!--.*?-->/g, "");
  }

  // A scheduled session in "Room A", Saturday 1 August 10:00–11:00 UTC, with
  // one RSVP'd guest.
  async function setup() {
    const event = await createEvent({ phase: "scheduling" });
    const roomA = await createLocation({ name: "Room A" });
    const roomB = await createLocation({ name: "Room B" });
    const guest = await createGuest({ email: "rsvper@test.example" });
    const session = await createSession(event.id, {
      title: "Fun Workshop",
      description: "A hands-on session.",
      locationIds: [roomA.id],
      startTime: new Date("2026-08-01T10:00:00Z"),
      endTime: new Date("2026-08-01T11:00:00Z"),
    });
    await getRepositories().rsvps.create({
      sessionId: session.id,
      guestId: guest.id,
    });
    return { event, roomA, roomB, guest, session };
  }

  it("emails RSVP'd guests the new and old time when the time changes", async () => {
    const { session } = await setup();
    const after = await getRepositories().sessions.update(session.id, {
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await notifySessionChanged({ before: session, after, changedById: null });

    expect(sendMail).toHaveBeenCalledOnce();
    const message = vi.mocked(sendMail).mock.calls[0][0];
    expect(message.to).toBe("rsvper@test.example");
    expect(message.subject).toContain("Fun Workshop");
    const html = await renderWithoutComments(message.body);
    expect(html).toContain("Fun Workshop");
    expect(html).toContain("A session you RSVP’d to");
    expect(html).toContain("A hands-on session.");
    expect(html).toContain("Saturday 1 August, 15:00–16:00");
    expect(html).toContain("(was Saturday 1 August, 10:00–11:00)");
    expect(html).toContain("Room A");
    // The location did not change, so no old location is given.
    expect(html.match(/\(was /g)).toHaveLength(1);
  });

  it("emails hosts, addressing them as hosts", async () => {
    const { session } = await setup();
    const host = await createGuest({ email: "host@test.example" });
    const withHost = await getRepositories().sessions.update(session.id, {
      hostIds: [host.id],
    });
    const after = await getRepositories().sessions.update(session.id, {
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await notifySessionChanged({ before: withHost, after, changedById: null });

    expect(sendMail).toHaveBeenCalledTimes(2);
    const messages = vi.mocked(sendMail).mock.calls.map((call) => call[0]);
    const hostMessage = messages.find((m) => m.to === "host@test.example");
    const rsvperMessage = messages.find((m) => m.to === "rsvper@test.example");
    expect(hostMessage).toBeDefined();
    expect(rsvperMessage).toBeDefined();
    expect(await renderWithoutComments(hostMessage!.body)).toContain(
      "A session you’re hosting"
    );
    expect(await renderWithoutComments(rsvperMessage!.body)).toContain(
      "A session you RSVP’d to"
    );
  });

  it("gates host emails on hostChange, not rsvpChange", async () => {
    const { session } = await setup();
    const host = await createGuest({
      email: "host@test.example",
      emailSettings: { rsvpChange: false, cohostAdd: true, hostChange: true },
    });
    const withHost = await getRepositories().sessions.update(session.id, {
      hostIds: [host.id],
    });
    const after = await getRepositories().sessions.update(session.id, {
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await notifySessionChanged({ before: withHost, after, changedById: null });

    // Host has rsvpChange off but hostChange on: they're still emailed.
    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients).toContain("host@test.example");
  });

  it("does not email a host who opted out of hostChange", async () => {
    const { session } = await setup();
    const host = await createGuest({
      email: "host@test.example",
      emailSettings: { rsvpChange: true, cohostAdd: true, hostChange: false },
    });
    const withHost = await getRepositories().sessions.update(session.id, {
      hostIds: [host.id],
    });
    const after = await getRepositories().sessions.update(session.id, {
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await notifySessionChanged({ before: withHost, after, changedById: null });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients).not.toContain("host@test.example");
  });

  it("does not email the guest who made the change", async () => {
    const { session } = await setup();
    const host = await createGuest({ email: "host@test.example" });
    const withHost = await getRepositories().sessions.update(session.id, {
      hostIds: [host.id],
    });
    const after = await getRepositories().sessions.update(session.id, {
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await notifySessionChanged({
      before: withHost,
      after,
      changedById: host.id,
    });

    expect(sendMail).toHaveBeenCalledOnce();
    expect(vi.mocked(sendMail).mock.calls[0][0].to).toBe("rsvper@test.example");
  });

  it("emails the new and old location when only the location changes", async () => {
    const { roomB, session } = await setup();
    const after = await getRepositories().sessions.update(session.id, {
      locationIds: [roomB.id],
    });

    await notifySessionChanged({ before: session, after, changedById: null });

    expect(sendMail).toHaveBeenCalledOnce();
    const html = await renderWithoutComments(
      vi.mocked(sendMail).mock.calls[0][0].body
    );
    expect(html).toContain("Room B");
    expect(html).toContain("(was Room A)");
    // The time did not change, so no old time is given.
    expect(html.match(/\(was /g)).toHaveLength(1);
  });

  it("does not email when neither time nor location changed", async () => {
    const { session } = await setup();
    const after = await getRepositories().sessions.update(session.id, {
      title: "Renamed Workshop",
    });

    await notifySessionChanged({ before: session, after, changedById: null });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("skips guests who opted out of session change emails", async () => {
    const { session } = await setup();
    const optedOut = await createGuest({
      email: "opted-out@test.example",
      emailSettings: { rsvpChange: false, hostChange: true, cohostAdd: true },
    });
    await getRepositories().rsvps.create({
      sessionId: session.id,
      guestId: optedOut.id,
    });
    const after = await getRepositories().sessions.update(session.id, {
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await notifySessionChanged({ before: session, after, changedById: null });

    expect(sendMail).toHaveBeenCalledOnce();
    expect(vi.mocked(sendMail).mock.calls[0][0].to).toBe("rsvper@test.example");
  });
});
