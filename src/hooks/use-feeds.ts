'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { FeedItem, Publisher, PublisherCategory, FilterState } from '@/types';
import {
  filterByCategory,
  filterByTimeRange,
  searchItems,
  sortByDate,
  groupByPublisher,
  deduplicateItems,
  paginateItems,
} from '@/lib/feed-utils';
import { mockFeedItems } from '@/data/mock-items';
import { publishers as defaultPublishers } from '@/data/publishers';

/**
 * Configuration options for the useFeeds hook
 */
interface UseFeedsOptions {
  /** Initial filter state */
  initialFilters?: Partial<FilterState>;
  /** Number of items per page */
  pageSize?: number;
  /** Whether to deduplicate items by URL */
  deduplicate?: boolean;
  /** Custom publishers array (defaults to mock data) */
  publishers?: Publisher[];
  /** Custom initial items (defaults to mock data) */
  initialItems?: FeedItem[];
}

/**
 * Return type for the useFeeds hook
 */
interface UseFeedsReturn {
  /** Filtered and sorted feed items for the current page */
  items: FeedItem[];
  /** All filtered items (before pagination) */
  allFilteredItems: FeedItem[];
  /** Items grouped by publisher */
  groupedItems: Map<string, FeedItem[]>;
  /** Available publishers */
  publishers: Publisher[];
  /** Current filter state */
  filters: FilterState;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Current page number */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages */
  hasMore: boolean;
  /** Total count of filtered items */
  totalCount: number;
  /** Update category filters */
  setCategories: (categories: PublisherCategory[]) => void;
  /** Toggle a single category */
  toggleCategory: (category: PublisherCategory) => void;
  /** Update time range filter */
  setTimeRange: (range: FilterState['timeRange']) => void;
  /** Update search query */
  setSearchQuery: (query: string) => void;
  /** Reset all filters to defaults */
  resetFilters: () => void;
  /** Go to a specific page */
  setPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Refresh feed items (placeholder for future implementation) */
  refresh: () => Promise<void>;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  timeRange: 'all',
  searchQuery: '',
};

const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for managing feed state, filtering, and pagination
 * @param options - Configuration options
 * @returns Feed state and control functions
 */
export function useFeeds(options: UseFeedsOptions = {}): UseFeedsReturn {
  const {
    initialFilters = {},
    pageSize = DEFAULT_PAGE_SIZE,
    deduplicate = true,
    publishers = defaultPublishers,
    initialItems = mockFeedItems,
  } = options;

  // State
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Deduplicate if enabled
    if (deduplicate) {
      result = deduplicateItems(result);
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = filterByCategory(result, filters.categories, publishers);
    }

    // Apply time range filter
    result = filterByTimeRange(result, filters.timeRange);

    // Apply search filter
    if (filters.searchQuery.trim()) {
      result = searchItems(result, filters.searchQuery);
    }

    // Sort by date
    result = sortByDate(result);

    return result;
  }, [items, filters, publishers, deduplicate]);

  // Memoized paginated items
  const paginatedResult = useMemo(() => {
    return paginateItems(filteredItems, page, pageSize);
  }, [filteredItems, page, pageSize]);

  // Memoized grouped items
  const groupedItems = useMemo(() => {
    return groupByPublisher(filteredItems, publishers);
  }, [filteredItems, publishers]);

  // Filter control functions
  const setCategories = useCallback((categories: PublisherCategory[]) => {
    setFilters((prev) => ({ ...prev, categories }));
  }, []);

  const toggleCategory = useCallback((category: PublisherCategory) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  }, []);

  const setTimeRange = useCallback((timeRange: FilterState['timeRange']) => {
    setFilters((prev) => ({ ...prev, timeRange }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  // Pagination control functions
  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, paginatedResult.totalPages));
  }, [paginatedResult.totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  // Refresh function (placeholder for future RSS fetching implementation)
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement actual feed fetching
      // const { items: newItems, errors } = await fetchAllFeeds(feedSources);
      // setItems(newItems);
      // if (errors.length > 0) {
      //   console.warn('Some feeds failed to fetch:', errors);
      // }

      // For now, just simulate a refresh with mock data
      await new Promise((resolve) => setTimeout(resolve, 500));
      setItems(initialItems);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh feeds'));
    } finally {
      setIsLoading(false);
    }
  }, [initialItems]);

  return {
    items: paginatedResult.items,
    allFilteredItems: filteredItems,
    groupedItems,
    publishers,
    filters,
    isLoading,
    error,
    page,
    totalPages: paginatedResult.totalPages,
    hasMore: paginatedResult.hasMore,
    totalCount: filteredItems.length,
    setCategories,
    toggleCategory,
    setTimeRange,
    setSearchQuery,
    resetFilters,
    setPage,
    nextPage,
    prevPage,
    refresh,
  };
}

/**
 * Hook for getting a single publisher's items
 * @param publisherId - ID of the publisher
 * @param options - Additional options
 */
export function usePublisherFeeds(
  publisherId: string,
  options: Omit<UseFeedsOptions, 'initialItems'> = {}
) {
  const filteredInitialItems = mockFeedItems.filter(
    (item) => item.publisherId === publisherId
  );

  return useFeeds({
    ...options,
    initialItems: filteredInitialItems,
  });
}

/**
 * Hook for real-time search functionality with debouncing
 * @param items - Items to search
 * @param debounceMs - Debounce delay in milliseconds
 */
export function useFeedSearch(items: FeedItem[], debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the query using useEffect with setTimeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Derive isSearching from query comparison
  const isSearching = query !== debouncedQuery;

  // Memoized search results
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items;
    }
    return searchItems(items, debouncedQuery);
  }, [items, debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    resultCount: results.length,
  };
}
