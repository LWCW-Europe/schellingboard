import type { EmailMessage } from "@/utils/mailer";

// Sent to each host an hour before their session's displayed start. It does
// double duty (FR-009): the reminder that they are hosting shortly, and the
// ask to count the room while they are in it. Time comes preformatted in the
// event's zone.
export function attendeeCountHeadsUpEmail(props: {
  title: string;
  time: string;
  location: string;
  sessionUrl: string;
}): EmailMessage {
  return {
    subject: `You're hosting "${props.title}" shortly`,
    body: (
      <>
        <h1>{props.title}</h1>
        <p>You&rsquo;re hosting this session in about an hour.</p>
        <p>
          <strong>Time:</strong> {props.time}
        </p>
        <p>
          <strong>Location:</strong> {props.location}
        </p>
        <p>
          While you&rsquo;re there, please count how many people attend. Once
          the session has finished you&rsquo;ll be able to record the number,
          and we&rsquo;ll email you a link when it&rsquo;s time.
        </p>
        <p>
          <a href={props.sessionUrl}>View the session</a>
        </p>
      </>
    ),
  };
}
