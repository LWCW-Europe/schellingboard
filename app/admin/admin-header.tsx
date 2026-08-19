"use client";

import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AdminLogoutButton } from "./logout-button";

const LINKS: { href: string; label: string }[] = [
  { href: "/admin/events", label: "Events" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/settings", label: "Settings" },
];

function NavLinks({ block }: { block?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      className={clsx(block ? "flex flex-col gap-1" : "flex gap-1")}
    >
      {LINKS.map((link) => {
        const active = pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              block && "block",
              active
                ? "bg-bar-fg/15 text-bar-fg"
                : "text-bar-fg-subtle hover:bg-bar-fg/10 hover:text-bar-fg"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminHeader({
  title,
  isAdmin,
}: {
  title: string;
  isAdmin: boolean;
}) {
  return (
    <Disclosure as="header" className="bg-bar text-bar-fg">
      {({ open }) => (
        <>
          <div className="max-w-6xl mx-auto px-3 lg:px-8 py-3 flex items-center justify-between gap-4">
            <Link
              href="/admin"
              className="font-semibold hover:text-bar-fg-subtle"
            >
              {title} Admin
            </Link>

            {isAdmin && (
              <>
                {/* Desktop: nav + logout on a single row */}
                <div className="hidden sm:flex items-center gap-4">
                  <NavLinks />
                  <AdminLogoutButton />
                </div>

                {/* Mobile: collapse everything behind a hamburger */}
                <Disclosure.Button
                  aria-label={open ? "Close admin menu" : "Open admin menu"}
                  className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-bar-fg-subtle hover:bg-bar-fg/10 hover:text-bar-fg"
                >
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </Disclosure.Button>
              </>
            )}
          </div>

          {isAdmin && (
            <Disclosure.Panel className="sm:hidden border-t border-bar-fg/20 px-3 py-3 space-y-3">
              <NavLinks block />
              <AdminLogoutButton />
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  );
}
