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

// Only show vibe-coded apps in the leaderboard — filter out big/famous sites
const VIBE_CODE_PATTERNS = [
  ".lovable.app", ".vercel.app", ".netlify.app", ".railway.app",
  ".replit.app", ".replit.dev", ".stackblitz.io", ".glitch.me",
  ".surge.sh", ".fly.dev", ".render.com", ".pages.dev",
  ".web.app", ".firebaseapp.com", ".amplifyapp.com",
  ".github.io", ".gitlab.io", ".onrender.com",
  ".bolt.new", ".v0.dev", ".base44.app", ".windsurf.build",
];

// Famous sites that shouldn't appear in the leaderboard
const BLOCKED_DOMAINS = [
  "example.com", "t.co",
  "google.com", "facebook.com", "twitter.com", "x.com",
  "perplexity.ai", "claude.ai", "chatgpt.com", "openai.com",
  "figma.com", "vercel.com", "www.vercel.com", "netlify.com",
  "github.com", "gitlab.com", "stackoverflow.com",
  "segment.com", "deel.com", "unkey.dev", "phind.com",
  "stripe.com", "amazon.com", "apple.com", "microsoft.com",
  "youtube.com", "reddit.com", "linkedin.com", "instagram.com",
  "preship.dev", "lovable.app", "lovable.dev",
  "abeg.xyz", "bolt.new", "v0.dev",
  "notion.so", "tldraw.com", "linear.app", "vercel.app",
  "netlify.com", "railway.app", "supabase.com", "planetscale.com",
  "neon.tech", "clerk.com", "resend.com", "cal.com",
  "midjourney.com", "anthropic.com", "huggingface.co",
  "showmeonmap.com",
];

function isVibeCodedApp(url: string): boolean {
  const clean = url.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
  // Check if it matches a vibe-code hosting pattern
  if (VIBE_CODE_PATTERNS.some((p) => clean.includes(p))) return true;
  // Block known big/famous sites
  if (BLOCKED_DOMAINS.some((d) => clean === d || clean === "www." + d || clean.startsWith(d + "/") || clean.startsWith("www." + d + "/"))) return false;
  // Allow everything else (custom domains that might be vibe-coded)
  return true;
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

    // Recent scans: last 5 completed (skip example.com, deduplicate by URL)
    const recentSeen = new Set<string>();
    const recentScans = scans
      .filter((s) => {
        if (!isVibeCodedApp(s.url)) return false;
        const clean = s.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || "";
        if (recentSeen.has(clean)) return false;
        recentSeen.add(clean);
        return true;
      })
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
      if (!isVibeCodedApp(s.url)) continue;
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
