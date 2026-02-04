import type { FeedSource } from '../types';

export const feedSources: FeedSource[] = [
  // CNBC Feeds
  {
    id: 'cnbc-top-news',
    publisherId: 'cnbc',
    name: 'CNBC Top News',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'cnbc-world-news',
    publisherId: 'cnbc',
    name: 'CNBC World News',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100727362',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'cnbc-finance',
    publisherId: 'cnbc',
    name: 'CNBC Finance',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'cnbc-investing',
    publisherId: 'cnbc',
    name: 'CNBC Investing',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },

  // MarketWatch Feeds
  {
    id: 'mw-top-stories',
    publisherId: 'marketwatch',
    name: 'MarketWatch Top Stories',
    url: 'https://feeds.marketwatch.com/marketwatch/topstories/',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'mw-market-pulse',
    publisherId: 'marketwatch',
    name: 'MarketWatch Market Pulse',
    url: 'https://feeds.marketwatch.com/marketwatch/marketpulse/',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },
  {
    id: 'mw-bulletins',
    publisherId: 'marketwatch',
    name: 'MarketWatch Bulletins',
    url: 'https://feeds.marketwatch.com/marketwatch/bulletins/',
    feedCategory: 'NEWS',
    isActive: true,
  },

  // Seeking Alpha Feeds
  {
    id: 'sa-market-news',
    publisherId: 'seekingalpha',
    name: 'Seeking Alpha Market News',
    url: 'https://seekingalpha.com/market_currents.xml',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'sa-wall-street',
    publisherId: 'seekingalpha',
    name: 'Seeking Alpha Wall Street Breakfast',
    url: 'https://seekingalpha.com/tag/wall-st-breakfast.xml',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },

  // Zero Hedge
  {
    id: 'zh-feed',
    publisherId: 'zerohedge',
    name: 'Zero Hedge',
    url: 'https://feeds.feedburner.com/zerohedge/feed',
    feedCategory: 'NEWS',
    isActive: true,
  },

  // Bloomberg
  {
    id: 'bloomberg-markets',
    publisherId: 'bloomberg',
    name: 'Bloomberg Markets',
    url: 'https://feeds.bloomberg.com/markets/news.rss',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'bloomberg-politics',
    publisherId: 'bloomberg',
    name: 'Bloomberg Politics',
    url: 'https://feeds.bloomberg.com/politics/news.rss',
    feedCategory: 'NEWS',
    isActive: true,
  },

  // Reuters
  {
    id: 'reuters-business',
    publisherId: 'reuters',
    name: 'Reuters Business',
    url: 'https://feeds.reuters.com/reuters/businessNews',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'reuters-markets',
    publisherId: 'reuters',
    name: 'Reuters Markets',
    url: 'https://feeds.reuters.com/reuters/globalmarketsNews',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },

  // Federal Reserve
  {
    id: 'fed-press-releases',
    publisherId: 'federalreserve',
    name: 'Federal Reserve Press Releases',
    url: 'https://www.federalreserve.gov/feeds/press_all.xml',
    feedCategory: 'PRESS_RELEASE',
    isActive: true,
  },
  {
    id: 'fed-speeches',
    publisherId: 'federalreserve',
    name: 'Federal Reserve Speeches',
    url: 'https://www.federalreserve.gov/feeds/speeches.xml',
    feedCategory: 'REGULATORY',
    isActive: true,
  },
  {
    id: 'fed-testimony',
    publisherId: 'federalreserve',
    name: 'Federal Reserve Testimony',
    url: 'https://www.federalreserve.gov/feeds/testimony.xml',
    feedCategory: 'REGULATORY',
    isActive: true,
  },

  // SEC
  {
    id: 'sec-press-releases',
    publisherId: 'sec',
    name: 'SEC Press Releases',
    url: 'https://www.sec.gov/news/pressreleases.rss',
    feedCategory: 'PRESS_RELEASE',
    isActive: true,
  },
  {
    id: 'sec-speeches',
    publisherId: 'sec',
    name: 'SEC Speeches',
    url: 'https://www.sec.gov/news/speeches.rss',
    feedCategory: 'REGULATORY',
    isActive: true,
  },
  {
    id: 'sec-litigation',
    publisherId: 'sec',
    name: 'SEC Litigation',
    url: 'https://www.sec.gov/rss/litigation/litreleases.xml',
    feedCategory: 'REGULATORY',
    isActive: true,
  },

  // CFTC
  {
    id: 'cftc-press-releases',
    publisherId: 'cftc',
    name: 'CFTC Press Releases',
    url: 'https://www.cftc.gov/RSS/PressRelease.xml',
    feedCategory: 'PRESS_RELEASE',
    isActive: true,
  },

  // PIMCO
  {
    id: 'pimco-insights',
    publisherId: 'pimco',
    name: 'PIMCO Insights',
    url: 'https://www.pimco.com/en-us/insights/rss',
    feedCategory: 'RESEARCH',
    isActive: true,
  },

  // BlackRock
  {
    id: 'blackrock-insights',
    publisherId: 'blackrock',
    name: 'BlackRock Investment Institute',
    url: 'https://www.blackrock.com/corporate/insights/blackrock-investment-institute/rss',
    feedCategory: 'RESEARCH',
    isActive: true,
  },

  // Goldman Sachs
  {
    id: 'gs-insights',
    publisherId: 'goldmansachs',
    name: 'Goldman Sachs Insights',
    url: 'https://www.goldmansachs.com/insights/rss/index.xml',
    feedCategory: 'RESEARCH',
    isActive: true,
  },

  // JP Morgan
  {
    id: 'jpm-insights',
    publisherId: 'jpmorgan',
    name: 'JP Morgan Insights',
    url: 'https://www.jpmorgan.com/insights/rss/feed.xml',
    feedCategory: 'RESEARCH',
    isActive: true,
  },

  // Morningstar
  {
    id: 'morningstar-articles',
    publisherId: 'morningstar',
    name: 'Morningstar Articles',
    url: 'https://www.morningstar.com/feeds/rss/articles',
    feedCategory: 'RESEARCH',
    isActive: true,
  },
  {
    id: 'morningstar-news',
    publisherId: 'morningstar',
    name: 'Morningstar News',
    url: 'https://www.morningstar.com/feeds/rss/news',
    feedCategory: 'NEWS',
    isActive: true,
  },

  // S&P Global
  {
    id: 'sp-market-intelligence',
    publisherId: 'sp',
    name: 'S&P Global Market Intelligence',
    url: 'https://www.spglobal.com/marketintelligence/en/rss-feed/rss.aspx',
    feedCategory: 'RESEARCH',
    isActive: true,
  },

  // Financial Times
  {
    id: 'ft-world',
    publisherId: 'ft',
    name: 'Financial Times World',
    url: 'https://www.ft.com/world?format=rss',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'ft-markets',
    publisherId: 'ft',
    name: 'Financial Times Markets',
    url: 'https://www.ft.com/markets?format=rss',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },

  // WSJ
  {
    id: 'wsj-markets',
    publisherId: 'wsj',
    name: 'WSJ Markets',
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },
  {
    id: 'wsj-world',
    publisherId: 'wsj',
    name: 'WSJ World News',
    url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'wsj-opinion',
    publisherId: 'wsj',
    name: 'WSJ Opinion',
    url: 'https://feeds.a.dj.com/rss/RSSOpinion.xml',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },
];

export const getFeedsByPublisher = (publisherId: string): FeedSource[] => {
  return feedSources.filter((f) => f.publisherId === publisherId);
};

export const getActiveFeedsByCategory = (category: FeedSource['feedCategory']): FeedSource[] => {
  return feedSources.filter((f) => f.feedCategory === category && f.isActive);
};

export const getFeedById = (id: string): FeedSource | undefined => {
  return feedSources.find((f) => f.id === id);
};
