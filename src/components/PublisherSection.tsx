"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Clock, User, ChevronRight } from "lucide-react";
import type { FeedItem, Publisher } from "@/types";
import { categoryLabels } from "@/hooks/useFeeds";

interface PublisherSectionProps {
  publisher: Publisher;
  items: FeedItem[];
  itemLimit?: number;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function FeedItemCard({ item }: { item: FeedItem }) {
  return (
    <div className="group py-3 px-4 -mx-4 rounded-md transition-colors hover:bg-secondary/50 cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/article/${item.id}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {item.summary}
            </p>
          </Link>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(item.publishedAt)}
            </span>
            {item.author && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.author}
              </span>
            )}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-primary transition-colors ml-auto"
            >
              <span className="hidden sm:inline">Read more</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_ITEM_LIMIT = 5;

export function PublisherSection({ publisher, items, itemLimit = DEFAULT_ITEM_LIMIT }: PublisherSectionProps) {
  if (items.length === 0) {
    return null;
  }

  const displayedItems = items.slice(0, itemLimit);
  const hasMoreItems = items.length > itemLimit;
  const remainingCount = items.length - itemLimit;

  return (
    <Card className="overflow-hidden">
      {/* Publisher Header */}
      <div
        className="px-4 py-3 border-b border-border/50"
        style={{
          borderLeftWidth: "4px",
          borderLeftColor: publisher.brandColor || "var(--primary)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/archive/${publisher.id}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: publisher.brandColor || "#333" }}
              title={`View all articles from ${publisher.name}`}
            >
              {publisher.shortName?.slice(0, 2) || publisher.name.slice(0, 2)}
            </Link>
            <div>
              <Link
                href={`/archive/${publisher.id}`}
                className="hover:text-primary transition-colors"
              >
                <h2 className="font-semibold text-sm">{publisher.name}</h2>
              </Link>
              <Badge variant="secondary" className="text-[10px] h-5 mt-0.5">
                {categoryLabels[publisher.category]}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/archive/${publisher.id}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Archive
            </Link>
            <a
              href={publisher.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Visit site
            </a>
          </div>
        </div>
      </div>

      {/* Feed Items */}
      <div className="px-4 divide-y divide-border/50">
        {displayedItems.map((item) => (
          <FeedItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* View All Link */}
      {hasMoreItems && (
        <div className="px-4 py-3 border-t border-border/50 bg-secondary/30">
          <Link
            href={`/archive/${publisher.id}`}
            className="flex items-center justify-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View all from {publisher.name}
            <span className="text-muted-foreground font-normal">
              (+{remainingCount} more)
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </Card>
  );
}
