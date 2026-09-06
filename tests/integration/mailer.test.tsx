import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { initMailer, resetMailer, sendMail } from "@/utils/mailer";
import {
  getMessage,
  searchBySubject,
  skipWithoutMailpit,
} from "../helpers/mailpit";
import { setupTestDb, resetTestDb } from "../helpers/db";
import { createEvent, createGuest, createLocation } from "../helpers/factories";
import { getRepositories } from "@/db/container";
import { dispatchDueReminders } from "@/utils/reminder-dispatch";

// This suite runs only when MAILPIT_API_URL points at a mailpit instance
// (start one with `make mailpit`, see docs/dev/testing.md § Running tests). Skips
// when MAILPIT_API_URL is unset (throws instead in CI); fails when it's set
// but mailpit is unreachable.
describe.skipIf(skipWithoutMailpit())("sendMail via mailpit", () => {
  beforeEach(() => {
    // Fix the sender rather than using the environment's SMTP_FROM, whose
    // format (bare address or `Name <address>`) the assertions would
    // otherwise depend on.
    vi.stubEnv("SMTP_FROM", "Test Sender <sender@test.example>");
    resetMailer();
    initMailer();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("delivers an email that mailpit receives", async () => {
    // Unique subject so the test finds its own message without wiping the
    // mailbox, which may hold a developer's other mail.
    const subject = `Integration test ${Date.now()}`;
    await sendMail({
      to: "recipient@test.example",
      subject,
      body: (
        <>
          <p>test body line 1</p>
          <p>line 2</p>
        </>
      ),
    });

    // The SMTP transaction is complete, but allow mailpit a moment to index.
    await expect
      .poll(() => searchBySubject(subject), {
        timeout: 1000 /* milliseconds */,
      })
      .toHaveLength(1);

    const [summary] = await searchBySubject(subject);
    expect(summary.From).toMatchObject({
      Name: "Test Sender",
      Address: "sender@test.example",
    });
    expect(summary.To).toEqual([
      expect.objectContaining({ Address: "recipient@test.example" }),
    ]);

    const message = await getMessage(summary.ID);

    // Check that both the html and the derived text parts arrive. This assumes
    // the HTML isn't formatted too much. For text, note that SMTP encodes
    // newlines as \r\n.
    expect(message.HTML).toContain("<p>test body line 1</p>");
    expect(message.HTML).toContain("<p>line 2</p>");
    expect(message.Text.trim()).toBe("test body line 1\r\n\r\nline 2");
  });
});

// The event runs in Berlin (UTC+2 on this date) while the process may not, so
// every asserted time doubles as an FR-018 check: an ambient-zone bug would
// print 10:10 instead of 12:10.
describe.skipIf(skipWithoutMailpit())(
  "attendee-count reminders via mailpit",
  () => {
    const START = new Date("2026-09-01T10:00:00Z"); // displayed 12:10 in Berlin
    const END = new Date("2026-09-01T11:00:00Z"); // 13:00 in Berlin
    const HEADS_UP_AT = new Date("2026-09-01T09:10:00Z");
    const FOLLOW_UP_AT = new Date("2026-09-01T11:15:00Z");

    beforeAll(() => setupTestDb());

    beforeEach(() => {
      resetTestDb();
      vi.stubEnv("SMTP_FROM", "Test Sender <sender@test.example>");
      vi.stubEnv("SITE_URL", "https://site.example");
      resetMailer();
      initMailer();
    });

    afterEach(() => vi.unstubAllEnvs());

    // A unique title so each run finds its own message without wiping a mailbox
    // that may hold a developer's other mail.
    async function berlinSession(title: string) {
      const event = await createEvent({ phase: "scheduling" });
      await getRepositories().events.update(event.id, {
        timezone: "Europe/Berlin",
      });
      const room = await createLocation({ name: "The Big Tent" });
      const host = await createGuest({ email: "host@test.example" });
      const session = await getRepositories().sessions.create({
        title,
        description: "",
        startTime: START,
        endTime: END,
        capacity: 30,
        adminManaged: false,
        blocker: false,
        closed: false,
        eventId: event.id,
        hostIds: [host.id],
        locationIds: [room.id],
      });
      const slug = (await getRepositories().events.findById(event.id))!.slug;
      return { session, slug };
    }

    // Searched by the unique title alone: both subjects quote the title, and
    // mailpit's `subject:"…"` query cannot carry nested quotes.
    async function receive(title: string, subject: string) {
      await expect
        .poll(() => searchBySubject(title), { timeout: 2000 })
        .toHaveLength(1);
      const [summary] = await searchBySubject(title);
      expect(summary.Subject).toBe(subject);
      expect(summary.To).toEqual([
        expect.objectContaining({ Address: "host@test.example" }),
      ]);
      return getMessage(summary.ID);
    }

    it("delivers a heads-up naming the start time and location in the event's zone", async () => {
      const title = `Heads-up session ${Date.now()}`;
      await berlinSession(title);

      await dispatchDueReminders(HEADS_UP_AT);

      const message = await receive(title, `You're hosting "${title}" shortly`);
      expect(message.HTML).toContain("12:10");
      expect(message.HTML).not.toContain("10:10");
      expect(message.HTML).toContain("The Big Tent");
    });

    it("delivers a follow-up carrying the record link", async () => {
      const title = `Follow-up session ${Date.now()}`;
      const { session, slug } = await berlinSession(title);

      await dispatchDueReminders(FOLLOW_UP_AT);

      const message = await receive(
        title,
        `How many people came to "${title}"?`
      );
      expect(message.HTML).toContain(
        `https://site.example/${slug}?viewSession=${session.id}&amp;record=count`
      );
      expect(message.HTML).toContain("13:00");
      expect(message.HTML).not.toContain("11:00");
    });
  }
);
