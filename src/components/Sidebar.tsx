"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Minus, Clock, Newspaper, Building2, Users, ExternalLink } from "lucide-react";
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
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {marketData.map((item) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
          >
            <div>
              <div className="font-medium text-sm">{item.symbol}</div>
              <div className="text-xs text-muted-foreground">{item.name}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">
                {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
                  item.isUp ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {item.isUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {item.isUp ? "+" : ""}
                {item.change.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TrendingTopics() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <Badge
              key={topic.tag}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
            >
              {topic.tag}
              <span className="ml-1 text-muted-foreground">({topic.count})</span>
            </Badge>
          ))}
        </div>
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
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Browse by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {categoriesWithPublishers.map((category) => (
          <Link
            key={category}
            href={`/category/${category}`}
            className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm group-hover:text-primary transition-colors">
              {categoryLabels[category]}
            </span>
            <Badge variant="secondary" className="text-xs">
              {categoryStats[category] || 0} sources
            </Badge>
          </Link>
        ))}
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
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          Active Publishers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {displayedPublishers.map((publisher) => (
          <div
            key={publisher.id}
            className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: publisher.brandColor || '#6b7280' }}
              />
              <span className="text-sm truncate" title={publisher.name}>
                {publisher.shortName || publisher.name}
              </span>
            </div>
            <a
              href={publisher.website}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title={`Visit ${publisher.name}`}
            >
              <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
            </a>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="pt-2 text-center">
            <span className="text-xs text-muted-foreground">
              +{remainingCount} more publishers
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Sidebar() {
  return (
    <div className="space-y-4 sticky top-36">
      <MarketTicker />
      <CategoryLinks />
      <ActivePublishers />
      <TrendingTopics />
    </div>
  );
}
