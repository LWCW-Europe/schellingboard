import type { EmailMessage } from "@/utils/mailer";
import { EmailMarkdown } from "@/emails/markdown";

/** What was commented on, and how to name it in the email. */
export type CommentSubject =
  | { kind: "proposal"; title: string }
  | { kind: "session"; title: string }
  | { kind: "profile"; ownerName: string };

/**
 * Who is being told: the guest responsible for the subject — a proposal's or
 * session's host, a profile's owner — or a guest who commented on it earlier.
 */
export type CommentRecipient = "responsible" | "commenter";

function heading(subject: CommentSubject, to: CommentRecipient): string {
  if (subject.kind !== "profile") {
    return subject.title;
  }
  return to === "responsible"
    ? "Your profile"
    : `${subject.ownerName}'s profile`;
}

function relation(subject: CommentSubject, to: CommentRecipient): string {
  if (subject.kind === "profile") {
    return to === "responsible" ? "your profile" : "a profile you commented on";
  }
  return to === "responsible"
    ? `a ${subject.kind} you're hosting`
    : `a ${subject.kind} you commented on`;
}

// Sent when someone comments on a proposal, a session or a profile. The body
// is the comment's markdown.
export function commentEmail(props: {
  subject: CommentSubject;
  recipient: CommentRecipient;
  commenterName: string;
  body: string;
  url: string;
}): EmailMessage {
  const title = heading(props.subject, props.recipient);
  return {
    subject:
      props.subject.kind === "profile" && props.recipient === "responsible"
        ? "New comment on your profile"
        : `New comment on: ${title}`,
    body: (
      <>
        <h1>{title}</h1>
        <p>
          {props.commenterName} commented on{" "}
          {relation(props.subject, props.recipient)}.
        </p>
        <EmailMarkdown>{props.body}</EmailMarkdown>
        <p>
          <a href={props.url}>View the comment</a>
        </p>
      </>
    ),
  };
}
