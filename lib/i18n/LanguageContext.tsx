'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { LanguageCode } from '@/types';
import { translations, TranslationDictionary } from './translations';
import { dbService } from '@/lib/storage';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LANGUAGE_STORAGE_KEY = 'dukaan_vikaas_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Use lazy state initialization to read from localStorage without cascading effect renders
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
        if (saved && ['en', 'hi', 'gu', 'hinglish'].includes(saved)) {
          return saved;
        }
      } catch {
        // storage disabled or SSR
      }
    }
    return 'hi'; // Default Hindi for Indian Kirana shopkeepers
  });

  const setLanguage = useCallback((newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      }
    } catch {
      // ignore
    }

    // Best-effort sync with IndexedDB shop settings so preferences survive across reloads
    try {
      dbService
        .getSettings()
        .then((curr) => {
          if (curr && curr.preferredLanguage !== newLang) {
            dbService.saveSettings({ ...curr, preferredLanguage: newLang }).catch(() => {});
          }
        })
        .catch(() => {});
    } catch {
      // ignore
    }
  }, []);

  const t = useMemo(() => translations[language] || translations.en, [language]);

  const contextValue = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
