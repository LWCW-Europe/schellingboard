"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar } from "@/app/(site)/guests/avatar";
import { Modal } from "@/app/(site)/modals";

/**
 * An {@link Avatar} that, when it has an uploaded image, can be clicked to open a
 * larger view of that image. Initials placeholders (no image) render as a plain,
 * non-interactive Avatar — there is nothing to enlarge.
 */
export function ZoomableAvatar({
  name,
  image,
}: {
  name: string;
  image?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!image) {
    return <Avatar name={name} />;
  }

  return (
    <>
      {/* w-fit: as a flex item the button would otherwise stretch to the full
          width of a stacked (mobile) header, well past the round photo.
          focus-visible, not focus: closing the modal restores focus here, so a
          plain :focus ring would linger around the photo after a mouse user
          dismissed the enlarged view. Keyboard users still get the ring. */}
      <button
        type="button"
        aria-label={`Enlarge photo of ${name}`}
        className="w-fit rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        onClick={() => setOpen(true)}
      >
        <Avatar name={name} image={image} />
      </button>
      {/* z-40 so the enlarged photo (and its dismiss-on-outside-click backdrop)
          covers the fixed nav bar, which is z-30. */}
      <Modal open={open} setOpen={setOpen} zIndex="z-40">
        {/* User-uploaded image of arbitrary dimensions: serve it directly
            (unoptimized) and bound it to the viewport so tall/wide photos stay
            fully visible. */}
        <Image
          src={image}
          alt={`Enlarged profile picture of ${name}`}
          className="mx-auto h-auto w-full max-h-[80vh] object-contain"
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
        />
      </Modal>
    </>
  );
}
