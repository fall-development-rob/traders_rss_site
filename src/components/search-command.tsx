'use client';

import * as React from 'react';
import { ClockIcon, FileTextIcon, SearchIcon, XIcon } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import type { FeedItem, Publisher } from '@/types';
import { searchItems, highlightMatch, groupItemsByPublisher, getRecentSearches, saveRecentSearch, clearRecentSearches } from '@/lib/search';

interface SearchCommandProps {
  /** Feed items to search through */
  items: FeedItem[];
  /** Publisher data for displaying grouped results */
  publishers: Map<string, Publisher>;
  /** Whether the command palette is open */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Command palette search component (Cmd+K / Ctrl+K)
 * Features grouped results by publisher, recent searches, and text highlighting
 */
export function SearchCommand({
  items,
  publishers,
  open: controlledOpen,
  onOpenChange,
}: SearchCommandProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
      // Reset query when closing
      if (!newOpen) {
        setQuery('');
      }
    },
    [isControlled, onOpenChange]
  );

  // Load recent searches when opening
  React.useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
    }
  }, [open]);

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpenChange(!open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleOpenChange]);

  // Search results
  const searchResults = React.useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    return searchItems(items, query);
  }, [items, query]);

  // Group results by publisher
  const groupedResults = React.useMemo(() => {
    return groupItemsByPublisher(searchResults);
  }, [searchResults]);

  const handleSelectItem = React.useCallback(
    (item: FeedItem) => {
      // Save search to recent searches
      if (query.trim()) {
        saveRecentSearch(query.trim());
      }
      // Open article in new tab
      window.open(item.url, '_blank', 'noopener,noreferrer');
      handleOpenChange(false);
    },
    [query, handleOpenChange]
  );

  const handleSelectRecentSearch = React.useCallback((search: string) => {
    setQuery(search);
  }, []);

  const handleClearRecentSearches = React.useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const getPublisherName = React.useCallback(
    (publisherId: string): string => {
      const publisher = publishers.get(publisherId);
      return publisher?.name || publisher?.shortName || publisherId;
    },
    [publishers]
  );

  const formatDate = React.useCallback((date: Date): string => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }, []);

  const hasQuery = query.trim().length > 0;
  const hasResults = searchResults.length > 0;
  const hasRecentSearches = recentSearches.length > 0 && !hasQuery;

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Search Articles"
      description="Search across all feed items"
      showCloseButton={false}
    >
      <CommandInput
        placeholder="Search articles..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {hasQuery && !hasResults && (
          <CommandEmpty>
            No articles found for &ldquo;{query}&rdquo;
          </CommandEmpty>
        )}

        {/* Recent Searches */}
        {hasRecentSearches && (
          <>
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search) => (
                <CommandItem
                  key={search}
                  value={`recent-${search}`}
                  onSelect={() => handleSelectRecentSearch(search)}
                  className="flex items-center gap-2"
                >
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{search}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <div className="px-2 py-1.5">
              <Button
                variant="ghost"
                size="xs"
                onClick={handleClearRecentSearches}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <XIcon className="mr-2 h-3 w-3" />
                Clear recent searches
              </Button>
            </div>
            <CommandSeparator />
          </>
        )}

        {/* Search Results grouped by Publisher */}
        {hasQuery &&
          Array.from(groupedResults.entries()).map(([publisherId, pubItems]) => (
            <CommandGroup
              key={publisherId}
              heading={getPublisherName(publisherId)}
            >
              {pubItems.slice(0, 5).map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.id}-${item.title}`}
                  onSelect={() => handleSelectItem(item)}
                  className="flex flex-col items-start gap-1 py-3"
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <FileTextIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2 text-sm font-medium">
                        {highlightMatch(item.title, query)}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  {item.summary && (
                    <p className="ml-6 line-clamp-1 text-xs text-muted-foreground">
                      {highlightMatch(
                        item.summary.length > 150
                          ? item.summary.slice(0, 150) + '...'
                          : item.summary,
                        query
                      )}
                    </p>
                  )}
                </CommandItem>
              ))}
              {pubItems.length > 5 && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  +{pubItems.length - 5} more results
                </div>
              )}
            </CommandGroup>
          ))}

        {/* Empty state when no query */}
        {!hasQuery && !hasRecentSearches && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <SearchIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>Start typing to search articles</p>
            <p className="mt-1 text-xs">
              Search in titles and summaries across all publishers
            </p>
          </div>
        )}
      </CommandList>

      {/* Footer with keyboard hints */}
      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>
            <span>to open</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>
            <span>to close</span>
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            {typeof navigator !== 'undefined' &&
            navigator.platform?.toLowerCase().includes('mac')
              ? '\u2318'
              : 'Ctrl'}
          </kbd>
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            K
          </kbd>
          <span>to toggle</span>
        </span>
      </div>
    </CommandDialog>
  );
}

/**
 * Hook for using the SearchCommand with keyboard shortcut
 */
export function useSearchCommand() {
  const [open, setOpen] = React.useState(false);

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const openSearch = React.useCallback(() => {
    setOpen(true);
  }, []);

  const closeSearch = React.useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    setOpen,
    toggle,
    openSearch,
    closeSearch,
  };
}
