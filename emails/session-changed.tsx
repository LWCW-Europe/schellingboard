import type { EmailMessage } from "@/utils/mailer";

// Sent to hosts and RSVP'd guests when a session changes time and/or
// location. Times and locations come preformatted; the old value is given
// only for what actually changed.
export function sessionChangedEmail(props: {
  recipient: "host" | "attendee";
  title: string;
  description: string;
  newTime: string;
  oldTime?: string;
  newLocation: string;
  oldLocation?: string;
}): EmailMessage {
  const changed =
    props.oldTime && props.oldLocation
      ? "time and location"
      : props.oldTime
        ? "time"
        : "location";
  return {
    subject: `Session ${changed} changed: ${props.title}`,
    body: (
      <>
        <h1>{props.title}</h1>
        <p>
          {props.recipient === "host" ? (
            <>A session you&rsquo;re hosting</>
          ) : (
            <>A session you RSVP&rsquo;d to</>
          )}{" "}
          has changed {changed}.
        </p>
        <p>
          <strong>Time:</strong> {props.newTime}
          {props.oldTime && <> (was {props.oldTime})</>}
        </p>
        <p>
          <strong>Location:</strong> {props.newLocation}
          {props.oldLocation && <> (was {props.oldLocation})</>}
        </p>
        {props.description && <p>{props.description}</p>}
      </>
    ),
  };
}
