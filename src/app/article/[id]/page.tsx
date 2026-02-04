"use client";

import { useEffect, useState, useMemo, useRef } from "react";
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

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

function ArticleSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading article content">
      <Skeleton className="h-8 w-3/4" aria-hidden="true" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-24" aria-hidden="true" />
        <Skeleton className="h-5 w-32" aria-hidden="true" />
        <Skeleton className="h-5 w-20" aria-hidden="true" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" aria-hidden="true" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" aria-hidden="true" />
        <Skeleton className="h-4 w-full" aria-hidden="true" />
        <Skeleton className="h-4 w-3/4" aria-hidden="true" />
      </div>
      <span className="sr-only">Loading article, please wait...</span>
    </div>
  );
}

function RelatedArticleCard({ item }: { item: FeedItem }) {
  const formattedDate = format(new Date(item.publishedAt), "MMM d, yyyy");
  const isoDate = new Date(item.publishedAt).toISOString();

  return (
    <article className="h-full">
      <Link
        href={`/article/${item.id}`}
        className="block group h-full"
        aria-label={`Read article: ${item.title}, published ${formattedDate}`}
      >
        <Card className="h-full transition-colors hover:bg-secondary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <CardContent className="p-4">
            <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {item.summary}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <time dateTime={isoDate}>
                {formattedDate}
              </time>
            </div>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.id as string;
  const mainContentRef = useRef<HTMLElement>(null);

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

  // Focus management: move focus to main content when article loads
  useEffect(() => {
    if (!isLoading && article && mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [isLoading, article]);

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
        <SkipLink />
        <header role="banner" className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav aria-label="Main navigation" className="container mx-auto flex h-16 items-center px-4">
            <Skeleton className="h-9 w-24" aria-hidden="true" />
          </nav>
        </header>
        <main id="main-content" role="main" className="container mx-auto px-4 py-8" aria-busy="true" aria-live="polite">
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
        <SkipLink />
        <header role="banner" className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav aria-label="Main navigation" className="container mx-auto flex h-16 items-center px-4">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Feed
              </Link>
            </Button>
          </nav>
        </header>
        <main id="main-content" role="main" className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center" role="alert">
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
      <SkipLink />
      {/* Header */}
      <header role="banner" className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav aria-label="Main navigation" className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Feed
            </Link>
          </Button>
          {publisher && (
            <a
              href={publisher.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              aria-label={`Visit ${publisher.name} website (opens in new tab)`}
            >
              Visit {publisher.shortName || publisher.name}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </nav>
      </header>

      <main
        id="main-content"
        role="main"
        ref={mainContentRef}
        tabIndex={-1}
        className="container mx-auto px-4 py-8 outline-none"
      >
        <article className="max-w-3xl mx-auto" aria-labelledby="article-title">
          {/* Publisher Badge */}
          {publisher && (
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: publisher.brandColor || "#333" }}
                aria-hidden="true"
              >
                {publisher.shortName?.slice(0, 2) ||
                  publisher.name.slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold">{publisher.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {categoryLabels[publisher.category]}
                </Badge>
              </div>
            </div>
          )}

          {/* Article Title - h1 for proper heading hierarchy */}
          <h1 id="article-title" className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6" role="group" aria-label="Article metadata">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={article.publishedAt.toISOString()}>
                {format(article.publishedAt, "MMMM d, yyyy 'at' h:mm a")}
              </time>
            </div>
            {article.author && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" aria-hidden="true" />
                <span>
                  <span className="sr-only">Author: </span>
                  {article.author}
                </span>
              </div>
            )}
            {publisher && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                <span>
                  <span className="sr-only">Publisher: </span>
                  {publisher.name}
                </span>
              </div>
            )}
          </div>

          {/* Categories */}
          {article.categories && article.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6" role="group" aria-label="Article categories">
              <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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

          <Separator className="my-6" aria-hidden="true" />

          {/* Thumbnail Image */}
          {article.thumbnailUrl && (
            <figure className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 bg-secondary">
              <Image
                src={article.thumbnailUrl}
                alt={`Featured image for article: ${article.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                priority
              />
            </figure>
          )}

          {/* Article Summary */}
          <section aria-labelledby="summary-heading">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle id="summary-heading" className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {article.summary}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Read Full Article Button */}
          <nav aria-label="Article actions" className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button asChild size="lg" className="flex-1 sm:flex-none">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
                aria-label={`Read full article: ${article.title} (opens in new tab)`}
              >
                Read Full Article
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Feed
              </Link>
            </Button>
          </nav>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <aside aria-labelledby="related-articles-heading">
              <Separator className="mb-8" aria-hidden="true" />
              <h2 id="related-articles-heading" className="text-xl font-semibold mb-6">
                More from {publisher?.name || "this publisher"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list" aria-label="Related articles">
                {relatedArticles.map((item) => (
                  <div key={item.id} role="listitem">
                    <RelatedArticleCard item={item} />
                  </div>
                ))}
              </div>
            </aside>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-border/40 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>TradersRSS - Financial news aggregated from trusted sources.</p>
            <nav aria-label="Footer navigation" className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                Home
              </Link>
              <a href="#" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded" aria-label="About TradersRSS">
                About
              </a>
              <a href="#" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded" aria-label="Privacy policy">
                Privacy
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
