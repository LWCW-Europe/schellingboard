import clsx from "clsx";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Renders a placeholder avatar showing the guest's initials. Uploaded avatar
 * images are not supported yet; this is the fallback that will remain visible
 * until a real avatar exists.
 */
export function Avatar({
  name,
  size = "lg",
}: {
  name: string;
  size?: "lg" | "sm";
}) {
  const dimensions = size === "lg" ? "h-28 w-28 text-3xl" : "h-12 w-12 text-sm";

  return (
    <div
      aria-hidden="true"
      className={clsx(
        dimensions,
        "shrink-0 rounded-full bg-rose-100 text-rose-600 font-semibold flex items-center justify-center"
      )}
    >
      {initials(name) || "?"}
    </div>
  );
}
