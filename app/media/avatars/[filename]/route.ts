// Serves user-uploaded location images from SB_UPLOADS_DIR. URLs carry a
// ?v= cache-buster set on upload, so responses can be cached aggressively.
import { NextRequest, NextResponse } from "next/server";
import { getImageRepositories } from "@/utils/images";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  const image = await getImageRepositories().avatars.read(filename);
  if (!image) {
    return new NextResponse("Not Found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
