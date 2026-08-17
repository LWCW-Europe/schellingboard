"use client";

import clsx from "clsx";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { EVENT_ICONS, eventIconLabel } from "@/app/event-icons";

export function IconPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-wrap gap-1.5"
    >
      <IconOption
        name="No icon"
        selected={value === ""}
        onSelect={() => onChange("")}
      >
        <NoSymbolIcon className="h-5 w-5 text-fg-faint" />
      </IconOption>
      {Object.entries(EVENT_ICONS).map(([name, Icon]) => (
        <IconOption
          key={name}
          name={eventIconLabel(name)}
          selected={value === name}
          onSelect={() => onChange(name)}
        >
          <Icon className="h-5 w-5" />
        </IconOption>
      ))}
    </div>
  );
}

function IconOption({
  name,
  selected,
  onSelect,
  children,
}: {
  name: string;
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      title={name}
      onClick={onSelect}
      className={clsx(
        selected
          ? "border-brand-accent bg-brand-tint text-brand-fg"
          : "border-line text-fg-subtle hover:bg-surface-muted",
        "flex h-10 w-10 items-center justify-center rounded-md border"
      )}
    >
      {children}
    </button>
  );
}
