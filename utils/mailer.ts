import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import TurndownService from "turndown";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

const turndown = new TurndownService();

type Mailer = { transport: Transporter; from: string };

export type SmtpTransportConfig =
  | { tag: "url"; url: string }
  | { tag: "object"; settings: SMTPTransport.Options };

// Decides how the SMTP transport should be created from the environment:
// from a connection URL (SMTP_URL) or from individual settings (SMTP_HOST/
// PORT/USER/PASSWORD/SECURE). Returns null when neither is configured.
// Empty strings are treated as unset.
export function smtpTransportConfig(env: {
  SMTP_URL?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  SMTP_SECURE?: string;
}): SmtpTransportConfig | null {
  const url = env.SMTP_URL || undefined;
  const host = env.SMTP_HOST || undefined;
  const port = env.SMTP_PORT || undefined;
  const user = env.SMTP_USER || undefined;
  const password = env.SMTP_PASSWORD || undefined;
  const secure = env.SMTP_SECURE || undefined;

  const hasIndividualSettings =
    host !== undefined ||
    port !== undefined ||
    user !== undefined ||
    password !== undefined ||
    secure !== undefined;

  if (url && hasIndividualSettings) {
    throw new Error(
      "Set either SMTP_URL or SMTP_HOST/PORT/USER/PASSWORD/SECURE, not both"
    );
  }
  if (url) return { tag: "url", url };
  if (!hasIndividualSettings) return null;
  if (!host) {
    throw new Error(
      "SMTP_HOST must be set when SMTP_PORT, SMTP_USER, SMTP_PASSWORD, or SMTP_SECURE is set"
    );
  }

  const settings: SMTPTransport.Options = { host };
  if (port !== undefined) {
    const parsed = Number(port);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error(`SMTP_PORT must be a positive integer, got "${port}"`);
    }
    settings.port = parsed;
  }
  if (user !== undefined || password !== undefined) {
    settings.auth = { user: user ?? "", pass: password ?? "" };
  }
  switch (secure ?? "requireTLS") {
    case "true":
      settings.secure = true;
      break;
    case "false":
      settings.secure = false;
      break;
    case "requireTLS":
      settings.secure = false;
      settings.requireTLS = true;
      break;
    default:
      throw new Error(
        `SMTP_SECURE must be "true", "false" or "requireTLS", got "${secure}"`
      );
  }
  return { tag: "object", settings };
}

type MailerState = { configured: true; mailer: Mailer } | { configured: false };

// Singletons need to be assigned to globalThis, not simply module-level
// variables. See https://github.com/vercel/next.js/discussions/68572.
const g = globalThis as typeof globalThis & { __mailerState?: MailerState };

// Called on server startup so a half-configured mailer fails the boot instead
// of the first send.
export function initMailer(): void {
  const transportConfig = smtpTransportConfig({
    SMTP_URL: process.env.SMTP_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_SECURE: process.env.SMTP_SECURE,
  });
  const from = process.env.SMTP_FROM;
  if (!transportConfig && !from) {
    console.warn("SMTP is not configured - email sending is disabled");
    g.__mailerState = { configured: false };
    return;
  }
  if (!from) {
    throw new Error("SMTP_FROM must be set when SMTP is configured");
  }
  if (!transportConfig) {
    throw new Error("SMTP_URL or SMTP_HOST must be set when SMTP_FROM is set");
  }
  g.__mailerState = {
    configured: true,
    mailer: {
      transport: nodemailer.createTransport(
        transportConfig.tag === "url"
          ? transportConfig.url
          : transportConfig.settings
      ),
      from,
    },
  };
}

// For tests only.
export function resetMailer(): void {
  delete g.__mailerState;
}

function getMailer(): Mailer | null {
  const state = g.__mailerState;
  if (!state) {
    throw new Error("Mailer has not been initialized");
  }
  return state.configured ? state.mailer : null;
}

// What the factories in `emails/` return: everything an email needs except
// the recipient.
export type EmailMessage = {
  subject: string;
  body: ReactElement;
};

// Send an email. Requires `initMailer` to have been called first. If email
// sending is disabled, logs a warning, with no way for the caller to tell.
//
// The body is given as a React element (see `emails/`) so that interpolated
// values are escaped by React rather than concatenated into markup. It is
// rendered to html, and a plain-text version (markdown) is derived from that
// and sent alongside. Links must be absolute; relative links are passed
// through as-is, which mail clients can't resolve.
export async function sendMail(
  options: { to: string } & EmailMessage
): Promise<void> {
  const mailer = getMailer();
  if (!mailer) {
    // Don't include details of the email, to avoid putting PII in logs.
    console.warn("SMTP is not configured - not sending email");
    return;
  }
  const { transport, from } = mailer;
  const html = await render(options.body, { pretty: true });
  await transport.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html,
    text: turndown.turndown(html),
  });
}
