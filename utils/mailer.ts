import nodemailer, { type Transporter } from "nodemailer";

type Mailer = { transport: Transporter; from: string };

type MailerState = { configured: true; mailer: Mailer } | { configured: false };

// Singletons need to be assigned to globalThis, not simply module-level
// variables. See https://github.com/vercel/next.js/discussions/68572.
const g = globalThis as typeof globalThis & { __mailerState?: MailerState };

// Called on server startup so a half-configured mailer fails the boot instead
// of the first send.
export function initMailer(): void {
  const smtpUrl = process.env.SMTP_URL;
  const from = process.env.SMTP_FROM;
  if (!smtpUrl && !from) {
    console.warn("SMTP_URL is not set - email sending is disabled");
    g.__mailerState = { configured: false };
    return;
  }
  if (!from) {
    throw new Error("SMTP_FROM must be set when SMTP_URL is set");
  }
  if (!smtpUrl) {
    throw new Error("SMTP_URL must be set when SMTP_FROM is set");
  }
  g.__mailerState = {
    configured: true,
    mailer: {
      transport: nodemailer.createTransport(smtpUrl),
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

// Send an email. Requires `initMailer` to have been called first. If email
// sending is disabled, logs a warning, with no way for the caller to tell.
//
// Currently doesn't give access to most nodemailer message options, notably
// including html email.
export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const mailer = getMailer();
  if (!mailer) {
    console.warn(
      `SMTP_URL is not set - not sending email "${options.subject}" to ${options.to}`
    );
    return;
  }
  const { transport, from } = mailer;
  await transport.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
}
