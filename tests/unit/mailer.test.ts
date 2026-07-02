import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const transportSendMail = vi.fn();

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: transportSendMail })),
  },
}));

import nodemailer from "nodemailer";
import { initMailer, resetMailer, sendMail } from "@/utils/mailer";

const MESSAGE = {
  to: "guest@test.example",
  subject: "Test email",
  text: "test email",
};

describe("mailer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMailer();
    vi.stubEnv("SMTP_URL", "smtp://localhost:1025");
    vi.stubEnv("SMTP_FROM", "SchellingBoard <noreply@test.example>");
  });

  afterEach(() => vi.unstubAllEnvs());

  describe("initMailer", () => {
    it("throws when SMTP_URL is set but SMTP_FROM is not", () => {
      vi.stubEnv("SMTP_FROM", "");
      expect(() => initMailer()).toThrow(
        "SMTP_FROM must be set when SMTP_URL is set"
      );
    });

    it("throws when SMTP_FROM is set but SMTP_URL is not", () => {
      vi.stubEnv("SMTP_URL", "");
      expect(() => initMailer()).toThrow(
        "SMTP_URL must be set when SMTP_FROM is set"
      );
    });

    it("creates the transport using SMTP_URL", () => {
      initMailer();
      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        "smtp://localhost:1025"
      );
    });

    it("does not create a transport when SMTP_URL is not set (email disabled)", () => {
      vi.stubEnv("SMTP_URL", "");
      vi.stubEnv("SMTP_FROM", "");
      expect(() => initMailer()).not.toThrow();
      expect(nodemailer.createTransport).not.toHaveBeenCalled();
    });
  });

  describe("sendMail", () => {
    it("throws when the mailer has not been initialized", async () => {
      await expect(sendMail(MESSAGE)).rejects.toThrow(
        "Mailer has not been initialized"
      );
      expect(transportSendMail).not.toHaveBeenCalled();
    });

    it("does nothing when email sending is disabled", async () => {
      vi.stubEnv("SMTP_URL", "");
      vi.stubEnv("SMTP_FROM", "");
      initMailer();
      await expect(sendMail(MESSAGE)).resolves.toBeUndefined();
      expect(transportSendMail).not.toHaveBeenCalled();
    });

    it("reuses the transport created at init across sends", async () => {
      initMailer();
      await sendMail(MESSAGE);
      await sendMail(MESSAGE);
      expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
      expect(transportSendMail).toHaveBeenCalledTimes(2);
      expect(transportSendMail).toHaveBeenCalledWith(
        expect.objectContaining(MESSAGE)
      );
    });

    it("uses the SMTP_FROM captured at init as the sender", async () => {
      vi.stubEnv("SMTP_FROM", "Events Team <events@test.example>");
      initMailer();
      vi.stubEnv("SMTP_FROM", "changed-later@test.example");
      await sendMail(MESSAGE);
      expect(transportSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ from: "Events Team <events@test.example>" })
      );
    });
  });
});
