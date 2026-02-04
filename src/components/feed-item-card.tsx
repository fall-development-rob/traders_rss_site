"use client";

import * as React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FeedItem } from "@/types";

interface FeedItemCardProps {
  item: FeedItem;
  className?: string;
}

export function FeedItemCard({ item, className }: FeedItemCardProps) {
  const relativeTime = React.useMemo(() => {
    return formatDistanceToNow(new Date(item.publishedAt), {
      addSuffix: true,
    });
  }, [item.publishedAt]);

  return (
    <article
      className={cn(
        "group relative py-3 px-4 transition-colors hover:bg-muted/50 dark:hover:bg-slate-800/50 cursor-pointer",
        "border-b border-border/50 last:border-b-0",
        className
      )}
    >
      {/* Clickable card area for article detail */}
      <Link
        href={`/article/${item.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      >
        {/* Title */}
        <h3 className="text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Summary */}
        {item.summary && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
        )}
      </Link>

      {/* Meta row */}
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <time dateTime={new Date(item.publishedAt).toISOString()}>
          {relativeTime}
        </time>
        {item.author && (
          <>
            <span className="text-border">|</span>
            <span className="truncate max-w-[150px]">{item.author}</span>
          </>
        )}
        {/* External link to original article */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 hover:text-primary transition-colors ml-auto"
          aria-label="Read original article"
        >
          <span className="hidden sm:inline">Read more</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}
