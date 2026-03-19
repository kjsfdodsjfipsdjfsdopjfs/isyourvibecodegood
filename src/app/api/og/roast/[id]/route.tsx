import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getScoreColor(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 50) return "#FBBF24";
  return "#EF4444";
}

function getGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D+";
  if (score >= 45) return "D";
  if (score >= 40) return "D-";
  return "F";
}

function getVerdict(score: number): string {
  if (score <= 25) return "Your app is a digital war crime.";
  if (score <= 50) return "Not the worst we've seen. The bar is in hell though.";
  if (score <= 70) return "Mediocre. The beige of websites.";
  if (score <= 85) return "Not bad. You clearly tried.";
  return "Actually good. We're annoyed.";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let score = 0;
  let url = "unknown";
  let secScore = 0;
  let a11yScore = 0;
  let perfScore = 0;

  try {
    const res = await fetch(
      `https://api.preship.dev/api/scan/public/${id}`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    if (data.data) {
      score = data.data.overallScore ?? 0;
      url = (data.data.url ?? "").replace(/^https?:\/\//, "");
      secScore = data.data.categories?.find((c: { category: string }) => c.category === "security")?.score ?? 0;
      a11yScore = data.data.categories?.find((c: { category: string }) => c.category === "accessibility")?.score ?? 0;
      perfScore = data.data.categories?.find((c: { category: string }) => c.category === "performance")?.score ?? 0;
    }
  } catch {
    // Use defaults
  }

  const color = getScoreColor(score);
  const grade = getGrade(score);
  const verdict = getVerdict(score);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#050505",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}20, transparent 70%)`,
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#F97316",
            marginBottom: "8px",
          }}
        >
          isyourvibecodegood.com
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "20px",
            fontFamily: "monospace",
          }}
        >
          {url}
        </div>

        {/* Score */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 700,
            color: color,
            lineHeight: 1,
            marginBottom: "4px",
          }}
        >
          {score}
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: color,
            marginBottom: "20px",
          }}
        >
          Grade: {grade}
        </div>

        {/* Category scores */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Security", score: secScore },
            { label: "A11y", score: a11yScore },
            { label: "Perf", score: perfScore },
          ].map((cat) => (
            <div
              key={cat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {cat.label}
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: getScoreColor(cat.score),
                }}
              >
                {cat.score}
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div
          style={{
            fontSize: "14px",
            color: "#FB923C",
            textAlign: "center",
            maxWidth: "500px",
            fontFamily: "monospace",
          }}
        >
          &ldquo;{verdict}&rdquo;
        </div>

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            fontSize: "13px",
            color: "#F97316",
            fontFamily: "monospace",
          }}
        >
          Roast yours free → isyourvibecodegood.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
