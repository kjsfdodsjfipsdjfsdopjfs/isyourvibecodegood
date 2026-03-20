"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EMBER_PARTICLES = [
  { x: "5%", size: "4px", dur: "3s", delay: "0s", drift: "20px", color: "#EF4444" },
  { x: "12%", size: "3px", dur: "2.5s", delay: "0.5s", drift: "-15px", color: "#F97316" },
  { x: "20%", size: "5px", dur: "3.5s", delay: "1s", drift: "10px", color: "#FBBF24" },
  { x: "28%", size: "2px", dur: "2.8s", delay: "0.3s", drift: "-25px", color: "#DC2626" },
  { x: "35%", size: "4px", dur: "3.2s", delay: "0.8s", drift: "15px", color: "#F97316" },
  { x: "42%", size: "3px", dur: "2.6s", delay: "1.2s", drift: "-10px", color: "#EF4444" },
  { x: "50%", size: "6px", dur: "3.8s", delay: "0.2s", drift: "30px", color: "#FBBF24" },
  { x: "58%", size: "3px", dur: "2.9s", delay: "0.7s", drift: "-20px", color: "#DC2626" },
  { x: "65%", size: "5px", dur: "3.1s", delay: "1.5s", drift: "12px", color: "#F97316" },
  { x: "72%", size: "2px", dur: "3.4s", delay: "0.9s", drift: "-18px", color: "#EF4444" },
  { x: "80%", size: "4px", dur: "2.7s", delay: "0.4s", drift: "22px", color: "#FBBF24" },
  { x: "87%", size: "3px", dur: "3.3s", delay: "1.1s", drift: "-14px", color: "#DC2626" },
  { x: "93%", size: "5px", dur: "3.6s", delay: "0.6s", drift: "18px", color: "#F97316" },
  { x: "8%", size: "3px", dur: "2.4s", delay: "1.8s", drift: "-28px", color: "#FBBF24" },
  { x: "48%", size: "4px", dur: "3.7s", delay: "0.1s", drift: "8px", color: "#EF4444" },
  { x: "75%", size: "6px", dur: "2.3s", delay: "1.3s", drift: "-22px", color: "#F97316" },
  { x: "32%", size: "3px", dur: "4s", delay: "0.5s", drift: "25px", color: "#DC2626" },
  { x: "62%", size: "2px", dur: "2.1s", delay: "2s", drift: "-12px", color: "#FBBF24" },
];

interface KillFeedItem {
  score: number;
  url: string;
  verdict: string;
  color: string;
  scanId?: string;
}

interface TopScoreItem {
  rank: number;
  score: number;
  url: string;
  verdict: string;
  color: string;
  scanId?: string;
}

const FALLBACK_KILL_FEED: KillFeedItem[] = [
  { score: 23, url: "todo-app.lovable.app", verdict: "BRUTAL", color: "#EF4444" },
  { score: 61, url: "crypto-dash.vercel.app", verdict: "MEH", color: "#FBBF24" },
  { score: 14, url: "ai-chat-clone.netlify.app", verdict: "BRUTAL", color: "#EF4444" },
  { score: 87, url: "portfolio-v3.vercel.app", verdict: "CLEAN", color: "#22C55E" },
  { score: 31, url: "flappy-bird.lovable.app", verdict: "BRUTAL", color: "#EF4444" },
];

const ASCII_FIRE = `         (  .      )
       )           (              )
             .  '   .   '  .  '  .
    (    , )       (.   )  (   ',    )
     .' ) ( . )    ,  ( ,     )   ( .
  ). , ( .   (  ) ( , ')  .' (  ,    )
 (_,,._,,)_,, )  (,,._,,)  (_,,._,,)_,,)
(_,,,._,,,._,,,._,,,._,,,._,,,._,,,._,,)`;

const LOADING_MESSAGES = [
  "Analyzing your crimes against web development...",
  "Counting the security holes...",
  "Wondering who let you ship this...",
  "Checking if screen readers are crying...",
  "Measuring how slow this thing really is...",
  "Preparing your roast...",
  "Finding the kindest way to destroy you...",
  "Looking for something nice to say... nope...",
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState("");
  const [killFeed, setKillFeed] = useState<KillFeedItem[]>(FALLBACK_KILL_FEED);
  const [topScores, setTopScores] = useState<TopScoreItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.recentScans?.length > 0) setKillFeed(data.recentScans);
        if (data.topScores?.length > 0) setTopScores(data.topScores);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    let scanUrl = url.trim();
    if (!scanUrl.startsWith("http://") && !scanUrl.startsWith("https://")) {
      scanUrl = "https://" + scanUrl;
    }

    setLoading(true);
    setError("");

    // Rotate loading messages
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]!);
    }, 3000);

    try {
      // Start scan via server-side proxy (uses admin API, no rate limit)
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to start scan");
      }

      const { data } = await res.json();
      const scanId = data.scanId;

      // Poll for results
      let attempts = 0;
      const maxAttempts = 60; // 2 minutes
      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 3000));
        const pollRes = await fetch(`/api/scan/${scanId}`);
        const pollData = await pollRes.json();

        if (pollData.data?.status === "completed") {
          clearInterval(msgInterval);
          router.push(`/roast/${scanId}`);
          return;
        }

        if (pollData.data?.status === "failed") {
          throw new Error("Scan failed. The site might be blocking our scanner.");
        }

        attempts++;
      }

      throw new Error("Scan timed out. Try again later.");
    } catch (err: unknown) {
      clearInterval(msgInterval);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Fire floor glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(to top, rgba(220,38,38,0.08), rgba(249,115,22,0.04) 30%, rgba(251,191,36,0.02) 60%, transparent)",
          animation: "fire-floor-pulse 3s ease-in-out infinite",
        }}
      />
      {/* Fire line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-[1]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #7F1D1D 10%, #DC2626 30%, #F97316 50%, #DC2626 70%, #7F1D1D 90%, transparent)",
          boxShadow:
            "0 0 10px #DC2626, 0 0 30px #F97316, 0 0 60px rgba(249,115,22,0.3)",
        }}
      />

      {/* Giant bottom glow */}
      <div
        className="absolute bottom-[-10%] left-1/2 w-[900px] h-[600px] pointer-events-none z-0"
        style={{
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(220,38,38,0.15), rgba(249,115,22,0.1) 20%, rgba(251,191,36,0.05) 40%, transparent 70%)",
          animation: "glow-pulse 4s ease-in-out infinite alternate",
        }}
      />

      {/* Smoke wisps */}
      {[
        { top: "25%", left: "20%", dur: "5s", delay: "0s" },
        { top: "30%", left: "55%", dur: "6s", delay: "1s" },
        { top: "40%", left: "35%", dur: "4.5s", delay: "2s" },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute w-[200px] h-[100px] rounded-full pointer-events-none z-0"
          style={{
            top: s.top,
            left: s.left,
            background:
              "radial-gradient(ellipse, rgba(249,115,22,0.08), transparent)",
            animation: `smoke-drift ${s.dur} ${s.delay} ease-out infinite`,
          }}
        />
      ))}

      {/* Ember particles */}
      <div className="absolute bottom-[10%] left-0 right-0 h-px pointer-events-none z-0">
        {EMBER_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${parseInt(p.size) * 3}px ${p.color}`,
              animation: `ember-rise ${p.dur} ${p.delay} ease-out infinite`,
              // @ts-expect-error CSS custom property
              "--drift": p.drift,
            }}
          />
        ))}
      </div>

      {/* ASCII Fire */}
      <pre
        className="font-mono text-[10px] leading-[1.15] text-center select-none relative z-[1] mb-6"
        style={{ animation: "fire-pulse 2s ease-in-out infinite alternate" }}
      >
        {ASCII_FIRE.split("\n").map((line, i) => {
          const colors = [
            "#FBBF24",
            "#FBBF24",
            "#F97316",
            "#F97316",
            "#DC2626",
            "#DC2626",
            "#EF4444",
            "#7F1D1D",
          ];
          return (
            <span key={i} style={{ color: colors[i] || "#7F1D1D" }}>
              {line}
              {"\n"}
            </span>
          );
        })}
      </pre>

      {/* The Question */}
      <div
        className="text-center relative z-[1] mb-12"
        style={{ animation: "crt-flicker 4s linear infinite" }}
      >
        <span className="block font-display text-[20px] sm:text-[28px] font-normal tracking-[6px] uppercase opacity-50">
          is your
        </span>
        <span
          className="block font-display text-[48px] sm:text-[80px] font-bold leading-none tracking-[-2px]"
          style={{
            background:
              "linear-gradient(135deg, #fff 0%, #FBBF24 50%, #F97316 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Vibe Code
        </span>
        <span
          className="block font-display text-[48px] sm:text-[80px] font-bold leading-none tracking-[-2px]"
          style={{
            background: "linear-gradient(135deg, #F97316, #DC2626)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Good?
        </span>
      </div>

      {/* Terminal Prompt */}
      {loading ? (
        <div className="relative z-[1] text-center">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-ember-orange/30"
            style={{
              borderTopColor: "#F97316",
              animation: "spin 1s linear infinite",
            }}
          />
          <p className="font-mono text-[14px] text-roast animate-pulse">
            {loadingMsg}
          </p>
          <p className="font-mono text-[11px] text-neutral-600 mt-3">
            This usually takes 30–60 seconds
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="relative z-[1] max-w-[600px] w-full mx-auto px-4 sm:px-0"
        >
          {/* Desktop: single bordered row */}
          <div
            className="hidden sm:flex items-center gap-0 bg-surface border-2 border-border rounded-2xl p-1"
            style={{ animation: "border-burn 3s ease-in-out infinite" }}
          >
            <span className="font-mono text-[16px] text-ember-orange pl-5 pr-0 py-4 select-none whitespace-nowrap">
              $ scan
            </span>
            <label htmlFor="url-input-desktop" className="sr-only">Website URL to scan</label>
            <input
              id="url-input-desktop"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="paste your url here"
              className="flex-1 min-w-0 px-3 py-4 bg-transparent border-none text-white font-mono text-[16px] outline-none placeholder:text-neutral-600"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl text-white font-display text-[15px] font-bold tracking-wide cursor-pointer whitespace-nowrap transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #DC2626, #F97316)",
                boxShadow: "0 0 30px rgba(249,115,22,0.3)",
              }}
            >
              ROAST ME
            </button>
          </div>
          {/* Mobile: stacked layout */}
          <div className="flex flex-col gap-2 sm:hidden">
            <div
              className="flex items-center bg-surface border-2 border-border rounded-2xl p-1"
              style={{ animation: "border-burn 3s ease-in-out infinite" }}
            >
              <label htmlFor="url-input-mobile" className="sr-only">Website URL to scan</label>
              <input
                id="url-input-mobile"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="paste your url here"
                className="flex-1 min-w-0 px-4 py-4 bg-transparent border-none text-white font-mono text-[16px] outline-none placeholder:text-neutral-600"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 rounded-2xl text-white font-display text-[15px] font-bold tracking-wide cursor-pointer whitespace-nowrap transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #DC2626, #F97316)",
                boxShadow: "0 0 30px rgba(249,115,22,0.3)",
              }}
            >
              ROAST ME
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="relative z-[1] mt-4 font-mono text-[13px] text-score-bad">
          {error}
        </p>
      )}

      {/* Kill Feed */}
      {!loading && (
        <div className="relative z-[1] mt-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[3px] text-neutral-600 mb-4">
            Recently Roasted
          </p>
          <div className="flex flex-col gap-1.5 items-center">
            {killFeed.map((item, i) => (
              <a
                key={i}
                href={item.scanId ? `/roast/${item.scanId}` : undefined}
                className="font-mono text-[13px] text-neutral-400 inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg hover:bg-white/[0.04] transition-colors"
                style={{
                  animation: `slide-up 0.5s ease-out ${i * 0.1}s both`,
                }}
              >
                <span
                  className="font-bold tabular-nums min-w-[28px] text-right"
                  style={{ color: item.color }}
                >
                  {item.score}
                </span>
                <span className="text-neutral-600 max-w-[180px] sm:max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.url}
                </span>
                <span
                  className="text-[11px] px-2 py-0.5 rounded font-semibold uppercase tracking-[0.5px]"
                  style={{
                    color: item.color,
                    background: `${item.color}20`,
                  }}
                >
                  {item.verdict}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Top 10 Leaderboard */}
      {!loading && topScores.length > 0 && (
        <div className="relative z-[1] mt-14 w-full max-w-[600px] mx-auto px-4 sm:px-0">
          <div className="text-center mb-6">
            <p className="font-display text-[24px] sm:text-[28px] font-bold">
              <span style={{ color: "#FBBF24" }}>&#9733;</span>{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #FBBF24, #F97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Top Vibe Codes
              </span>{" "}
              <span style={{ color: "#FBBF24" }}>&#9733;</span>
            </p>
            <p className="font-mono text-[12px] text-neutral-600 mt-1">
              Highest scores this week &mdash; score high and get featured here
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {topScores.map((item, i) => {
              const medals = ["#FFD700", "#C0C0C0", "#CD7F32"];
              const medalEmoji = i < 3 ? ["1st", "2nd", "3rd"][i] : null;
              const isTop3 = i < 3;

              return (
                <a
                  key={i}
                  href={item.scanId ? `/roast/${item.scanId}` : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:scale-[1.01] ${
                    isTop3
                      ? "bg-white/[0.04] border-white/[0.08]"
                      : "bg-white/[0.02] border-white/[0.04]"
                  }`}
                  style={{
                    animation: `slide-up 0.5s ease-out ${0.1 + i * 0.08}s both`,
                    ...(isTop3
                      ? {
                          boxShadow: `0 0 20px ${medals[i]}10`,
                          borderColor: `${medals[i]}30`,
                        }
                      : {}),
                  }}
                >
                  {/* Rank */}
                  <span
                    className="font-display text-[18px] font-bold min-w-[32px] text-center"
                    style={{ color: isTop3 ? medals[i] : "#666" }}
                  >
                    {medalEmoji || `#${item.rank}`}
                  </span>

                  {/* Score */}
                  <span
                    className="font-display text-[22px] font-bold tabular-nums min-w-[45px] text-right"
                    style={{ color: item.color }}
                  >
                    {item.score}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="font-mono text-[13px] text-neutral-300 truncate">
                      {item.url}
                    </p>
                  </div>

                  {/* Badge */}
                  <span
                    className="text-[11px] px-2.5 py-1 rounded-lg font-semibold uppercase tracking-[0.5px] shrink-0"
                    style={{
                      color: item.color,
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    {item.verdict}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-[1] mt-10 mb-8 font-mono text-[12px] text-neutral-600">
        Powered by{" "}
        <a
          href="https://preship.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember-orange border-b border-ember-orange/30 hover:border-ember-orange"
        >
          PreShip
        </a>{" "}
        &mdash; free QA scanner for vibe-coded apps
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
