"use client";

import { useEffect, useState, use } from "react";
import { generateRoast, getScoreColor, getLetterGrade } from "@/lib/roast";

interface ScanData {
  scanId: string;
  status: string;
  url: string;
  overallScore: number;
  categories: { category: string; score: number; violations: number }[];
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

export default function RoastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [scan, setScan] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRoast, setShowRoast] = useState(false);

  useEffect(() => {
    async function fetchScan() {
      try {
        const res = await fetch(
          `https://api.preship.dev/api/scan/public/${id}`
        );
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
            Loading your roast...
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
            {error || "Roast not found"}
          </p>
          <a
            href="/"
            className="font-mono text-sm text-ember-orange border-b border-ember-orange/30 hover:border-ember-orange"
          >
            Roast another app
          </a>
        </div>
      </main>
    );
  }

  const secScore =
    scan.categories.find((c) => c.category === "security")?.score ?? 0;
  const a11yScore =
    scan.categories.find(
      (c) => c.category === "accessibility"
    )?.score ?? 0;
  const perfScore =
    scan.categories.find(
      (c) => c.category === "performance"
    )?.score ?? 0;

  const roast = generateRoast(scan.overallScore, secScore, a11yScore, perfScore);
  const scoreColor = getScoreColor(scan.overallScore);
  const grade = getLetterGrade(scan.overallScore);

  const shareText = encodeURIComponent(
    `My vibe-coded app got ROASTED\n\nScore: ${scan.overallScore}/100 — Grade: ${grade}\n\n"${roast.overall.slice(0, 100)}"\n\nGet roasted: isyourvibecodegood.com`
  );
  const shareUrl = encodeURIComponent(
    `https://isyourvibecodegood.com/roast/${id}`
  );

  const categories = [
    {
      name: "SECURITY",
      score: secScore,
      roast: roast.security,
      violations: scan.categories.find((c) => c.category === "security")?.violations ?? 0,
    },
    {
      name: "ACCESSIBILITY",
      score: a11yScore,
      roast: roast.accessibility,
      violations: scan.categories.find((c) => c.category === "accessibility")?.violations ?? 0,
    },
    {
      name: "PERFORMANCE",
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

      {/* URL */}
      <p className="font-mono text-[14px] text-neutral-600 mb-6 relative z-[1]">
        {scan.url.replace(/^https?:\/\//, "")}
      </p>

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

      {/* Category roasts */}
      {showRoast && (
        <div className="max-w-[560px] w-full mx-auto space-y-4 mb-10 relative z-[1]">
          {categories.map((cat, i) => {
            const catColor = getScoreColor(cat.score);
            return (
              <div
                key={cat.name}
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
        Roast another app &rarr;
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
