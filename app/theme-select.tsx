"use client";

import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Theme } from "@/utils/theme";
import { useTheme } from "./theme-context";

const OPTIONS: {
  value: Theme;
  label: string;
  hint: string;
  Icon: typeof SunIcon;
}[] = [
  {
    value: "system",
    label: "System",
    hint: "Follow your device's light/dark setting",
    Icon: ComputerDesktopIcon,
  },
  {
    value: "light",
    label: "Light",
    hint: "Always use light colours (dark text on white)",
    Icon: SunIcon,
  },
  {
    value: "dark",
    label: "Dark",
    hint: "Always use dark colours (light text on black)",
    Icon: MoonIcon,
  },
];

/**
 * `labelled` spells the options out; the footer, where space is scarce, keeps
 * the names for screen readers only and leans on the icons and the tooltip.
 */
export function ThemeSelect({ labelled }: { labelled?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Colour theme"
      // `--line`, not `--line-subtle`: this box is the outline of a control,
      // which WCAG 1.4.11 holds to 3:1 — the exemption the contrast test grants
      // dividers and hover fills does not reach it.
      className="inline-flex rounded-md border border-line overflow-hidden"
    >
      {OPTIONS.map(({ value, label, hint, Icon }) => (
        <button
          key={value}
          type="button"
          title={hint}
          // The chosen option is a pressed toggle, not a tint: see issue #802.
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className={clsx(
            // The ring is inset because `overflow-hidden` above would clip it
            // on the two outer buttons, leaving keyboard focus half-drawn.
            "flex items-center gap-1 px-2 py-1 cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-accent",
            theme === value
              ? "bg-surface-inverse text-fg-inverse"
              : "text-fg-muted hover:bg-surface-hover"
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className={labelled ? undefined : "sr-only"}>{label}</span>
        </button>
      ))}
    </div>
  );
}
