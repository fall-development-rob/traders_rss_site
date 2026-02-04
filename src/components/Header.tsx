"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Search, Menu, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export function Header({ onSearch, searchValue = "" }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [localSearch, setLocalSearch] = useState(searchValue);

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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <nav className="flex flex-col gap-4 mt-8">
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
        <nav className="hidden lg:flex items-center gap-6">
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
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search feeds..."
              className="w-64 pl-9 bg-secondary/50"
              value={localSearch}
              onChange={handleSearchChange}
            />
          </form>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
