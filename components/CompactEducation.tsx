'use client';

import { GraduationCap, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EducationItem {
  school?: {
    name?: string;
    type?: string;
    location?: { name?: string };
    linkedin_url?: string;
    website?: string;
  };
  degrees?: string[];
  majors?: string[];
  gpa?: string | number | null;
  start_date?: string | null;
  end_date?: string | null;
  summary?: string | null;
}

function parseEducation(raw: string | null | undefined): EducationItem[] {
  if (!raw || raw === '[]') return [];
  try {
    const fixed = raw.replace(/True/g, 'true').replace(/False/g, 'false').replace(/None/g, 'null').replace(/'/g, '"');
    const parsed = JSON.parse(fixed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface CompactEducationProps {
  education: string | null | undefined;
}

export default function CompactEducation({ education }: CompactEducationProps) {
  const items = parseEducation(education);
  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => {
    const aEnd = a.end_date ? new Date(a.end_date).getTime() : Date.now();
    const bEnd = b.end_date ? new Date(b.end_date).getTime() : Date.now();
    return bEnd - aEnd;
  });

  const names = [...new Set(
    sorted.map((item) => item.school?.name).filter((n): n is string => Boolean(n)),
  )];

  if (names.length === 0) return null;

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

  const renderCompactItem = (name: string, item: EducationItem) => {
    const degrees = item.degrees?.filter((d): d is string => typeof d === 'string') || [];
    const majors = item.majors?.filter((m): m is string => typeof m === 'string') || [];
    const gpa = item.gpa;

    const details: string[] = [];
    if (degrees.length > 0) details.push(`مدرک: ${degrees.join('، ')}`);
    if (majors.length > 0) details.push(`رشته: ${majors.join('، ')}`);
    if (gpa !== undefined && gpa !== null) details.push(`GPA: ${gpa}`);

    return (
      <div
        key={name}
        className="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-slate-100">{name}</span>
        </div>
        {details.length > 0 && (
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{details.join(' | ')}</p>
        )}
      </div>
    );
  };

  if (names.length <= 3) {
    return (
      <div className="mt-2 space-y-2">
        {names.map((name) => {
          const item = sorted.find((s) => s.school?.name === name) || sorted[0];
          return renderCompactItem(name, item);
        })}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="space-y-2">
        {names.slice(0, 3).map((name) => {
          const item = sorted.find((s) => s.school?.name === name) || sorted[0];
          return renderCompactItem(name, item);
        })}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
        className="mt-2 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      >
        +{names.length - 3} تحصیل دیگر
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-3xl rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                تمام تحصیلات ({names.length})
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                {sorted.map((item, i) => renderCompactItem(item.school?.name || `edu-${i}`, item))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
