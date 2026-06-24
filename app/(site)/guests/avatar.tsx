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

  return (
    <div
      aria-hidden="true"
      className={clsx(
        className,
        dimensions,
        "shrink-0 rounded-full bg-rose-100 text-rose-600 font-semibold flex items-center justify-center overflow-hidden"
      )}
      onClick={onClick}
      onDrop={onDrop}
    >
      {image ? (
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={`Profile avatar of ${name}`}
          width="256"
          height="256"
        />
      ) : (
        initials(name) || "?"
      )}
    </div>
  );
}
