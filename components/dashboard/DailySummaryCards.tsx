'use client';

import React from 'react';
import { IndianRupee, ShoppingBag, AlertTriangle, PackageCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';
import { useLanguage } from '@/lib/i18n';
import { Sale, Product } from '@/types';

interface DailySummaryProps {
  sales: Sale[];
  products: Product[];
  lowStockProducts: Product[];
  onNavigateToLowStock?: () => void;
}

export function DailySummaryCards({
  sales,
  products,
  lowStockProducts,
  onNavigateToLowStock,
}: DailySummaryProps) {
  const { t } = useLanguage();

  // Compute today's completed sales
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(
    (s) => s.status !== 'cancelled' && s.dateTime.startsWith(todayStr)
  );
  const todaySalesAmount = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
  const todayItemsSold = todaySales.reduce((acc, s) => acc + s.totalQuantity, 0);

  const activeProductsCount = products.filter((p) => p.isActive).length;
  const lowStockCount = lowStockProducts.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Today's Total Sales */}
      <Card className="hover:border-emerald-300 transition-all border-l-4 border-l-emerald-800">
        <CardContent className="p-3.5 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold text-stone-500 line-clamp-1">
              {t.todaySales}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
            {formatCurrency(todaySalesAmount)}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {todaySales.length} {t.salesHistoryTitle.toLowerCase()}
          </p>
        </CardContent>
      </Card>

      {/* 2. Items Sold Today */}
      <Card className="hover:border-emerald-300 transition-all border-l-4 border-l-emerald-500">
        <CardContent className="p-3.5 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold text-stone-500 line-clamp-1">
              {t.itemsSoldToday}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
            {todayItemsSold}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Units across all bills
          </p>
        </CardContent>
      </Card>

      {/* 3. Low Stock Alerts */}
      <Card
        onClick={onNavigateToLowStock}
        className="hover:border-rose-300 transition-all border-l-4 border-l-rose-500 cursor-pointer group"
      >
        <CardContent className="p-3.5 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold text-stone-500 line-clamp-1">
              {t.lowStockAlerts}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-rose-600 tracking-tight flex items-baseline gap-2">
            {lowStockCount}
            {lowStockCount > 0 && (
              <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                Alert
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {lowStockCount > 0 ? 'Needs restock soon' : 'All stock healthy'}
          </p>
        </CardContent>
      </Card>

      {/* 4. Active Products In Store */}
      <Card className="hover:border-blue-300 transition-all border-l-4 border-l-blue-500">
        <CardContent className="p-3.5 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold text-stone-500 line-clamp-1">
              {t.totalProducts}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
            {activeProductsCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Registered Kirana items
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
