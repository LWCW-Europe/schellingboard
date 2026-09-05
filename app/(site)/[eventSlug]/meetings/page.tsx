import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PageNotice } from "@/app/components/page-notice";
import { EventPhase, getCurrentPhase } from "@/app/(site)/utils/events";
import { getRepositories } from "@/db/container";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { serverNow } from "@/utils/dev-clock-server";
import { MeetingModalFromUrl } from "../meeting-modal";
import { MeetingsProvider } from "../use-meetings";

export const dynamic = "force-dynamic";

/**
 * Where a meeting notification lands. Availability is set under Settings, so
 * all that is left here is opening the one meeting -- and even that is handed
 * to the schedule once there is one, where the meeting sits in its slot next
 * to whatever it clashes with. Before the scheduling phase the schedule
 * redirects to the proposals and would lose the meeting on the way, so until
 * then it opens here (#952 is to settle that).
 */
export default async function MeetingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventSlug: string }>;
  searchParams: Promise<{ viewMeeting?: string | string[] }>;
}) {
  const { eventSlug } = await params;
  const event = await getRepositories().events.findBySlug(eventSlug);
  if (!event) notFound();

  const { viewMeeting } = await searchParams;
  const meetingId = Array.isArray(viewMeeting) ? viewMeeting[0] : viewMeeting;
  if (!meetingId) redirect(`/${eventSlug}`);
  if (getCurrentPhase(event, await serverNow()) === EventPhase.SCHEDULING) {
    redirect(`/${eventSlug}?viewMeeting=${encodeURIComponent(meetingId)}`);
  }

  const cookieStore = await cookies();
  if (!(await verifiedCurrentUser(cookieStore))) {
    return (
      <PageNotice backHref={`/${eventSlug}`} backLabel={event.name}>
        {await unverifiedUserMessage(cookieStore, "opening your 1-on-1s")}
      </PageNotice>
    );
  }

  return (
    <>
      <PageNotice backHref={`/${eventSlug}`} backLabel={event.name}>
        Your 1-on-1s at {event.name} will sit on its schedule once scheduling
        starts; until then, this is where one opens.
      </PageNotice>
      <MeetingsProvider>
        <MeetingModalFromUrl />
      </MeetingsProvider>
    </>
  );
}
