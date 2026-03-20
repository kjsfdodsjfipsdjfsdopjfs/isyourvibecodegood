import { NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.PRESHIP_ADMIN_TOKEN || "";
const API_BASE = "https://api.preship.dev";

interface ScanEntry {
  scanId: string;
  url: string;
  overallScore: number;
  status: string;
  createdAt?: string;
  pageTitle?: string;
  pageDescription?: string;
}

function getVerdict(score: number): { verdict: string; color: string } {
  if (score >= 80) return { verdict: "CLEAN", color: "#22C55E" };
  if (score >= 50) return { verdict: "MEH", color: "#FBBF24" };
  return { verdict: "BRUTAL", color: "#EF4444" };
}

export async function GET() {
  try {
    // Try to fetch recent scans from PreShip admin API
    const res = await fetch(
      `${API_BASE}/api/admin/scans?source=isyourvibecodegood&limit=20&sort=-createdAt`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": ADMIN_TOKEN,
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!res.ok) {
      // API might not support listing — return empty
      return NextResponse.json({ recentScans: [], topScores: [] });
    }

    const data = await res.json();
    const scans: ScanEntry[] = (data.data || data.scans || data || []).filter(
      (s: ScanEntry) => s.status === "completed" && s.overallScore != null
    );

    // Recent scans: last 5 completed
    const recentScans = scans.slice(0, 5).map((s) => ({
      scanId: s.scanId,
      score: s.overallScore,
      url: s.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "",
      pageTitle: s.pageTitle || null,
      pageDescription: s.pageDescription || null,
      ...getVerdict(s.overallScore),
    }));

    // Top scores this week: filter by date, sort by score desc
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyScans = scans.filter((s) => {
      if (!s.createdAt) return true; // Include if no date (assume recent)
      return new Date(s.createdAt) >= oneWeekAgo;
    });

    // Sort by score descending, deduplicate by URL (keep best score)
    const urlMap = new Map<string, ScanEntry>();
    for (const s of weeklyScans) {
      const cleanUrl = s.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "";
      const existing = urlMap.get(cleanUrl);
      if (!existing || s.overallScore > existing.overallScore) {
        urlMap.set(cleanUrl, s);
      }
    }

    const topScores = Array.from(urlMap.values())
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 10)
      .map((s, i) => ({
        rank: i + 1,
        scanId: s.scanId,
        score: s.overallScore,
        url: s.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "",
        pageTitle: s.pageTitle || null,
        pageDescription: s.pageDescription || null,
        ...getVerdict(s.overallScore),
      }));

    return NextResponse.json({ recentScans, topScores });
  } catch {
    return NextResponse.json({ recentScans: [], topScores: [] });
  }
}
