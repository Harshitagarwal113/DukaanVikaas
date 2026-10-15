'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ShoppingCart, AlertTriangle, Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Product, Sale, SaleItem, PaymentMode, SaleInputMethod } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils/formatters';
import { generateId, generateSaleNumber } from '@/lib/utils/id';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRecordSale: (sale: Sale) => Promise<void>;
}

export function SaleModal({
  isOpen,
  onClose,
  products,
  onRecordSale,
}: SaleModalProps) {
  const { t } = useLanguage();

  const activeProducts = useMemo(() => products.filter((p) => p.isActive), [products]);
  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    activeProducts.forEach((p) => map.set(p.id, p));
    return map;
  }, [activeProducts]);

  const [items, setItems] = useState<SaleItem[]>(() => {
    const first = activeProducts[0];
    if (!first) return [];
    return [
      {
        productId: first.id,
        productName: first.name,
        quantity: 1,
        unitPrice: first.sellingPrice,
        subtotal: first.sellingPrice,
        unit: first.unit,
      },
    ];
  });

  const [customerName, setCustomerName] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [inputMethod] = useState<SaleInputMethod>('quick_sale');
  const [productSearch, setProductSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle product selection for a line item
  const handleProductChange = (index: number, productId: string) => {
    const selected = productMap.get(productId);
    if (!selected) return;

    setItems((prev) => {
      const copy = [...prev];
      const qty = copy[index]?.quantity || 1;
      copy[index] = {
        productId: selected.id,
        productName: selected.name,
        quantity: qty,
        unitPrice: selected.sellingPrice,
        subtotal: qty * selected.sellingPrice,
        unit: selected.unit,
      };
      return copy;
    });
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, qty: number) => {
    const safeQty = Math.max(1, qty);
    setItems((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      const unitPrice = copy[index].unitPrice;
      copy[index] = {
        ...copy[index],
        quantity: safeQty,
        subtotal: safeQty * unitPrice,
      };
      return copy;
    });
  };

  // Add a new line item
  const handleAddItem = (productId?: string) => {
    const selected = productId ? productMap.get(productId) : activeProducts[0];
    if (!selected) return;

    setItems((prev) => [
      ...prev,
      {
        productId: selected.id,
        productName: selected.name,
        quantity: 1,
        unitPrice: selected.sellingPrice,
        subtotal: selected.sellingPrice,
        unit: selected.unit,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Compute live calculations
  const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  // Check inventory stock validity
  const stockValidationIssues = items
    .map((item) => {
      const prod = productMap.get(item.productId);
      if (!prod) {
        return `Item "${item.productName}" not found in inventory.`;
      }
      if (prod.stockQuantity < item.quantity) {
        return `"${prod.name}" has only ${prod.stockQuantity} ${prod.unit} available (requested: ${item.quantity}).`;
      }
      return null;
    })
    .filter(Boolean) as string[];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (items.length === 0) {
      setError('Please add at least one item to the bill.');
      return;
    }

    if (stockValidationIssues.length > 0) {
      setError(`Cannot complete sale: ${stockValidationIssues.join('; ')}`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Recalculate accurately from database products
      const verifiedItems: SaleItem[] = items.map((it) => {
        const prod = productMap.get(it.productId);
        const price = prod ? prod.sellingPrice : it.unitPrice;
        return {
          productId: it.productId,
          productName: prod ? prod.name : it.productName,
          quantity: it.quantity,
          unitPrice: price,
          subtotal: it.quantity * price,
          unit: prod ? prod.unit : it.unit,
        };
      });

      const sale: Sale = {
        id: generateId('sale'),
        saleNumber: generateSaleNumber(),
        dateTime: new Date().toISOString(),
        items: verifiedItems,
        totalQuantity,
        totalAmount,
        inputMethod,
        status: 'completed',
        paymentMode,
        customerName: customerName.trim() || undefined,
        isDemoData: false,
      };

      await onRecordSale(sale);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record sale';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered products for quick-add helper
  const searchResults = useMemo(() => {
    if (!productSearch.trim()) return [];
    const q = productSearch.toLowerCase().trim();
    return activeProducts
      .filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inAlias = p.altNames?.some((a) => a.toLowerCase().includes(q));
        const inCategory = p.category.toLowerCase().includes(q);
        return inName || inAlias || inCategory;
      })
      .slice(0, 6);
  }, [activeProducts, productSearch]);

  const productOptions = activeProducts.map((p) => ({
    value: p.id,
    label: `${p.name} (₹${p.sellingPrice}/${p.unit} • ${p.stockQuantity} in stock)`,
  }));

  const paymentOptions = [
    { value: 'cash', label: t.paymentCash },
    { value: 'upi', label: t.paymentUpi },
    { value: 'credit', label: t.paymentCredit },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.actionNewSale}
      description="Create a customer bill with live inventory stock verification"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-left">
            <span className="text-[11px] text-stone-500 uppercase block font-semibold">
              {t.saleTotal} ({totalQuantity} items)
            </span>
            <span className="text-xl font-black text-emerald-800">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              {t.cancelButton}
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSubmit()}
              isLoading={isSubmitting}
              disabled={stockValidationIssues.length > 0 || items.length === 0}
              className="bg-emerald-800 hover:bg-emerald-900 font-bold"
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Save & Print Bill
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Customer & Payment Mode Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={t.customerName}
            placeholder="e.g. Ramesh Bhai / Walk-in"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <Select
            label={t.paymentMode}
            options={paymentOptions}
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
          />
        </div>

        {/* Quick Product Search & Add */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700">
              Quick Item Finder / Barcode
            </label>
            <span className="text-[11px] text-stone-500">
              Search by English, Hindi, or Gujarati aliases
            </span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Type product name (e.g. Maggi, Atta, Thums Up, दूध)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {searchResults.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => {
                    handleAddItem(prod.id);
                    setProductSearch('');
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200 hover:border-emerald-500 text-left text-xs transition-colors"
                >
                  <span className="font-semibold text-stone-900 truncate">
                    {prod.name}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 shrink-0 ml-2">
                    + Add ₹{prod.sellingPrice}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Items List on Bill */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-stone-900">
              Items on Bill ({items.length})
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddItem()}
              className="text-xs py-1 px-2.5 h-auto text-emerald-900 border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Another Line
            </Button>
          </div>

          <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const currentProd = productMap.get(item.productId);
              const isOverStock = currentProd ? currentProd.stockQuantity < item.quantity : false;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-colors flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 ${
                    isOverStock
                      ? 'bg-rose-50/60 border-rose-300'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <Select
                      options={productOptions}
                      value={item.productId}
                      onChange={(e) => handleProductChange(idx, e.target.value)}
                    />
                    {isOverStock && currentProd && (
                      <span className="text-[10px] font-bold text-rose-700 block mt-1">
                        Exceeds stock: Only {currentProd.stockQuantity} {currentProd.unit} available!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-start">
                    {/* Stepper Buttons */}
                    <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(idx, parseInt(e.target.value, 10) || 1)
                        }
                        className="w-12 text-center text-xs font-bold py-1 border-none outline-none"
                        title="Quantity"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-24 text-right">
                      <span className="text-xs font-black text-stone-900 block">
                        {formatCurrency(item.subtotal)}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        ₹{item.unitPrice}/{item.unit}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-2 text-stone-400 hover:text-rose-600 disabled:opacity-30 disabled:pointer-events-none rounded-lg hover:bg-stone-200/50"
                      title="Remove line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bill Summary preview box */}
        <div className="p-3 rounded-xl bg-stone-100/70 border border-stone-200 text-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-semibold text-stone-700">Bill Breakdown Preview</span>
            <p className="text-[11px] text-stone-500">
              Payment mode: <strong className="capitalize">{paymentMode}</strong> • {totalQuantity} total units
            </p>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-emerald-800">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
