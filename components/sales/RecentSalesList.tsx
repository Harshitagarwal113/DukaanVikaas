'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Eye,
  Plus,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Sale } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';

interface RecentSalesListProps {
  sales: Sale[];
  onNewSale?: () => void;
  onReverseSale?: (saleId: string, reason?: string) => Promise<void>;
  limit?: number;
}

export function RecentSalesList({
  sales,
  onNewSale,
  onReverseSale,
  limit,
}: RecentSalesListProps) {
  const { t } = useLanguage();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Reversal states
  const [saleToReverse, setSaleToReverse] = useState<Sale | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [isReversing, setIsReversing] = useState(false);
  const [reversalError, setReversalError] = useState('');
  const [reversalNotice, setReversalNotice] = useState<string | null>(null);

  const displayedSales = limit ? sales.slice(0, limit) : sales;

  const paymentBadges = {
    cash: <Badge variant="neutral">Cash</Badge>,
    upi: <Badge variant="info">UPI</Badge>,
    credit: <Badge variant="warning">Khata</Badge>,
  };

  const handleConfirmReversal = async () => {
    if (!saleToReverse || !onReverseSale) return;

    try {
      setIsReversing(true);
      setReversalError('');
      await onReverseSale(saleToReverse.id, reversalReason.trim() || undefined);

      setReversalNotice(
        `Bill #${saleToReverse.saleNumber} was reversed. Stock for ${saleToReverse.items.length} items has been safely restored.`
      );
      setSaleToReverse(null);
      setSelectedSale(null);
      setReversalReason('');
      setTimeout(() => setReversalNotice(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reverse sale';
      setReversalError(msg);
    } finally {
      setIsReversing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            {t.salesHistoryTitle}
          </h3>
          <p className="text-xs text-stone-500">
            {sales.length} total billing records saved locally in IndexedDB
          </p>
        </div>

        {onNewSale && (
          <Button
            onClick={onNewSale}
            variant="primary"
            size="sm"
            className="font-bold bg-emerald-800 hover:bg-emerald-900"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t.actionNewSale}
          </Button>
        )}
      </div>

      {reversalNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{reversalNotice}</span>
        </div>
      )}

      {displayedSales.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-7 h-7 text-emerald-800" />}
          title={t.noDataFound}
          description="No sales recorded yet. Click below to record your first customer bill."
          actionLabel={t.actionNewSale}
          onAction={onNewSale}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{t.billNumber}</th>
                  <th className="py-3.5 px-4">{t.saleDateTime}</th>
                  <th className="py-3.5 px-4">{t.customerName}</th>
                  <th className="py-3.5 px-4">{t.itemsCount}</th>
                  <th className="py-3.5 px-4">{t.paymentMode}</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">{t.saleTotal}</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {displayedSales.map((s) => {
                  const isReversed = s.status === 'cancelled';

                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors ${
                        isReversed
                          ? 'bg-stone-50/50 opacity-75'
                          : 'hover:bg-emerald-50/20'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-bold ${
                            isReversed ? 'line-through text-stone-500' : 'text-stone-900'
                          }`}
                        >
                          {s.saleNumber}
                        </span>
                        {s.isDemoData && (
                          <div className="mt-1">
                            <Badge variant="demo" size="sm">
                              {t.demoSaleRecord}
                            </Badge>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-stone-600">
                        {formatDate(s.dateTime, true)}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-stone-900">
                        {s.customerName || 'Walk-in Customer'}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-stone-600">
                        {s.totalQuantity} units ({s.items.length} item
                        {s.items.length > 1 ? 's' : ''})
                      </td>

                      <td className="py-3.5 px-4">
                        {paymentBadges[s.paymentMode || 'cash']}
                      </td>

                      <td className="py-3.5 px-4">
                        {isReversed ? (
                          <Badge variant="danger" size="sm">
                            {t.statusReversed}
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">
                            {t.statusCompleted}
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-black text-base ${
                            isReversed
                              ? 'line-through text-stone-400'
                              : 'text-emerald-850 text-stone-900'
                          }`}
                        >
                          {formatCurrency(s.totalAmount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSale(s)}
                            className="text-stone-600 hover:text-stone-900 text-xs px-2.5 h-8"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Details
                          </Button>

                          {!isReversed && onReverseSale && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSaleToReverse(s)}
                              className="text-xs px-2.5 h-8 text-rose-700 border-rose-300 hover:bg-rose-50"
                              title="Reverse transaction and restore inventory stock"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" />
                              Reverse
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2.5">
            {displayedSales.map((s) => {
              const isReversed = s.status === 'cancelled';

              return (
                <Card
                  key={s.id}
                  onClick={() => setSelectedSale(s)}
                  className={`p-3.5 shadow-2xs border-stone-200 cursor-pointer hover:border-emerald-300 transition-colors ${
                    isReversed ? 'bg-stone-50/70 opacity-80' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono font-bold text-xs ${
                        isReversed ? 'line-through text-stone-500' : 'text-stone-900'
                      }`}
                    >
                      {s.saleNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isReversed ? (
                        <Badge variant="danger" size="sm">
                          {t.statusReversed}
                        </Badge>
                      ) : (
                        paymentBadges[s.paymentMode || 'cash']
                      )}
                      {s.isDemoData && (
                        <Badge variant="demo" size="sm">
                          Demo
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-y border-stone-100 my-1">
                    <div className="text-stone-600">
                      <span className="font-medium text-stone-900 block">
                        {s.customerName || 'Walk-in'}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {formatDate(s.dateTime, true)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-base font-black block ${
                          isReversed
                            ? 'line-through text-stone-400'
                            : 'text-emerald-850 text-stone-900'
                        }`}
                      >
                        {formatCurrency(s.totalAmount)}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {s.totalQuantity} units ({s.items.length} line
                        {s.items.length > 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span className="truncate max-w-[200px]">
                      {s.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
                    </span>
                    <span className="text-emerald-850 font-bold shrink-0">View Details →</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Bill Details Modal */}
      {selectedSale && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSale(null)}
          title={`${t.saleDetailsTitle}: ${selectedSale.saleNumber}`}
          description={`Billed on ${formatDate(selectedSale.dateTime, true)}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <div>
                {selectedSale.status !== 'cancelled' && onReverseSale && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSaleToReverse(selectedSale);
                    }}
                    className="text-rose-700 border-rose-300 hover:bg-rose-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    {t.reverseSaleButton}
                  </Button>
                )}
              </div>
              <Button variant="secondary" onClick={() => setSelectedSale(null)}>
                {t.closeButton}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {selectedSale.status === 'cancelled' && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">
                    {t.reversedBadge}: Transaction Cancelled
                  </strong>
                  <span>{t.reversedNotice}</span>
                  {selectedSale.notes && (
                    <p className="mt-1 text-[11px] text-rose-800 font-mono">
                      Note: {selectedSale.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedSale.isDemoData && (
              <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-800 flex items-center justify-between">
                <span className="font-bold">⚠️ Demonstration Bill Record</span>
                <Badge variant="demo" size="sm">
                  Demo Data
                </Badge>
              </div>
            )}

            {/* Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 block uppercase font-bold text-[10px]">
                  {t.customerName}
                </span>
                <span className="font-bold text-stone-900 text-sm">
                  {selectedSale.customerName || 'Walk-in Customer'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block uppercase font-bold text-[10px]">
                  {t.paymentMode}
                </span>
                <span className="font-bold text-stone-900 text-sm capitalize">
                  {selectedSale.paymentMode || 'Cash'}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block uppercase font-bold text-[10px]">
                  Status
                </span>
                <span>
                  {selectedSale.status === 'cancelled' ? (
                    <Badge variant="danger" size="sm">
                      Reversed
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      Completed
                    </Badge>
                  )}
                </span>
              </div>
            </div>

            {/* Line items table */}
            <div className="rounded-xl border border-stone-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {selectedSale.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-stone-900">
                        {it.productName}
                      </td>
                      <td className="py-2.5 px-2 text-center text-stone-600">
                        {it.quantity} {it.unit}
                      </td>
                      <td className="py-2.5 px-2 text-right text-stone-600">
                        ₹{it.unitPrice}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                        {formatCurrency(it.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-50 font-bold border-t border-stone-200">
                  <tr>
                    <td colSpan={3} className="py-2.5 px-3 text-stone-800 text-right">
                      {t.saleTotal}:
                    </td>
                    <td className="py-2.5 px-3 text-right text-sm text-emerald-850 font-black">
                      {formatCurrency(selectedSale.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Reversal Confirmation Modal */}
      {saleToReverse && (
        <Modal
          isOpen={true}
          onClose={() => {
            if (!isReversing) {
              setSaleToReverse(null);
              setReversalError('');
            }
          }}
          title={t.reverseSaleConfirmTitle}
          description={t.reverseSaleConfirmDesc.replace(
            '{billNumber}',
            saleToReverse.saleNumber
          )}
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setSaleToReverse(null)}
                disabled={isReversing}
              >
                {t.cancelButton}
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmReversal}
                isLoading={isReversing}
                className="font-bold bg-rose-700 hover:bg-rose-800"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Confirm Reversal & Restore Stock
              </Button>
            </>
          }
        >
          <div className="space-y-3.5">
            {reversalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {reversalError}
              </div>
            )}

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">Inventory Restoration Summary:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {saleToReverse.items.map((it, idx) => (
                  <li key={idx}>
                    Restoring <strong>+{it.quantity} {it.unit}</strong> of{' '}
                    <span>{it.productName}</span> back to stock.
                  </li>
                ))}
              </ul>
              <p className="pt-1 text-[11px] text-amber-800">
                Compensating movement records will be inserted into IndexedDB audit log. The sale receipt is preserved with &lsquo;Cancelled&rsquo; status.
              </p>
            </div>

            <Input
              label={t.reverseSaleReasonLabel}
              placeholder="e.g. Customer returned items / Cashier entered wrong quantity"
              value={reversalReason}
              onChange={(e) => setReversalReason(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
