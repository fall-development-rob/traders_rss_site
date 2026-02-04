/**
 * Market Data Service
 *
 * Fetches real-time market data from Yahoo Finance API for major indices.
 * Uses the free v8 chart endpoint to get current prices and daily changes.
 */

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isUp: boolean;
  previousClose: number;
}

interface YahooChartResult {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        regularMarketPrice: number;
        previousClose: number;
        currency: string;
        exchangeName: string;
      };
      timestamp?: number[];
      indicators: {
        quote: Array<{
          close: (number | null)[];
          open: (number | null)[];
          high: (number | null)[];
          low: (number | null)[];
          volume: (number | null)[];
        }>;
      };
    }> | null;
    error: {
      code: string;
      description: string;
    } | null;
  };
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

/**
 * Yahoo Finance API base URL
 */
const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

/**
 * Request timeout in milliseconds
 */
const REQUEST_TIMEOUT = 5000;

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
    const encodedSymbol = encodeURIComponent(symbol);
    const url = `${YAHOO_FINANCE_BASE_URL}/${encodedSymbol}?interval=1d&range=1d`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'TradersRSS/1.0 (Market Data Aggregator)',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Failed to fetch ${symbol}: HTTP ${response.status}`);
      return null;
    }

    const data: YahooChartResult = await response.json();

    // Validate response structure
    if (data.chart.error) {
      console.error(`Yahoo Finance API error for ${symbol}:`, data.chart.error.description);
      return null;
    }

    if (!data.chart.result || data.chart.result.length === 0) {
      console.error(`No data returned for ${symbol}`);
      return null;
    }

    const result = data.chart.result[0];
    const meta = result.meta;

    // Extract price data
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose;

    // Validate we have required data
    if (currentPrice === undefined || previousClose === undefined) {
      console.error(`Missing price data for ${symbol}`);
      return null;
    }

    // Calculate change and percentage
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    const isUp = change >= 0;

    return {
      symbol: symbol.replace('^', ''), // Clean up symbol for display
      name,
      price: roundToDecimal(currentPrice, 2),
      change: roundToDecimal(change, 2),
      changePercent: roundToDecimal(changePercent, 2),
      isUp,
      previousClose: roundToDecimal(previousClose, 2),
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`Request timeout for ${symbol}`);
      } else {
        console.error(`Error fetching ${symbol}:`, error.message);
      }
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
