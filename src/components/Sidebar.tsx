"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Newspaper, Building2, Users, ExternalLink } from "lucide-react";
import { publishers } from "@/data/publishers";
import { categoryLabels } from "@/hooks/useFeeds";
import type { PublisherCategory } from "@/types";

// Mock market data
const marketData = [
  { symbol: "SPY", name: "S&P 500", price: 5892.45, change: 0.87, isUp: true },
  { symbol: "QQQ", name: "Nasdaq 100", price: 20456.78, change: 1.23, isUp: true },
  { symbol: "DIA", name: "Dow Jones", price: 43567.89, change: -0.12, isUp: false },
  { symbol: "IWM", name: "Russell 2000", price: 2234.56, change: 0.45, isUp: true },
  { symbol: "VIX", name: "Volatility", price: 14.23, change: -3.45, isUp: false },
];

// Mock trending topics
const trendingTopics = [
  { tag: "Federal Reserve", count: 24 },
  { tag: "Earnings Season", count: 18 },
  { tag: "Bitcoin", count: 15 },
  { tag: "Interest Rates", count: 12 },
  { tag: "Tech Stocks", count: 10 },
];

// Get unique categories that have publishers
const categoriesWithPublishers = Array.from(
  new Set(publishers.map((p) => p.category))
).filter((cat) => categoryLabels[cat]) as PublisherCategory[];

function MarketTicker() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" aria-hidden="true" />
          Market Overview
        </h2>
      </CardHeader>
      <CardContent>
        <table className="w-full" aria-label="Market data overview">
          <thead className="sr-only">
            <tr>
              <th scope="col">Symbol and Name</th>
              <th scope="col">Price</th>
              <th scope="col">Change</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item) => (
              <tr
                key={item.symbol}
                className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
              >
                <td>
                  <div className="font-medium text-sm">{item.symbol}</div>
                  <div className="text-xs text-muted-foreground">{item.name}</div>
                </td>
                <td className="text-right">
                  <div className="font-mono text-sm">
                    {item.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
                      item.isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}
                    aria-label={`${item.isUp ? "Up" : "Down"} ${Math.abs(item.change).toFixed(2)} percent`}
                  >
                    {item.isUp ? (
                      <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="h-3 w-3" aria-hidden="true" />
                    )}
                    <span aria-hidden="true">
                      {item.isUp ? "+" : ""}
                      {item.change.toFixed(2)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function TrendingTopics() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Newspaper className="h-4 w-4" aria-hidden="true" />
          Trending Topics
        </h2>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-wrap gap-2" aria-label="Trending topics list">
          {trendingTopics.map((topic) => (
            <li key={topic.tag}>
              <button
                type="button"
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                aria-label={`${topic.tag}, ${topic.count} articles`}
              >
                {topic.tag}
                <span className="ml-1 text-muted-foreground" aria-hidden="true">({topic.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CategoryLinks() {
  // Group publishers by category and count
  const categoryStats = publishers.reduce((acc, pub) => {
    acc[pub.category] = (acc[pub.category] || 0) + 1;
    return acc;
  }, {} as Record<PublisherCategory, number>);

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          Browse by Category
        </h2>
      </CardHeader>
      <CardContent>
        <nav aria-label="Category navigation">
          <ul className="space-y-1">
            {categoriesWithPublishers.map((category) => (
              <li key={category}>
                <Link
                  href={`/category/${category}`}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label={`${categoryLabels[category]}, ${categoryStats[category] || 0} sources`}
                >
                  <span className="text-sm group-hover:text-primary transition-colors">
                    {categoryLabels[category]}
                  </span>
                  <Badge variant="secondary" className="text-xs" aria-hidden="true">
                    {categoryStats[category] || 0} sources
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}

function ActivePublishers() {
  // Sort publishers alphabetically and group by category for display
  const sortedPublishers = [...publishers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Take first 12 publishers to show
  const displayedPublishers = sortedPublishers.slice(0, 12);
  const remainingCount = sortedPublishers.length - displayedPublishers.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" aria-hidden="true" />
          Active Publishers
        </h2>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1" aria-label="List of active publishers">
          {displayedPublishers.map((publisher) => (
            <li
              key={publisher.id}
              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: publisher.brandColor || '#6b7280' }}
                  aria-hidden="true"
                />
                <span className="text-sm truncate" title={publisher.name}>
                  {publisher.shortName || publisher.name}
                </span>
              </div>
              <a
                href={publisher.website}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                aria-label={`Visit ${publisher.name} website (opens in new tab)`}
              >
                <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        {remainingCount > 0 && (
          <p className="pt-2 text-center text-xs text-muted-foreground">
            +{remainingCount} more publishers
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function Sidebar() {
  return (
    <aside
      className="space-y-4 sticky top-36"
      role="complementary"
      aria-label="Sidebar with market data and navigation"
    >
      <MarketTicker />
      <CategoryLinks />
      <ActivePublishers />
      <TrendingTopics />
    </aside>
  );
}
