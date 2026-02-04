import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";

export default function PrivacyPage() {
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

        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 2026</p>

        <div className="prose prose-neutral dark:prose-invert space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <p className="text-muted-foreground">
              TradersRSS is designed with privacy in mind. We collect minimal data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Basic analytics (page views, general location)</li>
              <li>Theme preferences (stored locally in your browser)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">No Personal Data</h2>
            <p className="text-muted-foreground">
              We do not require registration or collect personal information such as
              names, email addresses, or payment information. You can use TradersRSS
              completely anonymously.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Cookies</h2>
            <p className="text-muted-foreground">
              We use only essential cookies to remember your theme preference (light/dark mode).
              We do not use tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Content</h2>
            <p className="text-muted-foreground">
              TradersRSS aggregates content from third-party publishers via their public RSS feeds.
              When you click through to read full articles, you will be subject to those
              publishers&apos; privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="text-muted-foreground">
              All connections to TradersRSS are encrypted using HTTPS. We do not store
              any sensitive user data on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy, please contact us through
              our GitHub repository.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
