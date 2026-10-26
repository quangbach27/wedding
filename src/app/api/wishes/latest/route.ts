import { wishRepository } from "@/lib/repository/wish";
import { connection, NextResponse } from "next/server";

export async function GET() {
  await connection();

  try {
    const wish = await wishRepository.getLatest();
    return NextResponse.json(wish, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("latest wish failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
