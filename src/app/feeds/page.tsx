import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Rss, ExternalLink, Building2, Landmark, BarChart3, Newspaper, FileText } from "lucide-react";
import { publishers, getPublishersByCategory } from "@/data/publishers";
import { feedSources, getFeedsByPublisher } from "@/data/feeds";
import type { Publisher } from "@/types";

const categoryConfig: Record<Publisher['category'], { label: string; icon: React.ReactNode; description: string }> = {
  NEWS: {
    label: "News Outlets",
    icon: <Newspaper className="h-5 w-5" />,
    description: "Major financial news publishers and media outlets"
  },
  BANK: {
    label: "Investment Banks",
    icon: <Building2 className="h-5 w-5" />,
    description: "Research and insights from global investment banks"
  },
  ASSET_MANAGER: {
    label: "Asset Managers",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Commentary and analysis from fund managers"
  },
  HEDGE_FUND: {
    label: "Hedge Funds",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Insights from hedge fund managers"
  },
  REGULATOR: {
    label: "Regulators",
    icon: <Landmark className="h-5 w-5" />,
    description: "Official releases from financial regulatory agencies"
  },
  RESEARCH: {
    label: "Research Firms",
    icon: <FileText className="h-5 w-5" />,
    description: "Analysis from rating agencies and research providers"
  },
  PROP_TRADING: {
    label: "Prop Trading Firms",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Insights from proprietary trading firms"
  },
  RIA: {
    label: "RIAs & Wealth Managers",
    icon: <Building2 className="h-5 w-5" />,
    description: "Registered investment advisors and wealth management firms"
  },
  TRADING: {
    label: "Trading Firms",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Market makers and trading operations"
  },
};

const categoryOrder: Publisher['category'][] = ['NEWS', 'REGULATOR', 'BANK', 'ASSET_MANAGER', 'HEDGE_FUND', 'RESEARCH', 'PROP_TRADING', 'RIA', 'TRADING'];

function PublisherCard({ publisher }: { publisher: Publisher }) {
  const feeds = getFeedsByPublisher(publisher.id);
  const activeFeeds = feeds.filter(f => f.isActive);

  if (activeFeeds.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: publisher.brandColor }}
              aria-hidden="true"
            />
            <span className="text-base font-semibold">{publisher.name}</span>
          </div>
          <a
            href={publisher.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Visit ${publisher.name} website`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {activeFeeds.map((feed) => (
            <li key={feed.id} className="flex items-start gap-2 text-sm">
              <Rss className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <span className="text-foreground">{feed.name}</span>
                <a
                  href={feed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-muted-foreground hover:text-foreground truncate transition-colors"
                  title={feed.url}
                >
                  {feed.url}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CategorySection({ category }: { category: Publisher['category'] }) {
  const config = categoryConfig[category];
  const categoryPublishers = getPublishersByCategory(category);

  // Only show publishers that have active feeds
  const publishersWithFeeds = categoryPublishers.filter(p => {
    const feeds = getFeedsByPublisher(p.id);
    return feeds.some(f => f.isActive);
  });

  if (publishersWithFeeds.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby={`category-${category}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {config.icon}
        </div>
        <div>
          <h2 id={`category-${category}`} className="text-xl font-semibold">
            {config.label}
          </h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {publishersWithFeeds.map((publisher) => (
          <PublisherCard key={publisher.id} publisher={publisher} />
        ))}
      </div>
    </section>
  );
}

export default function FeedsPage() {
  const totalFeeds = feedSources.filter(f => f.isActive).length;
  const totalPublishers = publishers.filter(p => {
    const feeds = getFeedsByPublisher(p.id);
    return feeds.some(f => f.isActive);
  }).length;

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

      <main className="container mx-auto px-4 py-12" role="main">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">RSS Feed Sources</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            TradersRSS aggregates content from {totalFeeds} RSS feeds across {totalPublishers} trusted
            financial publishers. Below is the complete list of sources we monitor.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
              <Rss className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">{totalFeeds}</span>
              <span className="text-muted-foreground">Active Feeds</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">{totalPublishers}</span>
              <span className="text-muted-foreground">Publishers</span>
            </div>
          </div>
        </div>

        {categoryOrder.map((category) => (
          <CategorySection key={category} category={category} />
        ))}

        <section className="mt-16 p-6 bg-secondary/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Subscribe to Our Feed</h2>
          <p className="text-muted-foreground mb-4">
            Want to add TradersRSS to your own feed reader? We provide a combined RSS feed
            of all aggregated content.
          </p>
          <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
            <Rss className="h-5 w-5 text-orange-500 shrink-0" />
            <code className="text-sm flex-1 truncate">/api/feeds?format=rss</code>
            <a
              href="/api/feeds?format=rss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm shrink-0"
            >
              Open Feed
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>TradersRSS - Financial news aggregated from trusted sources.</p>
            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-4">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/feeds" className="hover:text-foreground transition-colors">
                    Feeds
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
