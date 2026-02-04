"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedItemSkeleton() {
  return (
    <div className="py-3 px-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <div className="flex items-center gap-3 mt-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublisherSectionSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Publisher Header Skeleton */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Feed Items Skeleton */}
      <div className="divide-y divide-border/50">
        <FeedItemSkeleton />
        <FeedItemSkeleton />
        <FeedItemSkeleton />
      </div>
    </Card>
  );
}

export function FeedLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <PublisherSectionSkeleton />
      <PublisherSectionSkeleton />
      <PublisherSectionSkeleton />
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Market Overview Skeleton */}
      <Card>
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Trending Topics Skeleton */}
      <Card>
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </Card>

      {/* Publisher Stats Skeleton */}
      <Card>
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-40" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
