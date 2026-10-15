'use client';

import React from 'react';
import { PlusCircle, ShoppingCart, Download, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n';
import { exportBackupToFile } from '@/lib/storage';

interface QuickActionsProps {
  onNewSale: () => void;
  onSimulatedAi: () => void;
  onAddProduct: () => void;
  onViewLowStock: () => void;
  lowStockCount?: number;
}

export function QuickActions({
  onNewSale,
  onSimulatedAi,
  onAddProduct,
  onViewLowStock,
  lowStockCount = 0,
}: QuickActionsProps) {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportBackupToFile();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-wider">
          {t.quickActions}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {/* Record Sale */}
        <Button
          onClick={onNewSale}
          variant="primary"
          size="md"
          className="w-full shadow-xs bg-emerald-800 hover:bg-emerald-900 font-bold"
        >
          <ShoppingCart className="w-4 h-4 mr-1.5 shrink-0" />
          <span className="truncate">{t.actionNewSale}</span>
        </Button>

        {/* Simulated AI Entry */}
        <Button
          onClick={onSimulatedAi}
          variant="outline"
          size="md"
          className="w-full border-emerald-400 text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100 font-bold"
        >
          <Sparkles className="w-4 h-4 mr-1.5 text-emerald-700 shrink-0" />
          <span className="truncate">{t.actionSimulatedAi}</span>
        </Button>

        {/* Add Product */}
        <Button
          onClick={onAddProduct}
          variant="secondary"
          size="md"
          className="w-full shadow-xs bg-white hover:bg-stone-100 border-stone-300 font-bold text-stone-900"
        >
          <PlusCircle className="w-4 h-4 mr-1.5 shrink-0 text-stone-700" />
          <span className="truncate">{t.actionAddProduct}</span>
        </Button>

        {/* View Low Stock */}
        <Button
          onClick={onViewLowStock}
          variant="secondary"
          size="md"
          className="w-full bg-white hover:bg-stone-100 border-stone-300 font-semibold text-stone-800"
        >
          <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600 shrink-0" />
          <span className="truncate">
            {t.statusLowStock} ({lowStockCount})
          </span>
        </Button>

        {/* Export Backup */}
        <Button
          onClick={handleExport}
          isLoading={isExporting}
          variant="secondary"
          size="md"
          className="w-full bg-white hover:bg-stone-100 border-stone-300 font-semibold text-stone-800 col-span-2 sm:col-span-1"
        >
          <Download className="w-4 h-4 mr-1.5 text-stone-600 shrink-0" />
          <span className="truncate">{t.actionExportBackup}</span>
        </Button>
      </div>
    </div>
  );
}
