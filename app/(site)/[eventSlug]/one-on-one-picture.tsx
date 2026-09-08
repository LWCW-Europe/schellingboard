import Image from "next/image";

import { isUnoptimized } from "@/utils/image-loader";

const PICTURE = "/one-on-one.webp";

export function OneOnOnePicture() {
  return (
    <Image
      src={PICTURE}
      alt="Two attendees in conversation"
      unoptimized={isUnoptimized(PICTURE)}
      // Taller than a room photo's 4:3 on purpose: this column is capped
      // narrower than a room (day-grid), and the height is what levels them.
      className="w-full aspect-[7/8] object-cover"
      width={525}
      height={600}
    />
  );
}
