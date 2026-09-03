'use client';

import { MapPin, X } from 'lucide-react';
import { useState, useEffect } from 'react';

function parseLocations(raw: string | null | undefined): string[] {
  if (!raw || raw === '[]') return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return extractLocationNames(parsed);
  } catch {
    // Try Python-style fixes
  }

  try {
    const fixed = raw
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null');
    const sanitized = fixed.replace(/'/g, '"').replace(/\\"/g, '\\"');
    const parsed = JSON.parse(sanitized);
    if (Array.isArray(parsed)) return extractLocationNames(parsed);
  } catch {
    // Last resort
  }

  // Fallback: extract location names via regex
  const nameRegex = /"name"\s*:\s*"([^"]+)"/g;
  const locations: string[] = [];
  let match;
  while ((match = nameRegex.exec(raw)) !== null) {
    locations.push(match[1]);
  }
  return [...new Set(locations)];
}

function extractLocationNames(items: Record<string, unknown>[]): string[] {
  return items
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const obj = item as Record<string, unknown>;

      // Nested format: { company: { location: { name: "city, state, country" } }, location_names: [...] }
      if (obj.company && typeof obj.company === 'object') {
        const company = obj.company as Record<string, unknown>;
        if (company.location && typeof company.location === 'object') {
          const loc = company.location as Record<string, unknown>;
          if (loc.name && typeof loc.name === 'string') return loc.name;
        }
      }

      // Flat format: { name: "city, state, country", ... }
      if (obj.name && typeof obj.name === 'string') return obj.name;

      // location_names fallback (array of strings)
      if (obj.location_names && Array.isArray(obj.location_names)) {
        const names = obj.location_names as unknown[];
        for (const n of names) {
          if (typeof n === 'string') return n;
        }
      }

      return null;
    })
    .filter((loc): loc is string => Boolean(loc));
}

interface LocationModalProps {
  locations: string[];
  onClose: () => void;
}

export default function LocationModal({ locations, onClose }: LocationModalProps) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            تمام مکان‌ها ({locations.length})
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Only render content area if there are locations */}
        {locations.length > 0 ? (
          <div className="max-h-[60vh] overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {locations.map((loc, idx) => {
                // Skip empty/falsy locations
                if (!loc || loc.trim() === '') return null;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 p-4 dark:border-slate-800"
                    title={loc}
                  >
                    <MapPin className="h-5 w-5 flex-shrink-0 text-slate-400" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <MapPin className="h-8 w-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400">هیچ مکانی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}
