import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Is Your Vibe Code Good?",
  description:
    "Paste your URL. Get roasted. We scan AI-generated apps for security, accessibility, and performance — then tell you the truth. Brutally.",
  metadataBase: new URL("https://isyourvibecodegood.com"),
  openGraph: {
    title: "Is Your Vibe Code Good?",
    description: "Paste your URL. Get roasted. Brutally.",
    type: "website",
    siteName: "isyourvibecodegood.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Your Vibe Code Good?",
    description: "Paste your URL. Get roasted. Brutally.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WPMEJ88G9C"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WPMEJ88G9C');
            `,
          }}
        />
      </head>
      <body className="bg-bg text-white font-body antialiased">{children}</body>
    </html>
  );
}
