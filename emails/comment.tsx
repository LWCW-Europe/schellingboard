import type { EmailMessage } from "@/utils/mailer";

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

// The one-line version, for the in-app notification. Names the thing rather
// than the relation ("a session you're hosting"): in a list of notifications
// the title is what tells them apart.
export function commentNoticeText(
  subject: CommentSubject,
  to: CommentRecipient,
  commenterName: string
): string {
  if (subject.kind === "profile") {
    return to === "responsible"
      ? `${commenterName} commented on your profile`
      : `${commenterName} commented on ${subject.ownerName}'s profile`;
  }
  return `${commenterName} commented on "${subject.title}"`;
}

// Sent when someone comments on a proposal, a session or a profile.
//
// The comment's text is deliberately left out: it is enough to say that there
// is one and link to it, and there is no reason to hand what guests write to
// each other to their email providers.
export function commentEmail(props: {
  subject: CommentSubject;
  recipient: CommentRecipient;
  commenterName: string;
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
        <p>
          <a href={props.url}>View the comment</a>
        </p>
      </>
    ),
  };
}
