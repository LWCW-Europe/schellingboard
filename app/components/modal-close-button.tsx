"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";

// The one way out of a dialog, in the same corner everywhere. Painted the
// panel's own colour: invisible on a plain modal, legible over the map image.
export function ModalCloseButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className={`rounded-md bg-surface-raised p-1.5 text-fg-subtle hover:bg-surface-sunken hover:text-fg-muted focus:outline-none focus:ring-2 focus:ring-brand-accent ${className}`}
    >
      <XMarkIcon className="h-6 w-6 stroke-2" aria-hidden="true" />
    </button>
  );
}
