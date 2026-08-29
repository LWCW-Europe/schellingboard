import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import type { ReactElement } from "react";

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import {
  createEvent,
  createGuest,
  createLocation,
  createProposal,
  createSession,
} from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { DEFAULT_EMAIL_SETTINGS } from "@/db/repositories/interfaces";
import { render } from "@react-email/render";
import { sendMail } from "@/utils/mailer";
import {
  notifyCohostsAdded,
  notifyGuest,
  notifyProfileCommented,
  notifyProposalCommented,
  notifySessionCommented,
  notifySessionChanged,
  notifySessionDeleted,
} from "@/utils/notifications";

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
    vi.stubEnv("SITE_URL", "https://site.example");
  });

  afterEach(() => vi.unstubAllEnvs());

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
      description: "A *hands-on* session.",
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
    const { event, session } = await setup();
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
    // The description is not re-sent over email; the link is enough.
    expect(html).not.toContain("hands-on");
    expect(html).toContain("Saturday 1 August, 15:10–16:00");
    expect(html).toContain("(was Saturday 1 August, 10:10–11:00)");
    expect(html).toContain("Room A");
    // The location did not change, so no old location is given.
    expect(html.match(/\(was /g)).toHaveLength(1);
    // Links to the session, prefixed with SITE_URL.
    expect(html).toContain(
      `href="https://site.example/${event.slug}?viewSession=${session.id}"`
    );
  });

  it("sends nothing when SITE_URL is not set (email is disabled then too)", async () => {
    vi.stubEnv("SITE_URL", "");
    const { session } = await setup();
    const after = await getRepositories().sessions.update(session.id, {
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await notifySessionChanged({ before: session, after, changedById: null });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("does not throw, and sends nothing, when SITE_URL is invalid", async () => {
    vi.stubEnv("SITE_URL", "not-a-valid-url");
    const { session } = await setup();
    const after = await getRepositories().sessions.update(session.id, {
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await expect(
      notifySessionChanged({ before: session, after, changedById: null })
    ).resolves.toBeUndefined();

    expect(sendMail).not.toHaveBeenCalled();
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

  it("sends the change email to hosts added by the same change too", async () => {
    const { session } = await setup();
    const newHost = await createGuest({ email: "new-host@test.example" });
    const after = await getRepositories().sessions.update(session.id, {
      hostIds: [newHost.id],
      startTime: new Date("2026-08-01T15:00:00Z"),
      endTime: new Date("2026-08-01T16:00:00Z"),
    });

    await notifySessionChanged({ before: session, after, changedById: null });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients.sort()).toEqual([
      "new-host@test.example",
      "rsvper@test.example",
    ]);
  });
});

describe("notifySessionDeleted", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
    vi.stubEnv("SITE_URL", "https://site.example");
  });

  afterEach(() => vi.unstubAllEnvs());

  async function renderWithoutComments(body: ReactElement): Promise<string> {
    return (await render(body)).replace(/<!--.*?-->/g, "");
  }

  it("emails hosts and RSVP'd attendees that the session was deleted", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const room = await createLocation({ name: "Room A" });
    const host = await createGuest({ email: "host@test.example" });
    const attendee = await createGuest({ email: "attendee@test.example" });
    const session = await createSession(event.id, {
      title: "Fun Workshop",
      description: "A *hands-on* session.",
      hostIds: [host.id],
      locationIds: [room.id],
      startTime: new Date("2026-08-01T10:00:00Z"),
      endTime: new Date("2026-08-01T11:00:00Z"),
    });

    await notifySessionDeleted({
      session,
      rsvpGuestIds: [attendee.id],
      changedById: null,
    });

    expect(sendMail).toHaveBeenCalledTimes(2);
    const messages = vi.mocked(sendMail).mock.calls.map((call) => call[0]);
    const hostMessage = messages.find((m) => m.to === "host@test.example");
    const attendeeMessage = messages.find(
      (m) => m.to === "attendee@test.example"
    );
    expect(hostMessage?.subject).toBe("Session deleted: Fun Workshop");
    expect(attendeeMessage?.subject).toBe("Session deleted: Fun Workshop");

    const hostHtml = await renderWithoutComments(hostMessage!.body);
    const attendeeHtml = await renderWithoutComments(attendeeMessage!.body);
    expect(hostHtml).toContain("A session you");
    expect(hostHtml).toContain("hosting");
    expect(attendeeHtml).toContain("A session you RSVP");
    expect(hostHtml).toContain("has been deleted");
    expect(attendeeHtml).toContain("has been deleted");
    expect(hostHtml).not.toContain("hands-on");
    expect(hostHtml).toContain("Saturday 1 August, 10:10");
    expect(hostHtml).toContain("Room A");
    expect(hostHtml).toContain(`href="https://site.example/${event.slug}"`);
  });

  it("uses hostChange and rsvpChange settings for deletion recipients", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const optedOutHost = await createGuest({
      email: "host-off@test.example",
      emailSettings: {
        hostChange: false,
        rsvpChange: true,
        cohostAdd: true,
      },
    });
    const optedOutAttendee = await createGuest({
      email: "rsvp-off@test.example",
      emailSettings: {
        hostChange: true,
        rsvpChange: false,
        cohostAdd: true,
      },
    });
    const optedInAttendee = await createGuest({
      email: "rsvp-on@test.example",
      emailSettings: {
        hostChange: false,
        rsvpChange: true,
        cohostAdd: false,
      },
    });
    const session = await createSession(event.id, {
      hostIds: [optedOutHost.id],
    });

    await notifySessionDeleted({
      session,
      rsvpGuestIds: [optedOutAttendee.id, optedInAttendee.id],
      changedById: null,
    });

    expect(sendMail).toHaveBeenCalledOnce();
    expect(vi.mocked(sendMail).mock.calls[0][0].to).toBe(
      "rsvp-on@test.example"
    );
  });
});

describe("notifyCohostsAdded", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
    vi.stubEnv("SITE_URL", "https://site.example");
  });

  afterEach(() => vi.unstubAllEnvs());

  async function renderWithoutComments(body: ReactElement): Promise<string> {
    return (await render(body)).replace(/<!--.*?-->/g, "");
  }

  // Same shape as the notifySessionChanged setup: a scheduled session in
  // "Room A" with one RSVP'd guest, plus a guest just added as co-host.
  async function setupWithCohost() {
    const event = await createEvent({ phase: "scheduling" });
    const roomA = await createLocation({ name: "Room A" });
    const rsvper = await createGuest({ email: "rsvper@test.example" });
    const cohost = await createGuest({ email: "cohost@test.example" });
    const session = await createSession(event.id, {
      title: "Fun Workshop",
      description: "A *hands-on* session.",
      locationIds: [roomA.id],
      startTime: new Date("2026-08-01T10:00:00Z"),
      endTime: new Date("2026-08-01T11:00:00Z"),
      hostIds: [cohost.id],
    });
    await getRepositories().rsvps.create({
      sessionId: session.id,
      guestId: rsvper.id,
    });
    return { event, cohost, session };
  }

  it("does not throw, and sends nothing, when SITE_URL is invalid", async () => {
    vi.stubEnv("SITE_URL", "not-a-valid-url");
    const { session } = await setupWithCohost();

    await expect(
      notifyCohostsAdded({ session, previousHostIds: [], changedById: null })
    ).resolves.toBeUndefined();

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("emails newly added co-hosts the session details", async () => {
    const { event, session } = await setupWithCohost();

    await notifyCohostsAdded({
      session,
      previousHostIds: [],
      changedById: null,
    });

    // Only the new co-host; RSVP'd guests are not involved.
    expect(sendMail).toHaveBeenCalledOnce();
    const message = vi.mocked(sendMail).mock.calls[0][0];
    expect(message.to).toBe("cohost@test.example");
    expect(message.subject).toContain("Fun Workshop");
    const html = await renderWithoutComments(message.body);
    expect(html).toContain("co-host");
    expect(html).not.toContain("hands-on");
    expect(html).toContain("Saturday 1 August, 10:10–11:00");
    expect(html).toContain("Room A");
    expect(html).toContain(
      `href="https://site.example/${event.slug}?viewSession=${session.id}"`
    );
  });

  it("does not email guests who were hosts already", async () => {
    const { cohost, session } = await setupWithCohost();

    await notifyCohostsAdded({
      session,
      previousHostIds: [cohost.id],
      changedById: null,
    });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("does not email a guest who added themselves", async () => {
    const { cohost, session } = await setupWithCohost();

    await notifyCohostsAdded({
      session,
      previousHostIds: [],
      changedById: cohost.id,
    });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("skips guests who opted out of co-host emails", async () => {
    const { session } = await setupWithCohost();
    const optedOut = await createGuest({
      email: "opted-out@test.example",
      emailSettings: { rsvpChange: true, hostChange: true, cohostAdd: false },
    });
    const after = await getRepositories().sessions.update(session.id, {
      hostIds: [optedOut.id],
    });

    await notifyCohostsAdded({
      session: after,
      previousHostIds: [],
      changedById: null,
    });

    expect(sendMail).not.toHaveBeenCalled();
  });
});

describe("notifyProposalCommented", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
    vi.stubEnv("SITE_URL", "https://site.example");
  });

  afterEach(() => vi.unstubAllEnvs());

  async function renderWithoutComments(body: ReactElement): Promise<string> {
    return (await render(body)).replace(/<!--.*?-->/g, "");
  }

  // A proposal hosted by host@test.example, already carrying one comment by
  // earlier@test.example.
  async function setup() {
    const event = await createEvent({ phase: "proposal" });
    const host = await createGuest({ email: "host@test.example" });
    const earlier = await createGuest({ email: "earlier@test.example" });
    const proposal = await createProposal(event.id, [host.id], {
      title: "Fun Workshop",
    });
    await addComment(proposal.id, earlier.id, "Sounds good");
    return { event, host, earlier, proposal };
  }

  async function addComment(
    proposalId: string,
    authorId: string,
    body: string
  ) {
    return getRepositories().proposalComments.create({
      subjectId: proposalId,
      authorId,
      body,
      createdTime: new Date("2026-08-01T10:00:00Z"),
    });
  }

  async function optIntoThread(guestId: string) {
    await getRepositories().guests.updateEmailSettings(guestId, {
      ...DEFAULT_EMAIL_SETTINGS,
      commentThread: true,
    });
  }

  it("emails the proposal's hosts and the opted-in earlier commenters", async () => {
    const { event, earlier, proposal } = await setup();
    await optIntoThread(earlier.id);
    const commenter = await createGuest({
      name: "Rosa Diaz",
      email: "commenter@test.example",
    });
    const posted = await addComment(
      proposal.id,
      commenter.id,
      "A *great* idea"
    );

    await notifyProposalCommented({ proposalId: proposal.id, comment: posted });

    expect(sendMail).toHaveBeenCalledTimes(2);
    const messages = vi.mocked(sendMail).mock.calls.map((call) => call[0]);
    const hostMessage = messages.find((m) => m.to === "host@test.example");
    const earlierMessage = messages.find(
      (m) => m.to === "earlier@test.example"
    );
    expect(hostMessage?.subject).toBe("New comment on: Fun Workshop");
    expect(earlierMessage).toBeDefined();

    const hostHtml = await renderWithoutComments(hostMessage!.body);
    expect(hostHtml).toContain("Rosa Diaz");
    expect(hostHtml).toContain("proposal you");
    // The comment itself is not re-sent over email; the link is enough.
    expect(hostHtml).not.toContain("great");
    expect(hostHtml).toContain(
      `href="https://site.example/${event.slug}/proposals?viewProposal=${proposal.id}#comment-${posted.id}"`
    );

    const earlierHtml = await renderWithoutComments(earlierMessage!.body);
    expect(earlierHtml).toContain("commented on");
  });

  it("does not email the guest who wrote the comment", async () => {
    const { host, proposal } = await setup();
    const posted = await addComment(proposal.id, host.id, "My own thoughts");

    await notifyProposalCommented({ proposalId: proposal.id, comment: posted });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients).not.toContain("host@test.example");
  });

  it("leaves earlier commenters alone by default", async () => {
    const { proposal } = await setup();
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(proposal.id, commenter.id, "Hello");

    await notifyProposalCommented({ proposalId: proposal.id, comment: posted });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients).toEqual(["host@test.example"]);
  });

  it("skips a host who opted out of proposal comment emails", async () => {
    const event = await createEvent({ phase: "proposal" });
    const host = await createGuest({
      email: "host-off@test.example",
      emailSettings: { proposalComment: false },
    });
    const proposal = await createProposal(event.id, [host.id]);
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(proposal.id, commenter.id, "Hello");

    await notifyProposalCommented({ proposalId: proposal.id, comment: posted });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("emails a host once, even when they also commented earlier", async () => {
    const { host, proposal } = await setup();
    await optIntoThread(host.id);
    await addComment(proposal.id, host.id, "Looking forward to it");
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(proposal.id, commenter.id, "Hello");

    await notifyProposalCommented({ proposalId: proposal.id, comment: posted });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients.filter((to) => to === "host@test.example")).toHaveLength(
      1
    );
  });

  it("sends nothing when SITE_URL is not set", async () => {
    vi.stubEnv("SITE_URL", "");
    const { proposal } = await setup();
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(proposal.id, commenter.id, "Hello");

    await notifyProposalCommented({ proposalId: proposal.id, comment: posted });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("does not throw when the proposal is gone", async () => {
    const { proposal } = await setup();
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(proposal.id, commenter.id, "Hello");
    await getRepositories().sessionProposals.delete(proposal.id);

    await expect(
      notifyProposalCommented({ proposalId: proposal.id, comment: posted })
    ).resolves.toBeUndefined();
    expect(sendMail).not.toHaveBeenCalled();
  });
});

describe("notifySessionCommented", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
    vi.stubEnv("SITE_URL", "https://site.example");
  });

  afterEach(() => vi.unstubAllEnvs());

  // A session hosted by host@test.example, already carrying one comment by
  // earlier@test.example.
  async function setup() {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({ email: "host@test.example" });
    const earlier = await createGuest({ email: "earlier@test.example" });
    const session = await createSession(event.id, {
      title: "Hallway Track",
      hostIds: [host.id],
    });
    await addComment(session.id, earlier.id, "See you there");
    return { event, host, earlier, session };
  }

  async function addComment(sessionId: string, authorId: string, body: string) {
    return getRepositories().sessionComments.create({
      subjectId: sessionId,
      authorId,
      body,
      createdTime: new Date("2026-08-01T10:00:00Z"),
    });
  }

  it("emails the session's hosts and the opted-in earlier commenters", async () => {
    const { event, earlier, session } = await setup();
    await getRepositories().guests.updateEmailSettings(earlier.id, {
      ...DEFAULT_EMAIL_SETTINGS,
      commentThread: true,
    });
    const commenter = await createGuest({
      name: "Rosa Diaz",
      email: "commenter@test.example",
    });
    const posted = await addComment(session.id, commenter.id, "A *great* room");

    await notifySessionCommented({ sessionId: session.id, comment: posted });

    expect(sendMail).toHaveBeenCalledTimes(2);
    const messages = vi.mocked(sendMail).mock.calls.map((call) => call[0]);
    const hostMessage = messages.find((m) => m.to === "host@test.example");
    expect(hostMessage?.subject).toBe("New comment on: Hallway Track");

    const hostHtml = await render(hostMessage!.body);
    expect(hostHtml).toContain("Rosa Diaz");
    expect(hostHtml).toContain("session you");
    expect(hostHtml).not.toContain("great");
    expect(hostHtml).toContain(
      `href="https://site.example/${event.slug}?viewSession=${session.id}#comment-${posted.id}"`
    );
  });

  it("does not email the guest who wrote the comment", async () => {
    const { host, session } = await setup();
    const posted = await addComment(session.id, host.id, "My own thoughts");

    await notifySessionCommented({ sessionId: session.id, comment: posted });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients).not.toContain("host@test.example");
  });

  it("leaves earlier commenters alone by default", async () => {
    const { session } = await setup();
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(session.id, commenter.id, "Hello");

    await notifySessionCommented({ sessionId: session.id, comment: posted });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients).toEqual(["host@test.example"]);
  });

  it("skips a host who opted out of session comment emails", async () => {
    const event = await createEvent({ phase: "scheduling" });
    const host = await createGuest({
      email: "host-off@test.example",
      emailSettings: { sessionComment: false },
    });
    const session = await createSession(event.id, { hostIds: [host.id] });
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(session.id, commenter.id, "Hello");

    await notifySessionCommented({ sessionId: session.id, comment: posted });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("does not throw when the session is gone", async () => {
    const { session } = await setup();
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(session.id, commenter.id, "Hello");
    await getRepositories().sessions.delete(session.id);

    await expect(
      notifySessionCommented({ sessionId: session.id, comment: posted })
    ).resolves.toBeUndefined();
    expect(sendMail).not.toHaveBeenCalled();
  });
});

describe("notifyProfileCommented", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
    vi.stubEnv("SITE_URL", "https://site.example");
  });

  afterEach(() => vi.unstubAllEnvs());

  // owner@test.example's profile, already carrying one comment by
  // earlier@test.example.
  async function setup() {
    const owner = await createGuest({
      name: "Amy Santiago",
      email: "owner@test.example",
    });
    const earlier = await createGuest({ email: "earlier@test.example" });
    await addComment(owner.id, earlier.id, "Nice to meet you");
    return { owner, earlier };
  }

  async function addComment(profileId: string, authorId: string, body: string) {
    return getRepositories().profileComments.create({
      subjectId: profileId,
      authorId,
      body,
      createdTime: new Date("2026-08-01T10:00:00Z"),
    });
  }

  it("emails the profile's owner and the opted-in earlier commenters", async () => {
    const { owner, earlier } = await setup();
    await getRepositories().guests.updateEmailSettings(earlier.id, {
      ...DEFAULT_EMAIL_SETTINGS,
      commentThread: true,
    });
    const commenter = await createGuest({
      name: "Rosa Diaz",
      email: "commenter@test.example",
    });
    const posted = await addComment(owner.id, commenter.id, "Say *hi*");

    await notifyProfileCommented({ profileId: owner.id, comment: posted });

    expect(sendMail).toHaveBeenCalledTimes(2);
    const messages = vi.mocked(sendMail).mock.calls.map((call) => call[0]);
    const ownerMessage = messages.find((m) => m.to === "owner@test.example");
    expect(ownerMessage?.subject).toBe("New comment on your profile");

    const ownerHtml = await render(ownerMessage!.body);
    expect(ownerHtml).toContain("Rosa Diaz");
    expect(ownerHtml).not.toContain("Say");
    expect(ownerHtml).toContain(
      `href="https://site.example/guests/${owner.id}#comment-${posted.id}"`
    );

    const earlierMessage = messages.find(
      (m) => m.to === "earlier@test.example"
    );
    expect(earlierMessage?.subject).toBe(
      "New comment on: Amy Santiago's profile"
    );
  });

  it("does not email the guest who wrote the comment", async () => {
    const { owner } = await setup();
    const posted = await addComment(owner.id, owner.id, "A note to myself");

    await notifyProfileCommented({ profileId: owner.id, comment: posted });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients).not.toContain("owner@test.example");
  });

  it("leaves earlier commenters alone by default", async () => {
    const { owner } = await setup();
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(owner.id, commenter.id, "Hello");

    await notifyProfileCommented({ profileId: owner.id, comment: posted });

    const recipients = vi.mocked(sendMail).mock.calls.map((c) => c[0].to);
    expect(recipients).toEqual(["owner@test.example"]);
  });

  it("skips an owner who opted out of profile comment emails", async () => {
    const owner = await createGuest({
      email: "owner-off@test.example",
      emailSettings: { profileComment: false },
    });
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(owner.id, commenter.id, "Hello");

    await notifyProfileCommented({ profileId: owner.id, comment: posted });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it("does not throw when the profile is gone", async () => {
    const { owner } = await setup();
    const commenter = await createGuest({ email: "commenter@test.example" });
    const posted = await addComment(owner.id, commenter.id, "Hello");
    await getRepositories().guests.delete(owner.id);

    await expect(
      notifyProfileCommented({ profileId: owner.id, comment: posted })
    ).resolves.toBeUndefined();
    expect(sendMail).not.toHaveBeenCalled();
  });
});
