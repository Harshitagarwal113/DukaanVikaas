'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  PackagePlus,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { VALID_CATEGORIES } from '@/lib/validation';

interface ProductListProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => Promise<void>;
  onRestockProduct: (product: Product) => void;
  initialStockFilter?: 'all' | 'low' | 'out' | 'in';
}

export function ProductList({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onRestockProduct,
  initialStockFilter = 'all',
}: ProductListProps) {
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in'>(
    initialStockFilter
  );
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered products with multilingual search across name and aliases
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'low') {
        if (prod.stockQuantity > prod.lowStockThreshold || prod.stockQuantity === 0) return false;
      } else if (stockFilter === 'out') {
        if (prod.stockQuantity > 0) return false;
      } else if (stockFilter === 'in') {
        if (prod.stockQuantity <= prod.lowStockThreshold) return false;
      }

      // Search query across name, altNames, category
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = prod.name.toLowerCase().includes(q);
        const inCategory = prod.category.toLowerCase().includes(q);
        const inAliases = prod.altNames?.some((alias) =>
          alias.toLowerCase().includes(q)
        );

        if (!inName && !inCategory && !inAliases) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      await onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Search, Filters & Add Product */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 min-h-[44px]"
          />
        </div>

        {/* Add Product Button */}
        <Button
          onClick={onAddProduct}
          variant="primary"
          size="md"
          className="shrink-0 font-bold shadow-xs bg-emerald-800 hover:bg-emerald-900"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {t.actionAddProduct}
        </Button>
      </div>

      {/* Filter Chips: Stock Level & Category */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* Stock status pills */}
        <button
          onClick={() => setStockFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap min-h-[36px] ${
            stockFilter === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {t.allStockStatuses} ({products.length})
        </button>

        <button
          onClick={() => setStockFilter('low')}
          className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap min-h-[36px] flex items-center gap-1.5 ${
            stockFilter === 'low'
              ? 'bg-amber-600 text-white shadow-xs font-bold'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {t.statusLowStock} (
          {products.filter((p) => p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0).length}
          )
        </button>

        <button
          onClick={() => setStockFilter('out')}
          className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap min-h-[36px] ${
            stockFilter === 'out'
              ? 'bg-rose-600 text-white shadow-xs font-bold'
              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          {t.statusOutOfStock} ({products.filter((p) => p.stockQuantity === 0).length})
        </button>

        <span className="text-stone-300">|</span>

        {/* Category selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-xl font-medium bg-stone-100 border border-stone-200 text-stone-700 min-h-[36px] focus:outline-none"
        >
          <option value="all">{t.allCategories}</option>
          {VALID_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Product Content: Desktop Table & Mobile Cards */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title={t.noDataFound}
          description="Try modifying your search or filter criteria, or add a new product."
          actionLabel={t.actionAddProduct}
          onAction={onAddProduct}
        />
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
                  <th className="py-3.5 px-4">{t.colStock}</th>
                  <th className="py-3.5 px-4">{t.colStatus}</th>
                  <th className="py-3.5 px-4 text-right">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stockQuantity === 0;
                  const isLow = p.stockQuantity <= p.lowStockThreshold && !isOutOfStock;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{p.name}</div>
                        {p.altNames && p.altNames.length > 0 && (
                          <div className="text-xs text-stone-500 truncate max-w-xs mt-0.5">
                            {p.altNames.join(' • ')}
                          </div>
                        )}
                        {p.isDemoData && (
                          <Badge variant="demo" size="sm" className="mt-1">
                            Demo Item
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 capitalize text-stone-600 text-xs font-medium">
                        {p.category}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {formatCurrency(p.sellingPrice)}
                        <span className="text-[11px] font-normal text-stone-500 ml-1">
                          /{p.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-stone-900">
                          {p.stockQuantity}{' '}
                          <span className="text-xs font-normal text-stone-500">{p.unit}</span>
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Min: {p.lowStockThreshold}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <Badge variant="danger">{t.statusOutOfStock}</Badge>
                        ) : isLow ? (
                          <Badge variant="warning">{t.statusLowStock}</Badge>
                        ) : (
                          <Badge variant="success">{t.statusInStock}</Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onRestockProduct(p)}
                            className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                            title="Add stock"
                          >
                            <PackagePlus className="w-3.5 h-3.5 mr-1" />
                            +Stock
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 h-auto text-stone-600 hover:text-stone-900"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 h-auto text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Product Cards */}
          <div className="md:hidden space-y-2.5">
            {filteredProducts.map((p) => {
              const isOutOfStock = p.stockQuantity === 0;
              const isLow = p.stockQuantity <= p.lowStockThreshold && !isOutOfStock;

              return (
                <Card key={p.id} className="p-3.5 shadow-2xs border-stone-200">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 leading-tight">
                        {p.name}
                      </h4>
                      {p.altNames && p.altNames.length > 0 && (
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {p.altNames.join(' • ')}
                        </p>
                      )}
                    </div>
                    {isOutOfStock ? (
                      <Badge variant="danger" size="sm">
                        {t.statusOutOfStock}
                      </Badge>
                    ) : isLow ? (
                      <Badge variant="warning" size="sm">
                        {t.statusLowStock}
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        {t.statusInStock}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-y border-stone-100 my-2">
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase font-bold">
                        {t.colPrice}
                      </span>
                      <span className="font-extrabold text-sm text-stone-900">
                        {formatCurrency(p.sellingPrice)}
                      </span>
                      <span className="text-[11px] text-stone-500">/{p.unit}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-stone-500 block text-[10px] uppercase font-bold">
                        {t.colStock}
                      </span>
                      <span className="font-extrabold text-sm text-stone-900">
                        {p.stockQuantity} {p.unit}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        Min: {p.lowStockThreshold}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <div className="flex items-center gap-1">
                      {p.isDemoData && (
                        <Badge variant="demo" size="sm">
                          Demo
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onRestockProduct(p)}
                        className="text-xs px-2.5 py-1 text-emerald-800 bg-emerald-50 border-emerald-200"
                      >
                        <PackagePlus className="w-3.5 h-3.5 mr-1" />
                        +Stock
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditProduct(p)}
                        className="p-1.5 h-auto text-stone-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProductToDelete(p)}
                        className="p-1.5 h-auto text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setProductToDelete(null)}
          title="Delete Product?"
          description={`Are you sure you want to remove "${productToDelete.name}" from your inventory?`}
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
              >
                {t.cancelButton}
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={isDeleting}
              >
                {t.deleteButton}
              </Button>
            </>
          }
        >
          <p className="text-xs text-stone-500">
            This action will remove the item from active stock. Past sales and billing records will remain intact for bookkeeping.
          </p>
        </Modal>
      )}
    </div>
  );
}
