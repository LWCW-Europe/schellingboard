import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";

vi.mock("@/utils/mailer", () => ({
  sendMail: vi.fn(),
}));

import { setupTestDb, resetTestDb } from "../helpers/db";
import { createGuest } from "../helpers/factories";
import { sendMail } from "@/utils/mailer";
import { notifyGuest } from "@/utils/notifications";

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
