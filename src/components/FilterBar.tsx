"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Filter, Clock } from "lucide-react";
import type { FilterState, PublisherCategory } from "@/types";
import { categoryLabels, timeRangeLabels } from "@/hooks/useFeeds";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  totalCount: number;
  filteredCount: number;
}

const allCategories: PublisherCategory[] = [
  "NEWS",
  "ASSET_MANAGER",
  "BANK",
  "PROP_TRADING",
  "REGULATOR",
  "RESEARCH",
];

export function FilterBar({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const toggleCategory = useCallback((category: PublisherCategory) => {
    const current = filters.categories;
    if (current.includes(category)) {
      onFilterChange(
        "categories",
        current.filter((c) => c !== category)
      );
    } else {
      onFilterChange("categories", [...current, category]);
    }
  }, [filters.categories, onFilterChange]);

  const clearFilters = () => {
    onFilterChange("categories", []);
    onFilterChange("timeRange", "today");
    onFilterChange("searchQuery", "");
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.timeRange !== "today" ||
    filters.searchQuery !== "";

  const handleCategoryKeyDown = useCallback((
    event: React.KeyboardEvent<HTMLButtonElement>,
    category: PublisherCategory,
    index: number
  ) => {
    const categoryButtons = document.querySelectorAll<HTMLButtonElement>(
      '[data-filter-category]'
    );

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (index + 1) % categoryButtons.length;
        categoryButtons[nextIndex]?.focus();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = (index - 1 + categoryButtons.length) % categoryButtons.length;
        categoryButtons[prevIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        categoryButtons[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        categoryButtons[categoryButtons.length - 1]?.focus();
        break;
    }
  }, []);

  const activeFilterCount = filters.categories.length +
    (filters.timeRange !== "today" ? 1 : 0) +
    (filters.searchQuery !== "" ? 1 : 0);

  return (
    <div
      className="sticky top-16 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="region"
      aria-label="Feed filters"
    >
      <div className="container mx-auto px-4 py-3">
        {/* Time Range Filter Group */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <fieldset className="flex items-center gap-2 border-0 p-0 m-0">
            <legend className="sr-only">Filter by time range</legend>
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Tabs
              value={filters.timeRange}
              onValueChange={(value) =>
                onFilterChange("timeRange", value as FilterState["timeRange"])
              }
            >
              <TabsList className="h-8" aria-label="Time range options">
                {(Object.keys(timeRangeLabels) as FilterState["timeRange"][]).map(
                  (range) => (
                    <TabsTrigger
                      key={range}
                      value={range}
                      className="text-xs px-3 h-7"
                      aria-label={`Show items from ${timeRangeLabels[range].toLowerCase()}`}
                    >
                      {timeRangeLabels[range]}
                    </TabsTrigger>
                  )
                )}
              </TabsList>
            </Tabs>
          </fieldset>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              aria-live="polite"
              aria-atomic="true"
              role="status"
            >
              Showing{" "}
              <span className="font-medium text-foreground">{filteredCount}</span>{" "}
              of {totalCount} items
              {activeFilterCount > 0 && (
                <span className="sr-only">
                  {` with ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} applied`}
                </span>
              )}
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs"
                aria-label={`Clear all ${activeFilterCount} active filters`}
              >
                <X className="h-3 w-3 mr-1" aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <fieldset className="flex items-center gap-2 border-0 p-0 m-0">
          <legend className="sr-only">Filter by category</legend>
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <ScrollArea className="w-full whitespace-nowrap">
            <div
              className="flex gap-2 pb-2"
              role="group"
              aria-label="Category filter options"
            >
              {allCategories.map((category, index) => {
                const isActive = filters.categories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    role="checkbox"
                    aria-checked={isActive}
                    aria-label={`Filter by ${categoryLabels[category]}${isActive ? ' (selected)' : ''}`}
                    data-filter-category={category}
                    onClick={() => toggleCategory(category)}
                    onKeyDown={(e) => handleCategoryKeyDown(e, category, index)}
                    className={`
                      inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
                      transition-colors cursor-pointer
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                      ${isActive
                        ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                        : "border-input bg-background hover:bg-secondary"
                      }
                    `}
                  >
                    {categoryLabels[category]}
                  </button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </fieldset>
      </div>
    </div>
  );
}
