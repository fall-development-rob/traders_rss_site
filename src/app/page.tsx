"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { PublisherSection } from "@/components/PublisherSection";
import { Sidebar } from "@/components/Sidebar";
import { FeedLoadingSkeleton, SidebarSkeleton } from "@/components/FeedSkeleton";
import { useFeeds } from "@/hooks/useFeeds";
import { getPublisherById } from "@/data/publishers";
import { FileX2, AlertCircle } from "lucide-react";

function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <FileX2 className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
      <h2 className="text-lg font-semibold mb-2">No results found</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        No feed items match your current filters. Try adjusting your search or
        filter criteria to see more results.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-12 w-12 text-destructive mb-4" aria-hidden="true" />
      <h2 className="text-lg font-semibold mb-2">Error loading feed</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        {message}
      </p>
    </div>
  );
}

export default function Home() {
  const {
    isLoading,
    error,
    filters,
    updateFilter,
    groupedByPublisher,
    totalItems,
    filteredCount,
  } = useFeeds();

  const handleSearch = (query: string) => {
    updateFilter("searchQuery", query);
  };

  const renderFeedContent = () => {
    if (error) {
      return <ErrorState message={error || "Failed to load feed items. Please try again later."} />;
    }

    if (isLoading) {
      return <FeedLoadingSkeleton />;
    }

    if (groupedByPublisher.size === 0) {
      return <EmptyState />;
    }

    return Array.from(groupedByPublisher.entries()).map(
      ([publisherId, items]) => {
        const publisher = getPublisherById(publisherId);
        if (!publisher) return null;
        return (
          <PublisherSection
            key={publisherId}
            publisher={publisher}
            items={items}
            itemLimit={5}
          />
        );
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipToMainContent />

      <Header onSearch={handleSearch} searchValue={filters.searchQuery} />

      <FilterBar
        filters={filters}
        onFilterChange={updateFilter}
        totalCount={totalItems}
        filteredCount={filteredCount}
      />

      <main
        id="main-content"
        className="container mx-auto px-4 py-6"
        role="main"
        aria-label="Financial news feed"
      >
        <h1 className="sr-only">TradersRSS Financial News Feed</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main Feed Content */}
          <section
            aria-label="News feed"
            aria-busy={isLoading}
            aria-live="polite"
            className="space-y-4"
          >
            {renderFeedContent()}
          </section>

          {/* Sidebar - Hidden on mobile */}
          <aside
            className="hidden lg:block"
            aria-label="Trending topics and quick filters"
          >
            {isLoading ? <SidebarSkeleton /> : <Sidebar />}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-border/40 mt-12"
        role="contentinfo"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              TradersRSS - Financial news aggregated from trusted sources.
            </p>
            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-4">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
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
