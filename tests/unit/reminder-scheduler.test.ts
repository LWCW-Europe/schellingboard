import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/utils/reminder-dispatch", () => ({
  dispatchDueReminders: vi.fn(),
}));

import { dispatchDueReminders } from "@/utils/reminder-dispatch";
import {
  startReminderScheduler,
  stopReminderScheduler,
} from "@/utils/reminder-scheduler";

const SUMMARY = { notified: 0, sent: 0, skipped: 0, failed: 0, abandoned: 0 };

describe("startReminderScheduler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.mocked(dispatchDueReminders).mockReset().mockResolvedValue(SUMMARY);
  });

  afterEach(() => {
    stopReminderScheduler();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("dispatches once per interval", async () => {
    vi.stubEnv("REMINDER_DISPATCH_INTERVAL_MS", "1000");
    startReminderScheduler();
    expect(dispatchDueReminders).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);
    expect(dispatchDueReminders).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(2000);
    expect(dispatchDueReminders).toHaveBeenCalledTimes(3);
  });

  it("starts only one timer however often it is called", async () => {
    vi.stubEnv("REMINDER_DISPATCH_INTERVAL_MS", "1000");
    startReminderScheduler();
    startReminderScheduler();
    startReminderScheduler();

    await vi.advanceTimersByTimeAsync(1000);
    expect(dispatchDueReminders).toHaveBeenCalledTimes(1);
  });

  it("starts nothing when the interval is 0", async () => {
    vi.stubEnv("REMINDER_DISPATCH_INTERVAL_MS", "0");
    startReminderScheduler();

    await vi.advanceTimersByTimeAsync(600_000);
    expect(dispatchDueReminders).not.toHaveBeenCalled();
  });

  it("starts nothing outside the nodejs runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "edge");
    vi.stubEnv("REMINDER_DISPATCH_INTERVAL_MS", "1000");
    startReminderScheduler();

    await vi.advanceTimersByTimeAsync(10_000);
    expect(dispatchDueReminders).not.toHaveBeenCalled();
  });

  it("skips a tick while the previous run is still in flight", async () => {
    vi.stubEnv("REMINDER_DISPATCH_INTERVAL_MS", "1000");
    let finish = () => {};
    vi.mocked(dispatchDueReminders).mockReturnValue(
      new Promise((resolve) => {
        finish = () => resolve(SUMMARY);
      })
    );
    startReminderScheduler();

    // Three ticks pass, but a slow SMTP server must not stack three runs.
    await vi.advanceTimersByTimeAsync(3000);
    expect(dispatchDueReminders).toHaveBeenCalledTimes(1);

    finish();
    vi.mocked(dispatchDueReminders).mockResolvedValue(SUMMARY);
    await vi.advanceTimersByTimeAsync(1000);
    expect(dispatchDueReminders).toHaveBeenCalledTimes(2);
  });

  it("logs a failing run and keeps ticking", async () => {
    vi.stubEnv("REMINDER_DISPATCH_INTERVAL_MS", "1000");
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(dispatchDueReminders).mockRejectedValueOnce(
      new Error("database is locked")
    );
    startReminderScheduler();

    // A throwing tick must never take the web server down with it.
    await vi.advanceTimersByTimeAsync(1000);
    expect(logged).toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);
    expect(dispatchDueReminders).toHaveBeenCalledTimes(2);
  });
});
