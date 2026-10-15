'use client';

import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ShopSettings, ViewTab } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { AlertTriangle } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  settings: ShopSettings | null;
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  lowStockCount?: number;
  isDemoData?: boolean;
}

export function AppLayout({
  children,
  settings,
  currentTab,
  onSelectTab,
  lowStockCount = 0,
  isDemoData = true,
}: AppLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans antialiased">
      {/* Header */}
      <Header settings={settings} isDemoData={isDemoData} />

      {/* Demo Banner */}
      {isDemoData && (
        <div className="bg-stone-800 text-stone-200 text-xs py-2 px-4 border-b border-stone-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">
              <strong className="text-white mr-1.5">{t.demoDataBadge}:</strong>
              {t.demoDisclaimer}
            </span>
          </div>
        </div>
      )}

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          lowStockCount={lowStockCount}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-5xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        lowStockCount={lowStockCount}
      />
    </div>
  );
}
