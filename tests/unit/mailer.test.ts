import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const transportSendMail = vi.fn();

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: transportSendMail })),
  },
}));

import nodemailer from "nodemailer";
import {
  initMailer,
  resetMailer,
  sendMail,
  smtpTransportConfig,
} from "@/utils/mailer";

const MESSAGE = {
  to: "guest@test.example",
  subject: "Test email",
  text: "test email",
};

describe("smtpTransportConfig", () => {
  it("returns null when no SMTP variables are set", () => {
    expect(smtpTransportConfig({})).toBeNull();
  });

  it("treats empty strings as unset", () => {
    expect(
      smtpTransportConfig({ SMTP_URL: "", SMTP_HOST: "", SMTP_SECURE: "" })
    ).toBeNull();
    expect(
      smtpTransportConfig({ SMTP_URL: "smtp://localhost:1025", SMTP_HOST: "" })
    ).toEqual({ tag: "url", url: "smtp://localhost:1025" });
  });

  it("returns the URL when SMTP_URL is set", () => {
    expect(smtpTransportConfig({ SMTP_URL: "smtp://localhost:1025" })).toEqual({
      tag: "url",
      url: "smtp://localhost:1025",
    });
  });

  it("throws when SMTP_URL is combined with an individual setting", () => {
    expect(() =>
      smtpTransportConfig({ SMTP_URL: "smtp://x", SMTP_HOST: "mail.example" })
    ).toThrow("not both");
    expect(() =>
      smtpTransportConfig({ SMTP_URL: "smtp://x", SMTP_SECURE: "true" })
    ).toThrow("not both");
  });

  it("builds settings from SMTP_HOST alone, requiring TLS by default", () => {
    expect(smtpTransportConfig({ SMTP_HOST: "mail.example" })).toEqual({
      tag: "object",
      settings: { host: "mail.example", secure: false, requireTLS: true },
    });
  });

  it("builds settings from all individual variables", () => {
    expect(
      smtpTransportConfig({
        SMTP_HOST: "mail.example",
        SMTP_PORT: "2525",
        SMTP_USER: "mailer",
        SMTP_PASSWORD: "hunter2",
        SMTP_SECURE: "true",
      })
    ).toEqual({
      tag: "object",
      settings: {
        host: "mail.example",
        port: 2525,
        auth: { user: "mailer", pass: "hunter2" },
        secure: true,
      },
    });
  });

  it('maps SMTP_SECURE "true" to wrap SMTP inside TLS', () => {
    expect(
      smtpTransportConfig({ SMTP_HOST: "mail.example", SMTP_SECURE: "true" })
    ).toEqual({
      tag: "object",
      settings: { host: "mail.example", secure: true },
    });
  });

  it('maps SMTP_SECURE "false" to opportunistic TLS', () => {
    expect(
      smtpTransportConfig({ SMTP_HOST: "mail.example", SMTP_SECURE: "false" })
    ).toEqual({
      tag: "object",
      settings: { host: "mail.example", secure: false },
    });
  });

  it('maps SMTP_SECURE "requireTLS" to require upgrading to TLS', () => {
    expect(
      smtpTransportConfig({
        SMTP_HOST: "mail.example",
        SMTP_SECURE: "requireTLS",
      })
    ).toEqual({
      tag: "object",
      settings: { host: "mail.example", secure: false, requireTLS: true },
    });
  });

  it("throws when individual settings are given without SMTP_HOST", () => {
    expect(() => smtpTransportConfig({ SMTP_PORT: "2525" })).toThrow(
      "SMTP_HOST"
    );
  });

  it("throws on an invalid SMTP_SECURE", () => {
    expect(() =>
      smtpTransportConfig({ SMTP_HOST: "mail.example", SMTP_SECURE: "yes" })
    ).toThrow("SMTP_SECURE");
  });

  it("throws on a non-numeric SMTP_PORT", () => {
    expect(() =>
      smtpTransportConfig({ SMTP_HOST: "mail.example", SMTP_PORT: "smtp" })
    ).toThrow("SMTP_PORT");
  });
});

describe("mailer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMailer();
    vi.stubEnv("SMTP_URL", "smtp://localhost:1025");
    vi.stubEnv("SMTP_FROM", "SchellingBoard <noreply@test.example>");
    // Ensure individual SMTP_* variables from the developer's environment
    // don't leak into these tests.
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("SMTP_PORT", "");
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASSWORD", "");
    vi.stubEnv("SMTP_SECURE", "");
  });

  afterEach(() => vi.unstubAllEnvs());

  describe("initMailer", () => {
    it("throws when SMTP is configured but SMTP_FROM is not", () => {
      vi.stubEnv("SMTP_FROM", "");
      expect(() => initMailer()).toThrow("must be set");
    });

    it("throws when SMTP_FROM is set but SMTP_URL is not", () => {
      vi.stubEnv("SMTP_URL", "");
      expect(() => initMailer()).toThrow("must be set");
    });

    it("creates the transport using SMTP_URL", () => {
      initMailer();
      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        "smtp://localhost:1025"
      );
    });

    it("creates the transport using SMTP_HOST", () => {
      vi.stubEnv("SMTP_URL", "");
      vi.stubEnv("SMTP_HOST", "mail.example");
      initMailer();
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "mail.example",
        secure: false,
        requireTLS: true,
      });
    });

    it("creates the transport using SMTP_HOST and other variables", () => {
      vi.stubEnv("SMTP_URL", "");
      vi.stubEnv("SMTP_HOST", "mail.example");
      vi.stubEnv("SMTP_PORT", "123");
      vi.stubEnv("SMTP_USER", "user");
      vi.stubEnv("SMTP_PASSWORD", "pass");
      vi.stubEnv("SMTP_SECURE", "true");
      initMailer();
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "mail.example",
        port: 123,
        auth: {
          user: "user",
          pass: "pass",
        },
        secure: true,
      });
    });

    it("throws when SMTP_URL and SMTP_HOST are both set", () => {
      vi.stubEnv("SMTP_HOST", "mail.example");
      expect(() => initMailer()).toThrow("not both");
    });

    it("does not create a transport when SMTP is not configured (email disabled)", () => {
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
