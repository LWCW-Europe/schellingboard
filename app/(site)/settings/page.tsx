import { cookies } from "next/headers";
import { PageNotice } from "@/app/components/page-notice";
import { getRepositories } from "@/db/container";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { serverNow } from "@/utils/dev-clock-server";
import { vapidPublicKey } from "@/utils/push";
import {
  availabilityFormsFor,
  type AvailabilityFormData,
} from "@/utils/meeting-availability-form";
import { SettingsForm } from "./settings-form";
import { AccountSecurity } from "./account-security";
import { PushNotifications } from "./push-notifications";
import { AppearanceSettings } from "./appearance";
import { AvailabilityForm } from "./availability-form";

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
        <PageNotice backHref="/guests" backLabel="Attendees">
          {await unverifiedUserMessage(cookieStore, "changing your settings")}
        </PageNotice>
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

  const publicKey = await vapidPublicKey(await serverNow());
  const availability = await availabilityFormsFor(guest.id, await serverNow());

  // Never render the stored email address here: switching the current user
  // is unauthenticated, so anyone could impersonate a guest and read it.
  return (
    <div className="flex flex-col gap-8">
      <SettingsForm emailSettings={guest.info.emailSettings} />
      <PushNotifications publicKey={publicKey} />
      <OneOnOneSettings forms={availability} />
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

// Availability is per event, so it is one panel per event rather than one
// form -- collapsed, except that a lone one starts open.
function OneOnOneSettings({ forms }: { forms: AvailabilityFormData[] }) {
  return (
    <section
      aria-labelledby="one-on-ones"
      className="max-w-2xl mx-auto w-full px-4 sm:px-0 flex flex-col gap-3"
    >
      <h2 id="one-on-ones" className="text-lg font-semibold">
        1-on-1s
      </h2>
      <p className="text-sm text-fg-subtle">
        When you&apos;re free to meet other attendees, event by event. Only the
        events you&apos;re attending that offer 1-on-1s are listed.
      </p>
      {forms.length === 0 ? (
        <p className="text-sm text-fg-muted">
          None of your events offers 1-on-1s at the moment.
        </p>
      ) : (
        forms.map((form) => (
          <details
            key={form.eventId}
            open={forms.length === 1}
            className="rounded-md border border-line-subtle"
          >
            <summary className="cursor-pointer px-4 py-3 font-medium text-fg">
              {form.eventName}
            </summary>
            <div className="px-4 pb-4">
              <AvailabilityForm {...form} />
            </div>
          </details>
        ))
      )}
    </section>
  );
}
