import { dbService } from './db';
import { BackupPayload, BackupSummary } from '@/types';
import { validateBackupPayload } from '@/lib/validation';

export * from './db';

/**
 * Trigger browser-native download of the complete dataset as 'data.json'
 */
export async function exportBackupToFile(): Promise<{ fileName: string; summary: BackupSummary }> {
  const payload = await dbService.exportAllData();
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const fileName = `dukaan-vikaas-backup-${dateStr}.json`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  const summary: BackupSummary = {
    shopName: payload.shopSettings.shopName,
    exportedAt: payload.exportedAt,
    schemaVersion: payload.schemaVersion,
    productCount: payload.products.length,
    saleCount: payload.sales.length,
    movementCount: payload.inventoryMovements.length,
    isDemoData: !!payload.meta?.isDemoData,
  };

  return { fileName, summary };
}

/**
 * Read and validate an uploaded backup file without applying it
 */
export async function inspectBackupFile(
  file: File
): Promise<{
  valid: boolean;
  errors: string[];
  summary?: BackupSummary;
  payload?: BackupPayload;
}> {
  try {
    const text = await file.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        valid: false,
        errors: ['The selected file is not a valid JSON document.'],
      };
    }

    const validation = validateBackupPayload(json);
    if (!validation.valid || !validation.data) {
      return {
        valid: false,
        errors: validation.errors,
      };
    }

    return {
      valid: true,
      errors: [],
      summary: validation.summary,
      payload: validation.data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown file reading error';
    return {
      valid: false,
      errors: [`Failed to read file: ${message}`],
    };
  }
}

/**
 * Apply a validated backup payload into IndexedDB
 */
export async function applyBackupPayload(payload: BackupPayload): Promise<void> {
  await dbService.importAllData(payload);
}
