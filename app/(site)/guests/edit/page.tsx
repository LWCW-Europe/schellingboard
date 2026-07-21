import Link from "next/link";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { sanitizeGuest } from "@/utils/guests";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { ProfileForm } from "./profile-form";

export default async function EditProfilePage() {
  const cookieStore = await cookies();
  const currentUser = await verifiedCurrentUser(cookieStore);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4 px-4 sm:px-0">
        <p className="text-gray-700">
          You need to select who you are before editing your profile. Pick your
          name via the &ldquo;Select your name&rdquo; chip in the header at the
          top of the page.
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

  // Strip private info (email, email settings) before handing the guest to a
  // client component; those live on the settings page, not here.
  return <ProfileForm guest={sanitizeGuest(guest)} />;
}
