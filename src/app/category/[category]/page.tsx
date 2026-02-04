"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { PublisherSection } from "@/components/PublisherSection";
import { FeedLoadingSkeleton } from "@/components/FeedSkeleton";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublisherById, getPublishersByCategory } from "@/data/publishers";
import { categoryLabels } from "@/hooks/useFeeds";
import type { FeedItem, PublisherCategory } from "@/types";
import {
  ChevronRight,
  Home,
  Newspaper,
  Building2,
  TrendingUp,
  Landmark,
  BarChart3,
  Scale,
  Briefcase,
  Search,
  FileText,
  FileX2,
} from "lucide-react";

interface ApiFeedItem {
  id: string;
  feedSourceId: string;
  publisherId: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  author?: string;
  thumbnailUrl?: string;
  categories?: string[];
}

// Category metadata with descriptions and icons
const categoryMeta: Record<
  PublisherCategory,
  { description: string; icon: typeof Newspaper }
> = {
  NEWS: {
    description:
      "Breaking news and market updates from leading financial news outlets",
    icon: Newspaper,
  },
  ASSET_MANAGER: {
    description:
      "Investment insights and market commentary from major asset management firms",
    icon: Briefcase,
  },
  HEDGE_FUND: {
    description:
      "Alternative investment strategies and market analysis from hedge funds",
    icon: TrendingUp,
  },
  BANK: {
    description:
      "Research and market perspectives from global investment banks",
    icon: Building2,
  },
  PROP_TRADING: {
    description:
      "Market insights and trading perspectives from proprietary trading firms",
    icon: BarChart3,
  },
  REGULATOR: {
    description:
      "Official announcements, speeches, and regulatory updates from financial regulators",
    icon: Scale,
  },
  RIA: {
    description:
      "Investment advice and market outlook from registered investment advisors",
    icon: Landmark,
  },
  RESEARCH: {
    description:
      "In-depth market research and analysis from rating agencies and research firms",
    icon: Search,
  },
  TRADING: {
    description:
      "Trading insights and market data from trading platforms and exchanges",
    icon: FileText,
  },
};

// Valid categories for validation
const validCategories: PublisherCategory[] = [
  "NEWS",
  "ASSET_MANAGER",
  "HEDGE_FUND",
  "BANK",
  "PROP_TRADING",
  "REGULATOR",
  "RIA",
  "RESEARCH",
  "TRADING",
];

function isValidCategory(category: string): category is PublisherCategory {
  return validCategories.includes(category as PublisherCategory);
}

function EmptyState({ category }: { category: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <FileX2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No articles found</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        No feed items are available for {categoryLabels[category as PublisherCategory] || category} at the moment.
        Please check back later.
      </p>
    </div>
  );
}

function InvalidCategory({ category }: { category: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <FileX2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Invalid Category</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        The category &quot;{category}&quot; does not exist. Please select a valid category.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {validCategories.map((cat) => (
          <Link key={cat} href={`/category/${cat}`}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {categoryLabels[cat]}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Breadcrumb({ category }: { category: PublisherCategory }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">
        {categoryLabels[category]}
      </span>
    </nav>
  );
}

function CategoryHeader({ category }: { category: PublisherCategory }) {
  const meta = categoryMeta[category];
  const Icon = meta.icon;
  const publishersInCategory = getPublishersByCategory(category);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{categoryLabels[category]}</CardTitle>
            <CardDescription className="text-base">{meta.description}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-4">
              {publishersInCategory.map((publisher) => (
                <Badge
                  key={publisher.id}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: publisher.brandColor || undefined,
                    color: publisher.brandColor || undefined,
                  }}
                >
                  {publisher.shortName || publisher.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function CategorySidebar({ currentCategory }: { currentCategory: PublisherCategory }) {
  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Browse Categories</CardTitle>
      </CardHeader>
      <div className="px-4 pb-4">
        <div className="space-y-1">
          {validCategories.map((cat) => {
            const Icon = categoryMeta[cat].icon;
            const isActive = cat === currentCategory;
            return (
              <Link
                key={cat}
                href={`/category/${cat}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {categoryLabels[cat]}
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const categoryParam = params.category as string;
  const category = categoryParam?.toUpperCase();

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Validate category
  const isValid = isValidCategory(category);

  // Fetch feeds for this category
  useEffect(() => {
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    const fetchFeeds = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/feeds?publisherCategory=${category}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch feeds: ${response.status} ${response.statusText}`);
        }

        const data: ApiFeedItem[] = await response.json();

        // Convert publishedAt strings to Date objects
        const itemsWithDates: FeedItem[] = data.map((item) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
        }));

        setFeedItems(itemsWithDates);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching feeds:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeds();
  }, [category, isValid]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return feedItems;

    const query = searchQuery.toLowerCase();
    return feedItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        (item.author && item.author.toLowerCase().includes(query))
    );
  }, [feedItems, searchQuery]);

  // Group items by publisher
  const groupedByPublisher = useMemo(() => {
    const grouped = new Map<string, FeedItem[]>();

    // Get unique publisher IDs from filtered items
    const publisherIds = [...new Set(filteredItems.map((item) => item.publisherId))];

    // Sort publishers by their most recent item
    const sortedPublisherIds = publisherIds.sort((a, b) => {
      const aItems = filteredItems.filter((item) => item.publisherId === a);
      const bItems = filteredItems.filter((item) => item.publisherId === b);
      const aLatest = Math.max(...aItems.map((i) => i.publishedAt.getTime()));
      const bLatest = Math.max(...bItems.map((i) => i.publishedAt.getTime()));
      return bLatest - aLatest;
    });

    // Group items
    sortedPublisherIds.forEach((publisherId) => {
      const items = filteredItems.filter((item) => item.publisherId === publisherId);
      if (items.length > 0) {
        grouped.set(publisherId, items);
      }
    });

    return grouped;
  }, [filteredItems]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Invalid category
  if (!isValid) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} searchValue={searchQuery} />
        <main className="container mx-auto px-4 py-6">
          <InvalidCategory category={categoryParam} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchValue={searchQuery} />

      <main className="container mx-auto px-4 py-6">
        <Breadcrumb category={category as PublisherCategory} />
        <CategoryHeader category={category as PublisherCategory} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Main Feed Content */}
          <div className="space-y-4">
            {/* Results count */}
            {!isLoading && (
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">
                  {filteredItems.length} article{filteredItems.length !== 1 ? "s" : ""}{" "}
                  from {groupedByPublisher.size} publisher{groupedByPublisher.size !== 1 ? "s" : ""}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            )}

            {isLoading ? (
              <FeedLoadingSkeleton />
            ) : error ? (
              <Card className="p-6">
                <p className="text-destructive">{error}</p>
              </Card>
            ) : groupedByPublisher.size === 0 ? (
              <EmptyState category={category} />
            ) : (
              Array.from(groupedByPublisher.entries()).map(([publisherId, items]) => {
                const publisher = getPublisherById(publisherId);
                if (!publisher) return null;
                return (
                  <PublisherSection
                    key={publisherId}
                    publisher={publisher}
                    items={items}
                  />
                );
              })
            )}
          </div>

          {/* Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block">
            <CategorySidebar currentCategory={category as PublisherCategory} />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>TradersRSS - Financial news aggregated from trusted sources.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <a href="#" className="hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
