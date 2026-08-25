import { cookies } from "next/headers";
import { BackLink } from "@/app/components/back-link";
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
      <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
        <BackLink href="/guests">Attendees</BackLink>
        <p className="text-fg-muted">
          {await unverifiedUserMessage(cookieStore, "editing your profile")}
        </p>
      </div>
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
