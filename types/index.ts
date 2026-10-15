export type LanguageCode = 'en' | 'hi' | 'gu' | 'hinglish';

export type ProductCategory =
  | 'groceries'
  | 'dairy'
  | 'snacks'
  | 'beverages'
  | 'spices'
  | 'staples'
  | 'personal_care'
  | 'household'
  | 'other';

export type ProductUnit =
  | 'packet'
  | 'piece'
  | 'kg'
  | 'gm'
  | 'liter'
  | 'ml'
  | 'bottle'
  | 'box';

export type SaleInputMethod = 'quick_sale' | 'barcode' | 'manual_entry' | 'voice';

export type SaleStatus = 'completed' | 'cancelled' | 'refunded';

export type PaymentMode = 'cash' | 'upi' | 'credit';

export type InventoryMovementReason =
  | 'sale'
  | 'restock'
  | 'adjustment'
  | 'damage'
  | 'initial_stock'
  | 'return';

export interface ShopSettings {
  id: string;
  shopName: string;
  ownerName: string;
  preferredLanguage: LanguageCode;
  currency: string;
  createdDate: string;
  updatedDate: string;
  isDemoData?: boolean;
}

export interface Product {
  id: string;
  name: string;
  altNames: string[]; // e.g. ["मैगी", "पारले जी", "Maggie"]
  category: ProductCategory;
  unit: ProductUnit;
  sellingPrice: number;
  purchasePrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
  isDemoData?: boolean;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  unit: ProductUnit;
}

export interface Sale {
  id: string;
  saleNumber: string;
  dateTime: string; // ISO 8601 string
  items: SaleItem[];
  totalQuantity: number;
  totalAmount: number;
  inputMethod: SaleInputMethod;
  status: SaleStatus;
  paymentMode?: PaymentMode;
  customerName?: string;
  notes?: string;
  isDemoData?: boolean;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  quantityChange: number; // positive for additions, negative for deductions
  movementReason: InventoryMovementReason;
  associatedSaleId?: string;
  notes?: string;
  timestamp: string; // ISO 8601 string
  isDemoData?: boolean;
}

export interface DatabaseSchemaMeta {
  key: string; // e.g., "schema_version"
  schemaVersion: number;
  updatedAt: string;
  appName: string;
}

export interface BackupPayload {
  schemaVersion: number;
  exportedAt: string;
  appIdentifier: 'DukaanVikaas';
  shopSettings: ShopSettings;
  products: Product[];
  sales: Sale[];
  inventoryMovements: InventoryMovement[];
  meta?: {
    isDemoData: boolean;
    totalProducts: number;
    totalSales: number;
    totalMovements: number;
  };
}

export interface BackupSummary {
  shopName: string;
  exportedAt: string;
  schemaVersion: number;
  productCount: number;
  saleCount: number;
  movementCount: number;
  isDemoData: boolean;
}

export type ViewTab = 'dashboard' | 'inventory' | 'low-stock' | 'sales' | 'settings';

export interface ParsedTransactionItem {
  rawText: string;
  rawProductName: string;
  quantity: number;
  unit?: ProductUnit;
  matchedProduct?: Product;
  candidateProducts?: Product[];
  status: 'matched' | 'ambiguous' | 'unrecognized';
  warning?: string;
}

export interface SimulatedAiParseResult {
  action: 'record_sale';
  rawInput: string;
  items: ParsedTransactionItem[];
  clarificationStatus: 'ready' | 'needs_clarification' | 'unrecognized';
  explanation: string;
  confidence: number;
}

