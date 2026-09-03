'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

function parseSkills(raw: string | null | undefined): string[] {
  if (!raw || raw === '[]') return [];
  try {
    const fixed = raw.replace(/'/g, '"').replace(/True/g, 'true').replace(/False/g, 'false').replace(/None/g, 'null');
    const parsed = JSON.parse(fixed);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

interface CompactSkillsProps {
  skills: string | null | undefined;
  maxDisplay?: number;
}

export default function CompactSkills({ skills, maxDisplay = 3 }: CompactSkillsProps) {
  const items = parseSkills(skills);
  if (items.length === 0) return null;

  const uniqueItems = [...new Set(items)];
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

  if (uniqueItems.length <= maxDisplay) {
    return (
      <div className="mt-2 flex flex-wrap gap-1">
        {uniqueItems.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1">
        {uniqueItems.slice(0, maxDisplay).map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
          >
            {skill}
          </span>
        ))}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
          }}
          className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        >
          +{uniqueItems.length - maxDisplay} مهارت دیگر
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
                تمام مهارت‌ها ({uniqueItems.length})
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-4 py-4">
              <div className="flex flex-wrap gap-1.5">
                {uniqueItems.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
