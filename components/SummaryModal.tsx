'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface SummaryModalProps {
  points: string[];
  onClose: () => void;
}

export default function SummaryModal({ points, onClose }: SummaryModalProps) {
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
           شماره های من ({points.length})
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            {points.map((point, i) => (
              <p
                key={i}
                className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400"
              >
                {point}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
