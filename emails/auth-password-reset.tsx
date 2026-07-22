import type { EmailMessage } from "@/utils/mailer";

// Sent when a guest asks to set or reset the password on their (protected)
// name — from "Enable protection" or "Forgot your password?". The link works
// once and grants no session: it only lets the recipient choose a new
// password, which they then log in with.
export function authPasswordResetEmail(props: {
  name: string;
  resetUrl: string;
  validMinutes: number;
}): EmailMessage {
  return {
    subject: "Set your password",
    body: (
      <>
        <p>Hi {props.name},</p>
        <p>
          Use this link to set a new password for your name. It works once and
          expires in {props.validMinutes} minutes:
        </p>
        <p>
          <a href={props.resetUrl}>Set your password</a>
        </p>
        <p>
          You&rsquo;ll then log in with the new password. If you didn&rsquo;t
          request this, you can safely ignore this email — nothing changes until
          the link is used.
        </p>
      </>
    ),
  };
}
