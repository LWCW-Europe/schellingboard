import { cookies } from "next/headers";
import { BackLink } from "@/app/components/back-link";
import { getRepositories } from "@/db/container";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { SettingsForm } from "./settings-form";
import { AccountSecurity } from "./account-security";
import { AppearanceSettings } from "./appearance";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  // verifiedCurrentUser: a stale plain `user` cookie naming a protected
  // guest must not grant access to that guest's settings.
  const currentUser = await verifiedCurrentUser(cookieStore);

  // AppearanceSettings is repeated in every branch on purpose: it is about the
  // device, so it stays available to a visitor who has not said who they are.
  if (!currentUser) {
    return (
      <div className="flex flex-col gap-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
          <BackLink href="/guests">Attendees</BackLink>
          <p className="text-fg-muted">
            You need to select who you are before changing your settings. Pick
            your name via the &ldquo;Select your name&rdquo; chip in the header
            at the top of the page.
          </p>
        </div>
        <AppearanceSettings />
      </div>
    );
  }

  const guest = await getRepositories().guests.findById(currentUser);

  if (!guest) {
    return (
      <div className="flex flex-col gap-8">
        <p className="text-fg-muted">Profile not found, please log in again.</p>
        <AppearanceSettings />
      </div>
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
          guestName={guest.name}
          authProtected={guest.authProtected ?? false}
        />
      </div>
      <AppearanceSettings />
    </div>
  );
}
