// The recurring dispatch tick. Started from instrumentation.ts, which is the
// only hook that runs once per server process regardless of traffic — see
// docs/dev/adr/0006.
//
// The dispatcher is imported inside the tick, not at the top of this module:
// Next compiles instrumentation.ts for the Edge runtime as well, and a static
// import would pull db/container — and with it better-sqlite3, `path` and
// `process.cwd()` — into a bundle that supports none of them. The
// NEXT_RUNTIME guard below is a runtime check; it does not keep the module
// graph out of the edge build.

const DEFAULT_INTERVAL_MS = 60_000;

// Singletons need to be assigned to globalThis, not simply module-level
// variables. See https://github.com/vercel/next.js/discussions/68572.
const g = globalThis as typeof globalThis & {
  __reminderScheduler?: ReturnType<typeof setInterval>;
};

export function startReminderScheduler(): void {
  // Same guard as the mailer: the Edge runtime has neither a database nor SMTP.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (g.__reminderScheduler) return;

  const configured = process.env.REMINDER_DISPATCH_INTERVAL_MS;
  const period =
    configured === undefined || configured === ""
      ? DEFAULT_INTERVAL_MS
      : Number(configured);
  // 0 disables the scheduler outright, which is how a self-hoster turns the
  // reminders off and how both E2E tiers keep stray sends out of the mailbox.
  if (!Number.isFinite(period) || period <= 0) return;

  let running = false;
  const timer = setInterval(() => {
    // Correctness does not rest on this — claim() is the real guarantee — but
    // a slow mail server must not stack runs.
    if (running) return;
    running = true;
    void import("@/utils/reminder-dispatch")
      .then(({ dispatchDueReminders }) =>
        // eslint-disable-next-line no-restricted-syntax -- the tick runs outside any request, so there is no time-override cookie to read; dispatching against a fake clock is what the dev toolbar's button is for
        dispatchDueReminders(new Date())
      )
      .catch((err: unknown) => {
        console.error("Reminder dispatch failed:", err);
      })
      .finally(() => {
        running = false;
      });
  }, period);
  // Never hold the process open for a tick.
  timer.unref();
  g.__reminderScheduler = timer;
}

/** For tests only. */
export function stopReminderScheduler(): void {
  if (g.__reminderScheduler) clearInterval(g.__reminderScheduler);
  delete g.__reminderScheduler;
}
