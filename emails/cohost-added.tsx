import type { EmailMessage } from "@/utils/mailer";

// Sent to a guest when someone adds them as a co-host of a session (or
// creates a session listing them). Time and location come preformatted.
//
// The session's description is deliberately left out: it is not what the
// notification is about, and there is no reason to hand it to the recipient's
// email provider.
export function cohostAddedEmail(props: {
  title: string;
  time: string;
  location: string;
  sessionUrl: string;
}): EmailMessage {
  return {
    subject: `You are now a co-host of: ${props.title}`,
    body: (
      <>
        <h1>{props.title}</h1>
        <p>You&rsquo;ve been added as a co-host of this session.</p>
        <p>
          <strong>Time:</strong> {props.time}
        </p>
        <p>
          <strong>Location:</strong> {props.location}
        </p>
        <p>
          <a href={props.sessionUrl}>View the session</a>
        </p>
      </>
    ),
  };
}
