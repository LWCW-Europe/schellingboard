import { notFound } from "next/navigation";
import Link from "next/link";
import { getRepositories } from "@/db/container";
import { requireAdminPage } from "../../require-admin";
import { EventTabs } from "./event-tabs";

export default async function AdminEventDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();

  const { id } = await params;
  const event = await getRepositories().events.findById(id);
  if (!event) notFound();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Events
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
      <EventTabs eventId={id} />
      {children}
    </div>
  );
}
