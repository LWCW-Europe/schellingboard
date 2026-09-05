import Image from "next/image";

import { isUnoptimized } from "@/utils/image-loader";

// Shipped with the app rather than uploaded per event: every event's column is
// the same column, and an organizer has no room of their own to photograph for
// it.
//
// 7:8 where a room photo is 4:3, which is what makes the header row one line:
// this column is capped at 160px against a room's 240px (day-grid), so at 151
// and 231 px of picture the two shapes come out the same 173px tall.
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
      className="w-full aspect-[7/8] rounded object-cover"
      width={700}
      height={800}
    />
  );
}
