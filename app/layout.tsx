import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeInitializer from "@/components/shared/ThemeInitializer";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/**
 * ISR configuration for layout
 * Revalidates every 3600 seconds (1 hour)
 * Requirements: 12.5
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hassan-portfolio.vercel.app'),
  title: {
    default: "Hassan's Terminal Portfolio | Interactive Developer Portfolio",
    template: "%s | Hassan's Portfolio"
  },
  description: "Interactive terminal-based portfolio showcasing Hassan's skills, experience, and projects. Explore through a command-line interface or visual mode.",
  keywords: [
    "portfolio",
    "terminal",
    "developer",
    "Hassan",
    "web developer",
    "software engineer",
    "interactive portfolio",
    "command line",
    "Next.js",
    "TypeScript",
    "React"
  ],
  authors: [{ name: "Hassan" }],
  creator: "Hassan",
  publisher: "Hassan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Hassan's Terminal Portfolio",
    title: "Hassan's Terminal Portfolio | Interactive Developer Portfolio",
    description: "Interactive terminal-based portfolio showcasing Hassan's skills, experience, and projects. Explore through a command-line interface or visual mode.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hassan's Terminal Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hassan's Terminal Portfolio | Interactive Developer Portfolio",
    description: "Interactive terminal-based portfolio showcasing Hassan's skills, experience, and projects.",
    images: ["/og-image.png"],
    creator: "@hassan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-terminal-accent)] focus:text-[var(--color-terminal-bg)]">
          Skip to main content
        </a>
        <ThemeInitializer />
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
