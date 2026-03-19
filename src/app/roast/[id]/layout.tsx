import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  let score = 0;
  let url = "a vibe-coded app";
  let grade = "?";

  try {
    const res = await fetch(
      `https://api.preship.dev/api/scan/public/${id}`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    if (data.data) {
      score = data.data.overallScore ?? 0;
      url = (data.data.url ?? "").replace(/^https?:\/\//, "");
      if (score >= 90) grade = "A";
      else if (score >= 80) grade = "B";
      else if (score >= 60) grade = "C";
      else if (score >= 40) grade = "D";
      else grade = "F";
    }
  } catch {
    // Use defaults
  }

  const title = `${url} scored ${score}/100 (Grade: ${grade})`;
  const description = `We roasted ${url} — Score: ${score}/100. How does YOUR vibe code hold up?`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og/roast/${id}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/roast/${id}`],
    },
  };
}

export default function RoastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
