import type { EmailMessage } from "@/utils/mailer";

/** How a pending 1-on-1 ended, from the point of view of the guest being told. */
export type MeetingOutcome = "accepted" | "declined" | "canceled";

// The one-line version, for the in-app notification. The time is what tells
// two requests from the same person apart, so it is always named.
export function meetingRequestNoticeText(
  requesterName: string,
  time: string
): string {
  return `${requesterName} asked you for a 1-on-1 on ${time}`;
}

export function meetingOutcomeNoticeText(
  actorName: string,
  outcome: MeetingOutcome,
  time: string
): string {
  return outcome === "canceled"
    ? `${actorName} canceled the 1-on-1 on ${time}`
    : `${actorName} ${outcome} your 1-on-1 request for ${time}`;
}

// Sent when someone asks the guest for a 1-on-1.
//
// The requester's line of context is deliberately left out, as comment text
// is: it is enough to say there is a request and link to it, and what guests
// write to each other need not go to their email providers.
export function meetingRequestEmail(props: {
  requesterName: string;
  time: string;
  meetingPoint: string;
  url: string;
}): EmailMessage {
  return {
    subject: `1-on-1 request from ${props.requesterName}`,
    body: (
      <>
        <h1>{props.requesterName} would like to meet you</h1>
        <p>
          <strong>When:</strong> {props.time}
        </p>
        <p>
          <strong>Where:</strong> {props.meetingPoint}
        </p>
        <p>
          <a href={props.url}>Accept or decline</a>
        </p>
      </>
    ),
  };
}

// Sent to the other party when a 1-on-1 is accepted, declined or canceled.
export function meetingOutcomeEmail(props: {
  actorName: string;
  outcome: MeetingOutcome;
  time: string;
  meetingPoint: string;
  url: string;
}): EmailMessage {
  const accepted = props.outcome === "accepted";
  return {
    subject: `1-on-1 ${props.outcome}: ${props.time}`,
    body: (
      <>
        <h1>
          {meetingOutcomeNoticeText(props.actorName, props.outcome, props.time)}
        </h1>
        {accepted && (
          <p>
            <strong>Where:</strong> {props.meetingPoint}
          </p>
        )}
        <p>
          <a href={props.url}>View the meeting</a>
        </p>
      </>
    ),
  };
}
