"use client";

import { useState } from "react";
import Image from "next/image";
import { initials } from "@/app/(site)/guests/avatar";
import { Modal } from "@/app/(site)/modals";
import {
  AVATAR_ENLARGED_MAX_CSS_PX,
  AVATAR_MAX_SIZE,
} from "@/utils/avatar-image-constraints";

/**
 * Widest the profile shows a photo, in CSS pixels. Recognising a face is what
 * the picture is for, so it is shown at this size outright rather than behind a
 * click; the enlarged view is then only for looking closely.
 *
 * Caps the box and is what next/image is told, so raising it can't leave the
 * browser stretching a thumbnail-sized rendition.
 */
const PROFILE_PHOTO_SIZE = 256;

/**
 * The photo on a guest's profile. Clicking it opens the full stored
 * resolution; an initials placeholder renders non-interactive, since there is
 * nothing to enlarge.
 *
 * Square rather than round like the list's `Avatar`: a circle discards the
 * corners of the stored square crop, which goes unnoticed on a thumbnail but
 * eats hair and shoulders at this size.
 */
export function ProfilePhoto({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  const [open, setOpen] = useState(false);

  // aria-hidden: the name is right below as a heading, and the button already
  // carries its own label, so the alt text (or the initials) only repeats it.
  const photo = (
    <div
      aria-hidden="true"
      style={{ maxWidth: PROFILE_PHOTO_SIZE }}
      className="w-full aspect-square overflow-hidden rounded-2xl bg-brand-tint-hover text-brand-fg text-6xl font-semibold flex items-center justify-center"
    >
      {image ? (
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={`Profile avatar of ${name}`}
          width={PROFILE_PHOTO_SIZE}
          height={PROFILE_PHOTO_SIZE}
        />
      ) : (
        initials(name) || "?"
      )}
    </div>
  );

  if (!image) {
    return photo;
  }

  return (
    <>
      {/* w-full so the button tracks the photo exactly: narrower and the photo
          would overflow it, wider and it would swallow taps beside the photo
          and draw a focus ring around empty space.
          focus-visible, not focus: closing the modal restores focus here, so a
          plain :focus ring would linger around the photo after a mouse user
          dismissed the enlarged view. Keyboard users still get the ring. */}
      <button
        type="button"
        aria-label={`Enlarge photo of ${name}`}
        style={{ maxWidth: PROFILE_PHOTO_SIZE }}
        className="w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        onClick={() => setOpen(true)}
      >
        {photo}
      </button>
      {/* z-40 so the enlarged photo (and its dismiss-on-outside-click backdrop)
          covers the fixed nav bar, which is z-30. */}
      <Modal open={open} setOpen={setOpen} zIndex="z-40">
        {/* Avatars are stored as squares of at most AVATAR_MAX_SIZE, so the
            width/height below give the right aspect ratio and let next/image
            serve a rendition that fits the screen. maxWidth caps the displayed
            size: past this the image would be upscaled and look soft. */}
        <Image
          src={image}
          alt={`Enlarged profile picture of ${name}`}
          className="mx-auto h-auto w-full max-h-[80vh] object-contain"
          style={{ maxWidth: AVATAR_ENLARGED_MAX_CSS_PX }}
          width={AVATAR_MAX_SIZE}
          height={AVATAR_MAX_SIZE}
          sizes={`(max-width: ${AVATAR_ENLARGED_MAX_CSS_PX}px) 100vw, ${AVATAR_ENLARGED_MAX_CSS_PX}px`}
        />
      </Modal>
    </>
  );
}
