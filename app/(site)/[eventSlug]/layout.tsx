import { VotesProvider } from "@/app/(site)/context";
import { Suspense } from "react";
import { EventLayoutContent } from "./layout-content";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  // VotesProvider must live inside the Suspense boundary: it fetches votes in
  // a mount effect, and if that state update lands while the boundary content
  // below it is still dehydrated (selective hydration under load), React can
  // get stuck rendering the update without ever committing it, leaving stale
  // server-rendered HTML (e.g. vote highlights) frozen on screen.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VotesProvider eventSlug={eventSlug}>
        <EventLayoutContent eventSlug={eventSlug}>
          {children}
        </EventLayoutContent>
      </VotesProvider>
    </Suspense>
  );
}
