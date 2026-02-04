import Parser from 'rss-parser';
import { FeedItem, FeedSource } from '@/types';
import { feedSources } from '@/data/feeds';

// Configure RSS parser with custom fields
const parser = new Parser({
  timeout: 5000, // Reduced from 15s to 5s for faster initial load
  headers: {
    'User-Agent': 'TradersRSS/1.0 (RSS Feed Aggregator)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content', 'mediaContent'],
      ['dc:creator', 'dcCreator'],
    ],
  },
});

// Concurrency limit for parallel fetches
const MAX_CONCURRENT_FETCHES = 10;

// Priority publishers (load these first)
const PRIORITY_PUBLISHERS = ['cnbc', 'bloomberg', 'reuters', 'wsj', 'marketwatch', 'seekingalpha'];

/**
 * Simple concurrency limiter
 */
async function limitConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const p = task().then((result) => {
      results.push(result);
    });
    executing.push(p as unknown as Promise<void>);

    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((e) => e === p),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Determines if code is running on the server or client
 */
const isServer = typeof window === 'undefined';

// Type for raw RSS parser output
interface RawFeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  description?: string;
  creator?: string;
  dcCreator?: string;
  author?: string;
  categories?: string[];
  mediaThumbnail?: { $?: { url?: string } };
  mediaContent?: { $?: { url?: string } };
  enclosure?: { url?: string };
  guid?: string;
  id?: string;
}

/**
 * Generates a stable, deterministic ID for a feed item
 * Uses guid/link as primary identifier, falls back to content hash
 */
function generateItemId(item: RawFeedItem, feedSource: FeedSource): string {
  // Prefer guid or link as they should be unique per article
  if (item.guid) {
    // Clean guid - remove special chars, take last part if URL
    const cleanGuid = item.guid
      .split('/').pop()?.split('?')[0]?.replace(/[^a-zA-Z0-9-]/g, '') || '';
    if (cleanGuid.length >= 6) {
      return `${feedSource.id}-${cleanGuid.substring(0, 20)}`;
    }
  }

  if (item.link) {
    // Extract article slug from URL
    const urlParts = item.link.split('/').filter(Boolean);
    const slug = urlParts[urlParts.length - 1]?.split('?')[0]?.replace(/[^a-zA-Z0-9-]/g, '') || '';
    if (slug.length >= 6) {
      return `${feedSource.id}-${slug.substring(0, 30)}`;
    }
  }

  // Fallback: deterministic hash of title + date
  const pubDate = item.pubDate || item.isoDate || '';
  const base = `${item.title || ''}|${pubDate}|${item.link || ''}`;
  const hash = base
    .split('')
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
  return `${feedSource.id}-${Math.abs(hash).toString(36)}`;
}

/**
 * Extracts thumbnail URL from various RSS formats
 */
function extractThumbnailUrl(item: RawFeedItem): string | undefined {
  if (item.mediaThumbnail?.$?.url) {
    return item.mediaThumbnail.$.url;
  }
  if (item.mediaContent?.$?.url) {
    return item.mediaContent.$.url;
  }
  if (item.enclosure?.url) {
    const url = item.enclosure.url;
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return url;
    }
  }
  return undefined;
}

/**
 * Extracts author from various RSS formats
 */
function extractAuthor(item: RawFeedItem): string | undefined {
  return item.creator || item.dcCreator || item.author || undefined;
}

/**
 * Extracts summary/description from various RSS formats
 */
function extractSummary(item: RawFeedItem): string {
  const raw = item.contentSnippet || item.summary || item.description || item.content || '';
  // Strip HTML tags and limit length
  const stripped = raw.replace(/<[^>]*>/g, '').trim();
  return stripped.length > 500 ? stripped.substring(0, 497) + '...' : stripped;
}

/**
 * Parses publication date from various formats
 */
function parsePublishedDate(item: RawFeedItem): Date {
  const dateString = item.isoDate || item.pubDate;
  if (dateString) {
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
}

/**
 * Normalizes a raw RSS item into our FeedItem format
 */
export function normalizeFeedItem(item: RawFeedItem, feedSource: FeedSource): FeedItem {
  return {
    id: generateItemId(item, feedSource),
    feedSourceId: feedSource.id,
    publisherId: feedSource.publisherId,
    title: item.title?.trim() || 'Untitled',
    summary: extractSummary(item),
    url: item.link || '',
    publishedAt: parsePublishedDate(item),
    author: extractAuthor(item),
    thumbnailUrl: extractThumbnailUrl(item),
    categories: (item.categories || [])
      .map((cat: unknown) => {
        if (typeof cat === 'string') return cat;
        if (cat && typeof cat === 'object' && '_' in cat) return (cat as { _: string })._;
        return String(cat);
      })
      .filter(Boolean),
  };
}

/**
 * Error class for feed-related errors
 */
export class FeedError extends Error {
  constructor(
    message: string,
    public readonly feedSource: FeedSource,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'FeedError';
  }
}

/**
 * Fetches and parses a single RSS feed
 * @param feedSource - The feed source configuration
 * @returns Promise resolving to an array of normalized feed items
 */
export async function fetchFeed(feedSource: FeedSource): Promise<FeedItem[]> {
  if (!feedSource.isActive) {
    return [];
  }

  try {
    const feed = await parser.parseURL(feedSource.url);

    if (!feed.items || !Array.isArray(feed.items)) {
      return [];
    }

    return feed.items
      .map((item) => normalizeFeedItem(item as RawFeedItem, feedSource))
      .filter((item) => item.url && item.title);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new FeedError(
      `Failed to fetch feed "${feedSource.name}": ${errorMessage}`,
      feedSource,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Result type for fetching all feeds
 */
export interface FetchAllFeedsResult {
  items: FeedItem[];
  errors: FeedError[];
}

/**
 * Fetches multiple RSS feeds in parallel
 * @param feedSources - Array of feed source configurations
 * @returns Promise resolving to aggregated feed items and any errors
 */
export async function fetchAllFeeds(feedSources: FeedSource[]): Promise<FetchAllFeedsResult> {
  const activeSources = feedSources.filter((source) => source.isActive);

  if (activeSources.length === 0) {
    return { items: [], errors: [] };
  }

  // Sort by priority - major news sources first
  const sortedSources = [...activeSources].sort((a, b) => {
    const aPriority = PRIORITY_PUBLISHERS.indexOf(a.publisherId);
    const bPriority = PRIORITY_PUBLISHERS.indexOf(b.publisherId);
    // Priority publishers come first (-1 means not in list, put at end)
    if (aPriority === -1 && bPriority === -1) return 0;
    if (aPriority === -1) return 1;
    if (bPriority === -1) return -1;
    return aPriority - bPriority;
  });

  const items: FeedItem[] = [];
  const errors: FeedError[] = [];

  // Create fetch tasks
  const tasks = sortedSources.map((source, index) => async () => {
    try {
      const feedItems = await fetchFeed(source);
      return { index, items: feedItems, error: null };
    } catch (err) {
      const error = err instanceof FeedError
        ? err
        : new FeedError(
            `Failed to fetch feed "${source.name}"`,
            source,
            err instanceof Error ? err : undefined
          );
      return { index, items: [] as FeedItem[], error };
    }
  });

  // Run with concurrency limit
  const results = await limitConcurrency(tasks, MAX_CONCURRENT_FETCHES);

  // Collect results
  results.forEach((result) => {
    if (result.error) {
      errors.push(result.error);
    } else {
      items.push(...result.items);
    }
  });

  // Deduplicate by ID (keep first occurrence)
  const seenIds = new Set<string>();
  const uniqueItems = items.filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    }
    seenIds.add(item.id);
    return true;
  });

  return { items: uniqueItems, errors };
}

/**
 * Fetches a feed with a custom timeout
 * @param feedSource - The feed source configuration
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise resolving to feed items or rejecting on timeout
 */
export async function fetchFeedWithTimeout(
  feedSource: FeedSource,
  timeoutMs: number = 10000
): Promise<FeedItem[]> {
  return Promise.race([
    fetchFeed(feedSource),
    new Promise<FeedItem[]>((_, reject) => {
      setTimeout(() => {
        reject(
          new FeedError(
            `Feed fetch timed out after ${timeoutMs}ms`,
            feedSource
          )
        );
      }, timeoutMs);
    }),
  ]);
}

/**
 * Validates a feed URL by attempting to fetch it
 * @param url - The URL to validate
 * @returns Promise resolving to validation result
 */
export async function validateFeedUrl(url: string): Promise<{
  valid: boolean;
  itemCount?: number;
  title?: string;
  error?: string;
}> {
  try {
    const feed = await parser.parseURL(url);
    return {
      valid: true,
      itemCount: feed.items?.length || 0,
      title: feed.title,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Serialized FeedItem with string date for JSON transfer
 */
export interface SerializedFeedItem extends Omit<FeedItem, 'publishedAt'> {
  publishedAt: string;
}

/**
 * API response type for feeds endpoint
 */
export interface FeedsApiResponse {
  items?: SerializedFeedItem[];
  error?: string;
}

/**
 * Converts serialized items back to FeedItem with Date objects
 */
function deserializeFeedItems(items: SerializedFeedItem[]): FeedItem[] {
  return items.map((item) => ({
    ...item,
    publishedAt: new Date(item.publishedAt),
  }));
}

/**
 * Client-side function to fetch feeds via the API route
 * This avoids CORS issues by routing through our Next.js API
 * @param options - Optional filtering options
 * @returns Promise resolving to an array of feed items
 */
export async function fetchFeedsFromApi(options?: {
  category?: string;
  publisherId?: string;
  feedId?: string;
}): Promise<FetchAllFeedsResult> {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.publisherId) params.set('publisherId', options.publisherId);
  if (options?.feedId) params.set('feedId', options.feedId);

  const queryString = params.toString();
  const url = `/api/feeds${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Use cache with revalidation
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data: SerializedFeedItem[] | FeedsApiResponse = await response.json();

    // Handle both array response and object response formats
    if (Array.isArray(data)) {
      return {
        items: deserializeFeedItems(data),
        errors: [],
      };
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      items: data.items ? deserializeFeedItems(data.items) : [],
      errors: [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch feeds from API:', errorMessage);
    return {
      items: [],
      errors: [
        new FeedError(
          `Failed to fetch feeds: ${errorMessage}`,
          { id: 'api', name: 'API', url: '/api/feeds', publisherId: '', feedCategory: 'NEWS', isActive: true }
        ),
      ],
    };
  }
}

/**
 * Universal function to fetch all feeds
 * On the server, fetches directly using rss-parser
 * On the client, uses the API route to avoid CORS issues
 * @param options - Optional filtering options
 * @returns Promise resolving to aggregated feed items and any errors
 */
export async function fetchAllFeedsUniversal(options?: {
  category?: string;
  publisherId?: string;
  feedId?: string;
}): Promise<FetchAllFeedsResult> {
  // On the client, use the API route
  if (!isServer) {
    return fetchFeedsFromApi(options);
  }

  // On the server, fetch directly
  let sourcesToFetch = feedSources.filter((source) => source.isActive);

  if (options?.feedId) {
    sourcesToFetch = sourcesToFetch.filter((f) => f.id === options.feedId);
  } else if (options?.publisherId) {
    sourcesToFetch = sourcesToFetch.filter((f) => f.publisherId === options.publisherId);
  } else if (options?.category) {
    sourcesToFetch = sourcesToFetch.filter((f) => f.feedCategory === options.category);
  }

  return fetchAllFeeds(sourcesToFetch);
}

/**
 * Fetches all active feeds and returns sorted items
 * Convenience function that uses fetchAllFeedsUniversal
 * @returns Promise resolving to sorted feed items (newest first)
 */
export async function getLatestFeedItems(limit?: number): Promise<FeedItem[]> {
  const result = await fetchAllFeedsUniversal();

  // Sort by published date (newest first)
  const sorted = result.items.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );

  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Fetches feeds by publisher
 * @param publisherId - The publisher ID to filter by
 * @returns Promise resolving to feed items from the specified publisher
 */
export async function getFeedsByPublisher(publisherId: string): Promise<FeedItem[]> {
  const result = await fetchAllFeedsUniversal({ publisherId });
  return result.items.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}

/**
 * Fetches feeds by category
 * @param category - The feed category to filter by
 * @returns Promise resolving to feed items from the specified category
 */
export async function getFeedsByCategory(category: string): Promise<FeedItem[]> {
  const result = await fetchAllFeedsUniversal({ category });
  return result.items.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}
