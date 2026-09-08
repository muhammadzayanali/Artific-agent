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

  const apiBase = getDjangoUrl().replace(/\/$/, "");
  if (!apiBase || apiBase.includes("127.0.0.1") || apiBase.includes("localhost")) {
    // On Netlify/production this means DJANGO_API_URL was not set.
    if (process.env.NODE_ENV === "production" || process.env.CONTEXT) {
      return NextResponse.json(
        {
          detail:
            "Server misconfigured: set DJANGO_API_URL to your Railway API (https://artific-agent-production.up.railway.app).",
        },
        { status: 500 },
      );
    }
  }

  try {
    const upstream = await fetch(`${apiBase}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        detail: `Cannot reach Django API at ${apiBase}. Check DJANGO_API_URL. (${message})`,
      },
      { status: 502 },
    );
  }
}
