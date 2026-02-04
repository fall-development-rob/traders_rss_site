import type { FeedItem } from '../types';

const now = new Date();
const hoursAgo = (hours: number): Date => new Date(now.getTime() - hours * 60 * 60 * 1000);
const daysAgo = (days: number): Date => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

export const mockFeedItems: FeedItem[] = [
  // CNBC Items
  {
    id: 'cnbc-001',
    feedSourceId: 'cnbc-top-news',
    publisherId: 'cnbc',
    title: 'Fed Signals Potential Rate Cut in March as Inflation Cools',
    summary:
      'Federal Reserve officials indicated they may begin cutting interest rates as early as March, following encouraging inflation data that showed price pressures easing faster than expected.',
    url: 'https://www.cnbc.com/fed-rate-cut-march',
    publishedAt: hoursAgo(1),
    author: 'Jeff Cox',
    categories: ['Federal Reserve', 'Interest Rates', 'Economy'],
  },
  {
    id: 'cnbc-002',
    feedSourceId: 'cnbc-investing',
    publisherId: 'cnbc',
    title: 'Tech Stocks Rally as AI Optimism Drives Market Higher',
    summary:
      'Major technology stocks surged on Wednesday as investors bet that artificial intelligence will continue to drive corporate earnings growth throughout 2026.',
    url: 'https://www.cnbc.com/tech-rally-ai',
    publishedAt: hoursAgo(3),
    author: 'Yun Li',
    categories: ['Technology', 'Stocks', 'AI'],
  },
  {
    id: 'cnbc-003',
    feedSourceId: 'cnbc-finance',
    publisherId: 'cnbc',
    title: 'JPMorgan Beats Earnings Expectations on Strong Trading Revenue',
    summary:
      'JPMorgan Chase reported quarterly earnings that exceeded analyst expectations, driven by robust trading revenue and resilient consumer spending.',
    url: 'https://www.cnbc.com/jpm-earnings',
    publishedAt: hoursAgo(5),
    author: 'Hugh Son',
    categories: ['Banks', 'Earnings', 'JPMorgan'],
  },
  {
    id: 'cnbc-004',
    feedSourceId: 'cnbc-world-news',
    publisherId: 'cnbc',
    title: 'European Markets Rise on ECB Dovish Stance',
    summary:
      'European equities advanced after ECB officials suggested they would be patient with rate decisions, boosting sentiment across the region.',
    url: 'https://www.cnbc.com/europe-markets-ecb',
    publishedAt: hoursAgo(7),
    categories: ['Europe', 'ECB', 'Markets'],
  },
  {
    id: 'cnbc-005',
    feedSourceId: 'cnbc-top-news',
    publisherId: 'cnbc',
    title: 'Nvidia Unveils Next-Gen AI Chips at Record Prices',
    summary:
      'Nvidia announced its latest generation of AI accelerators, priced at premium levels reflecting strong demand from cloud providers.',
    url: 'https://www.cnbc.com/nvidia-chips',
    publishedAt: hoursAgo(2),
    categories: ['Nvidia', 'AI', 'Semiconductors'],
  },

  // MarketWatch Items
  {
    id: 'mw-001',
    feedSourceId: 'mw-top-stories',
    publisherId: 'marketwatch',
    title: 'S&P 500 Closes at Record High Amid Earnings Optimism',
    summary:
      'The S&P 500 index closed at an all-time high on Tuesday as strong corporate earnings reports fueled investor confidence in the economic outlook.',
    url: 'https://www.marketwatch.com/sp500-record',
    publishedAt: hoursAgo(2),
    author: 'William Watts',
    categories: ['S&P 500', 'Stocks', 'Records'],
  },
  {
    id: 'mw-002',
    feedSourceId: 'mw-market-pulse',
    publisherId: 'marketwatch',
    title: 'Oil Prices Surge on Middle East Supply Concerns',
    summary:
      'Crude oil futures jumped more than 3% after geopolitical tensions in the Middle East raised concerns about potential supply disruptions.',
    url: 'https://www.marketwatch.com/oil-surge',
    publishedAt: hoursAgo(4),
    categories: ['Oil', 'Commodities', 'Geopolitics'],
  },
  {
    id: 'mw-003',
    feedSourceId: 'mw-bulletins',
    publisherId: 'marketwatch',
    title: 'Bitcoin Breaks $100,000 as Institutional Adoption Accelerates',
    summary:
      'Bitcoin surpassed the $100,000 milestone for the first time as major financial institutions increased their cryptocurrency exposure.',
    url: 'https://www.marketwatch.com/bitcoin-100k',
    publishedAt: hoursAgo(6),
    categories: ['Bitcoin', 'Cryptocurrency', 'Institutional'],
  },
  {
    id: 'mw-004',
    feedSourceId: 'mw-top-stories',
    publisherId: 'marketwatch',
    title: 'Housing Starts Surge as Mortgage Rates Decline',
    summary:
      'New home construction jumped 8% in January as falling mortgage rates encouraged builders to increase residential development.',
    url: 'https://www.marketwatch.com/housing-starts',
    publishedAt: hoursAgo(8),
    categories: ['Housing', 'Real Estate', 'Construction'],
  },
  {
    id: 'mw-005',
    feedSourceId: 'mw-market-pulse',
    publisherId: 'marketwatch',
    title: 'Retail Sales Data Points to Consumer Resilience',
    summary:
      'U.S. retail sales rose more than expected in January, suggesting consumers remain willing to spend despite higher interest rates.',
    url: 'https://www.marketwatch.com/retail-sales',
    publishedAt: hoursAgo(11),
    categories: ['Retail', 'Consumer', 'Economy'],
  },

  // Seeking Alpha Items
  {
    id: 'sa-001',
    feedSourceId: 'sa-market-news',
    publisherId: 'seekingalpha',
    title: 'Apple Announces $100 Billion Stock Buyback Program',
    summary:
      'Apple Inc. unveiled a massive $100 billion share repurchase program, signaling confidence in its long-term growth prospects and commitment to returning value to shareholders.',
    url: 'https://seekingalpha.com/apple-buyback',
    publishedAt: hoursAgo(1),
    categories: ['Apple', 'Buybacks', 'Technology'],
  },
  {
    id: 'sa-002',
    feedSourceId: 'sa-wall-street',
    publisherId: 'seekingalpha',
    title: 'Wall Street Breakfast: What Moved Markets Overnight',
    summary:
      'Asian markets gained on China stimulus hopes, European futures point higher, and U.S. futures suggest a positive open ahead of key economic data.',
    url: 'https://seekingalpha.com/wsb-daily',
    publishedAt: hoursAgo(10),
    categories: ['Markets', 'Daily Wrap', 'Global'],
  },
  {
    id: 'sa-003',
    feedSourceId: 'sa-market-news',
    publisherId: 'seekingalpha',
    title: 'Tesla Deliveries Beat Estimates on Strong China Demand',
    summary:
      'Tesla reported quarterly vehicle deliveries that exceeded Wall Street expectations, driven by robust sales in China and new production efficiencies.',
    url: 'https://seekingalpha.com/tesla-deliveries',
    publishedAt: hoursAgo(12),
    categories: ['Tesla', 'EVs', 'China'],
  },
  {
    id: 'sa-004',
    feedSourceId: 'sa-market-news',
    publisherId: 'seekingalpha',
    title: 'Dividend Aristocrats: 5 Stocks With 50+ Year Streaks',
    summary:
      'A look at the elite dividend aristocrats that have increased their payouts for over half a century and continue to offer value.',
    url: 'https://seekingalpha.com/dividend-aristocrats',
    publishedAt: daysAgo(1),
    categories: ['Dividends', 'Blue Chips', 'Income'],
  },

  // Zero Hedge Items
  {
    id: 'zh-001',
    feedSourceId: 'zh-feed',
    publisherId: 'zerohedge',
    title: 'Treasury Yields Spike as Debt Concerns Mount',
    summary:
      'U.S. Treasury yields surged to multi-year highs as investors grew increasingly worried about the growing federal debt burden and its implications for fiscal stability.',
    url: 'https://www.zerohedge.com/treasury-yields',
    publishedAt: hoursAgo(2),
    categories: ['Treasuries', 'Debt', 'Bonds'],
  },
  {
    id: 'zh-002',
    feedSourceId: 'zh-feed',
    publisherId: 'zerohedge',
    title: 'Gold Hits All-Time High as Dollar Weakens',
    summary:
      'Gold prices reached a record high as the U.S. dollar weakened and investors sought safe-haven assets amid global economic uncertainty.',
    url: 'https://www.zerohedge.com/gold-record',
    publishedAt: hoursAgo(5),
    categories: ['Gold', 'Commodities', 'Dollar'],
  },
  {
    id: 'zh-003',
    feedSourceId: 'zh-feed',
    publisherId: 'zerohedge',
    title: 'Regional Bank Stress Returns as CRE Concerns Intensify',
    summary:
      'Several regional bank stocks tumbled after analysts warned that commercial real estate losses could pressure balance sheets in the coming quarters.',
    url: 'https://www.zerohedge.com/regional-banks-cre',
    publishedAt: hoursAgo(8),
    categories: ['Banks', 'CRE', 'Regional Banks'],
  },
  {
    id: 'zh-004',
    feedSourceId: 'zh-feed',
    publisherId: 'zerohedge',
    title: 'Central Banks Continue Gold Accumulation Trend',
    summary:
      'Global central banks added to their gold reserves for the fifteenth consecutive quarter as de-dollarization efforts accelerate.',
    url: 'https://www.zerohedge.com/central-bank-gold',
    publishedAt: daysAgo(2),
    categories: ['Gold', 'Central Banks', 'Reserves'],
  },

  // Federal Reserve Items
  {
    id: 'fed-001',
    feedSourceId: 'fed-press-releases',
    publisherId: 'federalreserve',
    title: 'Federal Reserve Issues FOMC Statement',
    summary:
      'The Federal Open Market Committee decided to maintain the target range for the federal funds rate at 4-1/4 to 4-1/2 percent.',
    url: 'https://www.federalreserve.gov/fomc-statement',
    publishedAt: daysAgo(1),
    categories: ['FOMC', 'Monetary Policy', 'Interest Rates'],
  },
  {
    id: 'fed-002',
    feedSourceId: 'fed-speeches',
    publisherId: 'federalreserve',
    title: 'Chair Powell Speaks on Economic Outlook',
    summary:
      'Federal Reserve Chair Jerome Powell delivered remarks on the economic outlook and monetary policy at the Economic Club of Washington.',
    url: 'https://www.federalreserve.gov/powell-speech',
    publishedAt: daysAgo(2),
    author: 'Jerome Powell',
    categories: ['Fed Chair', 'Economy', 'Speeches'],
  },
  {
    id: 'fed-003',
    feedSourceId: 'fed-testimony',
    publisherId: 'federalreserve',
    title: 'Semiannual Monetary Policy Report to Congress',
    summary:
      'Chair Powell presented the Federal Reserve Semiannual Monetary Policy Report to the Committee on Banking, Housing, and Urban Affairs.',
    url: 'https://www.federalreserve.gov/monetary-policy-report',
    publishedAt: daysAgo(5),
    author: 'Jerome Powell',
    categories: ['Congress', 'Monetary Policy', 'Testimony'],
  },

  // SEC Items
  {
    id: 'sec-001',
    feedSourceId: 'sec-press-releases',
    publisherId: 'sec',
    title: 'SEC Charges Investment Adviser With Fraud',
    summary:
      'The Securities and Exchange Commission today charged a registered investment adviser with defrauding clients through undisclosed conflicts of interest.',
    url: 'https://www.sec.gov/fraud-charges',
    publishedAt: hoursAgo(6),
    categories: ['Enforcement', 'Fraud', 'Investment Advisers'],
  },
  {
    id: 'sec-002',
    feedSourceId: 'sec-speeches',
    publisherId: 'sec',
    title: 'SEC Chair Remarks on Market Structure Reforms',
    summary:
      'SEC Chair Gary Gensler discussed proposed market structure reforms aimed at improving transparency and competition in equity markets.',
    url: 'https://www.sec.gov/market-structure',
    publishedAt: daysAgo(1),
    author: 'Gary Gensler',
    categories: ['Market Structure', 'Regulation', 'Speeches'],
  },
  {
    id: 'sec-003',
    feedSourceId: 'sec-litigation',
    publisherId: 'sec',
    title: 'SEC Obtains Emergency Relief Against Crypto Fraud Scheme',
    summary:
      'The SEC obtained emergency relief to halt an ongoing cryptocurrency fraud scheme that raised millions from retail investors.',
    url: 'https://www.sec.gov/crypto-fraud',
    publishedAt: daysAgo(2),
    categories: ['Crypto', 'Fraud', 'Enforcement'],
  },

  // Goldman Sachs Items
  {
    id: 'gs-001',
    feedSourceId: 'gs-insights',
    publisherId: 'goldmansachs',
    title: 'Global Markets Outlook: Navigating Uncertainty',
    summary:
      'Our strategists discuss key themes for global markets in 2026, including AI adoption, rate normalization, and emerging market opportunities.',
    url: 'https://www.goldmansachs.com/markets-outlook',
    publishedAt: daysAgo(1),
    categories: ['Research', 'Strategy', 'Global Markets'],
  },
  {
    id: 'gs-002',
    feedSourceId: 'gs-insights',
    publisherId: 'goldmansachs',
    title: 'The AI Investment Landscape: Where We See Value',
    summary:
      'Examining the AI value chain and identifying investment opportunities across semiconductors, software, and AI-enabled services.',
    url: 'https://www.goldmansachs.com/ai-investing',
    publishedAt: daysAgo(3),
    categories: ['AI', 'Technology', 'Investment Themes'],
  },

  // JP Morgan Items
  {
    id: 'jpm-001',
    feedSourceId: 'jpm-insights',
    publisherId: 'jpmorgan',
    title: 'Weekly Market Recap: Equities Rally on Earnings',
    summary:
      'Our market strategists review the past week performance and provide outlook for the week ahead with focus on earnings season.',
    url: 'https://www.jpmorgan.com/weekly-recap',
    publishedAt: hoursAgo(24),
    categories: ['Weekly Review', 'Earnings', 'Strategy'],
  },
  {
    id: 'jpm-002',
    feedSourceId: 'jpm-insights',
    publisherId: 'jpmorgan',
    title: 'Fixed Income Outlook: Opportunities in Credit',
    summary:
      'An analysis of current credit spreads and where we see value in investment-grade and high-yield corporate bonds.',
    url: 'https://www.jpmorgan.com/fixed-income',
    publishedAt: daysAgo(2),
    categories: ['Fixed Income', 'Credit', 'Bonds'],
  },

  // PIMCO Items
  {
    id: 'pimco-001',
    feedSourceId: 'pimco-insights',
    publisherId: 'pimco',
    title: 'Secular Outlook: The Age of Transformation',
    summary:
      'Our annual secular forum examines the forces reshaping the global economy and financial markets over the next three to five years.',
    url: 'https://www.pimco.com/secular-outlook',
    publishedAt: daysAgo(7),
    categories: ['Secular Outlook', 'Economy', 'Strategy'],
  },
  {
    id: 'pimco-002',
    feedSourceId: 'pimco-insights',
    publisherId: 'pimco',
    title: 'Bond Market Update: Yields and Duration',
    summary:
      'Analysis of current yield curve dynamics and our positioning across duration and credit sectors.',
    url: 'https://www.pimco.com/bond-update',
    publishedAt: daysAgo(3),
    categories: ['Bonds', 'Fixed Income', 'Duration'],
  },

  // BlackRock Items
  {
    id: 'blk-001',
    feedSourceId: 'blackrock-insights',
    publisherId: 'blackrock',
    title: 'Weekly Commentary: Mega Forces Driving Markets',
    summary:
      'Our Investment Institute discusses how mega forces like AI, geopolitical fragmentation, and the low-carbon transition are reshaping portfolios.',
    url: 'https://www.blackrock.com/mega-forces',
    publishedAt: hoursAgo(18),
    categories: ['Commentary', 'Mega Forces', 'Strategy'],
  },
  {
    id: 'blk-002',
    feedSourceId: 'blackrock-insights',
    publisherId: 'blackrock',
    title: 'Global Allocation Views: February 2026',
    summary:
      'Our monthly tactical views on equities, fixed income, and alternative assets across developed and emerging markets.',
    url: 'https://www.blackrock.com/allocation-views',
    publishedAt: daysAgo(4),
    categories: ['Asset Allocation', 'Global', 'Tactical'],
  },

  // Morningstar Items
  {
    id: 'ms-001',
    feedSourceId: 'morningstar-articles',
    publisherId: 'morningstar',
    title: 'Best Dividend Stocks for Long-Term Investors',
    summary:
      'Our analysts highlight undervalued dividend stocks with sustainable payouts and strong competitive advantages.',
    url: 'https://www.morningstar.com/dividend-stocks',
    publishedAt: hoursAgo(4),
    author: 'Susan Dziubinski',
    categories: ['Dividends', 'Stock Picks', 'Research'],
  },
  {
    id: 'ms-002',
    feedSourceId: 'morningstar-articles',
    publisherId: 'morningstar',
    title: 'Fund Manager of the Year: Our Top Picks',
    summary:
      'Recognizing exceptional fund managers who delivered outstanding risk-adjusted returns for their shareholders.',
    url: 'https://www.morningstar.com/fund-manager',
    publishedAt: daysAgo(2),
    categories: ['Funds', 'Awards', 'Research'],
  },
  {
    id: 'ms-003',
    feedSourceId: 'morningstar-news',
    publisherId: 'morningstar',
    title: 'ETF Flows: Where Investors Are Putting Money',
    summary:
      'A look at the biggest ETF inflows and outflows over the past month and what they reveal about investor sentiment.',
    url: 'https://www.morningstar.com/etf-flows',
    publishedAt: daysAgo(1),
    categories: ['ETFs', 'Flows', 'Sentiment'],
  },

  // Bloomberg Items
  {
    id: 'bbg-001',
    feedSourceId: 'bloomberg-markets',
    publisherId: 'bloomberg',
    title: 'Asian Stocks Rise on China Policy Optimism',
    summary:
      'Asian equities gained broadly as investors bet on additional policy support from Chinese authorities to boost economic growth.',
    url: 'https://www.bloomberg.com/asia-stocks',
    publishedAt: hoursAgo(8),
    categories: ['Asia', 'China', 'Stocks'],
  },
  {
    id: 'bbg-002',
    feedSourceId: 'bloomberg-markets',
    publisherId: 'bloomberg',
    title: 'Dollar Weakens as Traders Bet on Fed Pivot',
    summary:
      'The U.S. dollar declined against major currencies as traders increased bets that the Federal Reserve will cut rates sooner than expected.',
    url: 'https://www.bloomberg.com/dollar-fed',
    publishedAt: hoursAgo(10),
    categories: ['Dollar', 'Currency', 'Fed'],
  },
  {
    id: 'bbg-003',
    feedSourceId: 'bloomberg-politics',
    publisherId: 'bloomberg',
    title: 'Congress Passes Infrastructure Spending Bill',
    summary:
      'The U.S. Congress approved a major infrastructure spending package, allocating billions for transportation, energy, and broadband projects.',
    url: 'https://www.bloomberg.com/infrastructure-bill',
    publishedAt: daysAgo(1),
    categories: ['Politics', 'Infrastructure', 'Government'],
  },
  {
    id: 'bbg-004',
    feedSourceId: 'bloomberg-markets',
    publisherId: 'bloomberg',
    title: 'Private Equity Fundraising Slows Amid Higher Rates',
    summary:
      'Private equity firms are finding it harder to raise new capital as higher interest rates reduce the attractiveness of leveraged buyouts.',
    url: 'https://www.bloomberg.com/pe-fundraising',
    publishedAt: daysAgo(3),
    categories: ['Private Equity', 'Fundraising', 'Alternatives'],
  },

  // Reuters Items
  {
    id: 'reuters-001',
    feedSourceId: 'reuters-business',
    publisherId: 'reuters',
    title: 'Microsoft Cloud Revenue Beats Estimates',
    summary:
      'Microsoft reported cloud computing revenue that exceeded analyst expectations, driven by strong enterprise demand for AI services.',
    url: 'https://www.reuters.com/microsoft-cloud',
    publishedAt: hoursAgo(3),
    categories: ['Microsoft', 'Cloud', 'Earnings'],
  },
  {
    id: 'reuters-002',
    feedSourceId: 'reuters-markets',
    publisherId: 'reuters',
    title: 'Copper Prices Hit 2-Year High on Supply Worries',
    summary:
      'Copper futures surged to their highest level in two years amid concerns about supply disruptions and growing demand from the green energy transition.',
    url: 'https://www.reuters.com/copper-prices',
    publishedAt: hoursAgo(6),
    categories: ['Copper', 'Commodities', 'Mining'],
  },
  {
    id: 'reuters-003',
    feedSourceId: 'reuters-business',
    publisherId: 'reuters',
    title: 'Volkswagen to Invest $10 Billion in EV Production',
    summary:
      'German automaker Volkswagen announced plans to invest $10 billion in electric vehicle production facilities across North America.',
    url: 'https://www.reuters.com/vw-ev-investment',
    publishedAt: hoursAgo(12),
    categories: ['Autos', 'EVs', 'Investment'],
  },

  // Financial Times Items
  {
    id: 'ft-001',
    feedSourceId: 'ft-markets',
    publisherId: 'ft',
    title: 'UK Gilt Yields Fall After Soft Inflation Data',
    summary:
      'British government bond yields declined after inflation data came in below expectations, raising hopes for Bank of England rate cuts.',
    url: 'https://www.ft.com/uk-gilts',
    publishedAt: hoursAgo(5),
    categories: ['UK', 'Gilts', 'Inflation'],
  },
  {
    id: 'ft-002',
    feedSourceId: 'ft-world',
    publisherId: 'ft',
    title: 'EU Agrees on New AI Regulation Framework',
    summary:
      'European Union member states reached agreement on comprehensive artificial intelligence regulations that will affect global tech companies.',
    url: 'https://www.ft.com/eu-ai-regulation',
    publishedAt: hoursAgo(9),
    categories: ['EU', 'AI', 'Regulation'],
  },

  // WSJ Items
  {
    id: 'wsj-001',
    feedSourceId: 'wsj-markets',
    publisherId: 'wsj',
    title: 'Hedge Funds Boost Bearish Bets on Treasuries',
    summary:
      'Major hedge funds have increased their short positions on U.S. Treasuries, betting that yields will rise further as inflation proves sticky.',
    url: 'https://www.wsj.com/hedge-funds-treasuries',
    publishedAt: hoursAgo(4),
    author: 'Matt Grossman',
    categories: ['Hedge Funds', 'Treasuries', 'Trading'],
  },
  {
    id: 'wsj-002',
    feedSourceId: 'wsj-world',
    publisherId: 'wsj',
    title: 'Japan Intervenes to Support Weakening Yen',
    summary:
      'Japanese authorities intervened in currency markets to support the yen after it fell to its lowest level against the dollar in decades.',
    url: 'https://www.wsj.com/japan-yen',
    publishedAt: hoursAgo(7),
    categories: ['Japan', 'Yen', 'Intervention'],
  },
  {
    id: 'wsj-003',
    feedSourceId: 'wsj-opinion',
    publisherId: 'wsj',
    title: 'Opinion: The Case for Tax Reform in 2026',
    summary:
      'With expiring tax provisions and rising deficits, Congress has an opportunity to implement meaningful tax reform this year.',
    url: 'https://www.wsj.com/tax-reform-opinion',
    publishedAt: daysAgo(1),
    author: 'Editorial Board',
    categories: ['Opinion', 'Tax', 'Policy'],
  },

  // S&P Global Items
  {
    id: 'sp-001',
    feedSourceId: 'sp-market-intelligence',
    publisherId: 'sp',
    title: 'Global Default Rate Expected to Rise in 2026',
    summary:
      'S&P Global Ratings forecasts an increase in corporate default rates as higher borrowing costs pressure overleveraged companies.',
    url: 'https://www.spglobal.com/default-rate',
    publishedAt: daysAgo(2),
    categories: ['Credit', 'Defaults', 'Ratings'],
  },
  {
    id: 'sp-002',
    feedSourceId: 'sp-market-intelligence',
    publisherId: 'sp',
    title: 'Bank Loan Performance Shows Signs of Stress',
    summary:
      'Analysis of bank loan portfolios reveals increasing delinquencies in commercial real estate and consumer credit segments.',
    url: 'https://www.spglobal.com/bank-loans',
    publishedAt: daysAgo(4),
    categories: ['Banks', 'Loans', 'Credit Quality'],
  },

  // CFTC Items
  {
    id: 'cftc-001',
    feedSourceId: 'cftc-press-releases',
    publisherId: 'cftc',
    title: 'CFTC Announces Enhanced Reporting Requirements',
    summary:
      'The Commodity Futures Trading Commission approved new reporting requirements for large traders in derivatives markets.',
    url: 'https://www.cftc.gov/reporting-requirements',
    publishedAt: daysAgo(3),
    categories: ['Regulation', 'Derivatives', 'Reporting'],
  },
];

export const getMockItemsByPublisher = (publisherId: string): FeedItem[] => {
  return mockFeedItems.filter((item) => item.publisherId === publisherId);
};

export const getMockItemsByFeed = (feedSourceId: string): FeedItem[] => {
  return mockFeedItems.filter((item) => item.feedSourceId === feedSourceId);
};

export const getMockItemsByTimeRange = (
  range: 'today' | 'week' | 'month' | 'all'
): FeedItem[] => {
  const now = new Date();
  const cutoff = new Date();

  switch (range) {
    case 'today':
      cutoff.setHours(0, 0, 0, 0);
      break;
    case 'week':
      cutoff.setDate(now.getDate() - 7);
      break;
    case 'month':
      cutoff.setMonth(now.getMonth() - 1);
      break;
    case 'all':
      return mockFeedItems;
  }

  return mockFeedItems.filter((item) => item.publishedAt >= cutoff);
};

export const searchMockItems = (query: string): FeedItem[] => {
  const lowerQuery = query.toLowerCase();
  return mockFeedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.summary.toLowerCase().includes(lowerQuery) ||
      item.categories?.some((cat) => cat.toLowerCase().includes(lowerQuery))
  );
};
