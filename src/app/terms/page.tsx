import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function TermsPage() {
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

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>

        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 2026</p>

        <div className="prose prose-neutral dark:prose-invert space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using TradersRSS, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Service Description</h2>
            <p className="text-muted-foreground">
              TradersRSS is a news aggregation service that collects and displays publicly
              available RSS feeds from financial news sources. We do not create original
              content; we curate and organize content from third-party publishers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Not Financial Advice</h2>
            <p className="text-muted-foreground font-medium">
              The content displayed on TradersRSS is for informational purposes only and
              should not be construed as financial advice. We do not recommend any particular
              investments or trading strategies. Always consult with a qualified financial
              advisor before making investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Content</h2>
            <p className="text-muted-foreground">
              All news articles, analysis, and other content displayed on TradersRSS belongs
              to their respective publishers. We provide links to original sources and do not
              claim ownership of any third-party content. Each publisher maintains their own
              terms of service and copyright policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              TradersRSS is provided &quot;as is&quot; without warranties of any kind. We do not
              guarantee the accuracy, completeness, or timeliness of any content. RSS feeds
              may experience delays or outages beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TradersRSS shall not be liable for any damages arising from the use or inability
              to use our service, including but not limited to financial losses from trading
              decisions made based on information displayed on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of
              TradersRSS after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
