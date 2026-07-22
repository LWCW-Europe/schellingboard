import Link from "next/link";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import type {
  ContactType,
  ProfileContact,
  ProfilePrompt,
} from "@/db/repositories/interfaces";
import { CONTACT_TYPE_LABELS } from "@/model/guest";
import {
  EnvelopeIcon,
  GlobeAltIcon,
  LinkIcon,
  PaperAirplaneIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import {
  DiscordIcon,
  SignalIcon,
  WhatsAppIcon,
} from "@/app/(site)/guests/[guestId]/brand-icons";
import { CORE_PROMPTS } from "@/model/prompt-pool";
import { eventNameToSlug } from "@/utils/utils";
import { sanitizeGuest } from "@/utils/guests";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { Avatar } from "../avatar";
import { Markdown } from "@/app/(site)/markdown";
import { ComponentType, JSX, PropsWithChildren, SVGProps } from "react";
import {
  ProfileItem,
  ProposalLink,
  SessionLink,
} from "@/app/(site)/guests/[guestId]/profile-link";

export default async function GuestProfilePage(props: {
  params: Promise<{ guestId: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { guestId } = await props.params;
  const { from } = await props.searchParams;
  // Only ever a query string appended to "/guests" (see attendee-list.tsx),
  // so this can't become a redirect off-site even if `from` is tampered with.
  const backHref = from ? `/guests?${from}` : "/guests";
  const repos = getRepositories();

  const [completeGuest, hostedSessions, proposals, events] = await Promise.all([
    repos.guests.findById(guestId),
    repos.sessions.listHostedByGuest(guestId),
    repos.sessionProposals.listByHost(guestId),
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
  const isOwnProfile = (await verifiedCurrentUser(cookieStore)) === guestId;
  const isSessionHost = hostedSessions.length > 0;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 px-4 sm:px-0">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={backHref}
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
        <Avatar name={guest.name} image={guest.avatarUrl ?? undefined} />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{guest.name}</h1>
          {(guest.pronouns || isSessionHost) && (
            <div className="flex flex-row gap-2">
              {guest.pronouns && (
                <p className="text-gray-700">{guest.pronouns}</p>
              )}
              {isSessionHost && (
                <span className="w-fit rounded-full bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1">
                  Session host
                </span>
              )}
            </div>
          )}
          {guest.basedIn && (
            <p className="text-gray-700">Based in {guest.basedIn}</p>
          )}
        </div>
      </header>

      {guest.aboutMe && (
        <section>
          <h2 className="text-lg font-semibold mb-2">About me</h2>
          <div className="text-gray-800">
            <Markdown>{guest.aboutMe}</Markdown>
          </div>
        </section>
      )}

      {orderPrompts(guest.prompts ?? []).map(({ prompt, answer }) => (
        <section key={prompt}>
          <h2 className="text-lg font-semibold mb-2">{prompt}</h2>
          <p className="text-gray-800">{answer}</p>
        </section>
      ))}

      {(guest.languages ?? []).length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Languages</h2>
          <ul className="flex flex-wrap gap-2">
            {guest.languages!.map((language, i) => (
              <li
                key={i}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
              >
                {language}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(guest.contacts ?? []).length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <ul className="flex flex-col gap-2">
            {guest.contacts!.map((contact, i) => {
              const Icon = CONTACT_ICONS[contact.type];
              return (
                <li key={i} className="flex items-start gap-2 text-gray-800">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <span className="min-w-0 break-words">
                    <span className="font-medium">
                      {(contact.type === "other" && contact.label) ||
                        CONTACT_TYPE_LABELS[contact.type]}
                      :
                    </span>{" "}
                    <ContactValue contact={contact} />
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <ProfileList
        title="Hosting"
        items={hostedSessions.map((s) => ({
          key: s.id,
          label: s.title,
          item: { eventSlug: eventIdToSlug(s.eventId), id: s.id },
        }))}
        LinkType={SessionLink}
      />

      <ProfileList
        title="Proposals"
        items={proposals.map((p) => ({
          key: p.id,
          label: p.title,
          item: { eventSlug: eventIdToSlug(p.eventId), id: p.id },
        }))}
        LinkType={ProposalLink}
      />
    </div>
  );
}

const CONTACT_ICONS: Record<
  ContactType,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  email: EnvelopeIcon,
  phone: PhoneIcon,
  whatsapp: WhatsAppIcon,
  signal: SignalIcon,
  telegram: PaperAirplaneIcon,
  discord: DiscordIcon,
  website: GlobeAltIcon,
  other: LinkIcon,
};

/** Core prompts first, in their canonical order; the rest keep saved order. */
function orderPrompts(prompts: ProfilePrompt[]): ProfilePrompt[] {
  return [
    ...CORE_PROMPTS.flatMap((core) => prompts.filter((p) => p.prompt === core)),
    ...prompts.filter((p) => !CORE_PROMPTS.includes(p.prompt)),
  ];
}

/**
 * Values are attendee-supplied: only turn them into links when they are
 * unambiguously safe (mailto for email, http(s) URLs for websites).
 */
function ContactValue({ contact }: { contact: ProfileContact }) {
  const linkClass = "text-rose-500 hover:text-rose-600 underline";
  if (contact.type === "email") {
    return (
      <a className={linkClass} href={`mailto:${contact.value}`}>
        {contact.value}
      </a>
    );
  }
  if (
    contact.type === "website" &&
    /^https?:\/\//i.test(contact.value.trim())
  ) {
    return (
      <a
        className={linkClass}
        href={contact.value.trim()}
        target="_blank"
        rel="noopener noreferrer"
      >
        {contact.value}
      </a>
    );
  }
  return <>{contact.value}</>;
}

function ProfileList({
  title,
  items,
  LinkType,
}: {
  title: string;
  items: { key: string; label: string; item?: ProfileItem }[];
  LinkType: (props: PropsWithChildren<ProfileItem>) => JSX.Element;
}) {
  if (items.length === 0) return null;
  else
    return (
      <section>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.key}>
              {item.item ? (
                <LinkType {...item.item}>{item.label}</LinkType>
              ) : (
                <span className="text-gray-800">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
}
