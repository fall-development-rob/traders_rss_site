"use client";

import { useState, useEffect, useMemo, useCallback, useRef, useId } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLink,
  Clock,
  User,
  ChevronRight,
  Home,
  Calendar,
  Search,
  ChevronDown,
  FileX2,
  ArrowUp,
  TrendingUp,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { getPublisherById } from "@/data/publishers";
import { categoryLabels } from "@/hooks/useFeeds";
import type { FeedItem, Publisher } from "@/types";

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

type DateFilter = "all" | "today" | "week" | "month" | "custom";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const ITEMS_PER_PAGE = 20;

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Breadcrumb({ publisher }: { publisher: Publisher }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
    >
      <ol className="flex items-center gap-2">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-4 w-4" />
        </li>
        <li aria-current="page">
          <span className="text-foreground font-medium">{publisher.name}</span>
        </li>
      </ol>
    </nav>
  );
}

function ArchiveHeader({ publisher }: { publisher: Publisher }) {
  return (
    <header
      className="rounded-lg border p-6 mb-6"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: publisher.brandColor || "var(--primary)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-lg text-lg font-bold text-white shadow-sm"
            style={{ backgroundColor: publisher.brandColor || "#333" }}
            aria-hidden="true"
          >
            {publisher.shortName?.slice(0, 2) || publisher.name.slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{publisher.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {categoryLabels[publisher.category]}
              </Badge>
            </div>
          </div>
        </div>
        <a
          href={publisher.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Visit website</span>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </header>
  );
}

function ArticleCard({ item }: { item: FeedItem }) {
  return (
    <article>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
        aria-label={`${item.title} - Published ${formatDate(item.publishedAt)}${item.author ? ` by ${item.author}` : ''} (opens in new tab)`}
      >
        <div className="py-4 px-4 -mx-4 rounded-md transition-colors hover:bg-secondary/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h2>
              {item.summary && (
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                  {item.summary}
                </p>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <time dateTime={item.publishedAt.toISOString()}>
                    {formatTimeAgo(item.publishedAt)}
                  </time>
                </span>
                {item.author && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" aria-hidden="true" />
                    <span className="truncate max-w-[150px]">{item.author}</span>
                  </span>
                )}
                <span className="text-muted-foreground/60" aria-hidden="true">
                  {formatDate(item.publishedAt)}
                </span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" aria-hidden="true" />
          </div>
        </div>
      </a>
    </article>
  );
}

function ArticleSkeleton() {
  return (
    <div className="py-4 px-4" role="article" aria-hidden="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading publisher archive page...</span>
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Skeleton className="h-8 w-32" aria-hidden="true" />
          <Skeleton className="h-9 w-9 rounded-md" aria-hidden="true" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6" aria-hidden="true">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Header card skeleton */}
        <div className="rounded-lg border p-6 mb-6" aria-hidden="true">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
        </div>

        {/* Filter bar skeleton */}
        <div className="flex items-center gap-4 mb-6" aria-hidden="true">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Articles skeleton */}
        <Card aria-hidden="true">
          <div className="divide-y divide-border/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <FileX2 className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
      <h2 className="text-lg font-semibold mb-2">No articles found</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        {hasFilters
          ? "No articles match your current filters. Try adjusting your search or date range."
          : "This publisher has no articles available at this time."}
      </p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center" role="main">
      <div className="text-center" role="alert">
        <h1 className="text-4xl font-bold mb-4">Publisher Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The publisher you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>
            <Home className="h-4 w-4 mr-2" aria-hidden="true" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

const dateFilterLabels: Record<DateFilter, string> = {
  all: "All Time",
  today: "Today",
  week: "This Week",
  month: "This Month",
  custom: "Custom Range",
};

export default function ArchivePage() {
  const params = useParams();
  const publisherId = params.publisherId as string;
  const { theme, setTheme } = useTheme();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Refs and IDs for accessibility
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const articlesRegionRef = useRef<HTMLDivElement>(null);
  const searchInputId = useId();
  const startDateId = useId();
  const endDateId = useId();

  const publisher = getPublisherById(publisherId);

  // Fetch articles for this publisher
  useEffect(() => {
    const fetchArticles = async () => {
      if (!publisher) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/feeds?publisherId=${publisherId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data: ApiFeedItem[] = await response.json();

        const itemsWithDates: FeedItem[] = data.map((item) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
        }));

        setItems(itemsWithDates);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [publisherId, publisher]);

  // Track scroll position for "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter items based on search and date
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          (item.author && item.author.toLowerCase().includes(query))
      );
    }

    // Apply date filter
    const now = new Date();
    if (dateFilter !== "all") {
      const cutoffDate = new Date();

      switch (dateFilter) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          result = result.filter((item) => item.publishedAt >= cutoffDate);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          result = result.filter((item) => item.publishedAt >= cutoffDate);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          result = result.filter((item) => item.publishedAt >= cutoffDate);
          break;
        case "custom":
          if (customDateRange.start) {
            result = result.filter(
              (item) => item.publishedAt >= customDateRange.start!
            );
          }
          if (customDateRange.end) {
            const endOfDay = new Date(customDateRange.end);
            endOfDay.setHours(23, 59, 59, 999);
            result = result.filter((item) => item.publishedAt <= endOfDay);
          }
          break;
      }
    }

    // Sort by date (newest first)
    return result.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }, [items, searchQuery, dateFilter, customDateRange]);

  // Items to display (with pagination)
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, displayCount);
  }, [filteredItems, displayCount]);

  const hasMore = displayCount < filteredItems.length;
  const hasFilters = searchQuery.trim() !== "" || dateFilter !== "all";

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
    // Set focus to first new article after load for keyboard users
    setTimeout(() => {
      const articles = articlesRegionRef.current?.querySelectorAll('article');
      if (articles && articles.length > displayCount) {
        const firstNewArticle = articles[displayCount];
        const link = firstNewArticle.querySelector('a');
        link?.focus();
      }
    }, 100);
  }, [displayCount]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDateFilterChange = useCallback((filter: DateFilter) => {
    setDateFilter(filter);
    setDisplayCount(ITEMS_PER_PAGE);
    if (filter !== "custom") {
      setCustomDateRange({ start: null, end: null });
    }
  }, []);

  const handleCustomDateChange = useCallback(
    (type: "start" | "end", value: string) => {
      const date = value ? new Date(value) : null;
      setCustomDateRange((prev) => ({
        ...prev,
        [type]: date,
      }));
      setDateFilter("custom");
      setDisplayCount(ITEMS_PER_PAGE);
    },
    []
  );

  // Show loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Show not found state
  if (!publisher) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary" aria-hidden="true">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
              Traders<span className="text-accent-gold">RSS</span>
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-6" role="main">
        {/* Breadcrumb */}
        <Breadcrumb publisher={publisher} />

        {/* Publisher Header */}
        <ArchiveHeader publisher={publisher} />

        {/* Filter Bar */}
        <section aria-label="Search and filter options" className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <label htmlFor={searchInputId} className="sr-only">
              Search articles
            </label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id={searchInputId}
              type="search"
              placeholder="Search articles..."
              className="pl-9 bg-secondary/50"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(ITEMS_PER_PAGE);
              }}
              aria-describedby="results-count"
            />
          </div>

          {/* Date Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[140px]"
                aria-label={`Filter by date: ${dateFilterLabels[dateFilter]}`}
                aria-haspopup="menu"
              >
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                {dateFilterLabels[dateFilter]}
                <ChevronDown className="h-4 w-4 ml-auto" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" role="menu">
              <DropdownMenuLabel id="date-filter-label">Filter by Date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(dateFilterLabels) as DateFilter[])
                .filter((key) => key !== "custom")
                .map((filter) => (
                  <DropdownMenuItem
                    key={filter}
                    onClick={() => handleDateFilterChange(filter)}
                    className={dateFilter === filter ? "bg-accent" : ""}
                    role="menuitemradio"
                    aria-checked={dateFilter === filter}
                  >
                    {dateFilterLabels[filter]}
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                Custom Range
              </DropdownMenuLabel>
              <div className="px-2 py-2 space-y-2" role="group" aria-label="Custom date range">
                <div>
                  <label htmlFor={startDateId} className="text-xs text-muted-foreground block mb-1">
                    From date
                  </label>
                  <Input
                    id={startDateId}
                    type="date"
                    className="h-8 text-xs"
                    value={
                      customDateRange.start
                        ? customDateRange.start.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleCustomDateChange("start", e.target.value)
                    }
                    aria-label="Start date for custom filter"
                  />
                </div>
                <div>
                  <label htmlFor={endDateId} className="text-xs text-muted-foreground block mb-1">
                    To date
                  </label>
                  <Input
                    id={endDateId}
                    type="date"
                    className="h-8 text-xs"
                    value={
                      customDateRange.end
                        ? customDateRange.end.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleCustomDateChange("end", e.target.value)
                    }
                    aria-label="End date for custom filter"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Results count - live region for screen readers */}
          <div
            id="results-count"
            className="text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {filteredItems.length === items.length ? (
              <span>{items.length} articles</span>
            ) : (
              <span>
                Showing {filteredItems.length} of {items.length} articles
              </span>
            )}
          </div>
        </section>

        {/* Articles List */}
        <section aria-label="Articles" ref={articlesRegionRef}>
          {error ? (
            <Card className="p-6" role="alert">
              <div className="text-center text-destructive">
                <p>Failed to load articles: {error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card>
              <EmptyState hasFilters={hasFilters} />
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="divide-y divide-border/50 px-4" role="feed" aria-label="Article feed">
                {displayedItems.map((item, index) => (
                  <div key={item.id} aria-posinset={index + 1} aria-setsize={filteredItems.length}>
                    <ArticleCard item={item} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="p-4 border-t border-border/50">
                  <Button
                    ref={loadMoreRef}
                    variant="outline"
                    className="w-full"
                    onClick={handleLoadMore}
                    aria-label={`Load more articles. ${filteredItems.length - displayCount} remaining`}
                  >
                    Load More ({filteredItems.length - displayCount} remaining)
                  </Button>
                </div>
              )}
            </Card>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              TradersRSS - Financial news aggregated from trusted sources.
            </p>
            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-4">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
          onClick={handleScrollToTop}
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
