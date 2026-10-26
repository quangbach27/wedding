import { rsvpRepository } from "@/lib/repository/rsvp";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/rsvp/[id]">,
) {
  const { id } = await ctx.params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const rsvp = await rsvpRepository.getById(numericId);
    if (!rsvp) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(rsvp, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("get rsvp failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
