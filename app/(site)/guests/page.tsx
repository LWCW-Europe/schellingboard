import Link from "next/link";
import { getRepositories } from "@/db/container";
import { Avatar } from "./avatar";
import { cookies } from "next/headers";

export default async function GuestsPage() {
  const guests = await getRepositories().guests.list();
  guests.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const cookieStore = await cookies();
  const currentUser = cookieStore.get("user")?.value;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Attendees</h1>
        {currentUser && (
          <Link
            href="/guests/edit"
            className="text-sm font-semibold text-rose-500 hover:text-rose-600"
          >
            Edit profile
          </Link>
        )}
      </div>

      {guests.length === 0 ? (
        <p className="text-gray-500">No attendees yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-200">
          {guests.map((guest) => (
            <li key={guest.id}>
              <Link
                href={`/guests/${guest.id}`}
                className="flex items-center gap-4 py-3 hover:bg-gray-50 rounded-md px-2"
              >
                <Avatar
                  name={guest.name}
                  size="sm"
                  image={guest.avatarUrl ?? undefined}
                />
                <span className="font-medium text-gray-900">{guest.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
