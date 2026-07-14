import type { EmailMessage } from "@/utils/mailer";
import { EmailMarkdown } from "@/emails/markdown";

// Sent to a guest when someone adds them as a co-host of a session (or
// creates a session listing them). Time and location come preformatted.
export function cohostAddedEmail(props: {
  title: string;
  description: string;
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
        {props.description && (
          <EmailMarkdown>{props.description}</EmailMarkdown>
        )}
        <p>
          <a href={props.sessionUrl}>View the session</a>
        </p>
      </>
    ),
  };
}
