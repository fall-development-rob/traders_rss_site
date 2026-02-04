"use client";

import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { PublisherSection } from "@/components/PublisherSection";
import { Sidebar } from "@/components/Sidebar";
import { FeedLoadingSkeleton, SidebarSkeleton } from "@/components/FeedSkeleton";
import { useFeeds } from "@/hooks/useFeeds";
import { getPublisherById } from "@/data/publishers";
import { FileX2 } from "lucide-react";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <FileX2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No results found</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        No feed items match your current filters. Try adjusting your search or
        filter criteria to see more results.
      </p>
    </div>
  );
}

export default function Home() {
  const {
    isLoading,
    filters,
    updateFilter,
    groupedByPublisher,
    totalItems,
    filteredCount,
  } = useFeeds();

  const handleSearch = (query: string) => {
    updateFilter("searchQuery", query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchValue={filters.searchQuery} />
      <FilterBar
        filters={filters}
        onFilterChange={updateFilter}
        totalCount={totalItems}
        filteredCount={filteredCount}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main Feed Content */}
          <div className="space-y-4">
            {isLoading ? (
              <FeedLoadingSkeleton />
            ) : groupedByPublisher.size === 0 ? (
              <EmptyState />
            ) : (
              Array.from(groupedByPublisher.entries()).map(
                ([publisherId, items]) => {
                  const publisher = getPublisherById(publisherId);
                  if (!publisher) return null;
                  return (
                    <PublisherSection
                      key={publisherId}
                      publisher={publisher}
                      items={items}
                    />
                  );
                }
              )
            )}
          </div>

          {/* Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block">
            {isLoading ? <SidebarSkeleton /> : <Sidebar />}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              TradersRSS - Financial news aggregated from trusted sources.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
