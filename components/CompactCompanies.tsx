'use client';

import { Briefcase, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ExperienceItem {
  company?: {
    name?: string;
    size?: string;
    industry?: string;
    location?: { name?: string };
    linkedin_url?: string;
    website?: string;
  };
  title?: { name?: string };
  is_primary?: boolean;
  summary?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  location_names?: string[];
}

function parseExperience(raw: string | null | undefined): ExperienceItem[] {
  if (!raw || raw === '[]') return [];
  try {
    const fixed = raw.replace(/True/g, 'true').replace(/False/g, 'false').replace(/None/g, 'null').replace(/'/g, '"');
    const parsed = JSON.parse(fixed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface CompactCompaniesProps {
  experience: string | null | undefined;
}

export default function CompactCompanies({ experience }: CompactCompaniesProps) {
  const items = parseExperience(experience);
  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });

  const uniqueCompanies = [...new Set(
    sorted
      .map((item) => item.company?.name)
      .filter((n): n is string => Boolean(n)),
  )];

  if (uniqueCompanies.length === 0) return null;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showModal]);

  const renderCompactItem = (name: string, item: ExperienceItem) => {
    const isPrimary = item.is_primary ?? false;
    const size = item.company?.size;

    return (
      <span
        key={name}
        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
          isPrimary
            ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
        }`}
        title={name}
      >
        <Briefcase className="h-3 w-3 flex-shrink-0" />
        {name}
        {size && <span className="text-xs opacity-70">({size})</span>}
      </span>
    );
  };

  if (uniqueCompanies.length <= 3) {
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {uniqueCompanies.map((name) => {
          const item = sorted.find((s) => s.company?.name === name) || sorted[0];
          return <span key={name}>{renderCompactItem(name, item)}</span>;
        })}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1.5">
        {uniqueCompanies.slice(0, 3).map((name) => {
          const item = sorted.find((s) => s.company?.name === name) || sorted[0];
          return <span key={name}>{renderCompactItem(name, item)}</span>;
        })}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
          }}
          className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        >
          +{uniqueCompanies.length - 3} شرکت دیگر
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-3xl rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                تمام شرکت‌ها ({uniqueCompanies.length})
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
              {sorted.map((item, idx) => {
                const name = item.company?.name || 'ناشناس';
                const isPrimary = item.is_primary ?? false;
                const title = item.title?.name;
                const industry = item.company?.industry;
                const size = item.company?.size;

                return (
                  <div
                    key={idx}
                    className={`rounded-lg border p-3 text-xs ${
                      isPrimary
                        ? 'border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-500/5'
                        : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">{name}</span>
                      {isPrimary && (
                        <span className="inline-flex items-center rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
                          اصلی
                        </span>
                      )}
                    </div>
                    {title && <p className="mt-1 text-slate-600 dark:text-slate-400">عنوان: {title}</p>}
                    {industry && <p className="mt-1 text-slate-600 dark:text-slate-400">صنعت: {industry}</p>}
                    {size && <p className="mt-1 text-slate-600 dark:text-slate-400">اندازه: {size}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
