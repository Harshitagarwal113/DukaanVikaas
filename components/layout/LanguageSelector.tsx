'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { LanguageCode } from '@/types';
import { Languages } from 'lucide-react';

const LANGUAGE_OPTIONS: { code: LanguageCode; label: string; sub: string }[] = [
  { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
  { code: 'gu', label: 'ગુજરાતી', sub: 'Gujarati' },
  { code: 'hinglish', label: 'Hinglish', sub: 'Easy Hindi' },
  { code: 'en', label: 'English', sub: 'English' },
];

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200/80 transition-colors rounded-xl px-2.5 py-1.5 border border-stone-200">
        <Languages className="w-4 h-4 text-amber-700 shrink-0" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          className="bg-transparent text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none cursor-pointer pr-1"
          aria-label="Select Language"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.code} value={opt.code} className="text-stone-900 bg-white">
              {compact ? opt.label : `${opt.label} (${opt.sub})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
