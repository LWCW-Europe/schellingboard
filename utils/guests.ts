import type { Guest, CompleteGuest } from "@/db/repositories/interfaces";

export function sanitizeGuest(guest: CompleteGuest): Guest {
  const out = { ...guest, info: undefined };
  delete out.info;
  return out;
}
