import { NextResponse } from 'next/server';
import { fetchAllFeeds, FetchAllFeedsResult } from '@/lib/feed-service';
import { feedSources } from '@/data/feeds';
import { getPublisherById } from '@/data/publishers';
import type { PublisherCategory } from '@/types';

/**
 * API route handler for fetching RSS feeds
 * This runs server-side, avoiding CORS issues with external RSS feeds
 *
 * Query Parameters:
 * - category: Filter by feed category (NEWS, RESEARCH, MARKET_COMMENTARY, etc.)
 * - publisherCategory: Filter by publisher category (NEWS, ASSET_MANAGER, HEDGE_FUND, BANK, etc.)
 * - publisherId: Filter by publisher ID (cnbc, bloomberg, etc.)
 * - feedId: Fetch a specific feed by ID
 *
 * @example
 * GET /api/feeds - Fetch all active feeds
 * GET /api/feeds?category=NEWS - Fetch only news feeds
 * GET /api/feeds?publisherCategory=BANK - Fetch feeds from bank publishers
 * GET /api/feeds?publisherId=cnbc - Fetch only CNBC feeds
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const publisherCategory = searchParams.get('publisherCategory') as PublisherCategory | null;
  const publisherId = searchParams.get('publisherId');
  const feedId = searchParams.get('feedId');

  try {
    // Filter feed sources based on query params
    let sourcesToFetch = feedSources.filter((f) => f.isActive);

    if (feedId) {
      sourcesToFetch = feedSources.filter((f) => f.id === feedId);
    } else if (publisherId) {
      sourcesToFetch = sourcesToFetch.filter((f) => f.publisherId === publisherId);
    } else if (publisherCategory) {
      // Filter by publisher category (e.g., BANK, ASSET_MANAGER, HEDGE_FUND)
      sourcesToFetch = sourcesToFetch.filter((f) => {
        const publisher = getPublisherById(f.publisherId);
        return publisher && publisher.category === publisherCategory;
      });
    } else if (category) {
      sourcesToFetch = sourcesToFetch.filter((f) => f.feedCategory === category);
    }

    if (sourcesToFetch.length === 0) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'Content-Type': 'application/json',
        },
      });
    }

    const result: FetchAllFeedsResult = await fetchAllFeeds(sourcesToFetch);

    // Sort items by published date (newest first)
    const sortedItems = result.items.sort(
      (a, b) => {
        const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
        const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
        return dateB.getTime() - dateA.getTime();
      }
    );

    // Serialize dates to ISO strings for JSON response
    const serializedItems = sortedItems.map((item) => ({
      ...item,
      publishedAt: item.publishedAt instanceof Date
        ? item.publishedAt.toISOString()
        : item.publishedAt,
    }));

    // Log errors for monitoring but don't expose to client
    if (result.errors.length > 0) {
      console.warn(
        `Feed fetch completed with ${result.errors.length} errors:`,
        result.errors.map((e) => ({ feed: e.feedSource.id, message: e.message }))
      );
    }

    return NextResponse.json(serializedItems, {
      headers: {
        // Cache for 5 minutes, allow stale responses for 10 minutes while revalidating
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch feeds:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch feeds',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Disable body parsing as this is a GET-only endpoint
export const dynamic = 'force-dynamic';
