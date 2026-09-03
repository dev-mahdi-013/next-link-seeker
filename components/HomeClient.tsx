'use client';

import Link from 'next/link';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { useInfiniteSearch } from '@/hooks/useInfiniteSearch';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useStatistics } from '@/hooks/useSearch';
import SearchBar from '@/components/SearchBar';
import ResultsTable from '@/components/ResultsTable';
import { Search, BarChart3, Users } from 'lucide-react';
import type { PaginatedResult } from '@/lib/api';
import ServerResults from '@/components/ServerResults';

export default function HomeClient({ initialData }: { initialData: PaginatedResult | null }) {
  const isMobile = useIsMobile();

  // Desktop: paginated (SSR/SEO-friendly page param)
  const paginated = useDebouncedSearch({ page: 1, limit: 10 }, !isMobile);
  // Mobile: infinite scroll (seeded with the SSR first page to avoid a
  // placeholder collapse that makes the page jump on first paint)
  const infinite = useInfiniteSearch({ page: 1, limit: 10 }, isMobile, initialData);

  const { data: statsData } = useStatistics();

  const handleSearch = (params: {
    keyword?: string;
    skill?: string;
    company?: string;
    location?: string;
    page?: number;
  }) => {
    paginated.search(params);
    infinite.search(params);
  };

  const activeSearch = isMobile ? infinite : paginated;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/25">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  LinkedIn Search
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  جستجوی پیشرفته کاربران لینکدین
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {statsData && (
                <div className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400 sm:flex">
                  <Users className="h-3.5 w-3.5" />
                  <span className="font-medium">{statsData.totalUsers.toLocaleString()}</span>
                  <span>کاربر</span>
                </div>
              )}

              <div className="flex gap-0.5 rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800">
                <span className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm dark:bg-slate-700 dark:text-brand-300">
                  <Search className="h-3.5 w-3.5" />
                  جستجو
                </span>
                <Link
                  href="/stats"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  آمار
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} isLoading={activeSearch.isLoading} />
        </div>

          <div className="space-y-4">
            {activeSearch.isLoading && !initialData ? (
              <div className="card p-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  در حال جستجو...
                </p>
              </div>
            ) : isMobile ? (
              <>
                <div className="overflow-anchor-none">
                  <ResultsTable
                    data={infinite.users}
                    meta={{ totalItems: infinite.totalItems }}
                  />
                </div>
                {/* Infinite scroll sentinel + loader (fixed slot so it never
                    shifts the sentinel or the page while loading) */}
                <div ref={infinite.sentinelRef} className="h-1" />
                <div className="flex h-16 items-center justify-center">
                  {infinite.isFetchingNextPage && (
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400" />
                  )}
                </div>
              </>
            ) : (
              <ResultsTable
                data={paginated.data?.data ?? initialData?.data ?? []}
                meta={paginated.data?.meta ?? initialData?.meta}
                onPageChange={(page) => {
                  paginated.setPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
      </main>
    </div>
  );
}
