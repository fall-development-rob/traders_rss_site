import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output configuration for Netlify
  // Using default output mode which works best with @netlify/plugin-nextjs

  // Image optimization configuration for external RSS feed images
  images: {
    remotePatterns: [
      // Major news outlets
      { protocol: "https", hostname: "media.cnbc.com" },
      { protocol: "https", hostname: "www.reuters.com" },
      { protocol: "https", hostname: "static.reuters.com" },
      { protocol: "https", hostname: "s.wsj.net" },
      { protocol: "https", hostname: "images.wsj.net" },
      { protocol: "https", hostname: "www.ft.com" },
      { protocol: "https", hostname: "d1e00ek4ebabms.cloudfront.net" }, // FT CDN
      { protocol: "https", hostname: "static.seekingalpha.com" },
      { protocol: "https", hostname: "images.barrons.com" },
      { protocol: "https", hostname: "mw3.wsj.net" }, // MarketWatch
      { protocol: "https", hostname: "www.marketwatch.com" },
      { protocol: "https", hostname: "i.insider.com" }, // Business Insider
      { protocol: "https", hostname: "s.yimg.com" }, // Yahoo Finance
      { protocol: "https", hostname: "media.zenfs.com" }, // Yahoo CDN
      { protocol: "https", hostname: "cdn.benzinga.com" },
      { protocol: "https", hostname: "www.investopedia.com" },
      { protocol: "https", hostname: "g.foolcdn.com" }, // Motley Fool
      { protocol: "https", hostname: "images.mktw.net" }, // MarketWatch CDN
      { protocol: "https", hostname: "cloudfront-us-east-2.images.arcpublishing.com" },
      { protocol: "https", hostname: "a57.foxnews.com" }, // Fox Business
      { protocol: "https", hostname: "image.cnbcfm.com" }, // CNBC CDN
      // Generic patterns for common CDNs
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.akamaized.net" },
      { protocol: "https", hostname: "**.imgix.net" },
    ],
    // Optimize image loading
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 1 hour on Netlify Edge
    minimumCacheTTL: 3600,
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache API responses with stale-while-revalidate pattern
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },

  // Redirects (add any needed redirects here)
  async redirects() {
    return [
      // Example: Redirect old feed paths if needed
      // {
      //   source: "/rss",
      //   destination: "/api/feed",
      //   permanent: true,
      // },
    ];
  },

  // Rewrites for cleaner URLs if needed
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize for production builds
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Experimental features for better Netlify compatibility
  experimental: {
    // Enable server actions for form handling
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Environment variables that should be available on the client
  // (only non-sensitive values)
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
  },
};

export default nextConfig;
