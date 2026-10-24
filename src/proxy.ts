import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  if (currentPath === "/") {
    return NextResponse.redirect(new URL("/groom", request.url));
  }
}

// Optionally configure matcher to run only on specific paths
export const config = {
  matcher: "/",
};
