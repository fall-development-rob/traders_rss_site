'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { FeedItem } from '@/types';
import { searchItems, getRecentSearches, saveRecentSearch, clearRecentSearches } from '@/lib/search';

interface UseSearchOptions {
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Feed items to search through */
  items: FeedItem[];
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
}

interface UseSearchResult {
  /** Current search query */
  query: string;
  /** Debounced search query */
  debouncedQuery: string;
  /** Set the search query */
  setQuery: (query: string) => void;
  /** Clear the search query */
  clearQuery: () => void;
  /** Filtered search results */
  results: FeedItem[];
  /** Whether currently searching (during debounce) */
  isSearching: boolean;
  /** Recent search queries */
  recentSearches: string[];
  /** Save current query to recent searches */
  saveCurrentSearch: () => void;
  /** Clear all recent searches */
  clearRecent: () => void;
  /** Whether there's an active search */
  hasActiveSearch: boolean;
}

/**
 * Custom hook for managing search state with debouncing
 */
export function useSearch({
  debounceMs = 300,
  items,
  onSearchChange,
}: UseSearchOptions): UseSearchResult {
  const [query, setQueryInternal] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    // Initialize from localStorage on first render
    if (typeof window !== 'undefined') {
      return getRecentSearches();
    }
    return [];
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Derive isSearching from query vs debouncedQuery
  const isSearching = query !== debouncedQuery;

  // Debounce the search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      onSearchChange?.(query);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs, onSearchChange]);

  // Compute search results
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return items;
    }
    return searchItems(items, debouncedQuery);
  }, [items, debouncedQuery]);

  const setQuery = useCallback((newQuery: string) => {
    setQueryInternal(newQuery);
  }, []);

  const clearQuery = useCallback(() => {
    setQueryInternal('');
    setDebouncedQuery('');
    setIsSearching(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  const saveCurrentSearch = useCallback(() => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setRecentSearches(getRecentSearches());
    }
  }, [query]);

  const clearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const hasActiveSearch = Boolean(debouncedQuery.trim());

  return {
    query,
    debouncedQuery,
    setQuery,
    clearQuery,
    results,
    isSearching,
    recentSearches,
    saveCurrentSearch,
    clearRecent,
    hasActiveSearch,
  };
}

/**
 * Hook for debounced value (generic)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
