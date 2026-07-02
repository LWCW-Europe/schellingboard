"use client";

import { PropsWithChildren } from "react";
import Link, { LinkProps } from "next/link";
import {
  viewProposalLinkFromElsewhere,
  viewSessionLinkFromElsewhere,
} from "@/app/(site)/[eventSlug]/modal-nav";

export type ProfileItem = {
  eventSlug: string;
  id: string;
};

function ProfileItemLink({
  props,
  children,
}: PropsWithChildren<{ props: LinkProps }>) {
  return (
    <Link
      {...props}
      className="text-rose-500 hover:text-rose-600 hover:underline"
    >
      {children}
    </Link>
  );
}

export function SessionLink({
  eventSlug,
  id,
  children,
}: PropsWithChildren<ProfileItem>) {
  return (
    <ProfileItemLink props={viewSessionLinkFromElsewhere(eventSlug, id)}>
      {children}
    </ProfileItemLink>
  );
}

export function ProposalLink({
  eventSlug,
  id,
  children,
}: PropsWithChildren<ProfileItem>) {
  return (
    <ProfileItemLink props={viewProposalLinkFromElsewhere(eventSlug, id)}>
      {children}
    </ProfileItemLink>
  );
}
