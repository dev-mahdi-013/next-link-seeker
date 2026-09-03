import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'LinkedIn Search | جستجوی کاربران لینکدین',
  description:
    'سیستم جستجوی پیشرفته کاربران لینکدین با فیلتر شرکت، موقعیت جغرافیایی و مهارت‌ها به همراه داشبورد تحلیلی',
  keywords: ['لینکدین', 'جستجو', 'کاربران', 'LinkedIn', 'search', 'users', 'فیلتر'],
  openGraph: {
    title: 'LinkedIn Search | جستجوی کاربران لینکدین',
    description: 'جستجوی پیشرفته کاربران لینکدین با فیلترهای چندگانه و داشبورد آماری',
    type: 'website',
    locale: 'fa_IR',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
