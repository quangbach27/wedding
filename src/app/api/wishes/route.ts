import { wishRepository } from "@/lib/repository/wish";
import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 30;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const rawLimit = Number(params.get("limit") ?? DEFAULT_LIMIT);
  const limit = Number.isInteger(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const rawCursor = params.get("cursor");
  const cursor = rawCursor === null ? null : Number(rawCursor);
  if (cursor !== null && (!Number.isInteger(cursor) || cursor <= 0)) {
    return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
  }

  try {
    const page = await wishRepository.list({ limit, cursor });
    return NextResponse.json(page, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("list wishes failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
