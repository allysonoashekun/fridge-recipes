import { NextResponse, type NextRequest } from "next/server";
import { analyzeImage, claudeErrorResponse } from "@/lib/claude";
import { consumeQuota, requireUser } from "@/lib/guard";
import { getStaples } from "@/lib/pantry";

export const maxDuration = 60;

// Vercel rejects request bodies over about 4.5 MB before this route runs.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type ImageType = (typeof IMAGE_TYPES)[number];

function isImageType(type: string): type is ImageType {
  return (IMAGE_TYPES as readonly string[]).includes(type);
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  // Multipart overhead is small, so this rejects oversized bodies before parsing.
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_UPLOAD_BYTES + 1024) {
    return NextResponse.json({ error: "Image is too large" }, { status: 413 });
  }

  const form = await request.formData().catch(() => null);
  const image = form?.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (image.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image is too large" }, { status: 413 });
  }
  if (!isImageType(image.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
  }

  const blocked = await consumeQuota(auth);
  if (blocked) return blocked;

  try {
    const staples = await getStaples(auth);
    const data = Buffer.from(await image.arrayBuffer()).toString("base64");
    return NextResponse.json(await analyzeImage(data, image.type, staples));
  } catch (error) {
    return claudeErrorResponse(error);
  }
}
