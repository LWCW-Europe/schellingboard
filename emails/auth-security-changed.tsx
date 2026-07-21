import type { EmailMessage } from "@/utils/mailer";

// Sent when a protected guest's password changes or protection is turned
// off — a heads-up in case the guest didn't make the change themselves.
// Never sent for a guest's first-ever password (nothing to notify about),
// and never blocks the change it follows if sending fails.
export function authSecurityChangedEmail(props: {
  name: string;
  change: "disabled" | "password-changed";
}): EmailMessage {
  const subject =
    props.change === "disabled"
      ? "Your name protection was turned off"
      : "Your password was changed";
  return {
    subject,
    body: (
      <>
        <p>Hi {props.name},</p>
        <p>
          {props.change === "disabled"
            ? "Protection on your name was just turned off — anyone can now act under it until you protect it again."
            : "Your password was just changed."}
        </p>
        <p>
          If you didn&rsquo;t make this change, protect your name again (or set
          a new password) from Settings — an emailed code gets you back in even
          without the old password.
        </p>
      </>
    ),
  };
}
