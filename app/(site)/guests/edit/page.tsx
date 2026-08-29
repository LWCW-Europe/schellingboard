import { cookies } from "next/headers";
import { PageNotice } from "@/app/components/page-notice";
import { getRepositories } from "@/db/container";
import { sanitizeGuest } from "@/utils/guests";
import {
  unverifiedUserMessage,
  verifiedCurrentUser,
} from "@/utils/acting-guest";
import { ProfileForm } from "./profile-form";

export default async function EditProfilePage() {
  const cookieStore = await cookies();
  const currentUser = await verifiedCurrentUser(cookieStore);

  if (!currentUser) {
    return (
      <PageNotice backHref="/guests" backLabel="Attendees">
        {await unverifiedUserMessage(cookieStore, "editing your profile")}
      </PageNotice>
    );
  }

  const guest = await getRepositories().guests.findById(currentUser);

  if (!guest) {
    return (
      <p className="text-fg-muted">Profile not found, please log in again.</p>
    );
  }

  // Strip private info (email, email settings) before handing the guest to a
  // client component; those live on the settings page, not here.
  return <ProfileForm guest={sanitizeGuest(guest)} />;
}
