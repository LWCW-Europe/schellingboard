import { DateTime } from "luxon";
import { getRepositories } from "@/db/container";
import type { EmailSettings, Session } from "@/db/repositories/interfaces";
import { sendMail, type EmailMessage } from "@/utils/mailer";
import { siteUrl } from "@/utils/site-url";
import { sessionChangedEmail } from "@/emails/session-changed";

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
  // Deep link to the session, same shape as modal-nav's
  // viewSessionLinkFromElsewhere.
  const sessionUrl = `${base}/${event.slug}?viewSession=${after.id}`;

  const messageProps = {
    sessionUrl,
    title: after.title,
    description: after.description,
    newTime: formatSessionTime(after, event.timezone),
    oldTime: timeChanged
      ? formatSessionTime(before, event.timezone)
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

  // Guards against telling anyone twice (or the editor at all), should a
  // guest ever be both host and RSVP'd.
  const done = new Set(changedById === null ? [] : [changedById]);

  for (const host of after.hosts) {
    if (done.has(host.id)) continue;
    done.add(host.id);
    await tryNotifyGuest(host.id, "hostChange", hostMessage);
  }
  for (const rsvp of await rsvps.listBySession(after.id)) {
    if (done.has(rsvp.guestId)) continue;
    done.add(rsvp.guestId);
    await tryNotifyGuest(rsvp.guestId, "rsvpChange", attendeeMessage);
  }
}

function sameLocations(a: { id: string }[], b: { id: string }[]): boolean {
  const aIds = new Set(a.map((l) => l.id));
  const bIds = new Set(b.map((l) => l.id));
  return aIds.symmetricDifference(bIds).size === 0;
}

function formatSessionTime(
  session: { startTime?: Date; endTime?: Date },
  timezone: string
): string {
  if (!session.startTime || !session.endTime) return "Unscheduled";
  const start = DateTime.fromJSDate(session.startTime).setZone(timezone);
  const end = DateTime.fromJSDate(session.endTime).setZone(timezone);
  return `${start.toFormat("cccc d LLLL, HH:mm")}–${end.toFormat("HH:mm")}`;
}

function formatLocations(session: { locations: { name: string }[] }): string {
  return session.locations.map((l) => l.name).join(", ") || "No location";
}
