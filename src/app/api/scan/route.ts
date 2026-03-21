import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.PRESHIP_ADMIN_TOKEN || "";
const API_BASE = "https://api.preship.dev";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Try admin endpoint first (faster, no rate limit), fall back to public
    const endpoint = ADMIN_TOKEN
      ? `${API_BASE}/api/admin/scan`
      : `${API_BASE}/api/scan/public`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (ADMIN_TOKEN) {
      headers["X-Admin-Token"] = ADMIN_TOKEN;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ url, source: "isyourvibecodegood" }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return NextResponse.json(
        { error: data?.error || "Failed to start scan" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
