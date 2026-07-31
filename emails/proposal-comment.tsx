import type { EmailMessage } from "@/utils/mailer";
import { EmailMarkdown } from "@/emails/markdown";

// Sent when someone comments on a proposal, either to one of its hosts or to
// a guest who commented on it earlier. The body is the comment's markdown.
export function proposalCommentEmail(props: {
  recipient: "host" | "commenter";
  proposalTitle: string;
  commenterName: string;
  body: string;
  url: string;
}): EmailMessage {
  return {
    subject: `New comment on: ${props.proposalTitle}`,
    body: (
      <>
        <h1>{props.proposalTitle}</h1>
        <p>
          {props.commenterName} commented on{" "}
          {props.recipient === "host" ? (
            <>a proposal you&rsquo;re hosting</>
          ) : (
            <>a proposal you commented on</>
          )}
          .
        </p>
        <EmailMarkdown>{props.body}</EmailMarkdown>
        <p>
          <a href={props.url}>View the comment</a>
        </p>
      </>
    ),
  };
}
