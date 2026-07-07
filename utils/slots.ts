// Slot math for the schedule grid. Each event divides its days into slots of
// `slotIncrementMinutes`; the grid, start-time options, and duration options
// all derive from these helpers so they stay in agreement.

export const SLOT_INCREMENT_OPTIONS = [15, 30, 45, 60] as const;

/**
 * Default per-event slot increment, used when an event's value is unavailable
 * (e.g. before context has loaded). Mirrors the events schema default.
 */
export const DEFAULT_SLOT_INCREMENT_MINUTES = 30;

const MS_PER_MINUTE = 60 * 1000;

/** Rendered height of one slot row in the schedule grid. */
export const SLOT_HEIGHT_PX = 44;

export function isValidSlotIncrement(minutes: number): boolean {
  return SLOT_INCREMENT_OPTIONS.some((opt) => opt === minutes);
}

/**
 * Number of slots in [start, end). Rounds up so a misaligned window (legacy
 * data) still renders every session instead of truncating the grid.
 */
export function getNumSlots(
  start: Date,
  end: Date,
  incrementMinutes: number
): number {
  const lengthMs = end.getTime() - start.getTime();
  return Math.ceil(lengthMs / MS_PER_MINUTE / incrementMinutes);
}

/**
 * Vertical pixel offset of `now` from the top of a day's slot grid (kiosk
 * now-line), or null when `now` falls outside [start, end).
 */
export function getNowOffsetPx(
  day: { start: Date; end: Date },
  now: Date,
  incrementMinutes: number
): number | null {
  const offsetMs = now.getTime() - day.start.getTime();
  if (offsetMs < 0 || now.getTime() >= day.end.getTime()) return null;
  return (offsetMs / (incrementMinutes * MS_PER_MINUTE)) * SLOT_HEIGHT_PX;
}

/** True when `date` sits a whole number of slots away from `anchor`. */
export function isSlotAligned(
  date: Date,
  anchor: Date,
  incrementMinutes: number
): boolean {
  const offsetMs = date.getTime() - anchor.getTime();
  return offsetMs % (incrementMinutes * MS_PER_MINUTE) === 0;
}

/**
 * Selectable session durations: whole multiples of the increment up to
 * maxDuration. Always offers at least one slot, even when maxDuration is
 * misconfigured below the increment.
 */
export function slotDurationOptions(
  incrementMinutes: number,
  maxDuration: number
): number[] {
  const count = Math.max(1, Math.floor(maxDuration / incrementMinutes));
  return Array.from({ length: count }, (_, i) => (i + 1) * incrementMinutes);
}

/**
 * Snap a free-form duration (e.g. from a proposal) to the nearest selectable
 * option. Ties round up so the session gets at least the proposed time.
 */
export function snapDurationToSlots(
  duration: number,
  incrementMinutes: number,
  maxDuration: number
): number {
  const options = slotDurationOptions(incrementMinutes, maxDuration);
  let best = options[0];
  for (const option of options) {
    if (Math.abs(option - duration) <= Math.abs(best - duration)) {
      best = option;
    }
  }
  return best;
}
