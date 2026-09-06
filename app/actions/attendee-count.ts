"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { getRepositories } from "@/db/container";
import { attendeeCountFormSchema } from "@/model/attendee-count";
import { verifiedCurrentUser } from "@/utils/acting-guest";
import { requireSiteAuth } from "@/utils/action-auth";
import { serverNow } from "@/utils/dev-clock-server";

export type AttendeeCountResult =
  | { ok: true; count: number | null }
  | { ok: false; error: string | z.core.$ZodIssue[] };

// Deliberately the same wording for "not your session" and "no such session":
// a distinct message would let a prober map out sessions they don't host.
const NOT_YOURS = "Only this session's hosts can see its attendee count";
const NOT_FINISHED =
  "The attendee count can be recorded once the session has finished";

/**
 * The acting guest, and the session they are asking about, once every rule
 * that does not depend on the submitted value has been enforced. Shared by
 * both actions so the read and the write can never drift apart — the read is
 * what a prober would use to find a gap in the write.
 */
async function authorizedSession(
  sessionId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireSiteAuth();
  const currentUser = await verifiedCurrentUser(await cookies());
  if (!currentUser) return { ok: false, error: "No user is logged in" };

  const session = await getRepositories().sessions.findById(sessionId);
  if (!session) return { ok: false, error: NOT_YOURS };
  if (!session.hosts.some((host) => host.id === currentUser)) {
    return { ok: false, error: NOT_YOURS };
  }
  if (!session.endTime || session.endTime > (await serverNow())) {
    return { ok: false, error: NOT_FINISHED };
  }
  return { ok: true };
}

export async function getAttendeeCountAction(
  sessionId: string
): Promise<AttendeeCountResult> {
  const authorized = await authorizedSession(sessionId);
  if (!authorized.ok) return authorized;

  const count = await getRepositories().sessions.getAttendeeCount(sessionId);
  return { ok: true, count };
}

export async function setAttendeeCountAction(
  sessionId: string,
  value: unknown
): Promise<AttendeeCountResult> {
  // Authorization before validation (Constitution IV): a stranger must not be
  // able to probe the validation rules of a session that isn't theirs.
  const authorized = await authorizedSession(sessionId);
  if (!authorized.ok) return authorized;

  const parsed = attendeeCountFormSchema.safeParse({ count: value });
  if (!parsed.success) return { ok: false, error: parsed.error.issues };

  const { sessions } = getRepositories();
  await sessions.setAttendeeCount(sessionId, parsed.data.count);

  // The stored value, not the submitted one, so two saves racing each other
  // converge on what is actually in the database (SC-007).
  return { ok: true, count: await sessions.getAttendeeCount(sessionId) };
}
