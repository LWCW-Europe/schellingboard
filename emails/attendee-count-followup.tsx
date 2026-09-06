import type { EmailMessage } from "@/utils/mailer";

// Sent to each host fifteen minutes after their session ends. `recordUrl` is a
// plain deep link carrying no identity or token, like every other notification
// — a host on an unfamiliar browser selects their name first, exactly as with
// any other host-only control.
export function attendeeCountFollowUpEmail(props: {
  title: string;
  time: string;
  recordUrl: string;
}): EmailMessage {
  return {
    subject: `How many people came to "${props.title}"?`,
    body: (
      <>
        <h1>{props.title}</h1>
        <p>
          Your session finished at {props.time}. If you counted the room, record
          the number now &mdash; it only takes a moment, and only you and your
          co-hosts will ever see it.
        </p>
        <p>
          <a href={props.recordUrl}>Record the attendee count</a>
        </p>
        <p>
          It&rsquo;s optional, and you can come back and change it whenever you
          like.
        </p>
      </>
    ),
  };
}
