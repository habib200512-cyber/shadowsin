import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { uploadMedia } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: "Archivo muy grande (máx 50MB)" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    let resourceType: "image" | "video" | "raw" = "image";
    if (file.type.startsWith("video/")) resourceType = "video";
    else if (file.type.startsWith("audio/")) resourceType = "raw";

    const result = await uploadMedia(base64, "shadowsin/posts", resourceType);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
