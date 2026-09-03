'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SummaryModal from './SummaryModal';

function parseSummaryPoints(raw: string | string[] | null | undefined): string[] {
  if (!raw) return [];

  let lines = Array.isArray(raw) ? raw : raw.split('\n');

  // If single string that looks like a stringified array (e.g., "['a', 'b']")
  if (lines.length === 1 && typeof lines[0] === 'string') {
    const trimmed = lines[0].trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const jsonReady = trimmed.replace(/'/g, '"');
        const parsed = JSON.parse(jsonReady);
        if (Array.isArray(parsed)) {
          lines = parsed;
        }
      } catch {
        // Keep original
      }
    }
  }

  return lines
    .map((l) => (typeof l === 'string' ? l.trim() : ''))
    .filter((l) => l.length > 0)
    .map((l) => l.replace(/^\*\s/, '• ').trim());
}

/** True when the raw value is an array or a stringified array (e.g. phone numbers list). */
function isArrayLike(raw: string | string[] | null | undefined): boolean {
  if (Array.isArray(raw)) return true;
  if (typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return false;
  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    return Array.isArray(parsed);
  } catch {
    return false;
  }
}

interface CompactSummaryProps {
  summary: string | string[] | null | undefined;
}

export default function CompactSummary({ summary }: CompactSummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const points = parseSummaryPoints(summary);
  const arrayLike = isArrayLike(summary);
  const fullText = points.join('  •  ');

  // Detect whether the text actually overflows 2 lines
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setIsClamped(el.scrollHeight > el.clientHeight + 2);
    check();
    // Re-check on resize since line wrapping depends on width
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fullText]);

  if (points.length === 0) return null;

  // Array mode (e.g. phone numbers): show max 3 inline, rest in a modal
  if (arrayLike) {
    const display = points.slice(0, 3);
    const hidden = points.length - display.length;

    return (
      <div className="mt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {display.map((point, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 truncate-rtl max-w-full rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              title={point}
            >
              {point}
            </span>
          ))}
          {hidden > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowModal(true);
              }}
              className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            >
              +{hidden} شماره دیگر
            </button>
          )}
        </div>

        {showModal && <SummaryModal points={points} onClose={() => setShowModal(false)} />}
      </div>
    );
  }

  // Plain text mode: clamp to 2 lines with expand/collapse
  return (
    <div className="mt-2">
      <p
        ref={textRef}
        onClick={(e) => {
          if (!isClamped && !expanded) return;
          e.preventDefault();
          e.stopPropagation();
          setExpanded((v) => !v);
        }}
        className={`text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 ${
          expanded ? 'expanded' : 'line-clamp-2-rtl'
        } ${isClamped || expanded ? 'cursor-pointer' : ''}`}
      >
        {fullText}
      </p>
      {(isClamped || expanded) && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
          {expanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
        </button>
      )}
    </div>
  );
}
