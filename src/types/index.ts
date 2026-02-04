export interface Publisher {
  id: string;
  name: string;
  shortName?: string;
  category: PublisherCategory;
  logoUrl?: string;
  brandColor?: string;
  website: string;
}

export type PublisherCategory =
  | 'NEWS'
  | 'ASSET_MANAGER'
  | 'HEDGE_FUND'
  | 'BANK'
  | 'PROP_TRADING'
  | 'REGULATOR'
  | 'RIA'
  | 'RESEARCH'
  | 'TRADING';

export interface FeedSource {
  id: string;
  publisherId: string;
  name: string;
  url: string;
  feedCategory: FeedCategory;
  isActive: boolean;
}

export type FeedCategory =
  | 'MARKET_COMMENTARY'
  | 'RESEARCH'
  | 'NEWS'
  | 'PODCAST'
  | 'PRESS_RELEASE'
  | 'REGULATORY';

export interface FeedItem {
  id: string;
  feedSourceId: string;
  publisherId: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  author?: string;
  thumbnailUrl?: string;
  categories?: string[];
}

export interface FilterState {
  categories: PublisherCategory[];
  timeRange: 'today' | 'week' | 'month' | 'all';
  searchQuery: string;
}
