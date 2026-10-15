'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  HardDrive,
  Store,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/lib/i18n';
import {
  exportBackupToFile,
  inspectBackupFile,
  applyBackupPayload,
} from '@/lib/storage';
import { ShopSettings, BackupSummary, BackupPayload, LanguageCode } from '@/types';
import { formatDate } from '@/lib/utils/formatters';

interface BackupRestoreManagerProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => Promise<void>;
  onReloadAllData: () => Promise<void>;
  onResetToDemo: () => Promise<void>;
}

export function BackupRestoreManager({
  settings,
  onUpdateSettings,
  onReloadAllData,
  onResetToDemo,
}: BackupRestoreManagerProps) {
  const { t, setLanguage } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shop Profile state
  const [shopName, setShopName] = useState(settings.shopName);
  const [ownerName, setOwnerName] = useState(settings.ownerName || '');
  const [currency, setCurrency] = useState(settings.currency || '₹');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(
    settings.preferredLanguage || 'hi'
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Backup & Import states
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Preview & Confirm Modal
  const [importPreview, setImportPreview] = useState<{
    summary: BackupSummary;
    payload: BackupPayload;
  } | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Reset demo dialog
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) return;

    try {
      setIsSavingSettings(true);
      const updated: ShopSettings = {
        ...settings,
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        currency: currency.trim() || '₹',
        preferredLanguage: preferredLang,
        updatedDate: new Date().toISOString(),
      };
      await onUpdateSettings(updated);
      setLanguage(preferredLang);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportNotice(null);
      const { fileName, summary } = await exportBackupToFile();
      setExportNotice(
        `Backup downloaded as "${fileName}" containing ${summary.productCount} products and ${summary.saleCount} sales.`
      );
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so user can pick same file again if needed
    e.target.value = '';

    setImportErrors([]);
    const res = await inspectBackupFile(file);

    if (!res.valid || !res.payload || !res.summary) {
      setImportErrors(res.errors);
      return;
    }

    setImportPreview({
      summary: res.summary,
      payload: res.payload,
    });
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    try {
      setIsImporting(true);
      await applyBackupPayload(importPreview.payload);
      setImportPreview(null);
      await onReloadAllData();
      alert('Data successfully restored from backup!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      setImportErrors([msg]);
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetConfirm = async () => {
    try {
      setIsResetting(true);
      await onResetToDemo();
      setShowResetConfirm(false);
      await onReloadAllData();
    } finally {
      setIsResetting(false);
    }
  };

  const languageOptions = [
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { value: 'hinglish', label: 'Hinglish (Easy Hindi)' },
    { value: 'en', label: 'English' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Offline Architecture & Privacy Limitations Card */}
      <Card className="border-stone-200 bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            <CardTitle className="text-stone-900 text-base sm:text-lg">
              {t.storageInfoTitle}
            </CardTitle>
          </div>
          <CardDescription className="text-stone-600 text-xs sm:text-sm">
            Important information about how your Kirana store data is preserved and protected on this device.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900">100% Local Browser Storage</p>
                <p className="text-stone-600 mt-0.5 leading-relaxed">
                  All inventory records, sales, and settings are stored locally in the current browser using IndexedDB. No external servers or cloud accounts exist.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900">No Multi-Device Synchronization</p>
                <p className="text-stone-600 mt-0.5 leading-relaxed">
                  Data is not automatically synchronized between devices, computers, or other browser apps. Each browser maintains its own independent store.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900">Clearing Cache May Erase Data</p>
                <p className="text-stone-600 mt-0.5 leading-relaxed">
                  Clearing your browser website cache, history data, or using incognito / private windows will erase application records permanently.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900">Export Regular Backups</p>
                <p className="text-stone-600 mt-0.5 leading-relaxed">
                  We strongly recommend exporting a JSON backup file regularly to ensure your sales history and inventory catalog remain completely safe.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
            <Info className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold">Downloadable File Notice:</strong> The JSON backup is a downloadable file (<code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">data.json</code>) triggered via standard browser download, not a continuously synchronized background filesystem database. IndexedDB is used for automatic persistence.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Shop Profile Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-700" />
            <CardTitle>{t.shopProfileTitle}</CardTitle>
          </div>
          <CardDescription>
            Personalize your store details and language
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            {settingsSuccess && (
              <Alert variant="success">{t.successMessage}</Alert>
            )}

            <Input
              label={t.shopNameLabel}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label={t.ownerNameLabel}
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />

              <Input
                label={t.currencyLabel}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
            </div>

            <Select
              label={t.languageSelectLabel}
              options={languageOptions}
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value as LanguageCode)}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSavingSettings}
            >
              {t.saveSettingsButton}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 3. JSON Backup & Restore Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
            <CardTitle>{t.backupSectionTitle}</CardTitle>
          </div>
          <CardDescription>{t.backupSectionDesc}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {exportNotice && (
            <Alert variant="success">{exportNotice}</Alert>
          )}

          {importErrors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <p className="font-bold">Backup File Validation Failed:</p>
              {importErrors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Export Button */}
            <Button
              onClick={handleExport}
              isLoading={isExporting}
              variant="primary"
              size="md"
              className="bg-emerald-800 hover:bg-emerald-900 shadow-xs font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              {t.exportBackupButton}
            </Button>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept=".json,application/json"
              className="hidden"
            />

            {/* Import Button */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              size="md"
              className="border-stone-300 bg-white hover:bg-stone-50 font-bold"
            >
              <Upload className="w-4 h-4 mr-2 text-stone-600" />
              {t.importBackupButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Reset to Demo Data Card */}
      <Card className="border-rose-200 bg-rose-50/20">
        <CardHeader>
          <div className="flex items-center gap-2 text-rose-800">
            <RotateCcw className="w-5 h-5" />
            <CardTitle className="text-rose-900">{t.resetDemoTitle}</CardTitle>
          </div>
          <CardDescription className="text-rose-700/80">
            {t.resetDemoDesc}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            variant="danger"
            size="md"
            onClick={() => setShowResetConfirm(true)}
            className="font-bold"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.resetDemoButton}
          </Button>
        </CardContent>
      </Card>

      {/* Import Preview & Confirm Modal */}
      {importPreview && (
        <Modal
          isOpen={true}
          onClose={() => setImportPreview(null)}
          title={t.importPreviewTitle}
          description="Please review the contents of the backup file before replacing your current records."
          maxWidth="lg"
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setImportPreview(null)}
                disabled={isImporting}
              >
                {t.cancelButton}
              </Button>
              <Button
                variant="danger"
                onClick={confirmImport}
                isLoading={isImporting}
              >
                {t.confirmImportButton}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Alert variant="warning">
              This action will completely replace all currently saved products, billing history, and settings in your browser with the contents of this file.
            </Alert>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500 font-medium">Backup Shop Name:</span>
                <span className="font-bold text-stone-900">
                  {importPreview.summary.shopName}
                </span>
              </div>

              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500 font-medium">Export Date:</span>
                <span className="font-medium text-stone-900">
                  {formatDate(importPreview.summary.exportedAt, true)}
                </span>
              </div>

              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500 font-medium">Schema Version:</span>
                <span className="font-mono font-bold text-stone-900">
                  v{importPreview.summary.schemaVersion}
                </span>
              </div>

              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500 font-medium">Products in Backup:</span>
                <span className="font-bold text-stone-900">
                  {importPreview.summary.productCount} items
                </span>
              </div>

              <div className="flex justify-between border-b border-stone-200/60 pb-2">
                <span className="text-stone-500 font-medium">Sales Records:</span>
                <span className="font-bold text-stone-900">
                  {importPreview.summary.saleCount} transactions
                </span>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-stone-500 font-medium">Dataset Type:</span>
                <span>
                  {importPreview.summary.isDemoData ? (
                    <Badge variant="demo" size="sm">
                      Demo Data
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      Real Shop Data
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setShowResetConfirm(false)}
          title="Reset to Kirana Demonstration Data?"
          description="Are you sure you want to clear your current records?"
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
              >
                {t.cancelButton}
              </Button>
              <Button
                variant="danger"
                onClick={handleResetConfirm}
                isLoading={isResetting}
              >
                {t.confirmResetButton}
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <Alert variant="danger">
              All your custom products and sales recorded on this browser will be replaced with the 10 initial demonstration products and sample bills.
            </Alert>
            <p className="text-xs text-stone-600">
              Tip: You can download an offline backup file before resetting if you want to keep your current records!
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
