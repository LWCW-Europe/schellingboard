import { DateTime } from "luxon";
import { getRepositories } from "@/db/container";
import type {
  Comment,
  EmailSettings,
  Session,
} from "@/db/repositories/interfaces";
import { sendMail, type EmailMessage } from "@/utils/mailer";
import { siteUrl } from "@/utils/site-url";
import { sessionChangedEmail } from "@/emails/session-changed";
import { sessionDeletedEmail } from "@/emails/session-deleted";
import { cohostAddedEmail } from "@/emails/cohost-added";
import {
  type CommentSubject,
  commentEmail,
  commentNoticeText,
} from "@/emails/comment";
import { getStartTimePlusBreak } from "@/utils/utils";

// One line in the past tense, where it happened, and when — `at` comes from
// the caller's clock so the dev fake clock reaches these rows like every other
// timestamp (ADR 0004).
export type InAppNotice = { text: string; url: string; at: Date };

// Tell the guest that something happened, on both channels: an in-app
// notification always, and `message` by email iff they have opted in for
// `setting` (see EmailSettings). Opting out of the mail is a request not to be
// interrupted outside the app, not a request to be uninformed inside it.
//
// The in-app row is written first, so a mail that fails to send doesn't take
// the notification with it.
//
// An unknown guest id is a no-op rather than an error: notifications are sent
// after the triggering change is committed, by which time the guest may have
// been deleted.
export async function notifyGuest(
  guestId: string,
  setting: keyof EmailSettings,
  message: EmailMessage,
  inApp: InAppNotice
): Promise<void> {
  const { guests, notifications } = getRepositories();
  const guest = await guests.findById(guestId);
  if (!guest) return;

  await notifications.create({
    guestId,
    type: setting,
    text: inApp.text,
    url: inApp.url,
    createdAt: inApp.at,
  });

  if (!guest.info.emailSettings[setting]) return;
  // Without a base URL an email can only carry dead links. SITE_URL is
  // required wherever SMTP is configured, so this drops nothing that could
  // have been delivered — the in-app notification above is what such an
  // instance runs on.
  if (siteUrl() === null) return;
  await sendMail({ to: guest.info.email, ...message });
}

async function tryNotifyGuest(
  guestId: string,
  setting: keyof EmailSettings,
  message: EmailMessage,
  inApp: InAppNotice
): Promise<void> {
  try {
    await notifyGuest(guestId, setting, message, inApp);
  } catch (err) {
    console.error(`Failed to notify guest ${guestId}:`, err);
  }
}

// Email the session's hosts and RSVP'd guests (who have opted in) about the
// session's time and/or location change, telling them the old value of
// whatever changed. A no-op when neither changed. The guest who made the
// change (`changedById`; null when unknown or not a guest, e.g. an admin) is
// not told about their own edit.
//
// Never throws: any failure (including a bad SITE_URL, or a lookup error) is
// logged and must not break the session update it trails, nor the sends to
// the other guests.
export async function notifySessionChanged(args: {
  before: Session;
  after: Session;
  changedById: string | null;
  now: Date;
}): Promise<void> {
  try {
    await notifySessionChangedUnsafe(args);
  } catch (err) {
    console.error("Failed to send session-changed notifications:", err);
  }
}

async function notifySessionChangedUnsafe({
  before,
  after,
  changedById,
  now,
}: {
  before: Session;
  after: Session;
  changedById: string | null;
  now: Date;
}): Promise<void> {
  const timeChanged =
    before.startTime?.getTime() !== after.startTime?.getTime() ||
    before.endTime?.getTime() !== after.endTime?.getTime();
  const locationChanged = !sameLocations(before.locations, after.locations);
  if (!timeChanged && !locationChanged) return;

  const { events, rsvps } = getRepositories();
  const event = await events.findById(after.eventId);
  if (!event) return;

  const path = sessionPath(event.slug, after.id);
  const messageProps = {
    sessionUrl: emailBase() + path,
    title: after.title,
    newTime: formatSessionTime(after, event.timezone, event.breakMinutes),
    oldTime: timeChanged
      ? formatSessionTime(before, event.timezone, event.breakMinutes)
      : undefined,
    newLocation: formatLocations(after),
    oldLocation: locationChanged ? formatLocations(before) : undefined,
  };
  const hostMessage = sessionChangedEmail({
    ...messageProps,
    recipient: "host",
  });
  const attendeeMessage = sessionChangedEmail({
    ...messageProps,
    recipient: "attendee",
  });
  const what = changeSummary(messageProps.newTime, messageProps.newLocation, {
    timeChanged,
    locationChanged,
  });
  await notifySessionRecipients({
    hostIds: after.hosts.map((host) => host.id),
    rsvpGuestIds: (await rsvps.listBySession(after.id)).map(
      (rsvp) => rsvp.guestId
    ),
    changedById,
    hostMessage,
    attendeeMessage,
    hostInApp: {
      text: `Your session "${after.title}" ${what}`,
      url: path,
      at: now,
    },
    attendeeInApp: { text: `"${after.title}" ${what}`, url: path, at: now },
  });
}

// What to say happened, given only what actually changed.
function changeSummary(
  newTime: string,
  newLocation: string,
  changed: { timeChanged: boolean; locationChanged: boolean }
): string {
  if (changed.timeChanged && changed.locationChanged) {
    return `is now ${newTime}, ${newLocation}`;
  }
  return changed.timeChanged
    ? `moved to ${newTime}`
    : `moved to ${newLocation}`;
}

// The guests to tell about a session's deletion, to be called *before*
// deleting it: the delete cascades to its RSVP rows, so afterwards there is
// nobody left to look up. Pass the result to notifySessionDeleted.
//
// Never throws: failing to find the recipients must not fail the deletion.
export async function rsvpGuestIdsToNotify(
  sessionId: string
): Promise<string[]> {
  try {
    const rsvps = await getRepositories().rsvps.listBySession(sessionId);
    return rsvps.map((rsvp) => rsvp.guestId);
  } catch (err) {
    console.error(
      `Failed to load deletion notification recipients for session ${sessionId}:`,
      err
    );
    return [];
  }
}

// Email the session's hosts and RSVP'd guests (who have opted in) after a
// deletion. `rsvpGuestIds` comes from rsvpGuestIdsToNotify, called before the
// deletion.
//
// Never throws: notification failures must not make a successful deletion
// look unsuccessful.
export async function notifySessionDeleted(args: {
  session: Session;
  rsvpGuestIds: string[];
  changedById: string | null;
  now: Date;
}): Promise<void> {
  try {
    await notifySessionDeletedUnsafe(args);
  } catch (err) {
    console.error("Failed to send session-deleted notifications:", err);
  }
}

async function notifySessionDeletedUnsafe({
  session,
  rsvpGuestIds,
  changedById,
  now,
}: {
  session: Session;
  rsvpGuestIds: string[];
  changedById: string | null;
  now: Date;
}): Promise<void> {
  const event = await getRepositories().events.findById(session.eventId);
  if (!event) return;

  const eventPath = `/${event.slug}`;
  const messageProps = {
    title: session.title,
    time: formatSessionTime(session, event.timezone, event.breakMinutes),
    location: formatLocations(session),
    eventUrl: emailBase() + eventPath,
  };

  await notifySessionRecipients({
    hostIds: session.hosts.map((host) => host.id),
    rsvpGuestIds,
    changedById,
    hostMessage: sessionDeletedEmail({
      ...messageProps,
      recipient: "host",
    }),
    attendeeMessage: sessionDeletedEmail({
      ...messageProps,
      recipient: "attendee",
    }),
    // The session is gone, so the link can only be the event it was at.
    hostInApp: {
      text: `Your session "${session.title}" was deleted`,
      url: eventPath,
      at: now,
    },
    attendeeInApp: {
      text: `"${session.title}" was deleted`,
      url: eventPath,
      at: now,
    },
  });
}

async function notifySessionRecipients({
  hostIds,
  rsvpGuestIds,
  changedById,
  hostMessage,
  attendeeMessage,
  hostInApp,
  attendeeInApp,
}: {
  hostIds: string[];
  rsvpGuestIds: string[];
  changedById: string | null;
  hostMessage: EmailMessage;
  attendeeMessage: EmailMessage;
  hostInApp: InAppNotice;
  attendeeInApp: InAppNotice;
}): Promise<void> {
  // Guards against telling anyone twice (or the editor at all), should a
  // guest ever be both host and RSVP'd.
  const done = new Set(changedById === null ? [] : [changedById]);

  for (const hostId of hostIds) {
    if (done.has(hostId)) continue;
    done.add(hostId);
    await tryNotifyGuest(hostId, "hostChange", hostMessage, hostInApp);
  }
  for (const guestId of rsvpGuestIds) {
    if (done.has(guestId)) continue;
    done.add(guestId);
    await tryNotifyGuest(guestId, "rsvpChange", attendeeMessage, attendeeInApp);
  }
}

// Email the guests newly added as co-hosts of the session (who have opted
// in). `previousHostIds` are the session's hosts from before the change —
// empty for a freshly created session. The guest who made the change
// (`changedById`; null when unknown or not a guest) isn't emailed about
// adding themselves.
//
// Never throws: any failure (including a bad SITE_URL, or a lookup error) is
// logged and must not break the change it trails, nor the sends to the other
// guests.
export async function notifyCohostsAdded(args: {
  session: Session;
  previousHostIds: string[];
  changedById: string | null;
  now: Date;
}): Promise<void> {
  try {
    await notifyCohostsAddedUnsafe(args);
  } catch (err) {
    console.error("Failed to send co-host-added notifications:", err);
  }
}

async function notifyCohostsAddedUnsafe({
  session,
  previousHostIds,
  changedById,
  now,
}: {
  session: Session;
  previousHostIds: string[];
  changedById: string | null;
  now: Date;
}): Promise<void> {
  const previous = new Set(previousHostIds);
  const added = session.hosts.filter(
    (h) => !previous.has(h.id) && h.id !== changedById
  );
  if (added.length === 0) return;

  const event = await getRepositories().events.findById(session.eventId);
  if (!event) return;

  const path = sessionPath(event.slug, session.id);
  const message = cohostAddedEmail({
    title: session.title,
    time: formatSessionTime(session, event.timezone, event.breakMinutes),
    location: formatLocations(session),
    sessionUrl: emailBase() + path,
  });

  const inApp = {
    text: `You were added as a co-host of "${session.title}"`,
    url: path,
    at: now,
  };
  for (const host of added) {
    await tryNotifyGuest(host.id, "cohostAdd", message, inApp);
  }
}

// Notify the guests responsible for what was commented on — a proposal's or
// session's hosts, a profile's owner — and the authors of its earlier
// comments. Everyone told gets the in-app notification; their email settings
// decide who also gets mail (for earlier commenters that is off by default).
// The comment's own author is never told about their own comment, and nobody
// is told twice, whichever way they qualify.
async function deliverCommentNotifications({
  subject,
  responsibleIds,
  responsibleSetting,
  earlier,
  comment,
  path,
  now,
}: {
  subject: CommentSubject;
  responsibleIds: string[];
  responsibleSetting: keyof EmailSettings;
  earlier: Comment[];
  comment: Comment;
  path: string;
  now: Date;
}): Promise<void> {
  const messageProps = {
    subject,
    commenterName: comment.author?.name ?? "Someone",
    url: emailBase() + path,
  };

  const done = new Set(comment.author ? [comment.author.id] : []);
  for (const guestId of responsibleIds) {
    if (done.has(guestId)) {
      continue;
    }
    done.add(guestId);
    await tryNotifyGuest(
      guestId,
      responsibleSetting,
      commentEmail({ ...messageProps, recipient: "responsible" }),
      {
        text: commentNoticeText(
          subject,
          "responsible",
          messageProps.commenterName
        ),
        url: path,
        at: now,
      }
    );
  }

  for (const { author } of earlier) {
    if (!author || done.has(author.id)) {
      continue;
    }
    done.add(author.id);
    await tryNotifyGuest(
      author.id,
      "commentThread",
      commentEmail({ ...messageProps, recipient: "commenter" }),
      {
        text: commentNoticeText(
          subject,
          "commenter",
          messageProps.commenterName
        ),
        url: path,
        at: now,
      }
    );
  }
}

// Never throws: any failure (including a bad SITE_URL, or a lookup error) is
// logged and must not break the comment it trails, nor the sends to the other
// guests.
async function notifyCommented(
  kind: CommentSubject["kind"],
  send: () => Promise<void>
): Promise<void> {
  try {
    await send();
  } catch (err) {
    console.error(`Failed to send ${kind}-comment notifications:`, err);
  }
}

export async function notifyProposalCommented({
  proposalId,
  comment,
  now,
}: {
  proposalId: string;
  comment: Comment;
  now: Date;
}): Promise<void> {
  await notifyCommented("proposal", async () => {
    const { proposalComments, events, sessionProposals } = getRepositories();
    const proposal = await sessionProposals.findById(proposalId);
    if (!proposal) {
      return;
    }
    const event = await events.findById(proposal.eventId);
    if (!event) {
      return;
    }
    await deliverCommentNotifications({
      subject: { kind: "proposal", title: proposal.title },
      responsibleIds: proposal.hosts.map((host) => host.id),
      responsibleSetting: "proposalComment",
      earlier: await proposalComments.list(proposalId),
      comment,
      now,
      path: proposalCommentPath(event.slug, proposalId, comment.id),
    });
  });
}

export async function notifySessionCommented({
  sessionId,
  comment,
  now,
}: {
  sessionId: string;
  comment: Comment;
  now: Date;
}): Promise<void> {
  await notifyCommented("session", async () => {
    const { sessionComments, events, sessions } = getRepositories();
    const session = await sessions.findById(sessionId);
    if (!session) {
      return;
    }
    const event = await events.findById(session.eventId);
    if (!event) {
      return;
    }
    await deliverCommentNotifications({
      subject: { kind: "session", title: session.title },
      responsibleIds: session.hosts.map((host) => host.id),
      responsibleSetting: "sessionComment",
      earlier: await sessionComments.list(sessionId),
      comment,
      now,
      path: `${sessionPath(event.slug, sessionId)}#comment-${comment.id}`,
    });
  });
}

export async function notifyProfileCommented({
  profileId,
  comment,
  now,
}: {
  profileId: string;
  comment: Comment;
  now: Date;
}): Promise<void> {
  await notifyCommented("profile", async () => {
    const { profileComments, guests } = getRepositories();
    const owner = await guests.findById(profileId);
    if (!owner) {
      return;
    }
    await deliverCommentNotifications({
      subject: { kind: "profile", ownerName: owner.name },
      responsibleIds: [profileId],
      responsibleSetting: "profileComment",
      earlier: await profileComments.list(profileId),
      comment,
      now,
      path: `/guests/${profileId}#comment-${comment.id}`,
    });
  });
}

// Deep link to the comment inside the proposal modal, same shape as
// modal-nav's viewProposalLinkFromElsewhere plus the comment's anchor.
function proposalCommentPath(
  eventSlug: string,
  proposalId: string,
  commentId: string
) {
  return `/${eventSlug}/proposals?viewProposal=${proposalId}#comment-${commentId}`;
}

// Deep link to the session, same shape as modal-nav's
// viewSessionLinkFromElsewhere.
function sessionPath(eventSlug: string, sessionId: string) {
  return `/${eventSlug}?viewSession=${sessionId}`;
}

// Emails need an absolute link; in-app notifications keep the path, so they
// survive the site moving and still work on an instance with no SITE_URL at
// all. An empty base only happens when SMTP is unconfigured too (initMailer
// enforces that pairing), so the email built on it can never be sent.
function emailBase(): string {
  return siteUrl() ?? "";
}

function sameLocations(a: { id: string }[], b: { id: string }[]): boolean {
  const aIds = new Set(a.map((l) => l.id));
  const bIds = new Set(b.map((l) => l.id));
  return aIds.symmetricDifference(bIds).size === 0;
}

function formatSessionTime(
  session: Session,
  timezone: string,
  breakMinutes: number
): string {
  if (!session.startTime || !session.endTime) return "Unscheduled";
  const start = getStartTimePlusBreak(session, breakMinutes).setZone(timezone);
  const end = DateTime.fromJSDate(session.endTime).setZone(timezone);
  return `${start.toFormat("cccc d LLLL, HH:mm")}–${end.toFormat("HH:mm")}`;
}

function formatLocations(session: { locations: { name: string }[] }): string {
  return session.locations.map((l) => l.name).join(", ") || "No location";
}
