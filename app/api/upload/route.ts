import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // Check if Vercel Blob token is available
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      try {
        // Dynamic import to avoid build errors if package is absent
        const { put } = await import("@vercel/blob");
        for (const file of files) {
          const blob = await put(`lots/${Date.now()}-${file.name}`, file, {
            access: "public",
            token: blobToken,
          });
          uploadedUrls.push(blob.url);
        }
        return NextResponse.json({ urls: uploadedUrls, storage: "vercel-blob" });
      } catch (err) {
        console.warn("Vercel Blob upload failed, falling back to base64 encoding:", err);
      }
    }

    // Fallback: convert files to Base64 Data URLs
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = file.type || "image/jpeg";
      uploadedUrls.push(`data:${mimeType};base64,${base64}`);
    }

    return NextResponse.json({
      urls: uploadedUrls,
      storage: "base64-data-url",
      message: "Stored as lightweight base64 Data URLs. Set BLOB_READ_WRITE_TOKEN for Vercel Blob storage.",
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Failed to process image upload" },
      { status: 500 }
    );
  }
}
