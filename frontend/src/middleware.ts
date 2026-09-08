import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ACCESS_COOKIE } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/panel") && !token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/login"],
};
