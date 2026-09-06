import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
  isMailerConfigured: vi.fn(() => true),
}));

import Database from "better-sqlite3";
import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createLocation } from "../helpers/factories";
import { getRepositories, serializeDb } from "@/db/container";
import { DEFAULT_EMAIL_SETTINGS } from "@/db/repositories/interfaces";
import { isMailerConfigured, sendMail } from "@/utils/mailer";
import { dispatchDueReminders } from "@/utils/reminder-dispatch";
import { followUpDueTime } from "@/utils/reminder-schedule";

// The reference session: 10:00–11:00 UTC with the factory's 10-minute break,
// so the displayed start is 10:10, the heads-up is due at 09:10 and the
// follow-up at 11:15. Dispatching at either moment isolates one kind: by
// 11:15 the session has ended, which drops the heads-up (FR-013).
const START = new Date("2026-09-01T10:00:00Z");
const END = new Date("2026-09-01T11:00:00Z");
const HEADS_UP_AT = new Date("2026-09-01T09:10:00Z");
const FOLLOW_UP_AT = new Date("2026-09-01T11:15:00Z");

const HOUR_MS = 60 * 60 * 1000;

const FIRST = "first@test.example";
const SECOND = "second@test.example";

function later(from: Date, hours: number): Date {
  return new Date(from.getTime() + hours * HOUR_MS);
}

function recipients(): string[] {
  return vi
    .mocked(sendMail)
    .mock.calls.map((call) => call[0].to)
    .sort();
}

function subjects(): string[] {
  return vi.mocked(sendMail).mock.calls.map((call) => call[0].subject);
}

// Reads the raw reminder rows from a snapshot of the test database. The
// cascade is a storage-layer guarantee, so it is asserted at the storage
// layer rather than through a repository method nothing in the app needs.
function reminderRowCount(sessionId: string): number {
  const db = new Database(serializeDb());
  try {
    const row = db
      .prepare(
        "SELECT count(*) AS n FROM session_reminders WHERE session_id = ?"
      )
      .get(sessionId) as { n: number };
    return row.n;
  } finally {
    db.close();
  }
}

type StoredReminder = {
  due_time: string;
  claimed_at: string | null;
  sent_at: string | null;
  first_failed_at: string | null;
  notified_at: string | null;
};

// Which channels settled, and how — the distinction between "spoken for" and
// "mailed" is the whole point of the claimed_at/sent_at split, so it is read
// straight from the row.
function storedReminder(
  sessionId: string,
  guestId: string,
  kind: string
): StoredReminder | undefined {
  const db = new Database(serializeDb());
  try {
    return db
      .prepare(
        "SELECT due_time, claimed_at, sent_at, first_failed_at, notified_at" +
          " FROM session_reminders" +
          " WHERE session_id = ? AND guest_id = ? AND kind = ?"
      )
      .get(sessionId, guestId, kind) as StoredReminder | undefined;
  } finally {
    db.close();
  }
}

async function reminderNotices(guestId: string) {
  const all = await getRepositories().notifications.listByGuest(guestId);
  return all.filter(
    (n) => n.type === "sessionHeadsUp" || n.type === "attendeeCountReminder"
  );
}

/** A scheduled session in Room A hosted by every guest in `hosts`. */
async function scheduledSession(hostIds: string[]) {
  const event = await createEvent({ phase: "scheduling" });
  const room = await createLocation({ name: "Room A", eventId: event.id });
  const session = await getRepositories().sessions.create({
    title: "Fun Workshop",
    description: "",
    startTime: START,
    endTime: END,
    capacity: 30,
    adminManaged: false,
    blocker: false,
    closed: false,
    eventId: event.id,
    hostIds,
    locationIds: [room.id],
  });
  return { event, session };
}

async function twoHostSession() {
  const first = await createGuest({ email: FIRST });
  const second = await createGuest({ email: SECOND });
  const { event, session } = await scheduledSession([first.id, second.id]);
  return { event, session, first, second };
}

describe("dispatchDueReminders", () => {
  beforeAll(() => setupTestDb());

  beforeEach(() => {
    resetTestDb();
    vi.mocked(sendMail).mockReset();
    vi.mocked(isMailerConfigured).mockReset().mockReturnValue(true);
    vi.stubEnv("SITE_URL", "https://site.example");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends every host exactly one heads-up", async () => {
    await twoHostSession();

    const summary = await dispatchDueReminders(HEADS_UP_AT);

    expect(summary.sent).toBe(2);
    expect(recipients()).toEqual([FIRST, SECOND].sort());
    expect(subjects()).toEqual([
      expect.stringMatching(/hosting/i),
      expect.stringMatching(/hosting/i),
    ]);
  });

  it("sends every host exactly one follow-up", async () => {
    await twoHostSession();

    const summary = await dispatchDueReminders(FOLLOW_UP_AT);

    expect(summary.sent).toBe(2);
    expect(recipients()).toEqual([FIRST, SECOND].sort());
    expect(subjects()).toEqual([
      expect.stringMatching(/how many people/i),
      expect.stringMatching(/how many people/i),
    ]);
  });

  it("sends nothing more on a second run with the times unchanged (FR-015, SC-003)", async () => {
    await twoHostSession();

    await dispatchDueReminders(HEADS_UP_AT);
    const second = await dispatchDueReminders(HEADS_UP_AT);

    expect(second.sent).toBe(0);
    expect(sendMail).toHaveBeenCalledTimes(2);
  });

  it("suppresses the follow-up once a count is recorded, but not the heads-up", async () => {
    const { session } = await twoHostSession();
    await getRepositories().sessions.setAttendeeCount(session.id, 12);

    expect((await dispatchDueReminders(HEADS_UP_AT)).sent).toBe(2);
    vi.mocked(sendMail).mockClear();

    expect((await dispatchDueReminders(FOLLOW_UP_AT)).sent).toBe(0);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("still notifies a host who turned the reminder emails off (FR-017)", async () => {
    const { session, second } = await twoHostSession();
    const { guests } = getRepositories();
    await guests.updateEmailSettings(second.id, {
      ...DEFAULT_EMAIL_SETTINGS,
      sessionHeadsUp: false,
      attendeeCountReminder: false,
    });

    await dispatchDueReminders(HEADS_UP_AT);
    await dispatchDueReminders(FOLLOW_UP_AT);

    // The setting silences the mail, not the reminder: both still reach them
    // in the app.
    expect(recipients()).toEqual([FIRST, FIRST]);
    expect(await reminderNotices(second.id)).toHaveLength(2);

    // The reminder is settled even though nothing was mailed — claimed, never
    // sent — so opting back in does not resurrect a mail at the same due
    // time. They are reminded again on the next reschedule, like anyone else.
    const row = storedReminder(session.id, second.id, "followUp");
    expect(row?.claimed_at).not.toBeNull();
    expect(row?.sent_at).toBeNull();

    vi.mocked(sendMail).mockClear();
    await guests.updateEmailSettings(second.id, DEFAULT_EMAIL_SETTINGS);
    await dispatchDueReminders(FOLLOW_UP_AT);
    expect(recipients()).toEqual([]);
  });

  it("gives each reminder its own email switch", async () => {
    const { second } = await twoHostSession();
    const { guests } = getRepositories();
    await guests.updateEmailSettings(second.id, {
      ...DEFAULT_EMAIL_SETTINGS,
      sessionHeadsUp: false,
    });

    await dispatchDueReminders(HEADS_UP_AT);
    expect(recipients()).toEqual([FIRST]);

    vi.mocked(sendMail).mockClear();
    await dispatchDueReminders(FOLLOW_UP_AT);
    expect(recipients()).toEqual([FIRST, SECOND]);

    expect(await reminderNotices(second.id)).toHaveLength(2);
  });

  it("notifies a host with no address on file, and mails only the reachable one", async () => {
    const withAddress = await createGuest({ email: "reachable@test.example" });
    const withoutAddress = await createGuest({ email: "" });
    await scheduledSession([withAddress.id, withoutAddress.id]);

    // `sent` counts reminders settled, not emails: the unreachable host's is
    // settled too, with nothing to mail.
    const summary = await dispatchDueReminders(HEADS_UP_AT);

    expect(summary.sent).toBe(2);
    expect(recipients()).toEqual(["reachable@test.example"]);
    expect(await reminderNotices(withoutAddress.id)).toHaveLength(1);
  });

  it("produces nothing for a session with no hosts", async () => {
    await scheduledSession([]);

    const summary = await dispatchDueReminders(HEADS_UP_AT);

    expect(summary.sent).toBe(0);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("still reminds both hosts when mail is unconfigured (FR-012, FR-021)", async () => {
    const { session, first, second } = await twoHostSession();
    vi.mocked(isMailerConfigured).mockReturnValue(false);
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    const summary = await dispatchDueReminders(HEADS_UP_AT);

    expect(sendMail).not.toHaveBeenCalled();
    expect(summary.notified).toBe(2);
    expect(await reminderNotices(first.id)).toHaveLength(1);
    expect(await reminderNotices(second.id)).toHaveLength(1);
    // An instance with no mail is not failing, so nothing is marked failed and
    // nothing is logged.
    expect(summary.failed).toBe(0);
    expect(storedReminder(session.id, first.id, "headsUp")?.sent_at).toBeNull();
    expect(logged).not.toHaveBeenCalled();

    // The reminder was delivered, so configuring mail later does not re-open
    // this due time. The next reschedule is what reminds them again.
    vi.mocked(isMailerConfigured).mockReturnValue(true);
    expect((await dispatchDueReminders(HEADS_UP_AT)).sent).toBe(0);

    await getRepositories().sessions.update(session.id, {
      startTime: later(START, 3),
      endTime: later(END, 3),
    });
    expect((await dispatchDueReminders(later(HEADS_UP_AT, 3))).sent).toBe(2);
    expect(recipients()).toEqual([FIRST, SECOND].sort());
  });

  it("discards a session's reminder rows when the session is deleted (FR-019)", async () => {
    const { session } = await twoHostSession();
    await dispatchDueReminders(HEADS_UP_AT);
    expect(reminderRowCount(session.id)).toBe(2);

    await getRepositories().sessions.delete(session.id);

    expect(reminderRowCount(session.id)).toBe(0);
  });

  it("lets only one of two overlapping claims win (FR-015)", async () => {
    const { session, first } = await twoHostSession();
    const { reminders } = getRepositories();
    const key = {
      sessionId: session.id,
      guestId: first.id,
      kind: "headsUp" as const,
    };

    expect(await reminders.claim(key, HEADS_UP_AT, HEADS_UP_AT)).toEqual({
      claimed: true,
      notifyOwed: true,
    });
    expect((await reminders.claim(key, HEADS_UP_AT, HEADS_UP_AT)).claimed).toBe(
      false
    );
  });

  // The primitive the duplicate rule rests on: the notification is owed once
  // per due time, and a re-armed mail retry against the same due time is not a
  // new due time.
  it("owes no second notification when a re-armed claim is retried (FR-016)", async () => {
    const { session, first } = await twoHostSession();
    const { reminders } = getRepositories();
    const key = {
      sessionId: session.id,
      guestId: first.id,
      kind: "headsUp" as const,
    };

    await reminders.claim(key, HEADS_UP_AT, HEADS_UP_AT);
    await reminders.markNotified(key, HEADS_UP_AT);
    await reminders.markFailed(key, HEADS_UP_AT, 24 * HOUR_MS);

    expect(await reminders.claim(key, HEADS_UP_AT, HEADS_UP_AT)).toEqual({
      claimed: true,
      notifyOwed: false,
    });
  });

  // sent_at means "an email went out for this due time" and nothing else, so
  // a reschedule has to leave it as empty as the reminder it re-arms —
  // otherwise the row claims a send the new slot never had.
  it("keeps no record of the mail sent for a superseded due time", async () => {
    const { session, first } = await twoHostSession();
    await dispatchDueReminders(FOLLOW_UP_AT);
    expect(
      storedReminder(session.id, first.id, "followUp")?.sent_at
    ).not.toBeNull();

    await getRepositories().sessions.update(session.id, {
      startTime: later(START, 3),
      endTime: later(END, 3),
    });
    vi.mocked(isMailerConfigured).mockReturnValue(false);
    await dispatchDueReminders(later(FOLLOW_UP_AT, 3));

    const stored = storedReminder(session.id, first.id, "followUp");
    expect(stored?.due_time).toBe(followUpDueTime(later(END, 3)).toISOString());
    expect(stored?.sent_at).toBeNull();
  });

  describe("the in-app notification", () => {
    it("reaches every host once, linking to the session (FR-022)", async () => {
      const { event, session, first, second } = await twoHostSession();

      const summary = await dispatchDueReminders(HEADS_UP_AT);

      expect(summary.notified).toBe(2);
      for (const host of [first, second]) {
        const [notice, ...rest] = await reminderNotices(host.id);
        expect(rest).toEqual([]);
        expect(notice.type).toBe("sessionHeadsUp");
        expect(notice.text).toContain("Fun Workshop");
        // A path, not an absolute URL: notifications must work on an instance
        // with no SITE_URL at all.
        expect(notice.url).toBe(`/${event.slug}?viewSession=${session.id}`);
      }
    });

    it("points the follow-up at the count field (FR-022)", async () => {
      const { event, session, first } = await twoHostSession();

      await dispatchDueReminders(FOLLOW_UP_AT);

      const [notice] = await reminderNotices(first.id);
      expect(notice.type).toBe("attendeeCountReminder");
      expect(notice.text).toContain("Fun Workshop");
      expect(notice.url).toBe(
        `/${event.slug}?viewSession=${session.id}&record=count`
      );
    });

    it("is not repeated by a second run at the same due time (FR-015)", async () => {
      const { first } = await twoHostSession();

      await dispatchDueReminders(HEADS_UP_AT);
      const second = await dispatchDueReminders(HEADS_UP_AT);

      expect(second.notified).toBe(0);
      expect(await reminderNotices(first.id)).toHaveLength(1);
    });

    it("is not repeated when the mail is retried (FR-016)", async () => {
      const { second } = await twoHostSession();
      vi.mocked(sendMail).mockImplementation(({ to }) =>
        to === SECOND
          ? Promise.reject(new Error("smtp is down"))
          : Promise.resolve()
      );
      await dispatchDueReminders(FOLLOW_UP_AT);
      expect(await reminderNotices(second.id)).toHaveLength(1);

      vi.mocked(sendMail).mockReset();
      await dispatchDueReminders(later(FOLLOW_UP_AT, 1));

      // The mail is attempted again; the notification they already have is
      // left alone.
      expect(recipients()).toEqual([SECOND]);
      expect(await reminderNotices(second.id)).toHaveLength(1);
    });

    it("is created again when the session is rescheduled (FR-024)", async () => {
      const { session, first } = await twoHostSession();
      await dispatchDueReminders(FOLLOW_UP_AT);

      await getRepositories().sessions.update(session.id, {
        startTime: later(START, 3),
        endTime: later(END, 3),
      });
      await dispatchDueReminders(later(FOLLOW_UP_AT, 3));

      expect(await reminderNotices(first.id)).toHaveLength(2);
    });

    it("survives an abandoned mail", async () => {
      const { second } = await twoHostSession();
      vi.mocked(sendMail).mockRejectedValue(new Error("smtp is down"));
      await dispatchDueReminders(FOLLOW_UP_AT);
      vi.spyOn(console, "error").mockImplementation(() => {});

      const summary = await dispatchDueReminders(later(FOLLOW_UP_AT, 25));

      expect(summary.abandoned).toBe(2);
      expect(await reminderNotices(second.id)).toHaveLength(1);
    });

    it("carries neither a recorded count nor an address (FR-022)", async () => {
      const { session, first, second } = await twoHostSession();
      await getRepositories().sessions.setAttendeeCount(session.id, 12);

      await dispatchDueReminders(HEADS_UP_AT);

      for (const host of [first, second]) {
        const [notice] = await reminderNotices(host.id);
        // Only the text could carry the number; the url is a fixed path shape
        // whose session id would match a bare "12" by accident.
        expect(notice.text).not.toContain("12");
        for (const rendered of [notice.text, notice.url]) {
          expect(rendered).not.toContain(FIRST);
          expect(rendered).not.toContain(SECOND);
        }
      }
    });
  });

  describe("when a send fails", () => {
    function failFor(address: string): void {
      vi.mocked(sendMail).mockImplementation(({ to }) =>
        to === address
          ? Promise.reject(new Error("smtp is down"))
          : Promise.resolve()
      );
    }

    it("still mails the other hosts and leaves the failed one eligible", async () => {
      await twoHostSession();
      failFor(SECOND);

      const summary = await dispatchDueReminders(FOLLOW_UP_AT);

      expect(summary.sent).toBe(1);
      expect(summary.failed).toBe(1);
      expect(recipients()).toEqual([FIRST, SECOND].sort());

      // The next run retries only the one that failed.
      vi.mocked(sendMail).mockReset();
      await dispatchDueReminders(later(FOLLOW_UP_AT, 1));
      expect(recipients()).toEqual([SECOND]);
    });

    it("retries a reminder whose first failure is under 24 hours old", async () => {
      await twoHostSession();
      failFor(SECOND);
      await dispatchDueReminders(FOLLOW_UP_AT);

      vi.mocked(sendMail).mockReset();
      const summary = await dispatchDueReminders(later(FOLLOW_UP_AT, 23));

      expect(summary.sent).toBe(1);
      expect(recipients()).toEqual([SECOND]);
    });

    it("abandons and logs one whose first failure is more than 24 hours old (FR-016)", async () => {
      const { session } = await twoHostSession();
      failFor(SECOND);
      await dispatchDueReminders(FOLLOW_UP_AT);

      const logged = vi.spyOn(console, "error").mockImplementation(() => {});
      const summary = await dispatchDueReminders(later(FOLLOW_UP_AT, 25));

      expect(summary.abandoned).toBe(1);
      const message = logged.mock.calls
        .map((call) => call.join(" "))
        .join("\n");
      expect(message).toContain(session.id);
      expect(message).toContain("followUp");
      // The recipient's address is personal data and must never reach a log.
      expect(message).not.toContain(SECOND);
      expect(message).not.toContain(FIRST);

      // Abandoned means abandoned: a working mail server does not revive it.
      vi.mocked(sendMail).mockReset();
      expect((await dispatchDueReminders(later(FOLLOW_UP_AT, 26))).sent).toBe(
        0
      );
    });
  });
});
