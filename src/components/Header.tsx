"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Search, Menu, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useId } from "react";
import Link from "next/link";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export function Header({ onSearch, searchValue = "" }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputId = useId();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80"
              aria-label="Mobile navigation menu"
            >
              <nav
                id="mobile-navigation"
                className="flex flex-col gap-4 mt-8"
                role="navigation"
                aria-label="Mobile navigation"
              >
                <Link href="/category/NEWS" className="text-lg font-medium hover:text-primary transition-colors">
                  Markets
                </Link>
                <Link href="/category/RESEARCH" className="text-lg font-medium hover:text-primary transition-colors">
                  Research
                </Link>
                <Link href="/category/REGULATOR" className="text-lg font-medium hover:text-primary transition-colors">
                  Regulatory
                </Link>
                <Link href="/category/ASSET_MANAGER" className="text-lg font-medium hover:text-primary transition-colors">
                  Commentary
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
              Traders<span className="text-accent-gold">RSS</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-6"
          role="navigation"
          aria-label="Main navigation"
        >
          <Link
            href="/category/NEWS"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Markets
          </Link>
          <Link
            href="/category/RESEARCH"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Research
          </Link>
          <Link
            href="/category/REGULATOR"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Regulatory
          </Link>
          <Link
            href="/category/ASSET_MANAGER"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Commentary
          </Link>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative"
            role="search"
            aria-label="Search feeds"
          >
            <label htmlFor={searchInputId} className="sr-only">
              Search feeds
            </label>
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id={searchInputId}
              type="search"
              placeholder="Search feeds..."
              className="w-64 pl-9 bg-secondary/50"
              value={localSearch}
              onChange={handleSearchChange}
              aria-label="Search feeds"
            />
          </form>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
            aria-label="Toggle theme"
            suppressHydrationWarning
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
