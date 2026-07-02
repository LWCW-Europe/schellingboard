import { describe, it, expect, beforeEach } from "vitest";
import { initMailer, resetMailer, sendMail } from "@/utils/mailer";

// Runs only when MAILPIT_API_URL points at a mailpit instance (e.g.
// http://localhost:8025 via `docker compose up mailpit`). SMTP_URL and
// SMTP_FROM come from the environment too; .env.test sets all three.
// Skips when MAILPIT_API_URL is unset or empty; fails when it is set but
// mailpit is unreachable.
const MAILPIT_API_URL = process.env.MAILPIT_API_URL ?? "";

type MessageSummary = {
  ID: string;
  From: { Address: string };
  To: { Address: string }[];
  Subject: string;
};

async function mailpitGet(path: string): Promise<unknown> {
  const res = await fetch(new URL(path, MAILPIT_API_URL));
  if (!res.ok) {
    throw new Error(`Mailpit API ${path} returned ${res.status}`);
  }
  return res.json();
}

async function searchBySubject(subject: string): Promise<MessageSummary[]> {
  const query = encodeURIComponent(`subject:"${subject}"`);
  const result = (await mailpitGet(`/api/v1/search?query=${query}`)) as {
    messages: MessageSummary[];
  };
  return result.messages;
}

describe.skipIf(!MAILPIT_API_URL)("sendMail via mailpit", () => {
  beforeEach(() => {
    resetMailer();
    initMailer();
    console.warn(
      "This test fails if you don't have Mailpit running. If you want to skip the test instead of running Mailpit, set `MAILPIT_API_URL=''`."
    );
  });

  it("delivers an email that mailpit receives", async () => {
    // Unique subject so the test finds its own message without wiping the
    // mailbox, which may hold a developer's other mail.
    const subject = `Integration test ${Date.now()}`;
    await sendMail({
      to: "recipient@test.example",
      subject,
      text: "test email body",
    });

    // The SMTP transaction is complete, but allow mailpit a moment to index.
    await expect
      .poll(() => searchBySubject(subject), {
        timeout: 1000 /* milliseconds */,
      })
      .toHaveLength(1);

    const [summary] = await searchBySubject(subject);
    expect(summary.From.Address).toBe(process.env.SMTP_FROM);
    expect(summary.To).toEqual([
      expect.objectContaining({ Address: "recipient@test.example" }),
    ]);

    const message = (await mailpitGet(`/api/v1/message/${summary.ID}`)) as {
      Text: string;
    };
    expect(message.Text.trim()).toBe("test email body");
  });
});
