import type { EmailMessage } from "@/utils/mailer";

// Sent when a guest requests a temporary login code — to switch to their
// (protected) name on some device, or to confirm a change to their account
// security settings. The code is shown big enough to copy onto another
// device; the link logs in directly on the device the email is opened on.
export function authCodeEmail(props: {
  name: string;
  code: string;
  loginUrl: string;
  validMinutes: number;
}): EmailMessage {
  return {
    subject: "Your temporary login code",
    body: (
      <>
        <p>Hi {props.name},</p>
        <p>Your temporary login code is:</p>
        <p style={{ fontSize: "28px", letterSpacing: "4px" }}>
          <strong>{props.code}</strong>
        </p>
        <p>
          It works for {props.validMinutes} minutes — type it on the device
          where you are logging in or changing your account security settings,
          or log in here directly:
        </p>
        <p>
          <a href={props.loginUrl}>Log in as {props.name}</a>
        </p>
        <p>
          If you didn&rsquo;t request this code, you can safely ignore this
          email.
        </p>
      </>
    ),
  };
}
