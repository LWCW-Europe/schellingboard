"use client";
import { useContext, useState, useTransition } from "react";
import clsx from "clsx";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from "@headlessui/react";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import type { Guest } from "@/db/repositories/interfaces";
import { UserSelect } from "./user-select";
import { Modal } from "./modals";
import { UserContext } from "./context";
import { logoutAction } from "@/app/actions/auth";

// The current identity lives in the header so it is always visible who "I" am.
// Once a name is selected the chip opens a menu leading to the user's own
// profile, profile editing, and settings, ending in "Log out" — the only
// identity exit (see logoutAction). There is no "become someone else" while
// wearing a name: switching is logout-then-select, so the picker only ever
// appears from the anonymous state, where the chip prompts a selection
// directly.
export function HeaderUserSelect({ guests }: { guests: Guest[] }) {
  const { user: currentUser, applyUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();
  const currentGuest = guests.find((g) => g.id === currentUser);

  // applyUser(null) gives instant feedback while the request is in flight
  // (the layout stays mounted, so a fresh server render of UserProvider's
  // initialUser prop alone wouldn't reset its state — useState only reads
  // that prop on first mount). The hard reload after is what actually makes
  // the logout take effect: a soft client-side navigation could otherwise
  // serve the current page from Next's router cache, looking authenticated
  // until some later, unrelated navigation rechecks the cookie (see
  // logoutAction). Reloading the current URL, rather than sending the user
  // to "/", means a re-login (if the site is password protected) returns
  // them to the page they logged out from.
  const handleLogout = () => {
    applyUser?.(null);
    startLogout(async () => {
      await logoutAction();
      window.location.reload();
    });
  };

  const chipClasses =
    "flex min-w-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400";

  const selectModal = (
    <Modal open={open} setOpen={setOpen}>
      <label htmlFor="user-selection" className="text-gray-500">
        My name is:
      </label>
      <UserSelect guests={guests} onSelect={() => setOpen(false)} />
    </Modal>
  );

  if (!currentGuest) {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          // aria-label always starts with "Your name" so it's a stable target
          // regardless of who is selected.
          aria-label="Your name"
          className={clsx(
            chipClasses,
            // No name set: gently draw attention to prompt a selection.
            "bg-rose-50 text-rose-500 hover:bg-rose-100"
          )}
        >
          <UserCircleIcon className="h-5 w-5 shrink-0 stroke-2" />
          <span className="max-w-[40vw] truncate sm:max-w-[12rem]">
            Select your name
          </span>
        </button>
        {selectModal}
      </>
    );
  }

  const itemClasses = (focus: boolean) =>
    clsx(
      "block w-full text-left px-4 py-2 text-sm",
      focus ? "bg-gray-100 text-gray-900" : "text-gray-700"
    );

  return (
    <>
      <Menu>
        <MenuButton
          aria-label={`Your name: ${currentGuest.name}`}
          className={clsx(chipClasses, "text-gray-600 hover:bg-gray-100")}
        >
          <UserCircleIcon className="h-5 w-5 shrink-0 stroke-2" />
          <span className="max-w-[40vw] truncate sm:max-w-[12rem]">
            {currentGuest.name}
          </span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 stroke-2" />
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          className="z-40 mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
        >
          <MenuItem>
            {({ focus }) => (
              <Link
                href={`/guests/${currentGuest.id}`}
                className={itemClasses(focus)}
              >
                My profile
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <Link href="/guests/edit" className={itemClasses(focus)}>
                Edit profile
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <Link href="/settings" className={itemClasses(focus)}>
                Settings
              </Link>
            )}
          </MenuItem>
          <MenuSeparator className="my-1 h-px bg-gray-100" />
          <MenuItem>
            {({ focus }) => (
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className={clsx(itemClasses(focus), "disabled:opacity-50")}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
      {selectModal}
    </>
  );
}
