import Link from "next/link";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { SettingsForm } from "./settings-form";
import { AccountSecurity } from "./account-security";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  // verifiedCurrentUser: a stale plain `user` cookie naming a protected
  // guest must not grant access to that guest's settings.
  const currentUser = await verifiedCurrentUser(cookieStore);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
        <p className="text-gray-700">
          You need to select who you are before changing your settings. Pick
          your name via the &ldquo;Select your name&rdquo; chip in the header at
          the top of the page.
        </p>
        <Link
          href="/guests"
          className="bg-rose-400 text-white font-semibold py-2 rounded shadow hover:bg-rose-500 active:bg-rose-500 w-fit px-12"
        >
          Back to attendees
        </Link>
      </div>
    );
  }

  const guest = await getRepositories().guests.findById(currentUser);

  if (!guest) {
    return (
      <p className="text-gray-600">Profile not found, please log in again.</p>
    );
  }

  // Never render the stored email address here: switching the current user
  // is unauthenticated, so anyone could impersonate a guest and read it.
  return (
    <div className="flex flex-col gap-8">
      <SettingsForm emailSettings={guest.info.emailSettings} />
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-0">
        <AccountSecurity
          guestId={guest.id}
          authProtected={guest.authProtected ?? false}
        />
      </div>
    </div>
  );
}
