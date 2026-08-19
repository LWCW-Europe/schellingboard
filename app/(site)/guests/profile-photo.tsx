"use client";

import Image from "next/image";
import { initials } from "@/app/(site)/guests/avatar";

/**
 * Widest the profile shows a photo, in CSS pixels. Recognising a face is what
 * the picture is for, so it is shown at this size outright rather than behind a
 * click; enlarging it is then only for looking closely.
 */
export const PROFILE_PHOTO_SIZE = 256;

/**
 * The enlarged size. Half of `AVATAR_MAX_SIZE`, so a 2× screen fills exactly
 * the stored pixels and anything wider would start upscaling them.
 */
export const PROFILE_PHOTO_ZOOM_SIZE = 512;

/**
 * The photo on a guest's profile. Clicking it swaps it to the enlarged size in
 * place — deliberately not a second modal layer over the profile modal, which
 * would mean two focus traps and an Escape key that has to disambiguate them.
 * An initials placeholder renders non-interactive, since there is nothing to
 * enlarge.
 *
 * Square rather than round like the list's `Avatar`: a circle discards the
 * corners of the stored square crop, which goes unnoticed on a thumbnail but
 * eats hair and shoulders at this size.
 */
export function ProfilePhoto({
  name,
  image,
  zoomed = false,
  onToggleZoom,
}: {
  name: string;
  image?: string;
  zoomed?: boolean;
  onToggleZoom?: () => void;
}) {
  const size = zoomed ? PROFILE_PHOTO_ZOOM_SIZE : PROFILE_PHOTO_SIZE;

  // aria-hidden: the name is right below as a heading, and the button already
  // carries its own label, so the alt text (or the initials) only repeats it.
  const photo = (
    <div
      aria-hidden="true"
      style={{ maxWidth: size }}
      className="w-full aspect-square overflow-hidden rounded-2xl bg-brand-tint-hover text-brand-fg text-6xl font-semibold flex items-center justify-center"
    >
      {image ? (
        // width/height only fix the aspect ratio here; `sizes` is what decides
        // which rendition is fetched, so enlarging asks for a sharper one and
        // the browser keeps showing the cached smaller image until it lands.
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={`Profile avatar of ${name}`}
          width={PROFILE_PHOTO_ZOOM_SIZE}
          height={PROFILE_PHOTO_ZOOM_SIZE}
          sizes={`${size}px`}
        />
      ) : (
        initials(name) || "?"
      )}
    </div>
  );

  if (!image || !onToggleZoom) {
    return photo;
  }

  return (
    // w-full so the button tracks the photo exactly: narrower and the photo
    // would overflow it, wider and it would swallow taps beside the photo and
    // draw a focus ring around empty space.
    <button
      type="button"
      aria-label={`${zoomed ? "Shrink" : "Enlarge"} photo of ${name}`}
      aria-pressed={zoomed}
      style={{ maxWidth: size }}
      className="w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      onClick={onToggleZoom}
    >
      {photo}
    </button>
  );
}
