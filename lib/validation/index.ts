import {
  BackupPayload,
  BackupSummary,
  Product,
  Sale,
  ShopSettings,
  ProductCategory,
  ProductUnit,
} from '@/types';
import { CURRENT_SCHEMA_VERSION } from '@/lib/data/sampleData';

export const VALID_CATEGORIES: ProductCategory[] = [
  'groceries',
  'dairy',
  'snacks',
  'beverages',
  'spices',
  'staples',
  'personal_care',
  'household',
  'other',
];

export const VALID_UNITS: ProductUnit[] = [
  'packet',
  'piece',
  'kg',
  'gm',
  'liter',
  'ml',
  'bottle',
  'box',
];

export const VALID_LANGUAGES = ['en', 'hi', 'gu', 'hinglish'] as const;

export interface ValidationResult<T> {
  valid: boolean;
  errors: string[];
  data?: T;
  summary?: BackupSummary;
}

/**
 * Validate backup JSON file payload before allowing import into IndexedDB.
 */
export function validateBackupPayload(
  payload: unknown
): ValidationResult<BackupPayload> {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      valid: false,
      errors: ['Invalid backup file: Root data must be a JSON object.'],
    };
  }

  const raw = payload as Record<string, unknown>;

  // Check Application Identifier
  if (raw.appIdentifier !== 'DukaanVikaas') {
    errors.push(
      'Invalid app identifier: This backup was not created by DukaanVikaas or is unrecognized.'
    );
  }

  // Check Schema Version
  if (
    typeof raw.schemaVersion !== 'number' ||
    raw.schemaVersion < 1 ||
    !Number.isInteger(raw.schemaVersion)
  ) {
    errors.push('Missing or invalid schemaVersion (must be an integer >= 1).');
  } else if (raw.schemaVersion > CURRENT_SCHEMA_VERSION) {
    errors.push(
      `Unsupported schema version v${raw.schemaVersion}: This backup was created by a newer version of DukaanVikaas (current version is v${CURRENT_SCHEMA_VERSION}).`
    );
  }

  // Check Shop Settings
  if (!raw.shopSettings || typeof raw.shopSettings !== 'object') {
    errors.push('Missing shopSettings object.');
  } else {
    const s = raw.shopSettings as Record<string, unknown>;
    if (!s.shopName || typeof s.shopName !== 'string' || !s.shopName.trim()) {
      errors.push('shopSettings must contain a valid shopName.');
    }
  }

  // Check Products Array & Duplicate Product IDs
  const seenProductIds = new Set<string>();
  if (!Array.isArray(raw.products)) {
    errors.push('products must be an array.');
  } else {
    raw.products.forEach((p, idx) => {
      if (!p || typeof p !== 'object') {
        errors.push(`Product at index ${idx} is not a valid object.`);
        return;
      }
      const prod = p as Record<string, unknown>;
      if (!prod.id || typeof prod.id !== 'string') {
        errors.push(`Product at index ${idx} is missing an id.`);
      } else if (seenProductIds.has(prod.id)) {
        errors.push(`Duplicate product ID "${prod.id}" detected at index ${idx}.`);
      } else {
        seenProductIds.add(prod.id);
      }

      if (!prod.name || typeof prod.name !== 'string' || !prod.name.trim()) {
        errors.push(`Product at index ${idx} is missing a name.`);
      }
      if (typeof prod.sellingPrice !== 'number' || isNaN(prod.sellingPrice) || prod.sellingPrice < 0) {
        errors.push(`Product "${prod.name || idx}" has an invalid sellingPrice (cannot be negative).`);
      }
      if (typeof prod.stockQuantity !== 'number' || isNaN(prod.stockQuantity) || prod.stockQuantity < 0) {
        errors.push(`Product "${prod.name || idx}" has an invalid stockQuantity (cannot be negative).`);
      }
    });
  }

  // Check Sales Array & Duplicate Sale IDs & Line Items
  const seenSaleIds = new Set<string>();
  if (!Array.isArray(raw.sales)) {
    errors.push('sales must be an array.');
  } else {
    raw.sales.forEach((s, idx) => {
      if (!s || typeof s !== 'object') {
        errors.push(`Sale record at index ${idx} is not an object.`);
        return;
      }
      const sale = s as Record<string, unknown>;
      if (!sale.id || typeof sale.id !== 'string') {
        errors.push(`Sale at index ${idx} is missing an id.`);
      } else if (seenSaleIds.has(sale.id)) {
        errors.push(`Duplicate sale ID "${sale.id}" detected at index ${idx}.`);
      } else {
        seenSaleIds.add(sale.id);
      }

      if (typeof sale.totalAmount !== 'number' || isNaN(sale.totalAmount) || sale.totalAmount < 0) {
        errors.push(`Sale at index ${idx} has an invalid totalAmount.`);
      }
      if (!Array.isArray(sale.items)) {
        errors.push(`Sale at index ${idx} is missing items array.`);
      } else {
        sale.items.forEach((item, itemIdx) => {
          if (!item || typeof item !== 'object') {
            errors.push(`Sale at index ${idx} has invalid item at line ${itemIdx + 1}.`);
            return;
          }
          const itemObj = item as Record<string, unknown>;
          if (!itemObj.productId) {
            errors.push(`Sale at index ${idx}, line ${itemIdx + 1} has no productId.`);
          }
          if (typeof itemObj.quantity !== 'number' || itemObj.quantity <= 0) {
            errors.push(`Sale at index ${idx}, line ${itemIdx + 1} has invalid quantity (must be > 0).`);
          }
          if (typeof itemObj.unitPrice !== 'number' || itemObj.unitPrice < 0) {
            errors.push(`Sale at index ${idx}, line ${itemIdx + 1} has invalid unitPrice (cannot be negative).`);
          }
        });
      }
    });
  }

  // Check Inventory Movements Array & Duplicate Movement IDs
  const seenMovementIds = new Set<string>();
  if (!Array.isArray(raw.inventoryMovements)) {
    errors.push('inventoryMovements must be an array.');
  } else {
    raw.inventoryMovements.forEach((m, idx) => {
      if (!m || typeof m !== 'object') {
        errors.push(`Inventory movement at index ${idx} is not an object.`);
        return;
      }
      const mov = m as Record<string, unknown>;
      if (!mov.id || typeof mov.id !== 'string') {
        errors.push(`Inventory movement at index ${idx} is missing an id.`);
      } else if (seenMovementIds.has(mov.id)) {
        errors.push(`Duplicate movement ID "${mov.id}" detected at index ${idx}.`);
      } else {
        seenMovementIds.add(mov.id);
      }
      if (!mov.productId || typeof mov.productId !== 'string') {
        errors.push(`Inventory movement at index ${idx} is missing productId.`);
      }
      if (typeof mov.quantityChange !== 'number' || isNaN(mov.quantityChange)) {
        errors.push(`Inventory movement at index ${idx} has invalid quantityChange.`);
      }
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  const typedPayload = payload as BackupPayload;
  const summary: BackupSummary = {
    shopName: typedPayload.shopSettings?.shopName || 'Unknown Shop',
    exportedAt: typedPayload.exportedAt || new Date().toISOString(),
    schemaVersion: typedPayload.schemaVersion,
    productCount: typedPayload.products.length,
    saleCount: typedPayload.sales.length,
    movementCount: typedPayload.inventoryMovements.length,
    isDemoData: !!(
      typedPayload.shopSettings.isDemoData ||
      typedPayload.products.some((p) => p.isDemoData)
    ),
  };

  return {
    valid: true,
    errors: [],
    data: typedPayload,
    summary,
  };
}

/**
 * Validate a product before saving to storage
 */
export function validateProduct(
  product: Partial<Product>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!product.name || !product.name.trim()) {
    errors.push('Product name is required.');
  }

  if (
    product.sellingPrice === undefined ||
    isNaN(product.sellingPrice) ||
    product.sellingPrice < 0
  ) {
    errors.push('Selling price must be a non-negative number.');
  }

  if (
    product.stockQuantity === undefined ||
    isNaN(product.stockQuantity) ||
    product.stockQuantity < 0
  ) {
    errors.push('Stock quantity must be a non-negative number.');
  }

  if (
    product.lowStockThreshold === undefined ||
    isNaN(product.lowStockThreshold) ||
    product.lowStockThreshold < 0
  ) {
    errors.push('Low stock threshold must be 0 or higher.');
  }

  if (product.category && !VALID_CATEGORIES.includes(product.category)) {
    errors.push(`Category "${product.category}" is invalid.`);
  }

  if (product.unit && !VALID_UNITS.includes(product.unit)) {
    errors.push(`Unit "${product.unit}" is invalid.`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a sale record
 */
export function validateSale(
  sale: Partial<Sale>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!sale.items || sale.items.length === 0) {
    errors.push('Sale must include at least one item.');
  } else {
    sale.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1} has no product selected.`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item "${item.productName || index + 1}" quantity must be greater than 0.`);
      }
      if (item.unitPrice === undefined || item.unitPrice < 0) {
        errors.push(`Item "${item.productName || index + 1}" unit price cannot be negative.`);
      }
    });
  }

  if (sale.totalAmount === undefined || isNaN(sale.totalAmount) || sale.totalAmount < 0) {
    errors.push('Sale total amount must be a valid number.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate shop settings
 */
export function validateShopSettings(
  settings: Partial<ShopSettings>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!settings.shopName || !settings.shopName.trim()) {
    errors.push('Shop name cannot be empty.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
