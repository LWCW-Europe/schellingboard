import Link from "next/link";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import type { ContactType, ProfilePrompt } from "@/db/repositories/interfaces";
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
import { ProfilePhoto } from "../profile-photo";
import { InlineMarkdown, Markdown } from "@/app/(site)/markdown";
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
    return <p className="text-fg-muted">Profile not found.</p>;
  }

  // This is a public profile; never expose private info (email) here.
  const guest = sanitizeGuest(completeGuest);

  const eventIdToSlug = (eventId: string) =>
    eventNameToSlug(events.find((e) => e.id === eventId)!.name);

  const cookieStore = await cookies();
  const isOwnProfile = (await verifiedCurrentUser(cookieStore)) === guestId;
  const isSessionHost = hostedSessions.length > 0;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 px-4 md:px-0">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={backHref}
          className="bg-brand text-on-brand font-semibold py-2 rounded shadow hover:bg-brand-hover active:bg-brand-hover w-fit px-12"
        >
          Back to attendees
        </Link>
        {isOwnProfile && (
          <Link
            href="/guests/edit"
            className="text-sm font-semibold text-brand-fg hover:text-brand-fg-hover"
          >
            Edit profile
          </Link>
        )}
      </div>

      {/* Photo in its own column, with the text beside it rather than a
          screenful below: at this size a stacked layout would push About me
          off the first screen.

          md, not sm: the column costs a fixed 256px + gap, which at sm (640px)
          would leave prose 352px to wrap in — narrower than the stacked phone
          layout gets. The split only pays from 768px up.

          sticky: a filled-in profile runs for screens, and the column is short,
          so it would otherwise scroll away and leave a page-tall empty gutter.
          self-start is what makes that work — a stretched flex item is as tall
          as the row and can never sticky-scroll. top-20 clears the fixed h-16
          nav. */}
      <div className="flex flex-col md:flex-row gap-8">
        <header className="flex flex-col items-center md:items-start md:w-64 md:shrink-0 md:sticky md:top-20 md:self-start gap-2 text-center md:text-left">
          <ProfilePhoto
            name={guest.name}
            image={guest.avatarUrl ?? undefined}
          />
          {/* break-words: the column is only as wide as the photo, so a long
              name would otherwise run out over the text beside it. */}
          <h1 className="text-3xl font-bold break-words max-w-full">
            {guest.name}
          </h1>
          {(guest.pronouns || isSessionHost) && (
            <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-2">
              {guest.pronouns && (
                <p className="text-fg-muted">{guest.pronouns}</p>
              )}
              {isSessionHost && (
                <span className="w-fit rounded-full bg-brand-tint-hover text-brand-fg text-xs font-semibold px-3 py-1">
                  Session host
                </span>
              )}
            </div>
          )}
          {guest.basedIn && (
            <p className="text-fg-muted">Based in {guest.basedIn}</p>
          )}

          {/* Beside the photo rather than below the prompts: languages are the
              same kind of at-a-glance fact as pronouns and where someone is
              based, and short enough to wrap in a 256px column. */}
          {(guest.languages ?? []).length > 0 && (
            <section className="w-full mt-2">
              <h2 className="text-lg font-semibold mb-2">Languages</h2>
              <ul className="flex flex-wrap justify-center md:justify-start gap-2">
                {guest.languages!.map((language, i) => (
                  <li
                    key={i}
                    className="rounded-full bg-surface-muted px-3 py-1 text-sm text-fg"
                  >
                    {language}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </header>

        <div className="flex flex-1 flex-col gap-8 min-w-0">
          {guest.aboutMe && (
            <section>
              <h2 className="text-lg font-semibold mb-2">About me</h2>
              <div className="text-fg">
                <Markdown>{guest.aboutMe}</Markdown>
              </div>
            </section>
          )}

          {orderPrompts(guest.prompts ?? []).map(({ prompt, answer }) => (
            <section key={prompt}>
              <h2 className="text-lg font-semibold mb-2">{prompt}</h2>
              <p className="text-fg">
                <InlineMarkdown>{answer}</InlineMarkdown>
              </p>
            </section>
          ))}

          {(guest.contacts ?? []).length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Contact</h2>
              <ul className="flex flex-col gap-2">
                {guest.contacts!.map((contact, i) => {
                  const Icon = CONTACT_ICONS[contact.type];
                  return (
                    <li key={i} className="flex items-start gap-2 text-fg">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-fg-subtle" />
                      <span className="min-w-0 break-words">
                        <span className="font-medium">
                          {(contact.type === "other" && contact.label) ||
                            CONTACT_TYPE_LABELS[contact.type]}
                          :
                        </span>{" "}
                        <InlineMarkdown>{contact.value}</InlineMarkdown>
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
      </div>
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
                <span className="text-fg">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
}
