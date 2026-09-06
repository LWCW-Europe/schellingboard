"use server";

import { requireSiteAuth } from "@/utils/action-auth";
import { isDevToolsEnabled } from "@/utils/dev-clock";
import { serverNow } from "@/utils/dev-clock-server";
import {
  dispatchDueReminders,
  type DispatchSummary,
} from "@/utils/reminder-dispatch";

/**
 * Runs one dispatch tick on demand, from the dev toolbar. Only exists so the
 * reminder emails can be exercised without waiting for the interval — E2E
 * disables the scheduler outright (REMINDER_DISPATCH_INTERVAL_MS=0) to keep
 * stray sends out of the Mailpit assertions, and a developer checking the
 * emails by hand does not want to wait either.
 *
 * Refuses unless SB_ENABLE_DEV_TOOLS is set, which no real deployment sets.
 * It reads the dev clock, so time-travelling the browser past a session's end
 * is enough to make its follow-up due.
 */
export async function dispatchRemindersAction(): Promise<
  { ok: true; summary: DispatchSummary } | { ok: false; error: string }
> {
  await requireSiteAuth();
  if (!isDevToolsEnabled()) {
    return { ok: false, error: "Dev tools are not enabled" };
  }
  return { ok: true, summary: await dispatchDueReminders(await serverNow()) };
}
