'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import LocationModal from './LocationModal';

interface LocationOnlyExperienceProps {
  experience: string | null | undefined;
  compact?: boolean;
}

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

export default function LocationOnlyExperience({ experience, compact = false }: LocationOnlyExperienceProps) {
  const locations = parseLocations(experience);
  if (locations.length === 0) return null;

  const uniqueLocations = [...new Set(locations)];
  const [showModal, setShowModal] = useState(false);

  if (!compact) {
    return (
      <div className="mt-2 flex flex-col gap-2">
        {uniqueLocations.map((loc, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400"
            title={loc}
          >
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            {loc}
          </span>
        ))}
      </div>
    );
  }

  const displayCount = Math.min(3, uniqueLocations.length);

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        {uniqueLocations.slice(0, displayCount).map((loc, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1.5 truncate-rtl text-xs text-slate-500 dark:text-slate-400"
            title={loc}
          >
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            {loc}
          </span>
        ))}
        {uniqueLocations.length > displayCount && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowModal(true);
            }}
            className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          >
            +{uniqueLocations.length - displayCount} مکان دیگر
          </button>
        )}
      </div>

      {showModal && <LocationModal locations={uniqueLocations} onClose={() => setShowModal(false)} />}
    </div>
  );
}
