'use client';

import React, { useState, useMemo } from 'react';
import {
  PackagePlus,
  Edit2,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { Product } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/formatters';

interface LowStockManagementViewProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onRestockProduct: (product: Product) => void;
}

export function LowStockManagementView({
  products,
  onEditProduct,
  onRestockProduct,
}: LowStockManagementViewProps) {
  const { t } = useLanguage();

  const [filterMode, setFilterMode] = useState<'all' | 'out_of_stock' | 'below_threshold'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Products at or below threshold
  const lowStockItems = useMemo(() => {
    return products.filter((p) => p.isActive && p.stockQuantity <= p.lowStockThreshold);
  }, [products]);

  // Filtered view
  const filteredItems = useMemo(() => {
    return lowStockItems.filter((p) => {
      if (filterMode === 'out_of_stock' && p.stockQuantity > 0) return false;
      if (filterMode === 'below_threshold' && p.stockQuantity === 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(q);
        const inCategory = p.category.toLowerCase().includes(q);
        const inAliases = p.altNames?.some((a) => a.toLowerCase().includes(q));
        if (!inName && !inCategory && !inAliases) return false;
      }

      return true;
    });
  }, [lowStockItems, filterMode, searchQuery]);

  const outOfStockCount = lowStockItems.filter((p) => p.stockQuantity === 0).length;
  const lowCount = lowStockItems.filter((p) => p.stockQuantity > 0).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              {t.lowStockScreenTitle}
            </h2>
            {lowStockItems.length > 0 && (
              <Badge variant="danger" size="sm">
                {lowStockItems.length} Alert{lowStockItems.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.lowStockScreenDesc}
          </p>
        </div>

        {/* Quick filter tabs */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({lowStockItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('out_of_stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'out_of_stock'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-rose-700'
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('below_threshold')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'below_threshold'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-amber-800'
            }`}
          >
            Low Stock ({lowCount})
          </button>
        </div>
      </div>

      {/* Search Input */}
      {lowStockItems.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search low-stock products..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      )}

      {/* Empty State */}
      {lowStockItems.length === 0 ? (
        <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-950">
              Inventory Levels Healthy
            </h3>
            <p className="text-xs text-emerald-850 mt-1 max-w-md mx-auto">
              {t.healthyStockMessage}
            </p>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-500">
          No items match your active search or filter.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{t.colProduct}</th>
                  <th className="py-3.5 px-4">{t.colCategory}</th>
                  <th className="py-3.5 px-4">{t.colPrice}</th>
                  <th className="py-3.5 px-4">Available Quantity</th>
                  <th className="py-3.5 px-4">Threshold</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredItems.map((prod) => {
                  const isOut = prod.stockQuantity === 0;

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-stone-50 transition-colors ${
                        isOut ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">
                          {prod.name}
                        </span>
                        {prod.altNames && prod.altNames.length > 0 && (
                          <span className="text-[11px] text-stone-500">
                            {prod.altNames.slice(0, 2).join(', ')}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs capitalize text-stone-600">
                        {prod.category}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        {formatCurrency(prod.sellingPrice)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-black text-sm ${
                            isOut ? 'text-rose-700' : 'text-amber-800'
                          }`}
                        >
                          {prod.stockQuantity} {prod.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-stone-600">
                        Min {prod.lowStockThreshold} {prod.unit}
                      </td>

                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <Badge variant="danger" size="sm">
                            {t.statusOutOfStock}
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            {t.statusLowStock}
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onRestockProduct(prod)}
                            className="bg-emerald-800 hover:bg-emerald-900 text-xs px-2.5 h-8 font-bold"
                          >
                            <PackagePlus className="w-3.5 h-3.5 mr-1" />
                            + Restock
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditProduct(prod)}
                            className="text-stone-600 hover:text-stone-900 text-xs px-2.5 h-8"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2.5">
            {filteredItems.map((prod) => {
              const isOut = prod.stockQuantity === 0;

              return (
                <Card
                  key={prod.id}
                  className={`p-3.5 shadow-2xs border-stone-200 ${
                    isOut ? 'border-l-4 border-l-rose-500 bg-rose-50/15' : 'border-l-4 border-l-amber-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 capitalize mt-0.5">
                        {prod.category} • ₹{prod.sellingPrice}/{prod.unit}
                      </p>
                    </div>
                    {isOut ? (
                      <Badge variant="danger" size="sm">
                        Out of Stock
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        Low Stock
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-y border-stone-100 my-2">
                    <div>
                      <span className="text-stone-500 text-[11px] block">Current Stock:</span>
                      <span
                        className={`text-sm font-black ${
                          isOut ? 'text-rose-700' : 'text-amber-800'
                        }`}
                      >
                        {prod.stockQuantity} {prod.unit}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-stone-500 text-[11px] block">Threshold:</span>
                      <span className="font-semibold text-stone-800">
                        {prod.lowStockThreshold} {prod.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditProduct(prod)}
                      className="text-stone-600 text-xs px-2.5 h-8"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onRestockProduct(prod)}
                      className="bg-emerald-800 hover:bg-emerald-900 font-bold text-xs px-3 h-8"
                    >
                      <PackagePlus className="w-3.5 h-3.5 mr-1" />
                      Restock
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
