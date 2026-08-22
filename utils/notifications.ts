import { DateTime } from "luxon";
import { getRepositories } from "@/db/container";
import type {
  Comment,
  EmailSettings,
  Session,
} from "@/db/repositories/interfaces";
import { type EmailMessage, sendMail } from "@/utils/mailer";
import { siteUrl } from "@/utils/site-url";
import { sessionChangedEmail } from "@/emails/session-changed";
import { sessionDeletedEmail } from "@/emails/session-deleted";
import { cohostAddedEmail } from "@/emails/cohost-added";
import { proposalCommentEmail } from "@/emails/proposal-comment";
import { getStartTimePlusBreak } from "@/utils/utils";

// Send `message` to the guest, iff they have opted in to emails for
// `setting` (see EmailSettings).
//
// An unknown guest id is a no-op rather than an error: notifications should be
// sent after the triggering change is committed, by which time the guest may
// have been deleted.
export async function notifyGuest(
  guestId: string,
  setting: keyof EmailSettings,
  message: EmailMessage
): Promise<void> {
  const guest = await getRepositories().guests.findById(guestId);
  if (!guest || !guest.info.emailSettings[setting]) return;
  await sendMail({ to: guest.info.email, ...message });
}

async function tryNotifyGuest(
  guestId: string,
  setting: keyof EmailSettings,
  message: EmailMessage
): Promise<void> {
  try {
    await notifyGuest(guestId, setting, message);
  } catch (err) {
    console.error(`Failed to email guest ${guestId}:`, err);
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
}: {
  before: Session;
  after: Session;
  changedById: string | null;
}): Promise<void> {
  const timeChanged =
    before.startTime?.getTime() !== after.startTime?.getTime() ||
    before.endTime?.getTime() !== after.endTime?.getTime();
  const locationChanged = !sameLocations(before.locations, after.locations);
  if (!timeChanged && !locationChanged) return;

  const { events, rsvps } = getRepositories();
  const event = await events.findById(after.eventId);
  if (!event) return;

  // No SITE_URL means SMTP is not configured either (initMailer enforces
  // that), so no email could be sent anyway.
  const base = siteUrl();
  if (base === null) {
    console.warn(
      "SITE_URL is not set - not sending session change notifications"
    );
    return;
  }
  const messageProps = {
    sessionUrl: sessionUrl(base, event.slug, after.id),
    title: after.title,
    description: after.description,
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

  await notifySessionRecipients({
    hostIds: after.hosts.map((host) => host.id),
    rsvpGuestIds: (await rsvps.listBySession(after.id)).map(
      (rsvp) => rsvp.guestId
    ),
    changedById,
    hostMessage,
    attendeeMessage,
  });
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
}: {
  session: Session;
  rsvpGuestIds: string[];
  changedById: string | null;
}): Promise<void> {
  const event = await getRepositories().events.findById(session.eventId);
  if (!event) return;

  const base = siteUrl();
  if (base === null) {
    console.warn(
      "SITE_URL is not set - not sending session deletion notifications"
    );
    return;
  }
  const messageProps = {
    title: session.title,
    description: session.description,
    time: formatSessionTime(session, event.timezone, event.breakMinutes),
    location: formatLocations(session),
    eventUrl: `${base}/${event.slug}`,
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
  });
}

async function notifySessionRecipients({
  hostIds,
  rsvpGuestIds,
  changedById,
  hostMessage,
  attendeeMessage,
}: {
  hostIds: string[];
  rsvpGuestIds: string[];
  changedById: string | null;
  hostMessage: EmailMessage;
  attendeeMessage: EmailMessage;
}): Promise<void> {
  // Guards against telling anyone twice (or the editor at all), should a
  // guest ever be both host and RSVP'd.
  const done = new Set(changedById === null ? [] : [changedById]);

  for (const hostId of hostIds) {
    if (done.has(hostId)) continue;
    done.add(hostId);
    await tryNotifyGuest(hostId, "hostChange", hostMessage);
  }
  for (const guestId of rsvpGuestIds) {
    if (done.has(guestId)) continue;
    done.add(guestId);
    await tryNotifyGuest(guestId, "rsvpChange", attendeeMessage);
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
}: {
  session: Session;
  previousHostIds: string[];
  changedById: string | null;
}): Promise<void> {
  const previous = new Set(previousHostIds);
  const added = session.hosts.filter(
    (h) => !previous.has(h.id) && h.id !== changedById
  );
  if (added.length === 0) return;

  const event = await getRepositories().events.findById(session.eventId);
  if (!event) return;

  // No SITE_URL means SMTP is not configured either (initMailer enforces
  // that), so no email could be sent anyway.
  const base = siteUrl();
  if (base === null) {
    console.warn("SITE_URL is not set - not sending co-host notifications");
    return;
  }

  const message = cohostAddedEmail({
    title: session.title,
    description: session.description,
    time: formatSessionTime(session, event.timezone, event.breakMinutes),
    location: formatLocations(session),
    sessionUrl: sessionUrl(base, event.slug, session.id),
  });

  for (const host of added) {
    await tryNotifyGuest(host.id, "cohostAdd", message);
  }
}

// Email a new comment to the proposal's hosts (who have opted in) and to the
// authors of its earlier comments (who have opted in — off by default). The
// comment's own author is never told about their own comment, and nobody is
// told twice, whichever way they qualify.
//
// Never throws: any failure (including a bad SITE_URL, or a lookup error) is
// logged and must not break the comment it trails, nor the sends to the other
// guests.
export async function notifyProposalCommented(args: {
  proposalId: string;
  comment: Comment;
}): Promise<void> {
  try {
    await notifyProposalCommentedUnsafe(args);
  } catch (err) {
    console.error("Failed to send proposal-comment notifications:", err);
  }
}

async function notifyProposalCommentedUnsafe({
  proposalId,
  comment,
}: {
  proposalId: string;
  comment: Comment;
}): Promise<void> {
  const { proposalComments, events, sessionProposals } = getRepositories();
  const proposal = await sessionProposals.findById(proposalId);
  if (!proposal) {
    return;
  }
  const event = await events.findById(proposal.eventId);
  if (!event) {
    return;
  }

  const base = siteUrl();
  if (base === null) {
    console.warn("SITE_URL is not set - not sending comment notifications");
    return;
  }

  const messageProps = {
    proposalTitle: proposal.title,
    commenterName: comment.author?.name ?? "Someone",
    body: comment.body,
    url: commentUrl(base, event.slug, proposalId, comment.id),
  };

  const done = new Set(comment.author ? [comment.author.id] : []);
  for (const host of proposal.hosts) {
    if (done.has(host.id)) {
      continue;
    }
    done.add(host.id);
    await tryNotifyGuest(
      host.id,
      "proposalComment",
      proposalCommentEmail({ ...messageProps, recipient: "host" })
    );
  }

  for (const earlier of await proposalComments.listByProposal(proposalId)) {
    const author = earlier.author;
    if (!author || done.has(author.id)) {
      continue;
    }
    done.add(author.id);
    await tryNotifyGuest(
      author.id,
      "commentThread",
      proposalCommentEmail({ ...messageProps, recipient: "commenter" })
    );
  }
}

// Deep link to the comment inside the proposal modal, same shape as
// modal-nav's viewProposalLinkFromElsewhere plus the comment's anchor.
function commentUrl(
  base: string,
  eventSlug: string,
  proposalId: string,
  commentId: string
) {
  return `${base}/${eventSlug}/proposals?viewProposal=${proposalId}#comment-${commentId}`;
}

// Deep link to the session, same shape as modal-nav's
// viewSessionLinkFromElsewhere.
function sessionUrl(base: string, eventSlug: string, sessionId: string) {
  return `${base}/${eventSlug}?viewSession=${sessionId}`;
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
