// How often EventContext's `now` refreshes on the client after the initial,
// server-rendered value. See startNowTicker.
export const NOW_REFRESH_INTERVAL_MS = 60_000;

// Periodically reports the current time via onTick, starting after the first
// interval elapses (the caller already has an initial value to render with).
// Kept as a plain function, separate from the React effect that calls it, so
// the scheduling behavior can be unit-tested without rendering a component.
export function startNowTicker(
  onTick: (now: Date) => void,
  intervalMs: number = NOW_REFRESH_INTERVAL_MS
): () => void {
  const interval = setInterval(() => onTick(new Date()), intervalMs);
  return () => clearInterval(interval);
}
