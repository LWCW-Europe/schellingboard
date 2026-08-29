import type { EmailMessage } from "@/utils/mailer";

// Sent to hosts and RSVP'd guests when a session is deleted. Time and
// location come preformatted, and describe the session as it was; the link
// goes to the schedule, since the session itself is gone.
//
// The session's description is deliberately left out: it is not what the
// notification is about, and there is no reason to hand it to the recipient's
// email provider.
export function sessionDeletedEmail(props: {
  recipient: "host" | "attendee";
  title: string;
  time: string;
  location: string;
  eventUrl: string;
}): EmailMessage {
  return {
    subject: `Session deleted: ${props.title}`,
    body: (
      <>
        <h1>{props.title}</h1>
        <p>
          {props.recipient === "host" ? (
            <>A session you&rsquo;re hosting</>
          ) : (
            <>A session you RSVP&rsquo;d to</>
          )}{" "}
          has been deleted.
        </p>
        <p>
          <strong>Time:</strong> {props.time}
        </p>
        <p>
          <strong>Location:</strong> {props.location}
        </p>
        <p>
          <a href={props.eventUrl}>View the schedule</a>
        </p>
      </>
    ),
  };
}
