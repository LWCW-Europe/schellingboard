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

  it("stops ticking once the returned cleanup function is called", () => {
    const onTick = vi.fn();
    const stop = startNowTicker(onTick, 1000);

    vi.advanceTimersByTime(1000);
    stop();
    vi.advanceTimersByTime(5000);

    expect(onTick).toHaveBeenCalledTimes(1);
  });
});
