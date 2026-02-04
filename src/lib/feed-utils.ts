import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  subWeeks,
  subMonths,
  format,
} from 'date-fns';
import { FeedItem, Publisher, PublisherCategory } from '@/types';

/**
 * Groups feed items by publisher
 * @param items - Array of feed items to group
 * @param publishers - Array of publishers for lookup
 * @returns Map of publisher ID to their feed items
 */
export function groupByPublisher(
  items: FeedItem[],
  publishers: Publisher[]
): Map<string, FeedItem[]> {
  const publisherMap = new Map<string, Publisher>();
  publishers.forEach((pub) => publisherMap.set(pub.id, pub));

  const grouped = new Map<string, FeedItem[]>();

  // Initialize with empty arrays for all publishers
  publishers.forEach((pub) => {
    grouped.set(pub.id, []);
  });

  // Group items
  items.forEach((item) => {
    const publisherItems = grouped.get(item.publisherId);
    if (publisherItems) {
      publisherItems.push(item);
    } else {
      grouped.set(item.publisherId, [item]);
    }
  });

  return grouped;
}

/**
 * Filters feed items by publisher categories
 * @param items - Array of feed items to filter
 * @param categories - Array of categories to include
 * @param publishers - Array of publishers for category lookup
 * @returns Filtered array of feed items
 */
export function filterByCategory(
  items: FeedItem[],
  categories: PublisherCategory[],
  publishers: Publisher[]
): FeedItem[] {
  if (categories.length === 0) {
    return items;
  }

  const categorySet = new Set(categories);
  const publisherCategoryMap = new Map<string, PublisherCategory>();
  publishers.forEach((pub) => {
    publisherCategoryMap.set(pub.id, pub.category);
  });

  return items.filter((item) => {
    const category = publisherCategoryMap.get(item.publisherId);
    return category && categorySet.has(category);
  });
}

/**
 * Filters feed items by time range
 * @param items - Array of feed items to filter
 * @param range - Time range filter
 * @returns Filtered array of feed items
 */
export function filterByTimeRange(
  items: FeedItem[],
  range: 'today' | 'week' | 'month' | 'all'
): FeedItem[] {
  if (range === 'all') {
    return items;
  }

  const now = new Date();

  return items.filter((item) => {
    const publishedAt = item.publishedAt instanceof Date
      ? item.publishedAt
      : new Date(item.publishedAt);

    switch (range) {
      case 'today':
        return isToday(publishedAt);
      case 'week':
        return publishedAt >= subWeeks(now, 1);
      case 'month':
        return publishedAt >= subMonths(now, 1);
      default:
        return true;
    }
  });
}

/**
 * Sorts feed items by publication date (newest first)
 * @param items - Array of feed items to sort
 * @returns New sorted array
 */
export function sortByDate(items: FeedItem[]): FeedItem[] {
  return [...items].sort((a, b) => {
    const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
    const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Searches feed items by query string
 * Searches in title, summary, author, and categories
 * @param items - Array of feed items to search
 * @param query - Search query string
 * @returns Filtered array of matching feed items
 */
export function searchItems(items: FeedItem[], query: string): FeedItem[] {
  if (!query.trim()) {
    return items;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    const searchableText = [
      item.title,
      item.summary,
      item.author,
      ...(item.categories || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // All query terms must match
    return queryTerms.every((term) => searchableText.includes(term));
  });
}

/**
 * Formats a date as relative time
 * @param date - Date to format
 * @returns Human-readable relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Unknown date';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Less than 1 minute
  if (diffMinutes < 1) {
    return 'Just now';
  }

  // Less than 1 hour
  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Less than 24 hours
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Yesterday
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  // Within this week
  if (isThisWeek(dateObj)) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  // Within this month
  if (isThisMonth(dateObj)) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  // Older than a month - show full date
  return format(dateObj, 'MMM d, yyyy');
}

/**
 * Gets unique categories from feed items
 * @param items - Array of feed items
 * @returns Array of unique category strings
 */
export function getUniqueCategories(items: FeedItem[]): string[] {
  const categorySet = new Set<string>();
  items.forEach((item) => {
    item.categories?.forEach((category) => {
      categorySet.add(category);
    });
  });
  return Array.from(categorySet).sort();
}

/**
 * Gets the count of items per publisher
 * @param items - Array of feed items
 * @returns Map of publisher ID to item count
 */
export function getPublisherCounts(items: FeedItem[]): Map<string, number> {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const current = counts.get(item.publisherId) || 0;
    counts.set(item.publisherId, current + 1);
  });
  return counts;
}

/**
 * Paginates an array of items
 * @param items - Array to paginate
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated slice of items
 */
export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; totalPages: number; hasMore: boolean } {
  const validPage = Math.max(1, page);
  const validPageSize = Math.max(1, pageSize);

  const startIndex = (validPage - 1) * validPageSize;
  const endIndex = startIndex + validPageSize;

  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / validPageSize);

  return {
    items: paginatedItems,
    totalPages,
    hasMore: endIndex < items.length,
  };
}

/**
 * Deduplicates feed items by URL
 * @param items - Array of feed items
 * @returns Array with duplicates removed (keeps first occurrence)
 */
export function deduplicateItems(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) {
      return false;
    }
    seen.add(item.url);
    return true;
  });
}
