import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Rss, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Traders<span className="text-amber-500">RSS</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>

        <h1 className="text-4xl font-bold mb-6">About TradersRSS</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-3xl mb-12">
          <p className="text-lg text-muted-foreground">
            TradersRSS is a financial news aggregator that brings together content from
            the most trusted sources in finance, including major news outlets, investment banks,
            asset managers, and regulatory agencies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Rss className="h-5 w-5 text-primary" />
                Real-Time Feeds
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We aggregate RSS feeds from dozens of financial publishers, updating
              continuously to bring you the latest market news and analysis.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Trusted Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Our sources include Bloomberg, Reuters, CNBC, the Federal Reserve,
              SEC, Goldman Sachs, JP Morgan, and many more respected institutions.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                Fast & Clean
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              No ads, no trackers, no clutter. Just the financial news you need,
              organized by source and category for easy browsing.
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            We believe that access to quality financial information should be simple and
            straightforward. TradersRSS aggregates content from the sources that matter
            most to traders, investors, and financial professionals.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-8">
            <li><strong>News</strong> - Breaking financial news from major outlets</li>
            <li><strong>Banks</strong> - Research and insights from investment banks</li>
            <li><strong>Asset Managers</strong> - Commentary from leading fund managers</li>
            <li><strong>Regulators</strong> - Official releases from Fed, SEC, CFTC, and more</li>
            <li><strong>Research</strong> - Analysis from rating agencies and research firms</li>
          </ul>

          <Button asChild>
            <Link href="/">Start Reading</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
