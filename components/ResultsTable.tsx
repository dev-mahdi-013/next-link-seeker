'use client';

import { Mail, Phone, Link as LinkIcon, ChevronLeft, ChevronRight, Briefcase, Building2, MapPin } from 'lucide-react';
import type { User as UserType } from '@/lib/api';
import LocationOnlyExperience from './LocationOnlyExperience';
import CompactSkills from './CompactSkills';
import CompactSummary from './CompactSummary';
import CompactCompanies from './CompactCompanies';
import CompactEducation from './CompactEducation';

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface ResultsTableProps {
  data: UserType[];
  meta?: Partial<PaginationMeta>;
  onPageChange?: (page: number) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-lime-500 to-green-600',
  'from-fuchsia-500 to-purple-600',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function truncate(text: string | null | undefined, max: number): string {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '...' : text;
}

export default function ResultsTable({ data, meta, onPageChange }: ResultsTableProps) {
  if (data.length === 0) {
    return (
      <div className="card p-16 text-center animate-fade-in" style={{ minHeight: 200 }}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <Briefcase className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-700 dark:text-slate-300">
          نتیجه‌ای یافت نشد
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          لطفاً عبارت جستجو یا فیلترها را تغییر دهید.
        </p>
      </div>
    );
  }

  return (
    <div
      key={`${meta?.page ?? 1}-${data[0]?.id ?? 'empty'}`}
      className="space-y-4 animate-fade-in"
    >
      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          نمایش <span className="font-semibold text-slate-700 dark:text-slate-300">{data.length}</span> از{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{meta?.totalItems ?? 0}</span> کاربر
        </p>
      </div>

      {/* Card-based results */}
      <div className="grid grid-cols-1 gap-3">
        {data.map((user) => (
          <div
            key={user.id}
            className="group card card-hover p-4 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarColor(user.full_name || '')} text-white text-sm font-bold shadow-sm`}
              >
                {getInitials(user.full_name || '?')}
              </div>

              {/* Main info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {/* Name */}
                    <h3 className="truncate-rtl text-base font-semibold text-slate-900 dark:text-slate-100">
                      {user.full_name || 'نام نامشخص'}
                    </h3>

                    {/* Job title */}
                    {user.job_title && user.job_title.trim() !== '' && (
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {(() => {
                          try {
                            const fixed = user.job_title
                              .replace(/True/g, 'true')
                              .replace(/False/g, 'false')
                              .replace(/None/g, 'null')
                              .replace(/'/g, '"');
                            const parsed = JSON.parse(fixed);
                            if (Array.isArray(parsed)) {
                              return parsed
                                .filter((t): t is string => typeof t === 'string' && t.trim() !== '')
                                .slice(0, 3)
                                .map((title: string, i: number) => (
                                  <span
                                    key={i}
                                    className="truncate-rtl text-sm text-slate-600 dark:text-slate-400"
                                    title={title}
                                  >
                                    {title}
                                  </span>
                                ));
                            }
                          } catch {
                            // Not an array - treat as single string
                          }
                          // Display as single string
                          return (
                            <p className="truncate-rtl text-sm text-slate-600 dark:text-slate-400" title={user.job_title}>
                              {user.job_title}
                            </p>
                          );
                        })()}
                      </div>
                    )}

                    {/* Company + Location row */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {user.job_company_name && (() => {
                        // Handle array format (JSON string of array)
                        try {
                          const fixed = user.job_company_name
                            .replace(/True/g, 'true')
                            .replace(/False/g, 'false')
                            .replace(/None/g, 'null')
                            .replace(/'/g, '"');
                          const parsed = JSON.parse(fixed);
                          if (Array.isArray(parsed)) {
                            const companies = parsed.filter(
                              (n): n is string => typeof n === 'string' && n.trim() !== '',
                            );
                            if (companies.length > 0) {
                              const firstCompany = companies[0].slice(0, 20);
                              return (
                                <span className="flex items-center gap-1" title={companies.join('\n')}>
                                  <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                                  <span className="truncate-rtl max-w-[150px]" title={companies[0]}>{firstCompany}{companies.length > 1 && ` (+${companies.length - 1})`}</span>
                                </span>
                              );
                            }
                          }
                        } catch {
                          // Not an array, treat as single string
                        }

                        // Single string fallback
                        const company = user.job_company_name.slice(0, 20);
                        return (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                            <span className="truncate-rtl max-w-[150px]" title={user.job_company_name}>{company}</span>
                          </span>
                        );
                      })()}
 
                    </div>
                  </div>

                  {/* Contact badges */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {user.linkedin_url && (
                      <a
                        href={
                          user.linkedin_url.startsWith('http')
                            ? user.linkedin_url
                            : `https://${user.linkedin_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                        title="LinkedIn Profile"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </a>
                    )}
                    {user.emails && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" title="Has Email">
                        <Mail className="h-4 w-4" />
                      </div>
                    )}
                    {user.phone_numbers && (
                      <div className="flex" title={user.phone_numbers}>
                        {(() => {
                          let phones: string[] = [];
                          try {
                            const fixed = user.phone_numbers
                              .replace(/True/g, 'true')
                              .replace(/False/g, 'false')
                              .replace(/None/g, 'null')
                              .replace(/'/g, '"');
                            const parsed = JSON.parse(fixed);
                            if (Array.isArray(parsed)) {
                              phones = parsed.filter(
                                (p): p is string => typeof p === 'string' && p.trim() !== '',
                              );
                            }
                          } catch {
                            // Not an array format
                          }

                          if (phones.length === 0) {
                            // Fallback: treat as single string
                            return (
                              <div
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                title={user.phone_numbers}
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </div>
                            );
                          }

                          // Show all phone numbers in tooltip
                          return (
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                              title={phones.length === 1 ? phones[0] : phones.join('\n')}
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {user.summary && user.summary !== '[]' && (
                  <div>
                    <CompactSummary summary={user.summary} />
                  </div>
                )}

                {/* Skills */}
                {user.skills && user.skills !== '[]' && <CompactSkills skills={user.skills} />}

                {/* Companies (compact with modal for full list) */}
                {user.experience && user.experience !== '[]' && (
                  <CompactCompanies experience={user.experience} />
                )}

                {/* Locations (compact with modal for full list) */}
                {user.experience && user.experience !== '[]' && (
                  <LocationOnlyExperience experience={user.experience} compact />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (desktop) or results count (mobile / infinite scroll) */}
      {meta && onPageChange && meta.page && meta.totalPages && meta.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-1 pt-2">
          <button
            onClick={() => onPageChange(meta.page! - 1)}
            disabled={meta.page! <= 1}
            className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
            قبلی
          </button>

          {Array.from({ length: Math.min(meta.totalPages!, 7) }, (_, i) => {
            let page: number;
            if (meta.totalPages! <= 7) {
              page = i + 1;
            } else if (meta.page! <= 4) {
              page = i + 1;
            } else if (meta.page! >= meta.totalPages! - 3) {
              page = meta.totalPages! - 6 + i;
            } else {
              page = meta.page! - 3 + i;
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                  page === meta.page
                    ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(meta.page! + 1)}
            disabled={meta.page! >= meta.totalPages!}
            className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800"
          >
            بعدی
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : meta ? (
        <p className="pt-2 text-center text-xs text-slate-400 dark:text-slate-500">
          {meta.totalItems?.toLocaleString() ?? 0} نتیجه یافت شد
        </p>
      ) : null}
    </div>
  );
}
