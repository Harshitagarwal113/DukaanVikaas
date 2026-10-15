'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Product, ProductCategory, ProductUnit } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { validateProduct, VALID_CATEGORIES, VALID_UNITS } from '@/lib/validation';
import { generateId } from '@/lib/utils/id';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  existingProducts?: Product[];
  onSave: (product: Product) => Promise<void>;
}

function ProductForm({
  productToEdit,
  existingProducts = [],
  onSave,
  onClose,
}: {
  productToEdit?: Product | null;
  existingProducts?: Product[];
  onSave: (product: Product) => Promise<void>;
  onClose: () => void;
}) {
  const { t } = useLanguage();

  const [name, setName] = useState(productToEdit?.name || '');
  const [altNamesStr, setAltNamesStr] = useState(
    productToEdit?.altNames ? productToEdit.altNames.join(', ') : ''
  );
  const [category, setCategory] = useState<ProductCategory>(
    productToEdit?.category || 'groceries'
  );
  const [unit, setUnit] = useState<ProductUnit>(productToEdit?.unit || 'packet');
  const [sellingPrice, setSellingPrice] = useState(
    productToEdit?.sellingPrice !== undefined ? productToEdit.sellingPrice.toString() : '20'
  );
  const [purchasePrice, setPurchasePrice] = useState(
    productToEdit?.purchasePrice !== undefined ? productToEdit.purchasePrice.toString() : '16'
  );
  const [stockQuantity, setStockQuantity] = useState(
    productToEdit?.stockQuantity !== undefined ? productToEdit.stockQuantity.toString() : '20'
  );
  const [lowStockThreshold, setLowStockThreshold] = useState(
    productToEdit?.lowStockThreshold !== undefined
      ? productToEdit.lowStockThreshold.toString()
      : '10'
  );
  const [isActive, setIsActive] = useState<boolean>(
    productToEdit?.isActive !== undefined ? productToEdit.isActive : true
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [hasAcknowledgedDuplicate, setHasAcknowledgedDuplicate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSellingPrice = parseFloat(sellingPrice);
    const parsedPurchasePrice = purchasePrice ? parseFloat(purchasePrice) : undefined;
    const parsedStock = parseInt(stockQuantity, 10);
    const parsedThreshold = parseInt(lowStockThreshold, 10);

    const aliases = altNamesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const candidate: Partial<Product> = {
      name: name.trim(),
      altNames: aliases,
      category,
      unit,
      sellingPrice: isNaN(parsedSellingPrice) ? -1 : parsedSellingPrice,
      purchasePrice: parsedPurchasePrice,
      stockQuantity: isNaN(parsedStock) ? -1 : parsedStock,
      lowStockThreshold: isNaN(parsedThreshold) ? -1 : parsedThreshold,
      isActive,
    };

    const validation = validateProduct(candidate);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Accidental Duplicate Check
    const trimmedName = name.trim().toLowerCase();
    const potentialDuplicate = existingProducts.find(
      (p) =>
        p.id !== productToEdit?.id &&
        (p.name.toLowerCase() === trimmedName ||
          p.altNames?.some((a) => a.toLowerCase() === trimmedName))
    );

    if (potentialDuplicate && !hasAcknowledgedDuplicate) {
      setDuplicateWarning(
        `A product named "${potentialDuplicate.name}" already exists in your inventory. Are you sure you want to save a duplicate item?`
      );
      return;
    }

    try {
      setIsSaving(true);
      const now = new Date().toISOString();
      const product: Product = {
        id: productToEdit ? productToEdit.id : generateId('prod'),
        name: candidate.name!,
        altNames: candidate.altNames || [],
        category: candidate.category!,
        unit: candidate.unit!,
        sellingPrice: candidate.sellingPrice!,
        purchasePrice: candidate.purchasePrice,
        stockQuantity: candidate.stockQuantity!,
        lowStockThreshold: candidate.lowStockThreshold!,
        isActive,
        createdDate: productToEdit ? productToEdit.createdDate : now,
        updatedDate: now,
        isDemoData: false,
      };

      await onSave(product);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setErrors([msg]);
    } finally {
      setIsSaving(false);
    }
  };

  const categoryOptions = VALID_CATEGORIES.map((c) => ({
    value: c,
    label: c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' '),
  }));

  const unitOptions = VALID_UNITS.map((u) => ({
    value: u,
    label: u.toUpperCase(),
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
          {errors.map((err, i) => (
            <p key={i}>• {err}</p>
          ))}
        </div>
      )}

      {duplicateWarning && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Duplicate Item Warning</strong>
              <p>{duplicateWarning}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setHasAcknowledgedDuplicate(true);
                setDuplicateWarning(null);
              }}
              className="text-xs bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-amber-800"
            >
              Save Anyway as Duplicate
            </button>
            <button
              type="button"
              onClick={() => setDuplicateWarning(null)}
              className="text-xs bg-white text-stone-700 border border-stone-300 font-semibold px-3 py-1.5 rounded-lg"
            >
              Change Name
            </button>
          </div>
        </div>
      )}

      {/* Product Name */}
      <Input
        label={t.productNameLabel}
        placeholder={t.productNameHint}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setDuplicateWarning(null);
          setHasAcknowledgedDuplicate(false);
        }}
        required
      />

      {/* Local Names / Aliases */}
      <Input
        label={t.aliasesLabel}
        placeholder={t.aliasesHint}
        helperText="Helps you quickly search items in Hindi, Gujarati or local slang"
        value={altNamesStr}
        onChange={(e) => setAltNamesStr(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        {/* Category */}
        <Select
          label={t.categoryLabel}
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
        />

        {/* Unit */}
        <Select
          label={t.unitLabel}
          options={unitOptions}
          value={unit}
          onChange={(e) => setUnit(e.target.value as ProductUnit)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Selling Price */}
        <Input
          label={t.sellingPriceLabel}
          type="number"
          min="0"
          step="0.25"
          prefixElement={<span className="text-stone-400 font-bold">₹</span>}
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          required
        />

        {/* Purchase Price */}
        <Input
          label={t.purchasePriceLabel}
          type="number"
          min="0"
          step="0.25"
          prefixElement={<span className="text-stone-400 font-bold">₹</span>}
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Stock Quantity */}
        <Input
          label={t.stockQuantityLabel}
          type="number"
          min="0"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
        />

        {/* Low Stock Alert Threshold */}
        <Input
          label={t.thresholdLabel}
          type="number"
          min="0"
          helperText="Alerts you when stock falls to this number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(e.target.value)}
          required
        />
      </div>

      {/* Active/Inactive Status Checkbox */}
      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
        <div>
          <span className="text-xs sm:text-sm font-bold text-stone-900 block">
            Product Status: {isActive ? 'Active (Available for Sale)' : 'Inactive (Archived)'}
          </span>
          <p className="text-[11px] text-stone-500">
            Inactive products are hidden from POS billing but historical receipts are preserved.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
        </label>
      </div>

      <div className="border-t border-stone-100 pt-4 flex items-center justify-end gap-2.5">
        <Button variant="ghost" onClick={onClose} disabled={isSaving}>
          {t.cancelButton}
        </Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={isSaving}
          className="bg-emerald-800 hover:bg-emerald-900 font-bold"
        >
          {t.saveButton}
        </Button>
      </div>
    </form>
  );
}

export function ProductModal({
  isOpen,
  onClose,
  productToEdit,
  existingProducts = [],
  onSave,
}: ProductModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? t.editProductTitle : t.addProductTitle}
      maxWidth="lg"
    >
      <ProductForm
        key={productToEdit ? productToEdit.id : 'new-product-form'}
        productToEdit={productToEdit}
        existingProducts={existingProducts}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}
