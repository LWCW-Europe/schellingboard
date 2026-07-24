import { getRepositories } from "@/db/container";
import { ResetPasswordForm } from "./reset-password-form";

// Landing page for the emailed password-reset link. Deliberately changes no
// state on GET (mail scanners prefetch links); the new password is set only
// when the form below is submitted. Setting it grants no session — the guest
// logs in with the new password afterwards.
export default async function AuthResetPage({
  searchParams,
}: {
  searchParams: Promise<{ guest?: string; token?: string }>;
}) {
  const { guest: guestId, token } = await searchParams;
  const guest = guestId
    ? await getRepositories().guests.findById(guestId)
    : null;

  if (!guest || !token) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
        <p className="text-gray-700">
          This password link is invalid. Request a new one from the name
          selector or your settings page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
      <h1 className="text-2xl font-bold">Set a password for {guest.name}</h1>
      <ResetPasswordForm
        guestId={guest.id}
        guestName={guest.name}
        token={token}
      />
    </div>
  );
}
