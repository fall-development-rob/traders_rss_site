"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User,
  Building2,
  Tag,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublisherById } from "@/data/publishers";
import { categoryLabels } from "@/hooks/useFeeds";
import type { FeedItem, Publisher } from "@/types";

interface ApiFeedItem {
  id: string;
  feedSourceId: string;
  publisherId: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  author?: string;
  thumbnailUrl?: string;
  categories?: string[];
}

function ArticleSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function RelatedArticleCard({ item }: { item: FeedItem }) {
  return (
    <Link href={`/article/${item.id}`} className="block group">
      <Card className="h-full transition-colors hover:bg-secondary/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h4>
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
            {item.summary}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {format(new Date(item.publishedAt), "MMM d, yyyy")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<FeedItem | null>(null);
  const [allItems, setAllItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/feeds");
        if (!response.ok) {
          throw new Error(`Failed to fetch feeds: ${response.status}`);
        }

        const data: ApiFeedItem[] = await response.json();

        // Convert publishedAt strings to Date objects
        const itemsWithDates: FeedItem[] = data.map((item) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
        }));

        setAllItems(itemsWithDates);

        // Find the specific article by ID
        const foundArticle = itemsWithDates.find(
          (item) => item.id === articleId
        );

        if (!foundArticle) {
          setError("Article not found");
        } else {
          setArticle(foundArticle);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching article:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const publisher: Publisher | undefined = useMemo(() => {
    if (!article) return undefined;
    return getPublisherById(article.publisherId);
  }, [article]);

  const relatedArticles = useMemo(() => {
    if (!article || !publisher) return [];
    return allItems
      .filter(
        (item) =>
          item.publisherId === article.publisherId && item.id !== article.id
      )
      .slice(0, 4);
  }, [article, publisher, allItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Skeleton className="h-9 w-24" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <ArticleSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
              </Link>
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The article you're looking for doesn't exist or has been removed."}
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Link>
          </Button>
          {publisher && (
            <a
              href={publisher.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Visit {publisher.shortName || publisher.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          {/* Publisher Badge */}
          {publisher && (
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: publisher.brandColor || "#333" }}
              >
                {publisher.shortName?.slice(0, 2) ||
                  publisher.name.slice(0, 2)}
              </div>
              <div>
                <h2 className="font-semibold">{publisher.name}</h2>
                <Badge variant="secondary" className="text-xs">
                  {categoryLabels[publisher.category]}
                </Badge>
              </div>
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishedAt.toISOString()}>
                {format(article.publishedAt, "MMMM d, yyyy 'at' h:mm a")}
              </time>
            </div>
            {article.author && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            )}
            {publisher && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span>{publisher.name}</span>
              </div>
            )}
          </div>

          {/* Categories */}
          {article.categories && article.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {article.categories.map((category, index) => {
                const categoryText = typeof category === 'string'
                  ? category
                  : (category as { _?: string })?._  || String(category);
                return (
                  <Badge key={`${categoryText}-${index}`} variant="outline" className="text-xs">
                    {categoryText}
                  </Badge>
                );
              })}
            </div>
          )}

          <Separator className="my-6" />

          {/* Thumbnail Image */}
          {article.thumbnailUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 bg-secondary">
              <Image
                src={article.thumbnailUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                priority
              />
            </div>
          )}

          {/* Article Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {article.summary}
              </p>
            </CardContent>
          </Card>

          {/* Read Full Article Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button asChild size="lg" className="flex-1 sm:flex-none">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Read Full Article
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Feed
              </Link>
            </Button>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <Separator className="mb-8" />
              <h3 className="text-xl font-semibold mb-6">
                More from {publisher?.name || "this publisher"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((item) => (
                  <RelatedArticleCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>TradersRSS - Financial news aggregated from trusted sources.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <a href="#" className="hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
