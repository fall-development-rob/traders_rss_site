'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isUp: boolean;
  previousClose: number;
}

interface UseMarketDataReturn {
  quotes: MarketQuote[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

const REFRESH_INTERVAL_MS = 60000; // 60 seconds

export function useMarketData(): UseMarketDataReturn {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef<boolean>(true);
  // Track ongoing fetch to prevent duplicate requests
  const fetchInProgressRef = useRef<boolean>(false);

  const fetchMarketData = useCallback(async (): Promise<void> => {
    // Prevent duplicate concurrent fetches
    if (fetchInProgressRef.current) {
      return;
    }

    fetchInProgressRef.current = true;

    // Only set loading on initial fetch (when no data cached)
    if (quotes.length === 0) {
      setIsLoading(true);
    }

    try {
      const response = await fetch('/api/market', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        // Validate and transform the response data
        const marketQuotes: MarketQuote[] = Array.isArray(data)
          ? data.map((item: Partial<MarketQuote>) => ({
              symbol: item.symbol ?? '',
              name: item.name ?? '',
              price: typeof item.price === 'number' ? item.price : 0,
              change: typeof item.change === 'number' ? item.change : 0,
              changePercent: typeof item.changePercent === 'number' ? item.changePercent : 0,
              isUp: item.isUp ?? (item.change !== undefined ? item.change >= 0 : true),
              previousClose: typeof item.previousClose === 'number' ? item.previousClose : 0,
            }))
          : [];

        setQuotes(marketQuotes);
        setError(null);
        setLastUpdated(new Date());
      }
    } catch (err) {
      // Only update error state if component is still mounted
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error
          ? err.message
          : 'An unexpected error occurred while fetching market data';
        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      fetchInProgressRef.current = false;
    }
  }, [quotes.length]);

  // Manual refresh function exposed to consumers
  const refresh = useCallback(async (): Promise<void> => {
    await fetchMarketData();
  }, [fetchMarketData]);

  // Initial fetch on mount and setup auto-refresh interval
  useEffect(() => {
    isMountedRef.current = true;

    // Fetch immediately on mount
    fetchMarketData();

    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      fetchMarketData();
    }, REFRESH_INTERVAL_MS);

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchMarketData]);

  return {
    quotes,
    isLoading,
    error,
    refresh,
    lastUpdated,
  };
}

export default useMarketData;
