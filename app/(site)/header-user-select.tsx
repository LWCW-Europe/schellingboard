"use client";
import { useContext, useState } from "react";
import clsx from "clsx";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import type { Guest } from "@/db/repositories/interfaces";
import { UserSelect } from "./user-select";
import { Modal } from "./modals";
import { UserContext } from "./context";

// The current identity lives in the header so it is always visible who "I" am.
// The chip shows the selected name (or a prompt to pick one); switching is
// possible but intentionally gated behind a modal so it isn't encouraged —
// the only real use case is a shared device.
export function HeaderUserSelect({ guests }: { guests: Guest[] }) {
  const { user: currentUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const currentName = guests.find((g) => g.id === currentUser)?.name;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // aria-label always starts with "Your name" so it's a stable target
        // regardless of who is selected.
        aria-label={currentName ? `Your name: ${currentName}` : "Your name"}
        className={clsx(
          "flex min-w-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400",
          currentName
            ? "text-gray-600 hover:bg-gray-100"
            : // No name set: gently draw attention to prompt a selection.
              "bg-rose-50 text-rose-500 hover:bg-rose-100"
        )}
      >
        <UserCircleIcon className="h-5 w-5 shrink-0 stroke-2" />
        <span className="max-w-[40vw] truncate sm:max-w-[12rem]">
          {currentName ?? "Select your name"}
        </span>
      </button>
      <Modal open={open} setOpen={setOpen}>
        <label htmlFor="user-selection" className="text-gray-500">
          My name is:
        </label>
        <UserSelect guests={guests} onSelect={() => setOpen(false)} />
      </Modal>
    </>
  );
}
