import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Is Your Vibe Code Good? — Get your AI-generated app roasted";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0A0A 0%, #1A0A0A 50%, #0A0A0A 100%)",
          position: "relative",
        }}
      >
        {/* Bottom fire glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "linear-gradient(to top, rgba(220,38,38,0.3), rgba(249,115,22,0.15) 40%, transparent)",
            display: "flex",
          }}
        />
        {/* Fire line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #7F1D1D 10%, #DC2626 30%, #F97316 50%, #DC2626 70%, #7F1D1D 90%, transparent)",
            display: "flex",
          }}
        />

        {/* ASCII fire hint */}
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#F97316",
            opacity: 0.4,
            marginBottom: "16px",
            fontFamily: "monospace",
          }}
        >
          {"(  .  ) . ' .  ( . )  ' ."}
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: 400,
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "sans-serif",
            }}
          >
            IS YOUR
          </span>
          <span
            style={{
              fontSize: "96px",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-2px",
              background:
                "linear-gradient(135deg, #fff 0%, #FBBF24 50%, #F97316 100%)",
              backgroundClip: "text",
              color: "transparent",
              fontFamily: "sans-serif",
            }}
          >
            Vibe Code
          </span>
          <span
            style={{
              fontSize: "96px",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-2px",
              background: "linear-gradient(135deg, #F97316, #DC2626)",
              backgroundClip: "text",
              color: "transparent",
              fontFamily: "sans-serif",
            }}
          >
            Good?
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: "24px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "monospace",
          }}
        >
          $ scan your-app.vercel.app → Get roasted. Brutally.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "24px",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "monospace",
          }}
        >
          <span>Powered by</span>
          <span style={{ color: "#F97316" }}>PreShip</span>
          <span>— free QA scanner for vibe-coded apps</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
