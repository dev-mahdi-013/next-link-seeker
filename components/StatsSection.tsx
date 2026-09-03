'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, Building2, MapPin, TrendingUp, User, CircleHelp } from 'lucide-react';
import type { Statistics } from '@/lib/api';

const COLORS = ['#1580e8', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#84cc16'];

const FONT_FAMILY = "'Vazirmatn', sans-serif";

const tooltipStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: FONT_FAMILY,
  fontSize: '12px',
  direction: 'rtl',
  background: '#ffffff',
  color: '#0f172a',
};

const tooltipLabelStyle: React.CSSProperties = {
  color: '#0f172a',
  fontWeight: 600,
  marginBottom: '4px',
};

const tooltipItemStyle: React.CSSProperties = {
  color: '#334155',
};

const GENDER_META: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  male: { label: 'مرد', color: '#1580e8', icon: User },
  female: { label: 'زن', color: '#ec4899', icon: User },
  unknown: { label: 'نامشخص', color: '#94a3b8', icon: CircleHelp },
};

function genderMeta(gender: string) {
  return (
    GENDER_META[gender.trim().toLowerCase()] ?? {
      label: gender,
      color: '#6366f1',
      icon: User,
    }
  );
}

interface StatsSectionProps {
  stats: Statistics;
  isLoading: boolean;
}

function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

const CHART_LABELS: Record<string, string> = {
  industry: 'صنعت',
  country: 'کشور',
  company: 'شرکت',
  count: 'تعداد',
  range: 'بازه حقوقی',
  gender: 'جنسیت',
};

function translateLabel(label: string): string {
  return CHART_LABELS[label] ?? label;
}

export default function StatsSection({ stats, isLoading }: StatsSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-40 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-4 text-center">
          <Users className="mx-auto h-6 w-6 text-brand-500" />
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(stats.totalUsers)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">کل کاربران</p>
        </div>
        <div className="card p-4 text-center">
          <Building2 className="mx-auto h-6 w-6 text-indigo-500" />
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(stats.industries.length)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">صنعت مختلف</p>
        </div>
        <div className="card p-4 text-center">
          <MapPin className="mx-auto h-6 w-6 text-emerald-500" />
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(stats.countries.length)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">کشور مختلف</p>
        </div>
        <div className="card p-4 text-center">
          <TrendingUp className="mx-auto h-6 w-6 text-amber-500" />
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(stats.topCompanies.length)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">شرکت برتر</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Industries */}
        <div className="card p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            توزیع صنایع
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.industries.slice(0, 8)}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="count"
                label={false}
                labelLine={false}
              >
                {stats.industries.slice(0, 8).map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {stats.industries.slice(0, 8).map((ind, i) => {
              const total = stats.industries
                .slice(0, 8)
                .reduce((sum, x) => sum + x.count, 0);
              const percent = total > 0 ? ((ind.count / total) * 100).toFixed(0) : 0;
              return (
                <div key={ind.industry} className="flex items-center gap-2 text-xs">
                  <span
                    className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <span
                    className="truncate-rtl flex-1 text-slate-600 dark:text-slate-400"
                    title={ind.industry}
                  >
                    {ind.industry}
                  </span>
                  <span className="flex-shrink-0 font-medium text-slate-500 dark:text-slate-500">
                    {percent}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Countries */}
        <div className="card p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            توزیع کشورها
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.countries.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="country"
                width={0}
                hide
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                formatter={(value: number) => formatNumber(value)}
              />
              <Bar dataKey="count" fill="#1580e8" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {stats.countries.slice(0, 8).map((c, i) => (
              <div key={c.country} className="flex items-center gap-2 text-xs">
                <span
                  className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ background: '#1580e8', opacity: 1 - i * 0.1 }}
                />
                <span
                  className="truncate-rtl flex-1 text-slate-600 dark:text-slate-400"
                  title={c.country}
                >
                  {c.country}
                </span>
                <span className="flex-shrink-0 font-medium text-slate-500 dark:text-slate-500">
                  {formatNumber(c.count)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="card p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            شرکت‌های برتر
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.topCompanies.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis dataKey="company" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                formatter={(value: number) => formatNumber(value)}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {stats.topCompanies.slice(0, 8).map((c, i) => (
              <div key={c.company} className="flex items-center gap-2 text-xs">
                <span
                  className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="truncate-rtl flex-1 text-slate-600 dark:text-slate-400" title={c.company}>
                  {c.company}
                </span>
                <span className="flex-shrink-0 font-medium text-slate-500 dark:text-slate-500">
                  {formatNumber(c.count)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Ranges */}
        <div className="card p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            بازه‌های حقوقی
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.salaryRanges.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 10, fontFamily: FONT_FAMILY }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                formatter={(value: number) => formatNumber(value)}
              />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gender Distribution */}
      {stats.genderDistribution.length > 0 && (() => {
        const total = stats.genderDistribution.reduce((sum, g) => sum + g.count, 0);
        return (
          <div className="card card-hover overflow-hidden p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                <Users className="h-4 w-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                توزیع جنسیتی
              </h3>
            </div>

            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[auto_1fr]">
              {/* Donut */}
              <div className="relative mx-auto h-40 w-40 sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.genderDistribution}
                      dataKey="count"
                      innerRadius={56}
                      outerRadius={78}
                      paddingAngle={total > 1 ? 3 : 0}
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {stats.genderDistribution.map((g, index) => (
                        <Cell
                          key={`gender-cell-${index}`}
                          fill={genderMeta(g.gender).color}
                          className="outline-none"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatNumber(total)}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    کاربر
                  </span>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {stats.genderDistribution.map((g, i) => {
                  const meta = genderMeta(g.gender);
                  const percent = total > 0 ? (g.count / total) * 100 : 0;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={`${g.gender}-${i}`}
                      className="group flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/60 transition hover:bg-white hover:shadow-sm hover:ring-slate-300 dark:bg-slate-800/40 dark:ring-slate-700/60 dark:hover:bg-slate-800/70 dark:hover:ring-slate-600"
                    >
                      <span
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: `${meta.color}1f`,
                          color: meta.color,
                        }}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate-rtl text-sm font-medium text-slate-700 dark:text-slate-200">
                            {meta.label}
                          </span>
                          <span className="flex-shrink-0 text-sm font-bold text-slate-900 dark:text-slate-100">
                            {percent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(percent, 100)}%`,
                              background: `linear-gradient(90deg, ${meta.color}, ${meta.color}b3)`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="flex-shrink-0 self-end text-xs tabular-nums text-slate-500 dark:text-slate-400">
                        {formatNumber(g.count)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
