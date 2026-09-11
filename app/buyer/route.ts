import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // If Next.js client-side router requested RSC flight data, signal client navigation to full page
  if (
    request.headers.get("rsc") === "1" ||
    request.headers.get("next-router-prefetch") === "1"
  ) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "x-nextjs-redirect": "/buyer",
      },
    });
  }

  const filePath = path.join(process.cwd(), "public", "buyer", "index.html");
  const html = await fs.readFile(filePath, "utf-8");

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
