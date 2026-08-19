import clsx from "clsx";
import { DragEventHandler, MouseEventHandler } from "react";
import Image from "next/image";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Renders the user-uploaded avatar image or a placeholder avatar showing
 * the guest's initials as a fallback.
 */
export function Avatar({
  className,
  name,
  size = "lg",
  image,
  onDrop,
  onClick,
}: {
  className?: string;
  name: string;
  size?: "lg" | "sm";
  image?: string;
  onDrop?: DragEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  const dimensions = size === "lg" ? "h-28 w-28 text-3xl" : "h-12 w-12 text-sm";
  // Matches the box above (h-28 = 112px, h-12 = 48px). Stored avatars are up to
  // 1024px, so declaring the displayed size is what keeps next/image's 2x
  // srcset entry at a thumbnail-sized rendition instead of a 640px one.
  const renderedSize = size === "lg" ? 112 : 48;

  return (
    <div
      aria-hidden="true"
      className={clsx(
        className,
        dimensions,
        "shrink-0 rounded-full bg-brand-tint-hover text-brand-fg font-semibold flex items-center justify-center overflow-hidden"
      )}
      onClick={onClick}
      onDrop={onDrop}
    >
      {image ? (
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={`Profile avatar of ${name}`}
          width={renderedSize}
          height={renderedSize}
        />
      ) : (
        initials(name) || "?"
      )}
    </div>
  );
}
