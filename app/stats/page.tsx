import type { Metadata } from 'next';
import Link from 'next/link';
import StatsSection from '@/components/StatsSection';
import { getStatistics } from '@/lib/server-api';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'آمار | LinkedIn Search',
  description: 'داشبورد تحلیلی آمار کاربران لینکدین: صنایع، کشورها، شرکت‌های برتر و بازه‌های حقوقی',
};

export default async function StatsPage() {
  const stats = await getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/25">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  LinkedIn Search
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  جستجوی پیشرفته کاربران لینکدین
                </p>
              </div>
            </Link>

            {/* Tab switcher linking between pages */}
            <div className="flex gap-0.5 rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                جستجو
              </Link>
              <span className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm dark:bg-slate-700 dark:text-brand-300">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                آمار
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {stats ? (
          <StatsSection
            stats={stats}
            isLoading={false}
          />
        ) : (
          <div className="card p-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              آمار در دسترس نیست. لطفاً بعداً تلاش کنید.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
