// Server Component / Server Action reader for the dev fake clock. Split from
// dev-clock.ts because it imports next/headers, which cannot be pulled into
// client bundles or Route Handlers that read cookies off the request instead.
import { cookies } from "next/headers";
import {
  TIME_OFFSET_COOKIE,
  nowWithOffset,
  parseTimeOffset,
} from "./dev-clock";

/** Effective "now" for a Server Component or Server Action. */
export async function serverNow(): Promise<Date> {
  const store = await cookies();
  return nowWithOffset(parseTimeOffset(store.get(TIME_OFFSET_COOKIE)?.value));
}
