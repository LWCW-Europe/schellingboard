import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { DateTime } from "luxon";
import { PageNotice } from "@/app/components/page-notice";
import { getRepositories } from "@/db/container";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { meetingSlotsForDay } from "@/utils/meeting-slots";
import { MeetingModalFromUrl } from "../meeting-modal";
import { MeetingsProvider } from "../use-meetings";
import { AvailabilityForm, type SlotDay } from "./availability-form";

export const dynamic = "force-dynamic";

export default async function MeetingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventSlug: string }>;
  searchParams: Promise<{ viewMeeting?: string | string[] }>;
}) {
  const { eventSlug } = await params;
  const repos = getRepositories();
  const event = await repos.events.findBySlug(eventSlug);

  if (!event) notFound();

  // Turning meetings off neither cancels nor deletes the requests already
  // made, and every notification about one points here for good -- so a
  // meeting still opens, even where there is no longer any availability to
  // set. The toolbar link is hidden either way.
  const { viewMeeting } = await searchParams;
  if (!event.meetingsEnabled) {
    if (!viewMeeting) notFound();
    return (
      <>
        <PageNotice backHref={`/${eventSlug}`} backLabel="Schedule">
          {event.name} is no longer offering 1-on-1s, so there is no
          availability to set — but the ones already arranged are still yours to
          settle.
        </PageNotice>
        <MeetingsProvider evenIfMeetingsAreOff>
          <MeetingModalFromUrl />
        </MeetingsProvider>
      </>
    );
  }

  const cookieStore = await cookies();
  const currentUser = await verifiedCurrentUser(cookieStore);
  if (!currentUser) {
    return (
      <PageNotice backHref={`/${eventSlug}`} backLabel="Schedule">
        {await unverifiedUserMessage(
          cookieStore,
          "setting your 1-on-1 availability"
        )}
      </PageNotice>
    );
  }

  // The save action refuses a non-attendee anyway; checking here too means
  // they are told before filling the form in rather than after.
  const attending = await repos.guests.listEventsByGuests([currentUser]);
  if (!attending.get(currentUser)?.some((e) => e.id === event.id)) {
    return (
      <PageNotice backHref={`/${eventSlug}`} backLabel="Schedule">
        You&apos;re not on the guest list for {event.name}, so you can&apos;t
        set 1-on-1 availability here. Ask the organizer to add you.
      </PageNotice>
    );
  }

  const [days, declared] = await Promise.all([
    repos.days.listByEvent(event.id),
    repos.meetingAvailability.listByGuestAndEvent(currentUser, event.id),
  ]);

  const zoned = (date: Date) =>
    DateTime.fromJSDate(date).setZone(event.timezone);

  // Days only have to not overlap, so an event may legitimately run 09:00-12:00
  // and 14:00-18:00 on one date: the date alone is not a unique heading, and
  // the window disambiguates the ones that repeat.
  const dateCounts = new Map<string, number>();
  for (const day of days) {
    const date = zoned(day.start).toFormat("EEE d LLL");
    dateCounts.set(date, (dateCounts.get(date) ?? 0) + 1);
  }

  const slotDays: SlotDay[] = days
    .map((day) => ({
      id: day.id,
      label:
        (dateCounts.get(zoned(day.start).toFormat("EEE d LLL")) ?? 0) > 1
          ? `${zoned(day.start).toFormat("EEE d LLL")}, ${zoned(
              day.start
            ).toFormat("HH:mm")}–${zoned(day.end).toFormat("HH:mm")}`
          : zoned(day.start).toFormat("EEE d LLL"),
      slots: meetingSlotsForDay(day, event.slotIncrementMinutes).map(
        (slot) => ({
          start: slot.start.toISOString(),
          label: `${zoned(slot.start).toFormat("HH:mm")} – ${zoned(
            slot.end
          ).toFormat("HH:mm")}`,
        })
      ),
    }))
    .filter((day) => day.slots.length > 0);

  // Only what the event still offers. A day shortened or deleted after someone
  // declared leaves rows for slots the form no longer renders, and the save
  // action refuses any it isn't offering -- so passing them through would leave
  // the guest with a form that cannot be saved and nothing to untick.
  const offered = new Set(slotDays.flatMap((d) => d.slots.map((s) => s.start)));

  return (
    <>
      <AvailabilityForm
        eventId={event.id}
        eventSlug={eventSlug}
        eventName={event.name}
        timezone={event.timezone}
        days={slotDays}
        declared={declared
          .map((d) => d.toISOString())
          .filter((start) => offered.has(start))}
      />
      {/* Where a meeting notification lands: this page is here in every phase,
          while the schedule only exists once scheduling starts. */}
      <MeetingsProvider>
        <MeetingModalFromUrl />
      </MeetingsProvider>
    </>
  );
}
