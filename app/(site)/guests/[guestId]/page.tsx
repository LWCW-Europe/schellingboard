import Link from "next/link";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { eventNameToSlug } from "@/utils/utils";
import { sanitizeGuest } from "@/utils/guests";
import { Avatar } from "../avatar";

export default async function GuestProfilePage(props: {
  params: Promise<{ guestId: string }>;
}) {
  const { guestId } = await props.params;
  const repos = getRepositories();

  const [completeGuest, hostedSessions, proposals, rsvpdSessions, events] =
    await Promise.all([
      repos.guests.findById(guestId),
      repos.sessions.listHostedByGuest(guestId),
      repos.sessionProposals.listByHost(guestId),
      repos.sessions.listRsvpdByGuest(guestId),
      repos.events.list(),
    ]);

  if (!completeGuest) {
    return <p className="text-gray-600">Profile not found.</p>;
  }

  // This is a public profile; never expose private info (email) here.
  const guest = sanitizeGuest(completeGuest);

  const eventIdToSlug = (eventId: string) =>
    eventNameToSlug(events.find((e) => e.id === eventId)!.name);

  const cookieStore = await cookies();
  const isOwnProfile = cookieStore.get("user")?.value === guestId;
  const isSessionHost = hostedSessions.length > 0;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/guests"
          className="bg-rose-400 text-white font-semibold py-2 rounded shadow hover:bg-rose-500 active:bg-rose-500 w-fit px-12"
        >
          Back to attendees
        </Link>
        {isOwnProfile && (
          <Link
            href="/guests/edit"
            className="text-sm font-semibold text-rose-500 hover:text-rose-600"
          >
            Edit profile
          </Link>
        )}
      </div>

      <header className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Avatar name={guest.name} />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{guest.name}</h1>
          {isSessionHost && (
            <span className="w-fit rounded-full bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1">
              Session host
            </span>
          )}
        </div>
      </header>

      {guest.aboutMe && (
        <section>
          <h2 className="text-lg font-semibold mb-2">About me</h2>
          <p className="whitespace-pre-line text-gray-800">{guest.aboutMe}</p>
        </section>
      )}

      <ProfileList
        title="Hosting"
        items={hostedSessions.map((s) => ({
          key: s.id,
          label: s.title,
          href: `/${eventIdToSlug(s.eventId)}?viewSession=${s.id}`,
        }))}
      />

      <ProfileList
        title="Proposals"
        items={proposals.map((p) => ({
          key: p.id,
          label: p.title,
          href: `/${eventIdToSlug(p.eventId)}/proposals?viewProposal=${p.id}`,
        }))}
      />

      <ProfileList
        title="Going to"
        items={rsvpdSessions.map((s) => ({
          key: s.id,
          label: s.title,
          href: `/${eventIdToSlug(s.eventId)}?viewSession=${s.id}`,
        }))}
      />
    </div>
  );
}

function ProfileList({
  title,
  items,
}: {
  title: string;
  items: { key: string; label: string; href: string | undefined }[];
}) {
  if (items.length === 0) return null;
  else
    return (
      <section>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.key}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-rose-500 hover:text-rose-600 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-800">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
}
