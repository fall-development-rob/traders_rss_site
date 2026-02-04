"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FeedItem, FilterState, Publisher, PublisherCategory } from '../types';
import { feedItems } from '../data/feedItems';
import { publishers, getPublisherById } from '../data/publishers';

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
}

const defaultFilters: FilterState = {
  categories: [],
  timeRange: 'today',
  searchQuery: '',
};

export function useFeeds(): UseFeedsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
  }, [filters]);

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
