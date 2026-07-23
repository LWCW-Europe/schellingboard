import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { startNowTicker } from "@/utils/now-ticker";

describe("startNowTicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onTick with the current time at each interval", () => {
    const onTick = vi.fn();
    startNowTicker(onTick, 1000);

    expect(onTick).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onTick).toHaveBeenLastCalledWith(expect.any(Date));

    vi.advanceTimersByTime(2000);
    expect(onTick).toHaveBeenCalledTimes(3);
    expect(onTick).toHaveBeenLastCalledWith(expect.any(Date));
  });

  it("applies the offset to each reported time", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const onTick = vi.fn();
    startNowTicker(onTick, 1000, 86_400_000); // +1 day

    vi.advanceTimersByTime(1000);
    const reported = onTick.mock.calls[0][0] as Date;
    expect(reported.toISOString()).toBe("2026-01-02T00:00:01.000Z");
  });

  it("stops ticking once the returned cleanup function is called", () => {
    const onTick = vi.fn();
    const stop = startNowTicker(onTick, 1000);

    vi.advanceTimersByTime(1000);
    stop();
    vi.advanceTimersByTime(5000);

    expect(onTick).toHaveBeenCalledTimes(1);
  });
});
