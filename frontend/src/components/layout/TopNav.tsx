"use client";

import Link from "next/link";
import { Search, Scale, LogIn } from "lucide-react";
import { useState } from "react";

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-foreground)] hover:opacity-80 transition-opacity shrink-0"
          >
            <Scale className="h-5 w-5 text-stone-500" />
            <span className="font-semibold text-sm tracking-tight">
              Commitment Tracker
            </span>
          </Link>

          {/* Search - desktop */}
          <div className="hidden sm:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search people or statements..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-stone-50 py-1.5 pl-9 pr-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300 focus:border-stone-300"
              />
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden p-2 text-stone-500 hover:text-stone-700 rounded-md"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/methodology"
              className="px-3 py-1.5 text-sm text-stone-500 hover:text-stone-800 rounded-md hover:bg-stone-100 transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/admin/review"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-500 hover:text-stone-800 rounded-md hover:bg-stone-100 transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          </nav>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="sm:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search people or statements..."
                autoFocus
                className="w-full rounded-lg border border-[var(--color-border)] bg-stone-50 py-2 pl-9 pr-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
