/**
 * Market Data Service
 *
 * Fetches real-time market data from Yahoo Finance using the yahoo-finance2 package.
 * Provides current prices and daily changes for major indices.
 */

import YahooFinance from 'yahoo-finance2';

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isUp: boolean;
  previousClose: number;
}

/**
 * Market symbols configuration with display names
 */
export const MARKET_SYMBOLS = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'Nasdaq 100' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: 'IWM', name: 'Russell 2000' },
  { symbol: '^VIX', name: 'Volatility' },
] as const;

// Create Yahoo Finance instance (v3 API)
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

/**
 * Fetches a single market quote from Yahoo Finance
 *
 * @param symbol - The ticker symbol to fetch (e.g., 'SPY', '^VIX')
 * @param name - The display name for the symbol
 * @returns MarketQuote object or null if fetch fails
 */
export async function fetchMarketQuote(
  symbol: string,
  name: string
): Promise<MarketQuote | null> {
  try {
    const quote = await yahooFinance.quote(symbol);

    if (!quote || typeof quote.regularMarketPrice !== 'number' || typeof quote.regularMarketPreviousClose !== 'number') {
      console.error(`Missing price data for ${symbol}`);
      return null;
    }

    const currentPrice = quote.regularMarketPrice;
    const previousClose = quote.regularMarketPreviousClose;
    const change = typeof quote.regularMarketChange === 'number'
      ? quote.regularMarketChange
      : (currentPrice - previousClose);
    const changePercent = typeof quote.regularMarketChangePercent === 'number'
      ? quote.regularMarketChangePercent
      : ((change / previousClose) * 100);
    const isUp = change >= 0;

    return {
      symbol: symbol.replace('^', ''),
      name,
      price: roundToDecimal(currentPrice, 2),
      change: roundToDecimal(change, 2),
      changePercent: roundToDecimal(changePercent, 2),
      isUp,
      previousClose: roundToDecimal(previousClose, 2),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching ${symbol}:`, error.message);
    } else {
      console.error(`Unknown error fetching ${symbol}:`, error);
    }
    return null;
  }
}

/**
 * Fetches all market quotes in parallel
 *
 * @returns Array of MarketQuote objects for successfully fetched symbols
 */
export async function fetchAllMarketQuotes(): Promise<MarketQuote[]> {
  const fetchPromises = MARKET_SYMBOLS.map(({ symbol, name }) =>
    fetchMarketQuote(symbol, name)
  );

  const results = await Promise.all(fetchPromises);

  // Filter out null results (failed fetches)
  return results.filter((quote): quote is MarketQuote => quote !== null);
}

/**
 * Fetches market quotes for a custom list of symbols
 *
 * @param symbols - Array of symbol configurations with symbol and name
 * @returns Array of MarketQuote objects for successfully fetched symbols
 */
export async function fetchCustomMarketQuotes(
  symbols: Array<{ symbol: string; name: string }>
): Promise<MarketQuote[]> {
  const fetchPromises = symbols.map(({ symbol, name }) =>
    fetchMarketQuote(symbol, name)
  );

  const results = await Promise.all(fetchPromises);

  return results.filter((quote): quote is MarketQuote => quote !== null);
}

/**
 * Rounds a number to a specified number of decimal places
 *
 * @param value - The number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Formats a price change for display
 *
 * @param change - The price change value
 * @param includeSign - Whether to include +/- sign
 * @returns Formatted string
 */
export function formatPriceChange(change: number, includeSign = true): string {
  const sign = includeSign && change > 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
}

/**
 * Formats a percentage change for display
 *
 * @param changePercent - The percentage change value
 * @param includeSign - Whether to include +/- sign
 * @returns Formatted string with % symbol
 */
export function formatPercentChange(changePercent: number, includeSign = true): string {
  const sign = includeSign && changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
}

/**
 * Gets the CSS class name for positive/negative values
 *
 * @param isUp - Whether the value represents a positive change
 * @returns CSS class string for styling
 */
export function getChangeColorClass(isUp: boolean): string {
  return isUp ? 'text-green-500' : 'text-red-500';
}

/**
 * Checks if the market is currently open (US market hours)
 * Note: This is a simple check and doesn't account for holidays
 *
 * @returns boolean indicating if market is likely open
 */
export function isMarketOpen(): boolean {
  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();

  // Convert to Eastern Time (UTC-5 or UTC-4 during DST)
  // Market hours: 9:30 AM - 4:00 PM ET
  // Using UTC time: 14:30 - 21:00 (EST) or 13:30 - 20:00 (EDT)

  // Weekend check
  if (day === 0 || day === 6) {
    return false;
  }

  // Simplified check using UTC (accounts for ~EST, not DST-perfect)
  const utcMinutes = hour * 60 + minute;
  const marketOpenUTC = 14 * 60 + 30;  // 14:30 UTC (9:30 AM EST)
  const marketCloseUTC = 21 * 60;       // 21:00 UTC (4:00 PM EST)

  return utcMinutes >= marketOpenUTC && utcMinutes < marketCloseUTC;
}

/**
 * Creates a cache key for market data
 *
 * @param symbol - The ticker symbol
 * @returns Cache key string
 */
export function getMarketCacheKey(symbol: string): string {
  return `market-quote-${symbol.toLowerCase().replace('^', '')}`;
}

/**
 * Default export with all public functions
 */
const marketService = {
  fetchMarketQuote,
  fetchAllMarketQuotes,
  fetchCustomMarketQuotes,
  formatPriceChange,
  formatPercentChange,
  getChangeColorClass,
  isMarketOpen,
  getMarketCacheKey,
  MARKET_SYMBOLS,
};

export default marketService;
