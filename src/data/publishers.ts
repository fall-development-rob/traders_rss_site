import type { Publisher } from '../types';

export const publishers: Publisher[] = [
  // NEWS
  {
    id: 'cnbc',
    name: 'CNBC',
    shortName: 'CNBC',
    category: 'NEWS',
    brandColor: '#005594',
    website: 'https://www.cnbc.com',
  },
  {
    id: 'marketwatch',
    name: 'MarketWatch',
    shortName: 'MW',
    category: 'NEWS',
    brandColor: '#00AC4E',
    website: 'https://www.marketwatch.com',
  },
  {
    id: 'ft',
    name: 'Financial Times',
    shortName: 'FT',
    category: 'NEWS',
    brandColor: '#FFF1E5',
    website: 'https://www.ft.com',
  },
  {
    id: 'wsj',
    name: 'The Wall Street Journal',
    shortName: 'WSJ',
    category: 'NEWS',
    brandColor: '#0274B6',
    website: 'https://www.wsj.com',
  },
  {
    id: 'seekingalpha',
    name: 'Seeking Alpha',
    shortName: 'SA',
    category: 'NEWS',
    brandColor: '#F97316',
    website: 'https://seekingalpha.com',
  },
  {
    id: 'zerohedge',
    name: 'Zero Hedge',
    shortName: 'ZH',
    category: 'NEWS',
    brandColor: '#000000',
    website: 'https://www.zerohedge.com',
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg',
    shortName: 'BBG',
    category: 'NEWS',
    brandColor: '#2800D7',
    website: 'https://www.bloomberg.com',
  },
  {
    id: 'reuters',
    name: 'Reuters',
    shortName: 'Reuters',
    category: 'NEWS',
    brandColor: '#FF8000',
    website: 'https://www.reuters.com',
  },

  // ASSET_MANAGER
  {
    id: 'pimco',
    name: 'PIMCO',
    shortName: 'PIMCO',
    category: 'ASSET_MANAGER',
    brandColor: '#003366',
    website: 'https://www.pimco.com',
  },
  {
    id: 'vanguard',
    name: 'Vanguard',
    shortName: 'Vanguard',
    category: 'ASSET_MANAGER',
    brandColor: '#96151D',
    website: 'https://www.vanguard.com',
  },
  {
    id: 'blackrock',
    name: 'BlackRock',
    shortName: 'BLK',
    category: 'ASSET_MANAGER',
    brandColor: '#000000',
    website: 'https://www.blackrock.com',
  },
  {
    id: 'fidelity',
    name: 'Fidelity Investments',
    shortName: 'Fidelity',
    category: 'ASSET_MANAGER',
    brandColor: '#4FAA41',
    website: 'https://www.fidelity.com',
  },
  {
    id: 'schwab',
    name: 'Charles Schwab',
    shortName: 'Schwab',
    category: 'ASSET_MANAGER',
    brandColor: '#00A0DF',
    website: 'https://www.schwab.com',
  },

  // BANK
  {
    id: 'goldmansachs',
    name: 'Goldman Sachs',
    shortName: 'GS',
    category: 'BANK',
    brandColor: '#6BA539',
    website: 'https://www.goldmansachs.com',
  },
  {
    id: 'jpmorgan',
    name: 'JP Morgan',
    shortName: 'JPM',
    category: 'BANK',
    brandColor: '#117ACA',
    website: 'https://www.jpmorgan.com',
  },
  {
    id: 'morganstanley',
    name: 'Morgan Stanley',
    shortName: 'MS',
    category: 'BANK',
    brandColor: '#00856A',
    website: 'https://www.morganstanley.com',
  },
  {
    id: 'bofa',
    name: 'Bank of America',
    shortName: 'BofA',
    category: 'BANK',
    brandColor: '#E31837',
    website: 'https://www.bankofamerica.com',
  },

  // PROP_TRADING
  {
    id: 'janestreet',
    name: 'Jane Street',
    shortName: 'JS',
    category: 'PROP_TRADING',
    brandColor: '#1E3A5F',
    website: 'https://www.janestreet.com',
  },
  {
    id: 'virtu',
    name: 'Virtu Financial',
    shortName: 'Virtu',
    category: 'PROP_TRADING',
    brandColor: '#00AEEF',
    website: 'https://www.virtu.com',
  },
  {
    id: 'citadel',
    name: 'Citadel',
    shortName: 'Citadel',
    category: 'PROP_TRADING',
    brandColor: '#1C1C1C',
    website: 'https://www.citadel.com',
  },

  // REGULATOR
  {
    id: 'federalreserve',
    name: 'Federal Reserve',
    shortName: 'Fed',
    category: 'REGULATOR',
    brandColor: '#003B5C',
    website: 'https://www.federalreserve.gov',
  },
  {
    id: 'sec',
    name: 'Securities and Exchange Commission',
    shortName: 'SEC',
    category: 'REGULATOR',
    brandColor: '#002F6C',
    website: 'https://www.sec.gov',
  },
  {
    id: 'cftc',
    name: 'Commodity Futures Trading Commission',
    shortName: 'CFTC',
    category: 'REGULATOR',
    brandColor: '#003366',
    website: 'https://www.cftc.gov',
  },

  // RESEARCH
  {
    id: 'morningstar',
    name: 'Morningstar',
    shortName: 'Morningstar',
    category: 'RESEARCH',
    brandColor: '#E31B23',
    website: 'https://www.morningstar.com',
  },
  {
    id: 'sp',
    name: 'S&P Global',
    shortName: 'S&P',
    category: 'RESEARCH',
    brandColor: '#CC0000',
    website: 'https://www.spglobal.com',
  },
  {
    id: 'moodys',
    name: "Moody's",
    shortName: "Moody's",
    category: 'RESEARCH',
    brandColor: '#002855',
    website: 'https://www.moodys.com',
  },
];

export const getPublisherById = (id: string): Publisher | undefined => {
  return publishers.find((p) => p.id === id);
};

export const getPublishersByCategory = (category: Publisher['category']): Publisher[] => {
  return publishers.filter((p) => p.category === category);
};
