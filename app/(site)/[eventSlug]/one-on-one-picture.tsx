import Image from "next/image";

import { isUnoptimized } from "@/utils/image-loader";

// Shipped with the app rather than uploaded per event: every event's column is
// the same column, and an organizer has no room of their own to photograph for
// it. 800×600, the size and 4:3 shape the room photos are held to.
const PICTURE = "/one-on-one.jpg";

/**
 * The 1-on-1 column's picture, in the header row where the rooms have theirs,
 * so the column reads as one of them.
 */
export function OneOnOnePicture() {
  return (
    <Image
      src={PICTURE}
      alt="Two attendees in conversation"
      unoptimized={isUnoptimized(PICTURE)}
      className="w-full aspect-[4/3] rounded object-cover"
      style={{ maxHeight: 200 }}
      width={800}
      height={600}
    />
  );
}
