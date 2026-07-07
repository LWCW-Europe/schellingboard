"use client";

import { useSyncExternalStore } from "react";

// useSyncExternalStore compares snapshots with Object.is, so each getter must
// return a stable reference — otherwise it re-renders forever (React #185).
const EMPTY_TIMEZONES: string[] = [];
let cachedTimezones: string[] | null = null;
function getClientTimezones(): string[] {
  if (cachedTimezones === null) {
    // Older runtimes lack supportedValuesOf; the options below still offer
    // UTC and the current value, so the select stays usable.
    cachedTimezones =
      typeof Intl.supportedValuesOf === "function"
        ? Intl.supportedValuesOf("timeZone")
        : EMPTY_TIMEZONES;
  }
  return cachedTimezones;
}
function getServerTimezones(): string[] {
  return EMPTY_TIMEZONES;
}
const subscribeTimezones = () => () => {};

export function TimezoneSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const timezones = useSyncExternalStore(
    subscribeTimezones,
    getClientTimezones,
    getServerTimezones
  );
  // Always offer UTC and the current value (which may be an alias or a zone
  // missing from this browser's list) so the select never shows a blank —
  // including on the server render, where the Intl list is empty.
  const options = Array.from(new Set(["UTC", value, ...timezones])).filter(
    Boolean
  );

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
    >
      {options.map((tz) => (
        <option key={tz} value={tz}>
          {tz}
        </option>
      ))}
    </select>
  );
}
