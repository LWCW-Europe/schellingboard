"use server";

import { revalidatePath } from "next/cache";
import { requireSiteAuth } from "@/utils/action-auth";

// Sessions are mutated through the /api/{add,update,delete}-session route
// handlers, but we also need to purge the client-side Router Cache.
// This thin server action does just that.
//
// The session list is fetched in the shared [eventSlug] layout, so we
// revalidate the layout: this invalidates it and every page beneath it.
//
export async function revalidateEvent(eventSlug: string) {
  await requireSiteAuth();
  revalidatePath(`/${eventSlug}`, "layout");
}
