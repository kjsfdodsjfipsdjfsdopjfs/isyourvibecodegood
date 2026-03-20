import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.preship.dev";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const res = await fetch(`${API_BASE}/api/scan/public/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return NextResponse.json(
        { error: data?.error || "Failed to fetch scan status" },
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
