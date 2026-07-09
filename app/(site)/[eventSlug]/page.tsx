import { EventPhase, getCurrentPhase } from "../utils/events";
import { getRepositories } from "@/db/container";
import EventPage from "./event-page";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await props.params;
  const event = await getRepositories().events.findBySlug(eventSlug);

  if (!event) {
    return "Event not found: " + eventSlug;
  }

  const phase = getCurrentPhase(event);

  if (phase === EventPhase.SCHEDULING) {
    return <EventPage />;
  } else if (phase === EventPhase.VOTING || phase === EventPhase.PROPOSAL) {
    redirect(`/${eventSlug}/proposals`);
  } else {
    return "Event unavailable: " + event.name;
  }
}
