"use client";

import Link from "next/link";
import { ComponentType, JSX, PropsWithChildren, SVGProps } from "react";
import {
  EnvelopeIcon,
  GlobeAltIcon,
  LinkIcon,
  PaperAirplaneIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import type {
  Attendee,
  ContactType,
  ProfilePrompt,
} from "@/db/repositories/interfaces";
import { CONTACT_TYPE_LABELS } from "@/model/guest";
import { CORE_PROMPTS } from "@/model/prompt-pool";
import { InlineMarkdown, Markdown } from "@/app/(site)/markdown";
import {
  DiscordIcon,
  SignalIcon,
  WhatsAppIcon,
} from "@/app/(site)/guests/brand-icons";
import { ProfilePhoto } from "@/app/(site)/guests/profile-photo";
import {
  ProfileItem,
  ProposalLink,
  SessionLink,
} from "@/app/(site)/guests/profile-link";
import type { ProfileActivity } from "@/app/(site)/guests/profile-activity";

/**
 * A guest's public profile. Everything but Hosting and Proposals comes from the
 * directory payload the list already holds, so switching profiles is instant
 * and only the two joined sections arrive late.
 */
export function ProfileBody({
  guest,
  isOwnProfile,
  activity,
  zoomed,
  onToggleZoom,
}: {
  guest: Attendee;
  isOwnProfile: boolean;
  activity: ProfileActivity | null;
  zoomed: boolean;
  onToggleZoom: () => void;
}) {
  return (
    // Photo in its own column, with the text beside it rather than a screenful
    // below: at this size a stacked layout would push About me off the first
    // screen.
    //
    // md, not sm: the column costs a fixed 256px + gap, which at sm (640px)
    // would leave prose 352px to wrap in — narrower than the stacked phone
    // layout gets. The split only pays from 768px up.
    //
    // sticky: a filled-in profile runs for screens, and the column is short, so
    // it would otherwise scroll away and leave a page-tall empty gutter.
    // self-start is what makes that work — a stretched flex item is as tall as
    // the row and can never sticky-scroll.
    <div className="flex flex-col md:flex-row gap-8">
      <header
        className={`flex flex-col items-center md:items-start md:shrink-0 md:sticky md:top-0 md:self-start gap-2 text-center md:text-left ${
          zoomed ? "md:w-[32rem]" : "md:w-64"
        }`}
      >
        <ProfilePhoto
          name={guest.name}
          image={guest.avatarUrl ?? undefined}
          zoomed={zoomed}
          onToggleZoom={onToggleZoom}
        />
        {/* break-words: the column is only as wide as the photo, so a long
            name would otherwise run out over the text beside it. */}
        <h1 className="text-3xl font-bold break-words max-w-full">
          {guest.name}
        </h1>
        {(guest.pronouns || guest.isHost) && (
          <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-2">
            {guest.pronouns && (
              <p className="text-fg-muted">{guest.pronouns}</p>
            )}
            {guest.isHost && (
              <span className="w-fit rounded-full bg-brand-tint-hover text-brand-fg text-xs font-semibold px-3 py-1">
                Session host
              </span>
            )}
          </div>
        )}
        {guest.basedIn && (
          <p className="text-fg-muted">Based in {guest.basedIn}</p>
        )}
        {isOwnProfile && (
          <Link
            href="/guests/edit"
            className="text-sm font-semibold text-brand-fg hover:text-brand-fg-hover"
          >
            Edit profile
          </Link>
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

        {activity === null ? (
          // Unlabelled on purpose: the sections it stands in for are hidden
          // when empty, and a "Hosting" heading that then vanished would be a
          // worse lie than a nameless placeholder.
          <div aria-hidden="true" className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 w-28 rounded bg-surface-muted" />
            <div className="h-4 w-56 rounded bg-surface-muted" />
          </div>
        ) : (
          <>
            <ProfileList
              title="Hosting"
              items={activity.hosting}
              LinkType={SessionLink}
            />
            <ProfileList
              title="Proposals"
              items={activity.proposals}
              LinkType={ProposalLink}
            />
          </>
        )}
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
  items: (ProfileItem & { title: string })[];
  LinkType: (props: PropsWithChildren<ProfileItem>) => JSX.Element;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <LinkType eventSlug={item.eventSlug} id={item.id}>
              {item.title}
            </LinkType>
          </li>
        ))}
      </ul>
    </section>
  );
}
