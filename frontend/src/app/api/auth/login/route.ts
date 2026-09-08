import { NextResponse } from "next/server";

import { ACCESS_COOKIE, REFRESH_COOKIE, cookieOptions } from "@/lib/auth";
import { getDjangoUrl } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { detail: "Enter your email and password." },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${getDjangoUrl()}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return NextResponse.json(
      { detail: data.detail ?? "Invalid email or password." },
      { status: upstream.status },
    );
  }

  const response = NextResponse.json({ user: data.user });
  response.cookies.set(ACCESS_COOKIE, data.access, {
    ...cookieOptions,
    maxAge: 60 * 30,
  });
  response.cookies.set(REFRESH_COOKIE, data.refresh, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
