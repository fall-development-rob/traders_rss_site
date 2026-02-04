import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradersRSS - Financial News Aggregator",
  description:
    "Stay informed with curated financial news, market commentary, and research from top publishers, asset managers, banks, and regulators. Real-time updates from trusted sources.",
  keywords: [
    "financial news",
    "stock market",
    "trading",
    "investment research",
    "market commentary",
    "RSS feeds",
    "finance",
    "Wall Street",
    "Federal Reserve",
    "market analysis",
  ],
  authors: [{ name: "TradersRSS" }],
  openGraph: {
    title: "TradersRSS - Financial News Aggregator",
    description:
      "Stay informed with curated financial news, market commentary, and research from top publishers, asset managers, banks, and regulators.",
    type: "website",
    locale: "en_US",
    siteName: "TradersRSS",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradersRSS - Financial News Aggregator",
    description:
      "Stay informed with curated financial news, market commentary, and research from top publishers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
