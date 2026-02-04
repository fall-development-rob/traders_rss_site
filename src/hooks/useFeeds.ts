"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { FeedItem, FilterState, Publisher, PublisherCategory } from '../types';
import { publishers, getPublisherById } from '../data/publishers';

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

interface UseFeedsReturn {
  items: FeedItem[];
  publishers: Publisher[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  groupedByPublisher: Map<string, FeedItem[]>;
  totalItems: number;
  filteredCount: number;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

const defaultFilters: FilterState = {
  categories: [],
  timeRange: 'today',
  searchQuery: '',
};

// Cache configuration
const CACHE_KEY = 'tradersrss_feeds_cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  items: ApiFeedItem[];
  timestamp: number;
}

function getCachedData(): CacheData | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached) as CacheData;
  } catch {
    return null;
  }
}

function setCachedData(items: ApiFeedItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const cacheData: CacheData = {
      items,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (e) {
    console.warn('Failed to cache feed data:', e);
  }
}

function isCacheValid(cache: CacheData | null): boolean {
  if (!cache) return false;
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

export function useFeeds(): UseFeedsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isFetching = useRef(false);

  // Convert API items to FeedItems with Date objects
  const convertToFeedItems = useCallback((data: ApiFeedItem[]): FeedItem[] => {
    return data.map((item) => ({
      ...item,
      publishedAt: new Date(item.publishedAt),
    }));
  }, []);

  // Fetch feed items from API
  const fetchFeeds = useCallback(async (useCache = true) => {
    // Prevent concurrent fetches
    if (isFetching.current) return;
    isFetching.current = true;

    // Check cache first (stale-while-revalidate pattern)
    if (useCache) {
      const cached = getCachedData();
      if (cached && cached.items.length > 0) {
        // Use cached data immediately
        setFeedItems(convertToFeedItems(cached.items));
        setLastUpdated(new Date(cached.timestamp));

        // If cache is still valid, don't fetch
        if (isCacheValid(cached)) {
          setIsLoading(false);
          isFetching.current = false;
          return;
        }
        // Cache is stale - continue to fetch in background
        setIsLoading(false);
      }
    }

    if (!useCache || feedItems.length === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch('/api/feeds');

      if (!response.ok) {
        throw new Error(`Failed to fetch feeds: ${response.status} ${response.statusText}`);
      }

      const data: ApiFeedItem[] = await response.json();

      // Cache the response
      setCachedData(data);

      // Convert and set items
      setFeedItems(convertToFeedItems(data));
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      // Only set error if we don't have cached data
      if (feedItems.length === 0) {
        setError(errorMessage);
      }
      console.error('Error fetching feeds:', err);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [convertToFeedItems, feedItems.length]);

  // Manual refresh function (bypasses cache)
  const refresh = useCallback(async () => {
    await fetchFeeds(false);
  }, [fetchFeeds]);

  // Initial fetch on mount
  useEffect(() => {
    fetchFeeds(true);
  }, [fetchFeeds]);

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    let result = [...feedItems];

    // Filter by publisher categories
    if (filters.categories.length > 0) {
      result = result.filter((item) => {
        const publisher = getPublisherById(item.publisherId);
        return publisher && filters.categories.includes(publisher.category);
      });
    }

    // Filter by time range
    const now = new Date();
    if (filters.timeRange !== 'all') {
      const cutoffDate = new Date();
      switch (filters.timeRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      result = result.filter((item) => item.publishedAt >= cutoffDate);
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          (item.author && item.author.toLowerCase().includes(query))
      );
    }

    // Sort by published date (most recent first)
    return result.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }, [feedItems, filters]);

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

  // Get filtered publishers
  const filteredPublishers = useMemo(() => {
    if (filters.categories.length === 0) {
      return publishers;
    }
    return publishers.filter((p) => filters.categories.includes(p.category));
  }, [filters.categories]);

  return {
    items: filteredItems,
    publishers: filteredPublishers,
    isLoading,
    error,
    filters,
    setFilters,
    updateFilter,
    groupedByPublisher,
    totalItems: feedItems.length,
    filteredCount: filteredItems.length,
    refresh,
    lastUpdated,
  };
}

// Category labels for UI
export const categoryLabels: Record<PublisherCategory, string> = {
  NEWS: 'News',
  ASSET_MANAGER: 'Asset Managers',
  HEDGE_FUND: 'Hedge Funds',
  BANK: 'Banks',
  PROP_TRADING: 'Prop Trading',
  REGULATOR: 'Regulators',
  RIA: 'RIAs',
  RESEARCH: 'Research',
  TRADING: 'Trading',
};

// Time range labels for UI
export const timeRangeLabels: Record<FilterState['timeRange'], string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  all: 'All Time',
};
