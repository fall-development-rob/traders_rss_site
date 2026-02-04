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
  {
    id: 'fed-monetary-policy',
    publisherId: 'federalreserve',
    name: 'Fed Monetary Policy',
    url: 'https://www.federalreserve.gov/feeds/press_monetary.xml',
    feedCategory: 'REGULATORY',
    isActive: true,
  },
  {
    id: 'fed-feds-notes',
    publisherId: 'federalreserve',
    name: 'Fed FEDS Notes',
    url: 'https://www.federalreserve.gov/feeds/feds_notes.xml',
    feedCategory: 'RESEARCH',
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
  {
    id: 'cftc-enforcement',
    publisherId: 'cftc',
    name: 'CFTC Enforcement',
    url: 'https://www.cftc.gov/RSS/RSSENF/rssenf.xml',
    feedCategory: 'REGULATORY',
    isActive: true,
  },

  // FDIC
  {
    id: 'fdic-news',
    publisherId: 'fdic',
    name: 'FDIC News',
    url: 'https://public.govdelivery.com/topics/USFDIC_26/feed.rss',
    feedCategory: 'REGULATORY',
    isActive: true,
  },

  // OCC
  {
    id: 'occ-news',
    publisherId: 'occ',
    name: 'OCC News',
    url: 'https://www.comptrollerofthecurrency.gov/rss/occ_news.xml',
    feedCategory: 'REGULATORY',
    isActive: true,
  },

  // Treasury
  {
    id: 'treasury-securities',
    publisherId: 'treasury',
    name: 'Treasury Securities Announced',
    url: 'https://treasurydirect.gov/TA_WS/securities/announced/rss',
    feedCategory: 'REGULATORY',
    isActive: true,
  },

  // ECB
  {
    id: 'ecb-press',
    publisherId: 'ecb',
    name: 'ECB Press Releases',
    url: 'https://www.ecb.europa.eu/rss/press.html',
    feedCategory: 'REGULATORY',
    isActive: true,
  },

  // Bank of England
  {
    id: 'boe-news',
    publisherId: 'boe',
    name: 'Bank of England News',
    url: 'https://www.bankofengland.co.uk/rss/news',
    feedCategory: 'REGULATORY',
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
  {
    id: 'gs-exchanges-podcast',
    publisherId: 'goldmansachs',
    name: 'Goldman Sachs Exchanges Podcast',
    url: 'https://feeds.megaphone.fm/GLD9218176758',
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
  {
    id: 'jpm-news-releases',
    publisherId: 'jpmorgan',
    name: 'JPMorgan Chase News Releases',
    url: 'https://jpmorganchaseco.gcs-web.com/rss/news-releases.xml',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'jpm-at-any-rate-podcast',
    publisherId: 'jpmorgan',
    name: 'J.P. Morgan At Any Rate Podcast',
    url: 'https://feed.podbean.com/atanyrate/feed.xml',
    feedCategory: 'RESEARCH',
    isActive: true,
  },

  // Morgan Stanley
  {
    id: 'ms-press-releases',
    publisherId: 'morganstanley',
    name: 'Morgan Stanley Press Releases',
    url: 'https://www.morganstanley.com/press-releases.msfeed.xml',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'ms-thoughts-on-market-podcast',
    publisherId: 'morganstanley',
    name: 'Morgan Stanley Thoughts on the Market Podcast',
    url: 'https://rss.art19.com/thoughts-on-the-market',
    feedCategory: 'RESEARCH',
    isActive: true,
  },

  // Deutsche Bank
  {
    id: 'db-research',
    publisherId: 'deutschebank',
    name: 'Deutsche Bank Research',
    url: 'https://www.dbresearch.com/PROD/RPS_EN-PROD/RSS_GROUP_HOME_EN.calias',
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

  // T. Rowe Price
  {
    id: 'troweprice-news',
    publisherId: 'troweprice',
    name: 'T. Rowe Price News',
    url: 'https://investors.troweprice.com/rss/news-releases.xml',
    feedCategory: 'NEWS',
    isActive: true,
  },

  // Artisan Partners
  {
    id: 'artisan-news',
    publisherId: 'artisan',
    name: 'Artisan Partners News',
    url: 'https://www.apam.com/rss/news-releases.xml',
    feedCategory: 'NEWS',
    isActive: true,
  },

  // VanEck
  {
    id: 'vaneck-insights',
    publisherId: 'vaneck',
    name: 'VanEck Insights',
    url: 'https://www.vaneck.com/nl/en/news-and-insights/blog/blog-rss',
    feedCategory: 'RESEARCH',
    isActive: true,
  },

  // Advisor Perspectives
  {
    id: 'advisorperspectives-content',
    publisherId: 'advisorperspectives',
    name: 'Advisor Perspectives',
    url: 'https://www.advisorperspectives.com/content.rss',
    feedCategory: 'RESEARCH',
    isActive: true,
  },
  {
    id: 'advisorperspectives-commentaries',
    publisherId: 'advisorperspectives',
    name: 'Advisor Perspectives Commentaries',
    url: 'https://www.advisorperspectives.com/commentaries.rss',
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
