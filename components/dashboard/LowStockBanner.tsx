'use client';

import React from 'react';
import { AlertTriangle, ArrowRight, PackagePlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/lib/i18n';
import { Product } from '@/types';

interface LowStockBannerProps {
  lowStockProducts: Product[];
  onViewAllInventory: () => void;
  onRestockProduct: (product: Product) => void;
}

export function LowStockBanner({
  lowStockProducts,
  onViewAllInventory,
  onRestockProduct,
}: LowStockBannerProps) {
  const { t } = useLanguage();

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-300 bg-amber-50/40">
      <CardHeader className="py-3 px-4 sm:px-5 flex flex-row items-center justify-between border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <CardTitle className="text-sm sm:text-base text-amber-950 font-bold">
            {t.lowStockItemsTitle} ({lowStockProducts.length})
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAllInventory}
          className="text-xs text-amber-800 hover:text-amber-950 hover:bg-amber-100/60 p-1.5 h-auto"
        >
          <span>{t.viewAllProducts}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </CardHeader>

      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {lowStockProducts.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-amber-200/90 shadow-2xs gap-2"
            >
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="danger" size="sm">
                    {product.stockQuantity} {product.unit} left
                  </Badge>
                  <span className="text-[10px] text-stone-500">
                    Min: {product.lowStockThreshold}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onRestockProduct(product)}
                className="shrink-0 text-xs px-2.5 py-1 min-h-[32px] border-amber-400 text-amber-900 hover:bg-amber-100"
              >
                <PackagePlus className="w-3.5 h-3.5 mr-1" />
                +Stock
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
