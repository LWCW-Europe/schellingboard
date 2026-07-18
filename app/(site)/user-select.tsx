"use client";
import type { Guest } from "@/db/repositories/interfaces";
import { useContext, useState } from "react";
import { SelectHosts } from "@/app/select-hosts";
import { UserContext } from "./context";
import { GuestLoginForm } from "./guest-login-form";

export function UserSelect({
  guests,
  showOnlyWhenUserSet,
  onSelect,
}: {
  guests: Guest[];
  showOnlyWhenUserSet?: boolean;
  onSelect?: () => void;
}) {
  const { user: currentUser, switchUser, applyUser } = useContext(UserContext);
  // Set when a protected guest was picked and credentials are needed.
  const [pendingGuest, setPendingGuest] = useState<Guest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (guest: Guest | null) => {
    setError(null);
    setPendingGuest(null);
    try {
      const result = await switchUser?.(guest?.id ?? null);
      if (!result) return;
      if (result.ok) {
        onSelect?.();
      } else if (result.needsAuth && guest) {
        setPendingGuest(guest);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong — try again");
    }
  };

  return (
    (!showOnlyWhenUserSet || currentUser) && (
      <div className="flex flex-col gap-3">
        <SelectHosts
          id="user-selection"
          guests={guests}
          hosts={guests.filter((guest) => guest.id === currentUser)}
          setHosts={(hosts) => {
            void handleSelect(hosts?.at(-1) ?? null);
          }}
          selectMany={false}
          showProtected
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {pendingGuest && (
          <GuestLoginForm
            guestId={pendingGuest.id}
            guestName={pendingGuest.name}
            onSuccess={() => {
              applyUser?.(pendingGuest.id);
              setPendingGuest(null);
              onSelect?.();
            }}
          />
        )}
      </div>
    )
  );
}
