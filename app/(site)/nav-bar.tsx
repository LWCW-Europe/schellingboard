"use client";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MapModal } from "./modals";
import { LogoutButton } from "./logout-button";
import { HeaderUserSelect } from "./header-user-select";
import { EVENT_ICONS } from "@/app/event-icons";
import type { Guest } from "@/db/repositories/interfaces";

export type NavItem = {
  name: string;
  href: string;
  icon: string | null;
};

export default function NavBar({
  navItems,
  guests,
  showLogout,
  showGuestsLink,
  mapImageUrl,
}: {
  navItems: NavItem[];
  guests: Guest[];
  showLogout: boolean;
  showGuestsLink: boolean;
  mapImageUrl: string;
}) {
  return (
    <Disclosure
      as="nav"
      className="bg-white border-b border-gray-300 fixed w-full z-30"
    >
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-rose-400 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400">
                  <span className="absolute -inset-0.5" />
                  {open ? (
                    <XMarkIcon className="block h-6 w-6 stroke-2" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6 stroke-2" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex justify-between w-full items-center">
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  {/* Desktop nav */}
                  <div className="hidden sm:block">
                    <div className="flex space-x-4">
                      {navItems.map((item) => (
                        <NavBarItem
                          key={item.name}
                          item={item}
                          highlightCurrent={navItems.length > 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-3">
                  {showGuestsLink && (
                    <Link
                      href="/guests"
                      className="hidden sm:flex group gap-1 cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-100"
                    >
                      <UserGroupIcon className="block h-5 w-auto" />
                      Attendees
                    </Link>
                  )}
                  {mapImageUrl && <MapModal mapImageUrl={mapImageUrl} />}
                  {guests.length > 0 && <HeaderUserSelect guests={guests} />}
                  {showLogout && <LogoutButton />}
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => (
                <SmallNavBarItem
                  key={item.name}
                  item={item}
                  highlightCurrent={navItems.length > 1}
                />
              ))}
              {showGuestsLink && (
                <Disclosure.Button
                  as="a"
                  href="/guests"
                  className="flex gap-2 items-center rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-100"
                >
                  <UserGroupIcon className="block h-5 w-auto" />
                  Attendees
                </Disclosure.Button>
              )}
              {showLogout && (
                <div className="px-1 pt-2 border-t border-gray-200">
                  <LogoutButton className="w-full justify-start" />
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function NavBarItem(props: { item: NavItem; highlightCurrent: boolean }) {
  const { item, highlightCurrent } = props;
  const pathname = usePathname();
  const isCurrentPage =
    highlightCurrent && pathname.includes(item.href) && item.href != null;
  const Icon = item.icon ? EVENT_ICONS[item.icon] : null;
  return (
    <Link
      key={item.name}
      href={item.href}
      className={clsx(
        isCurrentPage
          ? "bg-rose-50 text-rose-400"
          : "text-gray-400 hover:bg-gray-100",
        "group flex gap-1 cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium"
      )}
    >
      {Icon && <Icon className="block h-5 w-auto" />}
      {item.name}
    </Link>
  );
}

function SmallNavBarItem(props: { item: NavItem; highlightCurrent: boolean }) {
  const { item, highlightCurrent } = props;
  const pathname = usePathname();
  const isCurrentPage =
    highlightCurrent && pathname.includes(item.href) && item.href != null;
  const Icon = item.icon ? EVENT_ICONS[item.icon] : null;
  return (
    <Disclosure.Button
      key={item.name}
      as="a"
      href={item.href}
      className={clsx(
        isCurrentPage
          ? "bg-rose-50 text-rose-400"
          : "text-gray-400 hover:bg-gray-100",
        "flex gap-2 rounded-md px-3 py-2 text-base font-medium"
      )}
    >
      {Icon && <Icon className="block h-5 w-auto" />}
      {item.name}
    </Disclosure.Button>
  );
}
