'use client';

import React from 'react';
import { Store, Download, HardDrive } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { exportBackupToFile } from '@/lib/storage';
import { useLanguage } from '@/lib/i18n';
import { ShopSettings } from '@/types';

interface HeaderProps {
  settings: ShopSettings | null;
  onOpenMobileMenu?: () => void;
  isDemoData?: boolean;
}

export function Header({ settings, isDemoData = true }: HeaderProps) {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleQuickBackup = async () => {
    try {
      setIsExporting(true);
      await exportBackupToFile();
    } catch (err) {
      console.error('Backup error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200 bg-white px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Shop Name & Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold text-stone-900 truncate tracking-tight">
                {settings?.shopName || 'श्री गणेश किराना स्टोर'}
              </h1>
              {isDemoData && (
                <Badge variant="demo" size="sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                  {t.demoDataBadge}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 truncate">
              <HardDrive className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Offline IndexedDB Active</span>
            </div>
          </div>
        </div>

        {/* Right: Language switch & quick backup */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSelector compact />

          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickBackup}
            isLoading={isExporting}
            className="hidden sm:inline-flex text-xs py-1.5 px-3"
            title="Download offline JSON backup"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Backup
          </Button>
        </div>
      </div>
    </header>
  );
}
