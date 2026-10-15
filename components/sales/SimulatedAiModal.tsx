'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Trash2,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Product, Sale, SaleItem, PaymentMode } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils/formatters';
import { generateId, generateSaleNumber } from '@/lib/utils/id';
import { parseSimulatedTransaction } from '@/lib/ai/simulatedParser';

interface SimulatedAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onConfirmSale: (sale: Sale) => Promise<void>;
}

interface EditableProposalItem {
  id: string;
  rawText: string;
  selectedProductId: string;
  quantity: number;
  candidateIds: string[];
}

export function SimulatedAiModal({
  isOpen,
  onClose,
  products,
  onConfirmSale,
}: SimulatedAiModalProps) {
  const { t } = useLanguage();

  const [commandInput, setCommandInput] = useState('');
  const [hasParsed, setHasParsed] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [clarificationStatus, setClarificationStatus] = useState<
    'ready' | 'needs_clarification' | 'unrecognized'
  >('ready');

  const [proposalItems, setProposalItems] = useState<EditableProposalItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const EXAMPLE_COMMANDS = [
    '5 packet Maggi bike',
    '3 Thums Up sell thai',
    '2 packet biscuit bech diye',
    'Aaj 5 packet Maggi aur 3 cold drink bike',
  ];

  const handleParse = (textToParse?: string) => {
    const text = (textToParse !== undefined ? textToParse : commandInput).trim();
    if (!text) return;

    setSubmissionError('');
    const result = parseSimulatedTransaction(text, products);

    setExplanation(result.explanation);
    setClarificationStatus(result.clarificationStatus);

    const editableItems: EditableProposalItem[] = result.items.map((it, idx) => ({
      id: `prop_item_${idx}_${Date.now()}`,
      rawText: it.rawText,
      selectedProductId: it.status === 'matched' && it.matchedProduct ? it.matchedProduct.id : '',
      quantity: Math.max(1, it.quantity),
      candidateIds: it.candidateProducts?.map((c) => c.id) || [],
    }));

    setProposalItems(editableItems);
    setHasParsed(true);
  };

  const handleApplyExample = (cmd: string) => {
    setCommandInput(cmd);
    handleParse(cmd);
  };

  const handleProductChange = (itemId: string, newProductId: string) => {
    setProposalItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, selectedProductId: newProductId } : it))
    );
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    const safeQty = Math.max(1, newQty);
    setProposalItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: safeQty } : it))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setProposalItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  // Product map for lookup
  const activeProducts = products.filter((p) => p.isActive);
  const productMap = new Map<string, Product>();
  activeProducts.forEach((p) => productMap.set(p.id, p));

  // Resolved items
  const resolvedItems = proposalItems.map((prop) => {
    const prod = productMap.get(prop.selectedProductId);
    const unitPrice = prod?.sellingPrice || 0;
    const subtotal = (prop.quantity || 1) * unitPrice;
    const isOutOfStock = prod ? prod.stockQuantity < prop.quantity : false;

    return {
      ...prop,
      product: prod,
      unitPrice,
      subtotal,
      isOutOfStock,
    };
  });

  const totalAmount = resolvedItems.reduce((acc, it) => acc + it.subtotal, 0);
  const totalQuantity = resolvedItems.reduce((acc, it) => acc + it.quantity, 0);
  const hasUnmappedProducts = resolvedItems.some((it) => !it.product);
  const hasStockErrors = resolvedItems.some((it) => it.isOutOfStock);

  const handleSubmit = async () => {
    if (resolvedItems.length === 0) {
      setSubmissionError('Please parse and add at least one item before confirming.');
      return;
    }

    if (hasUnmappedProducts) {
      setSubmissionError('Please select a valid product from inventory for all items.');
      return;
    }

    if (hasStockErrors) {
      setSubmissionError('Cannot record sale: One or more items exceed available store stock.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionError('');

      const saleItems: SaleItem[] = resolvedItems.map((r) => ({
        productId: r.product!.id,
        productName: r.product!.name,
        quantity: r.quantity,
        unitPrice: r.product!.sellingPrice,
        subtotal: r.quantity * r.product!.sellingPrice,
        unit: r.product!.unit,
      }));

      const saleRecord: Sale = {
        id: generateId('sale'),
        saleNumber: generateSaleNumber(),
        dateTime: new Date().toISOString(),
        items: saleItems,
        totalQuantity,
        totalAmount,
        inputMethod: 'quick_sale',
        status: 'completed',
        paymentMode,
        customerName: customerName.trim() || undefined,
        notes: `Recorded via Simulated AI Parser: "${commandInput}"`,
        isDemoData: false,
      };

      await onConfirmSale(saleRecord);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record sale';
      setSubmissionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const productOptions = [
    { value: '', label: '-- Select Item from Inventory --' },
    ...activeProducts.map((p) => ({
      value: p.id,
      label: `${p.name} (₹${p.sellingPrice}/${p.unit} • ${p.stockQuantity} in stock)`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.simulatedAiTitle}
      description={t.simulatedAiDesc}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-left">
            <span className="text-[11px] text-stone-500 uppercase block font-semibold">
              {t.saleTotal}
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
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!hasParsed || resolvedItems.length === 0 || hasUnmappedProducts || hasStockErrors}
              className="bg-emerald-800 hover:bg-emerald-900 font-bold"
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              {t.simulatedAiConfirmSale}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Transparent Simulated AI Disclaimer Notice */}
        <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs flex items-start gap-2.5">
          <Bot className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-stone-900">
                Rule-Based Assistant (Simulated AI)
              </span>
              <Badge variant="neutral" size="sm">
                100% Offline
              </Badge>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {t.simulatedAiDisclaimer}
            </p>
          </div>
        </div>

        {/* Natural Language Input Field */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-stone-800">
            Natural Language Sale Command
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleParse();
                  }
                }}
                placeholder={t.simulatedAiInputPlaceholder}
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 min-h-[44px]"
              />
            </div>
            <Button
              variant="primary"
              onClick={() => handleParse()}
              disabled={!commandInput.trim()}
              className="shrink-0 bg-emerald-800 hover:bg-emerald-900 font-bold"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              {t.simulatedAiParseButton}
            </Button>
          </div>
        </div>

        {/* Quick Example Clickable Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            {t.simulatedAiExamplesTitle}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_COMMANDS.map((cmd, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyExample(cmd)}
                className="text-xs bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 px-2.5 py-1 rounded-lg transition-colors text-left flex items-center gap-1 font-medium"
              >
                <span>&ldquo;{cmd}&rdquo;</span>
                <ArrowRight className="w-3 h-3 text-stone-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {submissionError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{submissionError}</span>
          </div>
        )}

        {/* Parsed Proposal Confirmation Section */}
        {hasParsed && (
          <div className="border border-stone-200 rounded-2xl bg-stone-50/70 p-4 space-y-3.5 pt-3">
            {/* Parser Status Header */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  {t.simulatedAiReviewTitle}
                </h4>
              </div>

              <div>
                {clarificationStatus === 'ready' && (
                  <Badge variant="success" size="sm">
                    Ready to Confirm
                  </Badge>
                )}
                {clarificationStatus === 'needs_clarification' && (
                  <Badge variant="warning" size="sm">
                    Needs Clarification
                  </Badge>
                )}
                {clarificationStatus === 'unrecognized' && (
                  <Badge variant="danger" size="sm">
                    Unrecognized Items
                  </Badge>
                )}
              </div>
            </div>

            {/* Explanation Note */}
            <p className="text-xs text-stone-600 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200/80">
              {explanation}
            </p>

            {/* Customer & Payment Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Input
                label={t.customerName}
                placeholder="Walk-in customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <Select
                label={t.paymentMode}
                options={[
                  { value: 'cash', label: t.paymentCash },
                  { value: 'upi', label: t.paymentUpi },
                  { value: 'credit', label: t.paymentCredit },
                ]}
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              />
            </div>

            {/* Line items */}
            <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
              {resolvedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-mono font-medium">
                      Item #{index + 1}: &ldquo;{item.rawText}&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-md"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {/* Product Selection */}
                    <div className="flex-1 min-w-0">
                      <Select
                        options={productOptions}
                        value={item.selectedProductId}
                        onChange={(e) => handleProductChange(item.id, e.target.value)}
                      />
                      {!item.selectedProductId && item.candidateIds.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                          <span className="text-[10px] font-semibold text-amber-800">
                            Did you mean:
                          </span>
                          {item.candidateIds.map((cId) => {
                            const cand = productMap.get(cId);
                            if (!cand) return null;
                            return (
                              <button
                                key={cId}
                                type="button"
                                onClick={() => handleProductChange(item.id, cId)}
                                className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-medium"
                              >
                                {cand.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-start">
                      <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
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
                            handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)
                          }
                          className="w-12 text-center text-xs font-bold py-1 border-none outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="w-20 text-right">
                        <span className="text-xs font-black text-stone-900 block">
                          {formatCurrency(item.subtotal)}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          ₹{item.unitPrice}/{item.product?.unit || 'unit'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock validation warning */}
                  {item.isOutOfStock && item.product && (
                    <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Insufficient stock! Store currently only has {item.product.stockQuantity}{' '}
                        {item.product.unit} available.
                      </span>
                    </div>
                  )}

                  {!item.product && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Unrecognized product name. Please map to an active product from the
                        dropdown above.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
