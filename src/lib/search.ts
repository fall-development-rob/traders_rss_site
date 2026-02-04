import * as React from 'react';
import type { FeedItem } from '@/types';

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculates a relevance score for a feed item based on the search query
 * Higher score = more relevant (title matches are weighted higher)
 */
function calculateRelevance(item: FeedItem, query: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerTitle = item.title.toLowerCase();
  const lowerSummary = item.summary.toLowerCase();

  let score = 0;

  // Exact title match (highest priority)
  if (lowerTitle === lowerQuery) {
    score += 100;
  }
  // Title starts with query
  else if (lowerTitle.startsWith(lowerQuery)) {
    score += 50;
  }
  // Title contains query as a word
  else if (new RegExp(`\\b${escapeRegex(lowerQuery)}\\b`).test(lowerTitle)) {
    score += 30;
  }
  // Title contains query
  else if (lowerTitle.includes(lowerQuery)) {
    score += 20;
  }

  // Summary contains query as a word
  if (new RegExp(`\\b${escapeRegex(lowerQuery)}\\b`).test(lowerSummary)) {
    score += 10;
  }
  // Summary contains query
  else if (lowerSummary.includes(lowerQuery)) {
    score += 5;
  }

  // Boost more recent items slightly
  const ageInDays = (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays < 1) {
    score += 3;
  } else if (ageInDays < 7) {
    score += 1;
  }

  return score;
}

/**
 * Searches feed items by query
 * Searches in title and summary fields
 * Returns results sorted by relevance (title matches first)
 */
export function searchItems(items: FeedItem[], query: string): FeedItem[] {
  if (!query || query.trim().length === 0) {
    return items;
  }

  const normalizedQuery = query.trim().toLowerCase();

  // Filter items that match the query
  const matchingItems = items.filter((item) => {
    const title = item.title.toLowerCase();
    const summary = item.summary.toLowerCase();
    return title.includes(normalizedQuery) || summary.includes(normalizedQuery);
  });

  // Sort by relevance score (descending)
  return matchingItems.sort((a, b) => {
    const scoreA = calculateRelevance(a, normalizedQuery);
    const scoreB = calculateRelevance(b, normalizedQuery);
    return scoreB - scoreA;
  });
}

/**
 * Highlights matching text in a string by wrapping matches in <mark> tags
 * Returns React elements with highlighted text
 */
export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || query.trim().length === 0) {
    return text;
  }

  const normalizedQuery = query.trim();
  const escapedQuery = escapeRegex(normalizedQuery);
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) {
    return text;
  }

  return React.createElement(
    React.Fragment,
    null,
    ...parts.map((part, index) => {
      if (part.toLowerCase() === normalizedQuery.toLowerCase()) {
        return React.createElement(
          'mark',
          {
            key: index,
            className: 'bg-yellow-200 dark:bg-yellow-900/50 text-inherit rounded-sm px-0.5',
          },
          part
        );
      }
      return part;
    })
  );
}

/**
 * Groups feed items by publisher ID
 */
export function groupItemsByPublisher(
  items: FeedItem[]
): Map<string, FeedItem[]> {
  const grouped = new Map<string, FeedItem[]>();

  for (const item of items) {
    const existing = grouped.get(item.publisherId) || [];
    existing.push(item);
    grouped.set(item.publisherId, existing);
  }

  return grouped;
}

/**
 * Storage key for recent searches
 */
const RECENT_SEARCHES_KEY = 'rss-recent-searches';
const MAX_RECENT_SEARCHES = 5;

/**
 * Gets recent searches from localStorage
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves a search query to recent searches
 */
export function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) {
    return;
  }

  try {
    const recent = getRecentSearches();
    const normalizedQuery = query.trim();

    // Remove duplicate if exists
    const filtered = recent.filter(
      (q) => q.toLowerCase() !== normalizedQuery.toLowerCase()
    );

    // Add to beginning
    filtered.unshift(normalizedQuery);

    // Keep only max items
    const trimmed = filtered.slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(trimmed));
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Clears all recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Silently fail if localStorage is not available
  }
}
