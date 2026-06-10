"use client";

import { EventProvider } from "@/app/(site)/context";
import type { EventContextType } from "@/app/(site)/context";

export function EventProviderWrapper({
  eventContextValue,
  children,
}: {
  eventContextValue: Omit<
    EventContextType,
    "localSessions" | "userBusySessions" | "rsvpdForSession" | "updateRsvp"
  >;
  children: React.ReactNode;
}) {
  return <EventProvider value={eventContextValue}>{children}</EventProvider>;
}
