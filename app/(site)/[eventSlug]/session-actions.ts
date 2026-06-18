"use server";

import { revalidatePath } from "next/cache";

// Sessions are mutated through the /api/{add,update,delete}-session route
// handlers, but we also need to purge the client-side Router Cache.
// This thin server action does just that.
//
// The session list is fetched in the shared [eventSlug] layout, so we
// revalidate the layout: this invalidates it and every page beneath it.
//
// revalidatePath is synchronous, but a "use server" action must be async to be
// callable from the client, hence the eslint exception.
// eslint-disable-next-line @typescript-eslint/require-await
export async function revalidateEvent(eventSlug: string) {
  revalidatePath(`/${eventSlug}`, "layout");
}
