"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Newspaper, Building2, Users, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { publishers } from "@/data/publishers";
import { categoryLabels } from "@/hooks/useFeeds";
import { useMarketData } from "@/hooks/useMarketData";
import type { PublisherCategory } from "@/types";

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

/**
 * Loading skeleton for market data rows
 */
function MarketDataSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading market data">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-1.5">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="space-y-1.5 text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading market data, please wait...</span>
    </div>
  );
}

/**
 * Error display for market data fetch failures
 */
function MarketDataError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-4 text-center"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" aria-hidden="true" />
      <p className="text-sm text-muted-foreground mb-3">{message}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        aria-label="Retry loading market data"
      >
        <RefreshCw className="h-3 w-3 mr-1" aria-hidden="true" />
        Retry
      </Button>
    </div>
  );
}

/**
 * Formats the last updated timestamp for display
 */
function formatLastUpdated(date: Date | null): string {
  if (!date) return "";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffSeconds < 60) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
}

function MarketTicker() {
  const { quotes, isLoading, error, refresh, lastUpdated } = useMarketData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            Market Overview
          </h2>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            aria-label={isRefreshing ? "Refreshing market data" : "Refresh market data"}
          >
            <RefreshCw
              className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </Button>
        </div>
        {lastUpdated && !isLoading && !error && (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Last updated: {formatLastUpdated(lastUpdated)}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && quotes.length === 0 ? (
          <MarketDataSkeleton />
        ) : error && quotes.length === 0 ? (
          <MarketDataError message="Unable to load market data" onRetry={handleRefresh} />
        ) : (
          <table className="w-full" aria-label="Market data overview">
            <thead className="sr-only">
              <tr>
                <th scope="col">Symbol and Name</th>
                <th scope="col">Price</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((item) => (
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
                      aria-label={`${item.isUp ? "Up" : "Down"} ${Math.abs(item.changePercent).toFixed(2)} percent`}
                    >
                      {item.isUp ? (
                        <TrendingUp className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="h-3 w-3" aria-hidden="true" />
                      )}
                      <span aria-hidden="true">
                        {item.isUp ? "+" : ""}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
