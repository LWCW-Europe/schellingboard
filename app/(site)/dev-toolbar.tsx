"use client";

// Development-only clock toolbar. Rendered only when SB_ENABLE_DEV_TOOLS is set
// (checked server-side in the layout) and shown when `?dev=1` is in the URL.
// See docs/adr/0004-dev-fake-clock.md.
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TIME_OFFSET_COOKIE } from "@/utils/dev-clock";

// Hydration gate: false on the server and during the first hydration pass, true
// once mounted on the client. Mirrors the useSyncExternalStore idiom used for
// client-only reads elsewhere (see kiosk.tsx), so the toolbar can read the
// cookie/clock without a setState-in-effect that would cascade a render.
const NEVER_CHANGES = () => () => {};

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function readOffset(): number {
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${TIME_OFFSET_COOKIE}=`));
  if (!match) return 0;
  const n = Number(
    decodeURIComponent(match.slice(TIME_OFFSET_COOKIE.length + 1))
  );
  return Number.isFinite(n) ? n : 0;
}

function writeOffset(offsetMs: number) {
  if (offsetMs === 0) {
    document.cookie = `${TIME_OFFSET_COOKIE}=; path=/; max-age=0`;
  } else {
    document.cookie = `${TIME_OFFSET_COOKIE}=${offsetMs}; path=/; max-age=${7 * 24 * 60 * 60}`;
  }
}

function toLocalInputValue(d: Date): string {
  // datetime-local wants "YYYY-MM-DDTHH:mm" in local time.
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

export function DevToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Rendered on the server too, so stay hidden until hydrated to keep SSR and
  // hydration in agreement.
  const hydrated = useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false
  );
  const [dismissed, setDismissed] = useState(false);
  const [offset, setOffset] = useState(0);
  // Real wall-clock, ticked once a second so the displayed simulated time stays
  // live. Kept in state (not a render-time Date.now()) to satisfy purity rules.
  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    // The cookie and the wall clock only exist on the client, so seed them once
    // after hydration. This one post-mount setState is unavoidable for reading
    // browser-only state (same exception suppressed for the RSVP deltas in
    // context.tsx); the per-second updates below come from the interval, which
    // the rule does not flag.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffset(readOffset());
    setNowMs(Date.now());
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!hydrated || dismissed || searchParams.get("dev") !== "1") return null;

  const apply = (nextOffset: number) => {
    writeOffset(nextOffset);
    setOffset(nextOffset);
    router.refresh();
  };

  const simulated = new Date(nowMs + offset);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-amber-100 border-t border-amber-400 text-amber-900 text-sm px-3 py-2 flex flex-wrap items-center gap-2 shadow">
      <span className="font-semibold">🕒 Dev clock</span>
      <span className="tabular-nums">
        {simulated.toISOString().replace("T", " ").slice(0, 16)} UTC
        {offset !== 0 && (
          <span className="ml-1 text-amber-700">
            ({offset > 0 ? "+" : ""}
            {Math.round(offset / HOUR_MS)}h)
          </span>
        )}
      </span>
      <button
        className="px-2 py-0.5 rounded border border-amber-500 hover:bg-amber-200"
        onClick={() => apply(0)}
      >
        Real time
      </button>
      <button
        className="px-2 py-0.5 rounded border border-amber-500 hover:bg-amber-200"
        onClick={() => apply(offset + HOUR_MS)}
      >
        +1h
      </button>
      <button
        className="px-2 py-0.5 rounded border border-amber-500 hover:bg-amber-200"
        onClick={() => apply(offset + DAY_MS)}
      >
        +1d
      </button>
      <button
        className="px-2 py-0.5 rounded border border-amber-500 hover:bg-amber-200"
        onClick={() => apply(offset + 7 * DAY_MS)}
      >
        +7d
      </button>
      <label className="flex items-center gap-1">
        <span className="sr-only">Pick date and time</span>
        <input
          type="datetime-local"
          className="rounded border border-amber-500 bg-white px-1 py-0.5"
          value={toLocalInputValue(simulated)}
          onChange={(e) => {
            const target = new Date(e.target.value);
            if (!Number.isNaN(target.getTime())) {
              apply(target.getTime() - Date.now());
            }
          }}
        />
      </label>
      <button
        className="ml-auto px-2 py-0.5 rounded border border-amber-500 hover:bg-amber-200"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss dev clock toolbar"
      >
        ✕
      </button>
    </div>
  );
}
