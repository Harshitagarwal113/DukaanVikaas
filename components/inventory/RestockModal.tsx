'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Product, InventoryMovementReason, InventoryMovement } from '@/types';
import { generateId } from '@/lib/utils/id';

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirmRestock: (movement: InventoryMovement) => Promise<void>;
}

export function RestockModal({
  isOpen,
  onClose,
  product,
  onConfirmRestock,
}: RestockModalProps) {
  const [quantity, setQuantity] = useState('10');
  const [reason, setReason] = useState<InventoryMovementReason>('restock');
  const [notes, setNotes] = useState('Stock received from wholesaler');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const movement: InventoryMovement = {
        id: generateId('mov'),
        productId: product.id,
        productName: product.name,
        quantityChange: reason === 'damage' ? -parsedQty : parsedQty,
        movementReason: reason,
        notes: notes.trim(),
        timestamp: new Date().toISOString(),
        isDemoData: false,
      };

      await onConfirmRestock(movement);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update stock';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions = [
    { value: 'restock', label: 'Wholesale Restock (नया माल आया)' },
    { value: 'adjustment', label: 'Manual Adjustment (स्टॉक मिलान)' },
    { value: 'return', label: 'Customer Return (वापसी)' },
    { value: 'damage', label: 'Damage / Spoiled (खराब / नुकसान)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Stock: ${product.name}`}
      description={`Current stock: ${product.stockQuantity} ${product.unit}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Update Inventory
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        <Input
          label="Quantity to Add / Adjust"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          suffixElement={<span className="text-xs text-stone-500 font-semibold">{product.unit}</span>}
          required
        />

        <Select
          label="Reason for Stock Change"
          options={reasonOptions}
          value={reason}
          onChange={(e) => setReason(e.target.value as InventoryMovementReason)}
        />

        <Input
          label="Notes / Supplier reference (Optional)"
          placeholder="e.g., Invoice #402 from City Distributor"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
}
