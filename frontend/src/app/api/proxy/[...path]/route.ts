import { NextRequest, NextResponse } from "next/server";

import { ACCESS_COOKIE } from "@/lib/auth";
import { getDjangoUrl } from "@/lib/api";

async function forward(request: NextRequest, path: string[]) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const target = `${getDjangoUrl()}/api/${path.join("/")}/${url.search}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const init: RequestInit = { method: request.method, headers };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // Keep boundary for Django MultiPartParser
      headers["Content-Type"] = contentType;
      init.body = await request.arrayBuffer();
    } else {
      headers["Content-Type"] = "application/json";
      init.body = await request.text();
    }
  }

  const upstream = await fetch(target, init);
  const text = await upstream.text();
  const upstreamType = upstream.headers.get("Content-Type") || "application/json";
  return new NextResponse(text || null, {
    status: upstream.status,
    headers: { "Content-Type": upstreamType },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forward(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forward(request, path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forward(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forward(request, path);
}
