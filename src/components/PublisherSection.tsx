"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Clock, User } from "lucide-react";
import type { FeedItem, Publisher } from "@/types";
import { categoryLabels } from "@/hooks/useFeeds";

interface PublisherSectionProps {
  publisher: Publisher;
  items: FeedItem[];
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
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="py-3 px-4 -mx-4 rounded-md transition-colors hover:bg-secondary/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {item.summary}
            </p>
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
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
        </div>
      </div>
    </a>
  );
}

export function PublisherSection({ publisher, items }: PublisherSectionProps) {
  if (items.length === 0) {
    return null;
  }

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
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-white"
              style={{ backgroundColor: publisher.brandColor || "#333" }}
            >
              {publisher.shortName?.slice(0, 2) || publisher.name.slice(0, 2)}
            </div>
            <div>
              <h2 className="font-semibold text-sm">{publisher.name}</h2>
              <Badge variant="secondary" className="text-[10px] h-5 mt-0.5">
                {categoryLabels[publisher.category]}
              </Badge>
            </div>
          </div>
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

      {/* Feed Items */}
      <div className="px-4 divide-y divide-border/50">
        {items.map((item, index) => (
          <FeedItemCard key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
}
