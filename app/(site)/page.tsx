export const dynamic = "force-dynamic";

import SummaryPage from "./summary-page";
import { getRepositories } from "@/db/container";
import { redirect } from "next/navigation";

export default async function Home() {
  const repos = getRepositories();
  const events = await repos.events.list();
  const sortedEvents = events.sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });
  if (sortedEvents.length > 1) {
    return <SummaryPage events={sortedEvents} />;
  } else if (sortedEvents.length === 1) {
    const eventSlug = sortedEvents[0].slug;
    redirect(`/${eventSlug}`);
  } else {
    return <p>No events found.</p>;
  }
}
