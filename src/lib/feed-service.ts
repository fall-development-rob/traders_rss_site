import Parser from 'rss-parser';
import { FeedItem, FeedSource } from '@/types';

// Configure RSS parser with custom fields
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'TradersRSSAggregator/1.0',
  },
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content', 'mediaContent'],
      ['dc:creator', 'dcCreator'],
    ],
  },
});

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
 * Generates a unique ID for a feed item
 */
function generateItemId(item: RawFeedItem, feedSource: FeedSource): string {
  const base = item.guid || item.id || item.link || item.title || '';
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
    categories: item.categories?.filter(Boolean) || [],
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

  const results = await Promise.allSettled(
    activeSources.map((source) => fetchFeed(source))
  );

  const items: FeedItem[] = [];
  const errors: FeedError[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    } else {
      const source = activeSources[index];
      if (result.reason instanceof FeedError) {
        errors.push(result.reason);
      } else {
        errors.push(
          new FeedError(
            `Failed to fetch feed "${source.name}"`,
            source,
            result.reason instanceof Error ? result.reason : undefined
          )
        );
      }
    }
  });

  return { items, errors };
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
