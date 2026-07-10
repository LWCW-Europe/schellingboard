import { NextRequest, NextResponse } from "next/server";
import { getImageRepositories } from "@/utils/images";

// Serves admin-uploaded location images from UPLOADS_DIR. URLs carry a
// ?v= cache-buster set on upload, so responses can be cached aggressively.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const image = await getImageRepositories().locations.read(filename);
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
