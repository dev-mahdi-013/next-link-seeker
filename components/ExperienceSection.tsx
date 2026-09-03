'use client';

import { useState } from 'react';
import { Calendar, MapPin, X, ChevronDown } from 'lucide-react';

interface ExperienceItem {
  company?: {
    name?: string;
    size?: string;
    industry?: string;
    location?: { name?: string };
    linkedin_url?: string;
    website?: string;
  };
  title?: {
    name?: string;
    role?: string;
    levels?: string[];
  };
  start_date?: string;
  end_date?: string;
  location_names?: string[];
  is_primary?: boolean;
  summary?: string;
}

function pythonToJson(raw: string): string {
  let s = raw
    .replace(/True/g, 'true')
    .replace(/False/g, 'false')
    .replace(/None/g, 'null');
  // Convert single quotes to double quotes (Python dicts use single quotes)
  s = s.replace(/'/g, '"');
  return s;
}

function parseExperience(raw: string | null | undefined): ExperienceItem[] {
  if (!raw || raw === '[]') return [];
  try {
    const json = pythonToJson(raw);
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    // Validate: must have company or title to be real experience
    return parsed.filter((item: any) => {
      if (!item || typeof item !== 'object') return false;
      const hasCompany = item.company && typeof item.company === 'object' && item.company.name;
      const hasTitle = item.title && typeof item.title === 'object' && item.title.name;
      return hasCompany || hasTitle;
    });
  } catch {
    return [];
  }
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  const parts = date.split('-');
  if (parts.length === 2) {
    const months = ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const month = months[monthIdx] || parts[1];
    return `${month} ${parts[0]}`;
  }
  return date;
}

function getLevelBadge(levels: string[] | undefined): string | null {
  if (!levels || levels.length === 0) return null;
  const level = levels[0]?.replace(/['"]/g, '');
  const map: Record<string, string> = {
    senior: 'Senior',
    junior: 'Junior',
    manager: 'Manager',
    director: 'Director',
    cxo: 'C-Level',
    vp: 'VP',
    training: 'Intern',
    unpaid: 'Unpaid',
  };
  return map[level] || level;
}

function ExperienceCard({ item }: { item: ExperienceItem }) {
  const company = item.company;
  const title = item.title;
  const level = getLevelBadge(title?.levels);

  return (
    <div
      className={`group relative flex gap-3 rounded-xl border p-3 transition ${
        item.is_primary
          ? 'border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-500/5'
          : 'border-slate-100 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700'
      }`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
          item.is_primary
            ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        }`}
      >
        {company?.name?.[0]?.toUpperCase() || '?'}
      </div>

      <div className="min-w-0 flex-1">
        {title?.name && (
          <p className="truncate-rtl text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title.name}
          </p>
        )}

        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {company?.name && (
            <span className="truncate-rtl text-xs text-slate-600 dark:text-slate-400">
              {company.name}
            </span>
          )}
          {level && (
            <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {level}
            </span>
          )}
          {company?.size && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {company.size}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
          {(item.start_date || item.end_date) && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(item.start_date)}
              {item.end_date ? ` — ${formatDate(item.end_date)}` : ' — فعلی'}
            </span>
          )}
          {(item.location_names?.[0] || company?.location?.name) && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate-rtl">
                {item.location_names?.[0] || company?.location?.name}
              </span>
            </span>
          )}
        </div>

        {item.summary && (
          <p className="line-clamp-2-rtl mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {item.summary.replace(/\n/g, ' ').replace(/\*\s/g, '• ')}
          </p>
        )}
      </div>
    </div>
  );
}

interface ExperienceSectionProps {
  experience: string | null | undefined;
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const items = parseExperience(experience);

  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });

  const displayItems = sorted.slice(0, 3);
  const hasMore = sorted.length > 3;

  return (
    <>
      <div className="space-y-2">
        {displayItems.map((item, idx) => (
          <ExperienceCard key={idx} item={item} />
        ))}

        {hasMore && (
          <button
            onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-2 text-xs font-medium text-slate-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400 dark:hover:border-brand-600 dark:hover:bg-brand-500/10 dark:hover:text-brand-400"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            مشاهده {sorted.length - 3} تجربه دیگر
          </button>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  تمام تجربه‌ها
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {sorted.length} مورد
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(80vh-72px)] overflow-y-auto p-4 space-y-2">
              {sorted.map((item, idx) => (
                <ExperienceCard key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
