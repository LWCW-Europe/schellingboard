"use client";

import { useTransition } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { adminLogoutAction } from "../actions/admin-auth";

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => adminLogoutAction())}
      disabled={isPending}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        "text-gray-300 hover:text-white hover:bg-gray-800",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      <ArrowRightOnRectangleIcon className="h-4 w-4" />
      {isPending ? "Logging out..." : "Admin logout"}
    </button>
  );
}
