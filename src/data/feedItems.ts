import type { FeedItem, FeedSource } from '../types';

export const feedSources: FeedSource[] = [
  {
    id: 'cnbc-markets',
    publisherId: 'cnbc',
    name: 'CNBC Markets',
    url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'marketwatch-top',
    publisherId: 'marketwatch',
    name: 'MarketWatch Top Stories',
    url: 'http://feeds.marketwatch.com/marketwatch/topstories/',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'bloomberg-markets',
    publisherId: 'bloomberg',
    name: 'Bloomberg Markets',
    url: 'https://www.bloomberg.com/markets',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'wsj-markets',
    publisherId: 'wsj',
    name: 'WSJ Markets',
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    feedCategory: 'NEWS',
    isActive: true,
  },
  {
    id: 'fed-press',
    publisherId: 'federalreserve',
    name: 'Federal Reserve Press Releases',
    url: 'https://www.federalreserve.gov/feeds/press_all.xml',
    feedCategory: 'REGULATORY',
    isActive: true,
  },
  {
    id: 'sec-press',
    publisherId: 'sec',
    name: 'SEC Press Releases',
    url: 'https://www.sec.gov/rss/news/press.xml',
    feedCategory: 'REGULATORY',
    isActive: true,
  },
  {
    id: 'pimco-insights',
    publisherId: 'pimco',
    name: 'PIMCO Insights',
    url: 'https://www.pimco.com/en-us/insights',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },
  {
    id: 'blackrock-insights',
    publisherId: 'blackrock',
    name: 'BlackRock Insights',
    url: 'https://www.blackrock.com/us/insights',
    feedCategory: 'MARKET_COMMENTARY',
    isActive: true,
  },
  {
    id: 'gs-insights',
    publisherId: 'goldmansachs',
    name: 'Goldman Sachs Insights',
    url: 'https://www.goldmansachs.com/insights',
    feedCategory: 'RESEARCH',
    isActive: true,
  },
  {
    id: 'jpm-research',
    publisherId: 'jpmorgan',
    name: 'JP Morgan Research',
    url: 'https://www.jpmorgan.com/insights',
    feedCategory: 'RESEARCH',
    isActive: true,
  },
];

// Generate mock feed items
const now = new Date();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);

export const feedItems: FeedItem[] = [
  // CNBC
  {
    id: 'cnbc-1',
    feedSourceId: 'cnbc-markets',
    publisherId: 'cnbc',
    title: 'S&P 500 futures rise after benchmark posts best day since November election',
    summary: 'Stock futures rose slightly on Tuesday night after the S&P 500 snapped a five-day losing streak with its best performance since the November election.',
    url: 'https://www.cnbc.com/2026/02/04/stock-market-today-live-updates.html',
    publishedAt: hoursAgo(1),
    author: 'Sarah Min',
    categories: ['Markets', 'Stocks'],
  },
  {
    id: 'cnbc-2',
    feedSourceId: 'cnbc-markets',
    publisherId: 'cnbc',
    title: 'Treasury yields slip as investors weigh economic data',
    summary: 'U.S. Treasury yields fell on Wednesday as investors assessed the latest economic indicators and their implications for Federal Reserve policy.',
    url: 'https://www.cnbc.com/2026/02/04/treasury-yields-today.html',
    publishedAt: hoursAgo(2),
    author: 'Jesse Pound',
    categories: ['Bonds', 'Economy'],
  },
  {
    id: 'cnbc-3',
    feedSourceId: 'cnbc-markets',
    publisherId: 'cnbc',
    title: 'Oil prices edge higher amid Middle East supply concerns',
    summary: 'Oil prices rose on Wednesday as concerns about supply disruptions in the Middle East offset worries about demand.',
    url: 'https://www.cnbc.com/2026/02/04/oil-prices-today.html',
    publishedAt: hoursAgo(3),
    categories: ['Commodities', 'Energy'],
  },

  // MarketWatch
  {
    id: 'mw-1',
    feedSourceId: 'marketwatch-top',
    publisherId: 'marketwatch',
    title: 'These 5 stocks are driving the rally in the Dow Jones Industrial Average',
    summary: 'The Dow Jones Industrial Average gained more than 400 points Tuesday, driven by gains in these five components.',
    url: 'https://www.marketwatch.com/story/dow-rally-leaders',
    publishedAt: hoursAgo(1),
    author: 'Mark DeCambre',
    categories: ['Stocks', 'Dow Jones'],
  },
  {
    id: 'mw-2',
    feedSourceId: 'marketwatch-top',
    publisherId: 'marketwatch',
    title: 'Bitcoin climbs above $105,000 as crypto rally extends',
    summary: 'Bitcoin rose above $105,000 for the first time, extending a rally that has seen the cryptocurrency gain more than 15% this year.',
    url: 'https://www.marketwatch.com/story/bitcoin-rally',
    publishedAt: hoursAgo(4),
    author: 'Frances Yue',
    categories: ['Cryptocurrency', 'Bitcoin'],
  },

  // Bloomberg
  {
    id: 'bbg-1',
    feedSourceId: 'bloomberg-markets',
    publisherId: 'bloomberg',
    title: 'Fed Officials Signal No Rush to Cut Rates Despite Market Pressure',
    summary: 'Federal Reserve officials indicated they are in no hurry to lower interest rates, pushing back against market expectations for imminent cuts.',
    url: 'https://www.bloomberg.com/news/fed-rates',
    publishedAt: hoursAgo(2),
    author: 'Christopher Condon',
    categories: ['Federal Reserve', 'Interest Rates'],
  },
  {
    id: 'bbg-2',
    feedSourceId: 'bloomberg-markets',
    publisherId: 'bloomberg',
    title: 'European stocks gain as earnings season kicks into high gear',
    summary: 'European equities advanced as investors digested a slew of corporate earnings reports and economic data.',
    url: 'https://www.bloomberg.com/news/european-stocks',
    publishedAt: hoursAgo(5),
    categories: ['Europe', 'Stocks'],
  },

  // WSJ
  {
    id: 'wsj-1',
    feedSourceId: 'wsj-markets',
    publisherId: 'wsj',
    title: 'Corporate Bond Sales Hit Record Pace in January',
    summary: 'Companies rushed to sell bonds in January at the fastest pace on record, taking advantage of strong investor demand and tight credit spreads.',
    url: 'https://www.wsj.com/articles/corporate-bonds',
    publishedAt: hoursAgo(3),
    author: 'Matt Wirz',
    categories: ['Bonds', 'Corporate Finance'],
  },
  {
    id: 'wsj-2',
    feedSourceId: 'wsj-markets',
    publisherId: 'wsj',
    title: 'Tech Earnings Test Rally in Magnificent Seven Stocks',
    summary: 'Investors are watching earnings from the biggest technology companies for signs that the recent rally can continue.',
    url: 'https://www.wsj.com/articles/tech-earnings',
    publishedAt: hoursAgo(6),
    author: 'Hannah Miao',
    categories: ['Technology', 'Earnings'],
  },

  // Federal Reserve
  {
    id: 'fed-1',
    feedSourceId: 'fed-press',
    publisherId: 'federalreserve',
    title: 'Federal Reserve Board announces termination of enforcement action',
    summary: 'The Federal Reserve Board on Wednesday announced the termination of the enforcement action listed below.',
    url: 'https://www.federalreserve.gov/newsevents/pressreleases.htm',
    publishedAt: hoursAgo(4),
    categories: ['Regulatory', 'Enforcement'],
  },
  {
    id: 'fed-2',
    feedSourceId: 'fed-press',
    publisherId: 'federalreserve',
    title: 'Beige Book Summary of Economic Activity',
    summary: 'Economic activity expanded slightly in most Districts since the previous report. Consumer spending was mixed.',
    url: 'https://www.federalreserve.gov/monetarypolicy/beigebook.htm',
    publishedAt: hoursAgo(8),
    categories: ['Economy', 'Beige Book'],
  },

  // SEC
  {
    id: 'sec-1',
    feedSourceId: 'sec-press',
    publisherId: 'sec',
    title: 'SEC Charges Investment Adviser with Fraud',
    summary: 'The Securities and Exchange Commission today charged a registered investment adviser with defrauding clients.',
    url: 'https://www.sec.gov/news/press-releases',
    publishedAt: hoursAgo(5),
    categories: ['Enforcement', 'Fraud'],
  },

  // PIMCO
  {
    id: 'pimco-1',
    feedSourceId: 'pimco-insights',
    publisherId: 'pimco',
    title: 'Asset Allocation Outlook: Bonds Are Back',
    summary: 'With yields at multi-year highs, bonds offer attractive income and diversification potential in portfolios.',
    url: 'https://www.pimco.com/en-us/insights/asset-allocation-outlook',
    publishedAt: hoursAgo(12),
    author: 'Erin Browne',
    categories: ['Fixed Income', 'Asset Allocation'],
  },
  {
    id: 'pimco-2',
    feedSourceId: 'pimco-insights',
    publisherId: 'pimco',
    title: 'Cyclical Outlook: Navigating Economic Crosscurrents',
    summary: 'We see a range of plausible paths for the global economy, with developed markets growth slowing but remaining positive.',
    url: 'https://www.pimco.com/en-us/insights/cyclical-outlook',
    publishedAt: hoursAgo(24),
    author: 'Tiffany Wilding',
    categories: ['Economic Outlook', 'Global Markets'],
  },

  // BlackRock
  {
    id: 'blk-1',
    feedSourceId: 'blackrock-insights',
    publisherId: 'blackrock',
    title: 'Weekly Market Commentary: Staying Selective',
    summary: 'We remain overweight equities but are selective, favoring quality and companies with strong earnings visibility.',
    url: 'https://www.blackrock.com/us/insights/weekly-commentary',
    publishedAt: hoursAgo(10),
    author: 'Wei Li',
    categories: ['Market Commentary', 'Equities'],
  },

  // Goldman Sachs
  {
    id: 'gs-1',
    feedSourceId: 'gs-insights',
    publisherId: 'goldmansachs',
    title: 'Global Macro Outlook: Growth Resilience',
    summary: 'Despite persistent inflation concerns, global growth has proven more resilient than expected.',
    url: 'https://www.goldmansachs.com/insights/macro-outlook',
    publishedAt: hoursAgo(16),
    author: 'Jan Hatzius',
    categories: ['Macro', 'Global Economy'],
  },
  {
    id: 'gs-2',
    feedSourceId: 'gs-insights',
    publisherId: 'goldmansachs',
    title: 'Equity Strategy: Sector Rotation Underway',
    summary: 'We are seeing early signs of rotation from growth to value stocks as investors reassess valuations.',
    url: 'https://www.goldmansachs.com/insights/equity-strategy',
    publishedAt: hoursAgo(20),
    author: 'David Kostin',
    categories: ['Equities', 'Strategy'],
  },

  // JP Morgan
  {
    id: 'jpm-1',
    feedSourceId: 'jpm-research',
    publisherId: 'jpmorgan',
    title: 'Guide to the Markets: Q1 2026',
    summary: 'Our quarterly guide provides a comprehensive view of market dynamics and investment opportunities.',
    url: 'https://www.jpmorgan.com/insights/guide-to-markets',
    publishedAt: hoursAgo(48),
    author: 'Dr. David Kelly',
    categories: ['Market Guide', 'Investment Strategy'],
  },

  // Seeking Alpha
  {
    id: 'sa-1',
    feedSourceId: 'seekingalpha',
    publisherId: 'seekingalpha',
    title: 'Nvidia: Still Room to Run Higher',
    summary: 'Despite the massive rally, Nvidia remains attractively valued relative to its growth trajectory.',
    url: 'https://seekingalpha.com/article/nvidia-analysis',
    publishedAt: hoursAgo(7),
    author: 'Tech Investor',
    categories: ['Technology', 'Semiconductors'],
  },

  // Reuters
  {
    id: 'reuters-1',
    feedSourceId: 'reuters',
    publisherId: 'reuters',
    title: 'Dollar slips as traders eye upcoming jobs data',
    summary: 'The U.S. dollar weakened on Wednesday as traders looked ahead to Friday\'s jobs report for clues on the interest rate outlook.',
    url: 'https://www.reuters.com/markets/currencies',
    publishedAt: hoursAgo(3),
    categories: ['Currencies', 'Dollar'],
  },

  // Zero Hedge
  {
    id: 'zh-1',
    feedSourceId: 'zerohedge',
    publisherId: 'zerohedge',
    title: 'Yield Curve Inversion Deepens to Levels Not Seen Since 1980s',
    summary: 'The spread between 2-year and 10-year Treasury yields has widened to its most inverted level in four decades.',
    url: 'https://www.zerohedge.com/markets/yield-curve',
    publishedAt: hoursAgo(6),
    categories: ['Bonds', 'Yield Curve'],
  },
];

export const getFeedItemsByPublisher = (publisherId: string): FeedItem[] => {
  return feedItems.filter((item) => item.publisherId === publisherId);
};

export const getRecentFeedItems = (limit: number = 50): FeedItem[] => {
  return [...feedItems]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
};
