"use client";
import { useContext, useState } from "react";
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

// The current identity lives in the header so it is always visible who "I" am.
// Once a name is selected the chip opens a menu leading to the user's own
// profile, profile editing, and settings; switching names is possible but
// tucked behind a menu entry so it isn't encouraged — the only real use case
// is a shared device. Without a name, the chip prompts a selection directly.
export function HeaderUserSelect({ guests }: { guests: Guest[] }) {
  const { user: currentUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const currentGuest = guests.find((g) => g.id === currentUser);

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
                onClick={() => setOpen(true)}
                className={itemClasses(focus)}
              >
                Switch name
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
      {selectModal}
    </>
  );
}
