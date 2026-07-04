"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function EventTabs({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  const base = `/admin/events/${eventId}`;
  const tabs: { href: string; label: string }[] = [
    { href: base, label: "Config" },
    { href: `${base}/guests`, label: "Guests" },
    { href: `${base}/locations`, label: "Locations" },
    { href: `${base}/proposals`, label: "Proposals" },
    { href: `${base}/sessions`, label: "Sessions" },
  ];

  return (
    <nav
      aria-label="Event sections"
      className="flex gap-1 border-b border-gray-200 overflow-x-auto"
    >
      {tabs.map((tab) => {
        // Config is the base route, so it must match exactly; the others match
        // their own path prefix.
        const active =
          tab.href === base
            ? pathname === base
            : pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors",
              active
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
