"use client";

import { Badge } from "@/components/ui/badge";
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
  const toggleCategory = (category: PublisherCategory) => {
    const current = filters.categories;
    if (current.includes(category)) {
      onFilterChange(
        "categories",
        current.filter((c) => c !== category)
      );
    } else {
      onFilterChange("categories", [...current, category]);
    }
  };

  const clearFilters = () => {
    onFilterChange("categories", []);
    onFilterChange("timeRange", "today");
    onFilterChange("searchQuery", "");
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.timeRange !== "today" ||
    filters.searchQuery !== "";

  return (
    <div className="sticky top-16 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        {/* Time Range Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Tabs
              value={filters.timeRange}
              onValueChange={(value) =>
                onFilterChange("timeRange", value as FilterState["timeRange"])
              }
            >
              <TabsList className="h-8">
                {(Object.keys(timeRangeLabels) as FilterState["timeRange"][]).map(
                  (range) => (
                    <TabsTrigger
                      key={range}
                      value={range}
                      className="text-xs px-3 h-7"
                    >
                      {timeRangeLabels[range]}
                    </TabsTrigger>
                  )
                )}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing{" "}
              <span className="font-medium text-foreground">{filteredCount}</span>{" "}
              of {totalCount} items
            </span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {allCategories.map((category) => {
                const isActive = filters.categories.includes(category);
                return (
                  <Badge
                    key={category}
                    variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer transition-colors hover:bg-primary/80 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {categoryLabels[category]}
                  </Badge>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
