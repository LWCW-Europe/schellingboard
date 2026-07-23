import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { EventProviderWrapper } from "./event-provider-wrapper";
import type { DayWithSessions } from "@/app/(site)/context";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { serverNow } from "@/utils/dev-clock-server";

export async function EventLayoutContent({
  eventSlug,
  children,
}: {
  eventSlug: string;
  children: React.ReactNode;
}) {
  const repos = getRepositories();
  const event = await repos.events.findBySlug(eventSlug);

  if (!event) {
    return <div>Event not found</div>;
  }

  const cookieStore = await cookies();
  // Verified, not the raw `user` cookie: a guest's RSVP list is private, so a
  // forged plain cookie naming a protected guest must not seed their RSVPs
  // into the SSR payload.
  const currentUser = await verifiedCurrentUser(cookieStore);

  const [days, sessions, locations, guests, rsvps] = await Promise.all([
    repos.days.listByEvent(event.id),
    repos.sessions.listByEvent(event.id),
    repos.locations.listVisibleByEvent(event.id),
    repos.guests.listByEvent(event.id),
    currentUser ? repos.rsvps.listByGuest(currentUser) : Promise.resolve([]),
  ]);

  const daysWithSessions: DayWithSessions[] = days.map((day) => ({
    ...day,
    sessions: sessions.filter((s) => {
      if (!s.startTime || !s.endTime) return false;
      return (
        day.start.getTime() <= s.startTime.getTime() &&
        day.end.getTime() >= s.endTime.getTime()
      );
    }),
  }));

  const eventContextValue = {
    event,
    days: daysWithSessions,
    sessions,
    locations,
    guests,
    rsvps,
    // Computed on the server so SSR and hydration agree on which days
    // default to folded (see getDefaultFoldedDayIds). Honours the dev fake
    // clock so time travel drives phase/schedule UI (see docs/adr/0004-dev-fake-clock.md).
    now: await serverNow(),
  };

  return (
    <EventProviderWrapper eventContextValue={eventContextValue}>
      {children}
    </EventProviderWrapper>
  );
}
