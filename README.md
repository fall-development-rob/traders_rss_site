# TradersRSS

A real-time financial news aggregator that pulls RSS feeds from trusted sources across the financial industry. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Real-time RSS Aggregation**: Fetches and displays news from 50+ financial RSS feeds
- **Multi-category Support**: News, Banks, Asset Managers, Regulators, Research, and more
- **Dark/Light Theme**: Full theme support with system preference detection
- **Responsive Design**: Mobile-first design that works on all devices
- **Client-side Caching**: 5-minute cache with stale-while-revalidate pattern
- **Server-side Fetching**: Avoids CORS issues by proxying RSS feeds through API routes
- **Publisher Archives**: Dedicated pages for each publisher's full article history
- **Category Browsing**: Filter content by publisher category
- **Search**: Full-text search across all articles

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **RSS Parsing**: rss-parser
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/traders-rss.git
cd traders-rss

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## RSS Feed Sources

TradersRSS aggregates content from **52 active RSS feeds** across **35 publishers** in **6 categories**.

---

### News (8 Publishers, 19 Feeds)

| Publisher | Feed Name | Category |
|-----------|-----------|----------|
| **CNBC** | Top News | NEWS |
| **CNBC** | World News | NEWS |
| **CNBC** | Finance | NEWS |
| **CNBC** | Investing | MARKET_COMMENTARY |
| **MarketWatch** | Top Stories | NEWS |
| **MarketWatch** | Market Pulse | MARKET_COMMENTARY |
| **MarketWatch** | Bulletins | NEWS |
| **Financial Times** | World | NEWS |
| **Financial Times** | Markets | MARKET_COMMENTARY |
| **Wall Street Journal** | Markets | MARKET_COMMENTARY |
| **Wall Street Journal** | World News | NEWS |
| **Wall Street Journal** | Opinion | MARKET_COMMENTARY |
| **Seeking Alpha** | Market News | NEWS |
| **Seeking Alpha** | Wall Street Breakfast | MARKET_COMMENTARY |
| **Zero Hedge** | Main Feed | NEWS |
| **Bloomberg** | Markets | NEWS |
| **Bloomberg** | Politics | NEWS |
| **Reuters** | Business | NEWS |
| **Reuters** | Markets | MARKET_COMMENTARY |

---

### Banks (5 Publishers, 8 Feeds)

| Publisher | Feed Name | Category |
|-----------|-----------|----------|
| **Goldman Sachs** | Insights | RESEARCH |
| **Goldman Sachs** | Exchanges Podcast | RESEARCH |
| **JP Morgan** | Insights | RESEARCH |
| **JP Morgan** | News Releases | NEWS |
| **JP Morgan** | At Any Rate Podcast | RESEARCH |
| **Morgan Stanley** | Press Releases | NEWS |
| **Morgan Stanley** | Thoughts on the Market Podcast | RESEARCH |
| **Deutsche Bank** | Research | RESEARCH |

---

### Asset Managers (6 Publishers, 7 Feeds)

| Publisher | Feed Name | Category |
|-----------|-----------|----------|
| **PIMCO** | Insights | RESEARCH |
| **BlackRock** | Investment Institute | RESEARCH |
| **T. Rowe Price** | News | NEWS |
| **Artisan Partners** | News | NEWS |
| **VanEck** | Insights | RESEARCH |

---

### Regulators (8 Publishers, 14 Feeds)

| Publisher | Feed Name | Category |
|-----------|-----------|----------|
| **Federal Reserve** | Press Releases | PRESS_RELEASE |
| **Federal Reserve** | Speeches | REGULATORY |
| **Federal Reserve** | Testimony | REGULATORY |
| **Federal Reserve** | Monetary Policy | REGULATORY |
| **Federal Reserve** | FEDS Notes | RESEARCH |
| **SEC** | Press Releases | PRESS_RELEASE |
| **SEC** | Speeches | REGULATORY |
| **SEC** | Litigation | REGULATORY |
| **CFTC** | Press Releases | PRESS_RELEASE |
| **CFTC** | Enforcement | REGULATORY |
| **FDIC** | News | REGULATORY |
| **OCC** | News | REGULATORY |
| **U.S. Treasury** | Securities Announced | REGULATORY |
| **European Central Bank** | Press Releases | REGULATORY |
| **Bank of England** | News | REGULATORY |

---

### Research (4 Publishers, 5 Feeds)

| Publisher | Feed Name | Category |
|-----------|-----------|----------|
| **Morningstar** | Articles | RESEARCH |
| **Morningstar** | News | NEWS |
| **S&P Global** | Market Intelligence | RESEARCH |
| **Advisor Perspectives** | Content | RESEARCH |
| **Advisor Perspectives** | Commentaries | MARKET_COMMENTARY |

---

## All Publishers

### News Outlets
| Publisher | Short Name | Website |
|-----------|------------|---------|
| CNBC | CNBC | https://www.cnbc.com |
| MarketWatch | MW | https://www.marketwatch.com |
| Financial Times | FT | https://www.ft.com |
| The Wall Street Journal | WSJ | https://www.wsj.com |
| Seeking Alpha | SA | https://seekingalpha.com |
| Zero Hedge | ZH | https://www.zerohedge.com |
| Bloomberg | BBG | https://www.bloomberg.com |
| Reuters | Reuters | https://www.reuters.com |

### Investment Banks
| Publisher | Short Name | Website |
|-----------|------------|---------|
| Goldman Sachs | GS | https://www.goldmansachs.com |
| JP Morgan | JPM | https://www.jpmorgan.com |
| Morgan Stanley | MS | https://www.morganstanley.com |
| Bank of America | BofA | https://www.bankofamerica.com |
| Deutsche Bank | DB | https://www.db.com |

### Asset Managers
| Publisher | Short Name | Website |
|-----------|------------|---------|
| PIMCO | PIMCO | https://www.pimco.com |
| Vanguard | Vanguard | https://www.vanguard.com |
| BlackRock | BLK | https://www.blackrock.com |
| Fidelity Investments | Fidelity | https://www.fidelity.com |
| Charles Schwab | Schwab | https://www.schwab.com |
| T. Rowe Price | T.Rowe | https://www.troweprice.com |
| Artisan Partners | Artisan | https://www.artisanpartners.com |
| VanEck | VanEck | https://www.vaneck.com |

### Regulators
| Publisher | Short Name | Website |
|-----------|------------|---------|
| Federal Reserve | Fed | https://www.federalreserve.gov |
| Securities and Exchange Commission | SEC | https://www.sec.gov |
| Commodity Futures Trading Commission | CFTC | https://www.cftc.gov |
| FDIC | FDIC | https://www.fdic.gov |
| Office of the Comptroller | OCC | https://www.occ.gov |
| U.S. Treasury | Treasury | https://www.treasury.gov |
| European Central Bank | ECB | https://www.ecb.europa.eu |
| Bank of England | BoE | https://www.bankofengland.co.uk |

### Research Providers
| Publisher | Short Name | Website |
|-----------|------------|---------|
| Morningstar | Morningstar | https://www.morningstar.com |
| S&P Global | S&P | https://www.spglobal.com |
| Moody's | Moody's | https://www.moodys.com |
| Advisor Perspectives | AP | https://www.advisorperspectives.com |

### Proprietary Trading Firms
| Publisher | Short Name | Website |
|-----------|------------|---------|
| Jane Street | JS | https://www.janestreet.com |
| Virtu Financial | Virtu | https://www.virtu.com |
| Citadel | Citadel | https://www.citadel.com |

---

## Project Structure

```
src/
├── app/
│   ├── api/feeds/        # RSS feed API route
│   ├── archive/[id]/     # Publisher archive pages
│   ├── article/[id]/     # Article detail pages
│   ├── category/[cat]/   # Category archive pages
│   ├── about/            # About page
│   ├── privacy/          # Privacy policy
│   └── terms/            # Terms of service
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Main header
│   ├── Sidebar.tsx       # Sidebar with market data
│   ├── FilterBar.tsx     # Category/time filters
│   ├── PublisherSection.tsx  # Publisher feed section
│   └── FeedList.tsx      # Main feed list
├── data/
│   ├── feeds.ts          # RSS feed configurations
│   └── publishers.ts     # Publisher configurations
├── hooks/
│   ├── useFeeds.ts       # Main feeds hook
│   └── use-search.ts     # Search hook
├── lib/
│   ├── feed-service.ts   # RSS fetching service
│   ├── search.ts         # Search utilities
│   └── utils.ts          # General utilities
└── types/
    └── index.ts          # TypeScript types
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Git Hooks

This project uses Husky and commitlint for enforcing conventional commits:

- **pre-commit**: Runs `npm run lint` before each commit
- **commit-msg**: Validates commit messages follow conventional format

### Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting changes |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |
| `build` | Build system changes |
| `revert` | Revert previous commit |

## Configuration

### Adding New RSS Feeds

1. Add the feed configuration to `src/data/feeds.ts`:

```typescript
{
  id: 'unique-feed-id',
  publisherId: 'publisher-id',
  name: 'Feed Display Name',
  url: 'https://example.com/feed.rss',
  feedCategory: 'NEWS',
  isActive: true,
}
```

2. If it's a new publisher, add it to `src/data/publishers.ts`:

```typescript
{
  id: 'publisher-id',
  name: 'Publisher Name',
  shortName: 'Short',
  category: 'NEWS',
  brandColor: '#HEXCODE',
  website: 'https://publisher.com',
}
```

### Feed Categories

| Category | Description |
|----------|-------------|
| `NEWS` | General news |
| `MARKET_COMMENTARY` | Market analysis and commentary |
| `RESEARCH` | Research reports |
| `REGULATORY` | Regulatory updates |
| `PRESS_RELEASE` | Press releases |

### Publisher Categories

| Category | Description |
|----------|-------------|
| `NEWS` | News outlets |
| `BANK` | Investment banks |
| `ASSET_MANAGER` | Asset management firms |
| `REGULATOR` | Government regulators |
| `RESEARCH` | Research providers |
| `PROP_TRADING` | Proprietary trading firms |
| `HEDGE_FUND` | Hedge funds |
| `RIA` | Registered Investment Advisors |

## Performance Optimizations

- **Concurrent Fetching**: Fetches up to 10 feeds in parallel
- **Priority Loading**: Major news sources (CNBC, Bloomberg, Reuters, WSJ) load first
- **Reduced Timeout**: 5-second timeout per feed for faster initial loads
- **Deduplication**: Removes duplicate articles by ID
- **Client Caching**: 5-minute localStorage cache with stale-while-revalidate

## Deploy on Vercel

The easiest way to deploy this app is on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/traders-rss)

## License

MIT

## Contributing

Contributions are welcome! Please ensure your commits follow the conventional commit format and all lint checks pass.
