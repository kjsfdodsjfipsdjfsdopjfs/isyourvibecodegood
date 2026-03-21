"use client";

import { useEffect, useState, use } from "react";
import {
  generateRoast,
  getScoreColor,
  getLetterGrade,
  getShipReadinessColor,
  getCategoryRoast,
  getPillarRoast,
  CATEGORY_META,
  PILLAR_META,
  type PillarData,
} from "@/lib/roast";

interface CategoryData {
  category: string;
  score: number;
  violations: number;
}

interface ScanData {
  scanId: string;
  status: string;
  url: string;
  overallScore: number;
  categories: CategoryData[];
  shipReadiness?: string;
  pillars?: PillarData[];
}

function Typewriter({ text, delay = 25 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          className="inline-block w-[2px] h-[1em] bg-roast ml-0.5 align-middle"
          style={{ animation: "typewriter-cursor 0.8s step-end infinite" }}
        />
      )}
    </span>
  );
}

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <>{value}</>;
}

function ShipReadinessBadge({ verdict }: { verdict: string }) {
  const color = getShipReadinessColor(verdict);
  return (
    <div
      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-[18px] sm:text-[22px] font-bold uppercase tracking-wide"
      style={{
        color,
        background: `${color}15`,
        border: `2px solid ${color}40`,
        boxShadow: `0 0 30px ${color}20`,
        animation: "slide-up 0.5s ease-out",
      }}
    >
      <span style={{ fontSize: "1.2em" }}>
        {verdict === "SHIP IT" && "🚀"}
        {verdict === "ALMOST READY" && "⚠️"}
        {verdict === "NEEDS WORK" && "🔧"}
        {verdict === "DO NOT SHIP" && "🚫"}
      </span>
      {verdict}
    </div>
  );
}

function PillarCard({
  pillar,
  animDelay,
}: {
  pillar: PillarData;
  animDelay: number;
}) {
  const meta = PILLAR_META[pillar.pillar];
  const pillarColor = getScoreColor(pillar.score);
  const roastText = getPillarRoast(pillar.pillar, pillar.score);

  return (
    <div
      className="bg-surface border border-border rounded-2xl p-5 sm:p-6"
      style={{ animation: `slide-up 0.5s ease-out ${animDelay}s both` }}
    >
      {/* Pillar header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[20px]">{meta?.emoji}</span>
          <span
            className="font-display text-[16px] sm:text-[18px] font-bold uppercase tracking-[1px]"
            style={{ color: pillarColor }}
          >
            {meta?.label || pillar.pillar}
          </span>
          <span className="font-mono text-[11px] text-neutral-600">
            ({meta?.weight})
          </span>
        </div>
        <span
          className="font-display text-[28px] sm:text-[32px] font-bold tabular-nums"
          style={{ color: pillarColor }}
        >
          {pillar.score}
        </span>
      </div>

      {/* Category sub-bars */}
      <div className="space-y-2.5 mb-4">
        {pillar.categories.map((cat) => {
          const catColor = getScoreColor(cat.score);
          const catMeta = CATEGORY_META[cat.category];
          return (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[12px] text-neutral-400 flex items-center gap-1.5">
                  <span className="text-[11px]">{catMeta?.icon}</span>
                  {catMeta?.label || cat.category}
                </span>
                <span
                  className="font-mono text-[12px] font-bold tabular-nums"
                  style={{ color: catColor }}
                >
                  {cat.score}
                </span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${cat.score}%`,
                    background: catColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pillar roast */}
      {roastText && (
        <p className="font-mono text-[12px] sm:text-[13px] text-roast leading-relaxed border-t border-border pt-3">
          &ldquo;{roastText}&rdquo;
        </p>
      )}
    </div>
  );
}

export default function RoastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [scan, setScan] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRoast, setShowRoast] = useState(false);

  useEffect(() => {
    async function fetchScan() {
      try {
        const res = await fetch(`/api/scan/${id}`);
        const data = await res.json();

        if (data.data?.status === "completed") {
          setScan(data.data);
          setLoading(false);
          setTimeout(() => setShowRoast(true), 1800);
        } else if (data.data?.status === "failed") {
          setError("Scan failed.");
          setLoading(false);
        } else {
          // Still processing, poll
          setTimeout(fetchScan, 3000);
        }
      } catch {
        setError("Failed to load results.");
        setLoading(false);
      }
    }
    fetchScan();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-ember-orange/30"
            style={{
              borderTopColor: "#F97316",
              animation: "spin 1s linear infinite",
            }}
          />
          <p className="font-mono text-[14px] text-roast animate-pulse">
            Loading your reality check...
          </p>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </main>
    );
  }

  if (error || !scan) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-score-bad mb-4">
            {error || "Reality check not found"}
          </p>
          <a
            href="/"
            className="font-mono text-sm text-ember-orange border-b border-ember-orange/30 hover:border-ember-orange"
          >
            Reality check another app
          </a>
        </div>
      </main>
    );
  }

  // Derive pillars from categories if API doesn't return them
  const PILLAR_DEFS: Record<string, { label: string; categories: string[] }> = {
    technical: { label: "Technical Reality", categories: ["accessibility", "security", "performance", "seo", "privacy", "mobile"] },
    product: { label: "Product Reality", categories: ["ux", "design", "human_appeal"] },
    business: { label: "Business Reality", categories: ["business", "revenue", "growth"] },
  };

  const derivedPillars: PillarData[] = scan.pillars && scan.pillars.length > 0
    ? scan.pillars
    : Object.entries(PILLAR_DEFS).map(([key, def]) => {
        const pillarCats = def.categories
          .map((catKey) => scan.categories.find((c) => c.category === catKey))
          .filter(Boolean) as CategoryData[];
        const avgScore = pillarCats.length > 0
          ? Math.round(pillarCats.reduce((sum, c) => sum + c.score, 0) / pillarCats.length)
          : 0;
        return {
          pillar: key,
          score: avgScore,
          categories: pillarCats.map((c) => ({ category: c.category, score: c.score })),
        };
      }).filter((p) => p.categories.length > 0);

  const hasPillars = derivedPillars.length > 0;

  const secScore =
    scan.categories.find((c) => c.category === "security")?.score ?? 0;
  const a11yScore =
    scan.categories.find((c) => c.category === "accessibility")?.score ?? 0;
  const perfScore =
    scan.categories.find((c) => c.category === "performance")?.score ?? 0;

  // Derive ship readiness from score if API doesn't return it
  const shipReadiness = scan.shipReadiness || (
    scan.overallScore >= 90 ? "SHIP IT" :
    scan.overallScore >= 70 ? "ALMOST READY" :
    scan.overallScore >= 50 ? "NEEDS WORK" : "DO NOT SHIP"
  );

  const roast = generateRoast(
    scan.overallScore,
    secScore,
    a11yScore,
    perfScore,
    scan.categories,
    derivedPillars
  );
  const scoreColor = getScoreColor(scan.overallScore);
  const grade = getLetterGrade(scan.overallScore);

  const shareText = encodeURIComponent(
    `My vibe-coded app got a Reality Check\n\nScore: ${scan.overallScore}/100 — Grade: ${grade} — ${shipReadiness}\n\n"${roast.overall.slice(0, 100)}"\n\nGet your reality check: isyourvibecodegood.com`
  );
  const shareUrl = encodeURIComponent(
    `https://isyourvibecodegood.com/roast/${id}`
  );

  // Fallback: old-style category cards when no pillars (pre-expansion scans)
  const legacyCategories = [
    {
      name: "SECURITY",
      key: "security",
      score: secScore,
      roast: roast.security,
      violations: scan.categories.find((c) => c.category === "security")?.violations ?? 0,
    },
    {
      name: "ACCESSIBILITY",
      key: "accessibility",
      score: a11yScore,
      roast: roast.accessibility,
      violations: scan.categories.find((c) => c.category === "accessibility")?.violations ?? 0,
    },
    {
      name: "PERFORMANCE",
      key: "performance",
      score: perfScore,
      roast: roast.performance,
      violations: scan.categories.find((c) => c.category === "performance")?.violations ?? 0,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-[20%] left-1/2 w-[500px] h-[500px] pointer-events-none z-0"
        style={{
          transform: "translateX(-50%)",
          background: `radial-gradient(circle, ${scoreColor}15, transparent 70%)`,
        }}
      />

      {/* Reality Check badge */}
      <span className="relative z-[1] font-mono text-[11px] sm:text-[13px] font-semibold tracking-[6px] uppercase mb-4" style={{ color: "#F97316" }}>
        Reality Check
      </span>

      {/* URL */}
      <p className="font-mono text-[14px] text-neutral-600 mb-6 relative z-[1]">
        {scan.url.replace(/^https?:\/\//, "")}
      </p>

      {/* Ship Readiness Verdict */}
      {scan.shipReadiness && showRoast && (
        <div className="relative z-[1] mb-6">
          <ShipReadinessBadge verdict={scan.shipReadiness} />
        </div>
      )}

      {/* Score */}
      <div className="relative z-[1] text-center mb-2">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${scoreColor}20, transparent 70%)`,
            animation: "glow-pulse 3s ease-in-out infinite alternate",
          }}
        />
        <p
          className="relative font-display text-[120px] sm:text-[150px] font-bold leading-none tabular-nums"
          style={{
            color: scoreColor,
            animation: "count-up 0.5s ease-out",
          }}
        >
          <CountUp target={scan.overallScore} />
        </p>
      </div>
      <p className="font-mono text-[16px] text-neutral-600 mb-2 relative z-[1]">
        / 100
      </p>
      <p
        className="font-display text-[32px] font-bold mb-8 relative z-[1]"
        style={{ color: scoreColor }}
      >
        Grade: {grade}
      </p>

      {/* Overall roast verdict */}
      {showRoast && (
        <div
          className="max-w-[520px] w-full mx-auto mb-10 px-6 py-5 bg-ember-orange/5 border border-ember-orange/15 rounded-xl relative z-[1]"
          style={{ animation: "slide-up 0.5s ease-out" }}
        >
          <p className="font-mono text-[16px] sm:text-[18px] text-roast leading-relaxed">
            &ldquo;<Typewriter text={roast.overall} />&rdquo;
          </p>
        </div>
      )}

      {/* === NEW: 3-Pillar Display (when pillars available) === */}
      {showRoast && hasPillars && (
        <div
          className="max-w-[720px] w-full mx-auto mb-10 relative z-[1]"
          role="list"
          aria-label="Score breakdown by pillar"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {derivedPillars.map((pillar, i) => (
              <PillarCard
                key={pillar.pillar}
                pillar={pillar}
                animDelay={0.2 + i * 0.2}
              />
            ))}
          </div>
        </div>
      )}

      {/* === LEGACY: Category cards (when no pillars) === */}
      {showRoast && !hasPillars && (
        <div className="max-w-[560px] w-full mx-auto space-y-4 mb-10 relative z-[1]" role="list" aria-label="Score breakdown by category">
          {legacyCategories.map((cat, i) => {
            const catColor = getScoreColor(cat.score);
            return (
              <div
                key={cat.name}
                role="listitem"
                aria-label={`${cat.name}: ${cat.score} out of 100`}
                className="bg-bg border border-border rounded-xl p-5 text-left"
                style={{
                  animation: `slide-up 0.5s ease-out ${0.2 + i * 0.2}s both`,
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className="font-display text-[14px] font-semibold uppercase tracking-[1px]"
                    style={{ color: catColor }}
                  >
                    {cat.name}
                    {cat.violations > 0 && (
                      <span className="text-neutral-600 text-[11px] ml-2 font-normal">
                        {cat.violations} issues
                      </span>
                    )}
                  </span>
                  <span
                    className="font-display text-[20px] font-bold tabular-nums"
                    style={{ color: catColor }}
                  >
                    {cat.score}/100
                  </span>
                </div>
                <div className="h-1 bg-border rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.score}%`,
                      background: catColor,
                      animation: `bar-fill 0.8s ease-out ${0.4 + i * 0.2}s both`,
                    }}
                  />
                </div>
                <p className="font-mono text-[13px] text-roast leading-relaxed">
                  &ldquo;{cat.roast}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Share buttons */}
      {showRoast && (
        <div
          className="flex flex-wrap gap-3 justify-center relative z-[1] mb-6"
          style={{ animation: "slide-up 0.5s ease-out 1s both" }}
        >
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1D9BF0] text-white font-display text-[14px] font-semibold hover:brightness-110 transition-all"
          >
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0A66C2] text-white font-display text-[14px] font-semibold hover:brightness-110 transition-all"
          >
            LinkedIn
          </a>
          <a
            href={`https://preship.dev/results/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-display text-[14px] font-semibold hover:brightness-110 transition-all"
            style={{
              background: "linear-gradient(135deg, #DC2626, #F97316)",
              boxShadow: "0 0 20px rgba(249,115,22,0.25)",
            }}
          >
            Fix My App
          </a>
        </div>
      )}

      {/* Roast another */}
      <a
        href="/"
        className="relative z-[1] font-mono text-[13px] text-neutral-600 hover:text-white transition-colors"
      >
        Reality check another app &rarr;
      </a>

      {/* Footer */}
      <div className="relative z-[1] mt-12 font-mono text-[12px] text-neutral-600">
        Powered by{" "}
        <a
          href="https://preship.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember-orange border-b border-ember-orange/30 hover:border-ember-orange"
        >
          PreShip
        </a>
      </div>
    </main>
  );
}
