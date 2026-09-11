"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";

import type { Event, Location, Session } from "@/db/repositories/interfaces";
import { googleCalendarUrl } from "@/utils/google-calendar";
import { useSiteOrigin } from "@/utils/hooks";

export function AddToGoogleCalendar(props: {
  session: Session;
  event: Event;
  location: Location | undefined;
}) {
  const { session, event, location } = props;
  const origin = useSiteOrigin();

  if (!session.startTime || !session.endTime) return null;

  const href = googleCalendarUrl({
    description: session.description,
    end: session.endTime,
    hostNames: session.hosts.map((h) => h.name),
    location: location?.name,
    start: session.startTime,
    timezone: event.timezone,
    title: session.title,
    url: origin
      ? `${origin}/${event.slug}?viewSession=${session.id}`
      : undefined,
  });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md border border-brand-accent text-brand-fg hover:bg-brand-tint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
    >
      <CalendarIcon className="h-3 w-3 mr-1" />
      Add to Google Calendar
    </a>
  );
}
