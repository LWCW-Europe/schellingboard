import { getRepositories } from "@/db/container";
import { LoginConfirm } from "./login-confirm";

// Landing page for the emailed login link. Deliberately changes no state on
// GET (mail scanners prefetch links); the user must submit the form below.
export default async function AuthLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ guest?: string; code?: string }>;
}) {
  const { guest: guestId, code } = await searchParams;
  const guest = guestId
    ? await getRepositories().guests.findById(guestId)
    : null;
  const credentials = guest
    ? await getRepositories().guests.getAuthCredentials(guest.id)
    : null;

  if (!guest) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-0">
        <p className="text-gray-700">
          This login link is invalid. Request a new code from the name selector
          or your settings page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
      <h1 className="text-2xl font-bold">Log in as {guest.name}</h1>
      <LoginConfirm
        guestId={guest.id}
        guestName={guest.name}
        code={code ?? ""}
        hasPassword={credentials?.passwordHash != null}
      />
    </div>
  );
}
