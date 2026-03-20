import { NextResponse } from "next/server";

const ADMIN_TOKEN = "preadmin_2832ce130a78225fa763647b4d7fd834";
const API_BASE = "https://api.preship.dev";

interface ScanEntry {
  id: string;
  url: string;
  score: number;
  status: string;
  source: string;
  createdAt: string;
  completedAt: string | null;
  error: string | null;
}

function getVerdict(score: number): { verdict: string; color: string } {
  if (score >= 80) return { verdict: "CLEAN", color: "#22C55E" };
  if (score >= 50) return { verdict: "MEH", color: "#FBBF24" };
  return { verdict: "BRUTAL", color: "#EF4444" };
}

export async function GET() {
  try {
    const res = await fetch(
      `${API_BASE}/api/admin/scans/recent?limit=100`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": ADMIN_TOKEN,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ recentScans: [], topScores: [] });
    }

    const data = await res.json();
    const scans: ScanEntry[] = (data.data || []).filter(
      (s: ScanEntry) => s.status === "completed" && s.score != null
    );

    // Recent scans: last 5 completed (skip example.com test scans)
    const recentScans = scans
      .filter((s) => !s.url.includes("example.com"))
      .slice(0, 5)
      .map((s) => ({
        scanId: s.id,
        score: s.score,
        url: s.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "",
        ...getVerdict(s.score),
      }));

    // Top scores this week: filter by date, sort by score desc
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyScans = scans.filter((s) => {
      if (!s.createdAt) return true;
      return new Date(s.createdAt) >= oneWeekAgo;
    });

    // Deduplicate by URL (keep best score), skip example.com
    const urlMap = new Map<string, ScanEntry>();
    for (const s of weeklyScans) {
      if (s.url.includes("example.com")) continue;
      const cleanUrl = s.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "";
      const existing = urlMap.get(cleanUrl);
      if (!existing || s.score > existing.score) {
        urlMap.set(cleanUrl, s);
      }
    }

    const topScores = Array.from(urlMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((s, i) => ({
        rank: i + 1,
        scanId: s.id,
        score: s.score,
        url: s.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "",
        ...getVerdict(s.score),
      }));

    return NextResponse.json({ recentScans, topScores });
  } catch {
    return NextResponse.json({ recentScans: [], topScores: [] });
  }
}
