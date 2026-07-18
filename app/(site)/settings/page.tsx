import Link from "next/link";
import { cookies } from "next/headers";
import { getRepositories } from "@/db/container";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get("user")?.value;

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
  return <SettingsForm emailSettings={guest.info.emailSettings} />;
}
