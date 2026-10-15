'use client';

import React, { useMemo } from 'react';
import { TrendingUp, Package, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useLanguage } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils/formatters';
import { Sale, Product } from '@/types';

interface BestSellingProductsProps {
  sales: Sale[];
  products: Product[];
  limit?: number;
}

interface RankedProduct {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  currentStock: number;
  unit: string;
  category: string;
}

export function BestSellingProducts({
  sales,
  products,
  limit = 5,
}: BestSellingProductsProps) {
  const { t } = useLanguage();

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      map.set(p.id, p);
    }
    return map;
  }, [products]);

  // Aggregate item sales from non-cancelled transactions
  const topProducts = useMemo(() => {
    const aggregation = new Map<
      string,
      { quantity: number; revenue: number; name: string; unit: string }
    >();

    for (const sale of sales) {
      if (sale.status === 'cancelled') continue;

      for (const item of sale.items) {
        const existing = aggregation.get(item.productId) || {
          quantity: 0,
          revenue: 0,
          name: item.productName,
          unit: item.unit,
        };
        existing.quantity += item.quantity;
        existing.revenue += item.subtotal;
        aggregation.set(item.productId, existing);
      }
    }

    const ranked: RankedProduct[] = [];
    aggregation.forEach((data, productId) => {
      const prod = productMap.get(productId);
      ranked.push({
        productId,
        productName: prod ? prod.name : data.name,
        totalQuantity: data.quantity,
        totalRevenue: data.revenue,
        currentStock: prod ? prod.stockQuantity : 0,
        unit: prod ? prod.unit : data.unit,
        category: prod ? prod.category : 'groceries',
      });
    });

    // Sort descending by totalQuantity
    ranked.sort((a, b) => b.totalQuantity - a.totalQuantity);
    return ranked.slice(0, limit);
  }, [sales, productMap, limit]);

  return (
    <Card className="border-stone-200 bg-white">
      <CardHeader className="py-3.5 px-4 sm:px-5 flex flex-row items-center justify-between border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-stone-900">
              {t.bestSellingTitle}
            </CardTitle>
            <p className="text-[11px] text-stone-500">
              Calculated from confirmed offline sales receipts
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-5">
        {topProducts.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-500">
            <Package className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <p>{t.noSalesRecordedYet}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {topProducts.map((item, index) => {
              const rank = index + 1;
              const rankColors =
                rank === 1
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                  : rank === 2
                  ? 'bg-stone-200 text-stone-800 border-stone-300 font-bold'
                  : rank === 3
                  ? 'bg-orange-100 text-orange-900 border-orange-300 font-bold'
                  : 'bg-stone-100 text-stone-600 border-stone-200 font-medium';

              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs border shrink-0 ${rankColors}`}
                    >
                      {rank === 1 ? (
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                      ) : (
                        `#${rank}`
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {item.currentStock} {item.unit} available in shop
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-black text-stone-900 block">
                      {item.totalQuantity} {item.unit}s
                    </span>
                    <span className="text-[11px] text-emerald-800 font-bold block">
                      {formatCurrency(item.totalRevenue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
