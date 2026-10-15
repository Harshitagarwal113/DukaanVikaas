import {
  Product,
  ShopSettings,
  Sale,
  InventoryMovement,
  BackupPayload,
} from '@/types';
import {
  DEMO_SHOP_SETTINGS,
  DEMO_PRODUCTS,
  DEMO_SALES,
  DEMO_INVENTORY_MOVEMENTS,
  CURRENT_SCHEMA_VERSION,
} from '@/lib/data/sampleData';
import { generateId } from '@/lib/utils/id';

const DB_NAME = 'dukaan_vikaas_db';
const DB_VERSION = 1;

const STORES = {
  SETTINGS: 'settings',
  PRODUCTS: 'products',
  SALES: 'sales',
  MOVEMENTS: 'inventoryMovements',
  METADATA: 'metadata',
} as const;

class StorageService {
  private db: IDBDatabase | null = null;
  private isConnecting: Promise<IDBDatabase> | null = null;

  /**
   * Safe access to IndexedDB database instance
   */
  public async getDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    if (this.isConnecting) {
      return this.isConnecting;
    }

    this.isConnecting = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported or not running in a browser environment.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Settings Store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
        }

        // Products Store
        if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
          const productStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
          productStore.createIndex('category', 'category', { unique: false });
          productStore.createIndex('name', 'name', { unique: false });
          productStore.createIndex('stockQuantity', 'stockQuantity', { unique: false });
          productStore.createIndex('isActive', 'isActive', { unique: false });
        }

        // Sales Store
        if (!db.objectStoreNames.contains(STORES.SALES)) {
          const salesStore = db.createObjectStore(STORES.SALES, { keyPath: 'id' });
          salesStore.createIndex('dateTime', 'dateTime', { unique: false });
          salesStore.createIndex('status', 'status', { unique: false });
          salesStore.createIndex('saleNumber', 'saleNumber', { unique: false });
        }

        // Inventory Movements Store
        if (!db.objectStoreNames.contains(STORES.MOVEMENTS)) {
          const movStore = db.createObjectStore(STORES.MOVEMENTS, { keyPath: 'id' });
          movStore.createIndex('productId', 'productId', { unique: false });
          movStore.createIndex('timestamp', 'timestamp', { unique: false });
          movStore.createIndex('associatedSaleId', 'associatedSaleId', { unique: false });
        }

        // Metadata Store
        if (!db.objectStoreNames.contains(STORES.METADATA)) {
          db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;

        this.db.onversionchange = () => {
          this.db?.close();
          this.db = null;
        };

        resolve(this.db);
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        reject(error || new Error('Failed to open IndexedDB database.'));
      };
    });

    try {
      const db = await this.isConnecting;
      return db;
    } finally {
      this.isConnecting = null;
    }
  }

  /**
   * Initializes the database on first run. If empty, seeds initial demo data.
   */
  public async initDatabase(): Promise<void> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.SETTINGS, STORES.PRODUCTS, STORES.METADATA], 'readwrite');
      const settingsStore = tx.objectStore(STORES.SETTINGS);
      const metaStore = tx.objectStore(STORES.METADATA);

      const checkReq = settingsStore.get(DEMO_SHOP_SETTINGS.id);

      checkReq.onsuccess = () => {
        if (!checkReq.result) {
          // Empty DB, seed initial demo data
          const productStore = tx.objectStore(STORES.PRODUCTS);

          settingsStore.put(DEMO_SHOP_SETTINGS);
          for (const prod of DEMO_PRODUCTS) {
            productStore.put(prod);
          }

          metaStore.put({
            key: 'schema_version',
            schemaVersion: CURRENT_SCHEMA_VERSION,
            initializedAt: new Date().toISOString(),
            isDemoData: true,
          });

          // Seed demo sales and movements
          const salesStore = db.transaction([STORES.SALES, STORES.MOVEMENTS], 'readwrite');
          const sStore = salesStore.objectStore(STORES.SALES);
          const mStore = salesStore.objectStore(STORES.MOVEMENTS);

          for (const sale of DEMO_SALES) {
            sStore.put(sale);
          }
          for (const mov of DEMO_INVENTORY_MOVEMENTS) {
            mStore.put(mov);
          }
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Get current shop settings
   */
  public async getSettings(): Promise<ShopSettings> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readonly');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.getAll();

      req.onsuccess = () => {
        if (req.result && req.result.length > 0) {
          resolve(req.result[0]);
        } else {
          resolve(DEMO_SHOP_SETTINGS);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Update shop settings
   */
  public async saveSettings(settings: ShopSettings): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readwrite');
      const store = tx.objectStore(STORES.SETTINGS);
      const req = store.put({
        ...settings,
        updatedDate: new Date().toISOString(),
      });

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Get all products
   */
  public async getProducts(): Promise<Product[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PRODUCTS, 'readonly');
      const store = tx.objectStore(STORES.PRODUCTS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Get a single product by ID
   */
  public async getProduct(id: string): Promise<Product | undefined> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PRODUCTS, 'readonly');
      const store = tx.objectStore(STORES.PRODUCTS);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Save or update a product
   */
  public async saveProduct(product: Product): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PRODUCTS, 'readwrite');
      const store = tx.objectStore(STORES.PRODUCTS);
      const req = store.put({
        ...product,
        updatedDate: new Date().toISOString(),
      });

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Delete a product
   */
  public async deleteProduct(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PRODUCTS, 'readwrite');
      const store = tx.objectStore(STORES.PRODUCTS);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Get low stock products (stockQuantity <= lowStockThreshold)
   */
  public async getLowStockProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.isActive && p.stockQuantity <= p.lowStockThreshold);
  }

  /**
   * Get all sales records
   */
  public async getSales(): Promise<Sale[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SALES, 'readonly');
      const store = tx.objectStore(STORES.SALES);
      const req = store.getAll();

      req.onsuccess = () => {
        // Return sorted by date descending (newest first)
        const sorted = (req.result || []).sort(
          (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        resolve(sorted);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Atomic recording of a sale:
   * 1. Validates every item and verifies sufficient stock exists (prevents negative inventory)
   * 2. Recalculates prices from stored product records to prevent tampering
   * 3. Saves sale to 'sales' store
   * 4. Decrements stock for each item in 'products' store
   * 5. Creates inventory deduction entries in 'inventoryMovements' store
   */
  public async recordSale(sale: Sale, autoUpdateStock = true): Promise<Sale> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.SALES, STORES.PRODUCTS, STORES.MOVEMENTS], 'readwrite');
      const salesStore = tx.objectStore(STORES.SALES);
      const productsStore = tx.objectStore(STORES.PRODUCTS);
      const movementsStore = tx.objectStore(STORES.MOVEMENTS);

      let completedSaleRecord: Sale = { ...sale };

      if (!sale.items || sale.items.length === 0) {
        tx.abort();
        reject(new Error('Cannot record sale with empty items.'));
        return;
      }

      // First retrieve all products to check stock and retrieve true stored prices
      let pendingChecks = sale.items.length;
      const verifiedItems: typeof sale.items = [];
      let totalAmount = 0;
      let totalQuantity = 0;

      for (let i = 0; i < sale.items.length; i++) {
        const item = sale.items[i];
        const req = productsStore.get(item.productId);

        req.onsuccess = () => {
          const product = req.result as Product | undefined;
          if (!product) {
            tx.abort();
            reject(new Error(`Product not found in database: ${item.productName || item.productId}`));
            return;
          }

          if (autoUpdateStock && product.stockQuantity < item.quantity) {
            tx.abort();
            reject(
              new Error(
                `Insufficient stock for "${product.name}". Available: ${product.stockQuantity} ${product.unit}, requested: ${item.quantity}.`
              )
            );
            return;
          }

          // Use stored product price for safety
          const unitPrice = product.sellingPrice;
          const subtotal = item.quantity * unitPrice;
          totalAmount += subtotal;
          totalQuantity += item.quantity;

          verifiedItems.push({
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            unitPrice,
            subtotal,
            unit: product.unit,
          });

          if (autoUpdateStock) {
            // Decrement stock
            const newQuantity = product.stockQuantity - item.quantity;
            productsStore.put({
              ...product,
              stockQuantity: newQuantity,
              updatedDate: new Date().toISOString(),
            });

            // Record movement
            const movement: InventoryMovement = {
              id: generateId('mov'),
              productId: product.id,
              productName: product.name,
              quantityChange: -item.quantity,
              movementReason: 'sale',
              associatedSaleId: sale.id,
              notes: `Billed on ${sale.saleNumber}`,
              timestamp: sale.dateTime,
              isDemoData: sale.isDemoData,
            };
            movementsStore.put(movement);
          }

          pendingChecks--;
          if (pendingChecks === 0) {
            completedSaleRecord = {
              ...sale,
              items: verifiedItems,
              totalAmount,
              totalQuantity,
            };
            salesStore.put(completedSaleRecord);
          }
        };

        req.onerror = () => {
          tx.abort();
          reject(req.error || new Error('Failed to read product for stock check.'));
        };
      }

      tx.oncomplete = () => resolve(completedSaleRecord);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error('Transaction aborted during sale processing.'));
    });
  }

  /**
   * Reverse an existing sale:
   * 1. Marks sale status as 'cancelled'
   * 2. Restores inventory quantity in 'products' store
   * 3. Creates compensating return entries in 'inventoryMovements' store
   * Does NOT silently delete the sale; preserves audit trail.
   */
  public async reverseSale(saleId: string, reason?: string): Promise<void> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.SALES, STORES.PRODUCTS, STORES.MOVEMENTS], 'readwrite');
      const salesStore = tx.objectStore(STORES.SALES);
      const productsStore = tx.objectStore(STORES.PRODUCTS);
      const movementsStore = tx.objectStore(STORES.MOVEMENTS);

      const saleReq = salesStore.get(saleId);

      saleReq.onsuccess = () => {
        const sale = saleReq.result as Sale | undefined;
        if (!sale) {
          tx.abort();
          reject(new Error(`Transaction #${saleId} not found.`));
          return;
        }

        if (sale.status === 'cancelled') {
          tx.abort();
          reject(new Error(`Transaction #${sale.saleNumber} has already been reversed/cancelled.`));
          return;
        }

        // Mark as cancelled
        const updatedSale: Sale = {
          ...sale,
          status: 'cancelled',
          notes: reason ? `${sale.notes || ''} [Reversed: ${reason}]`.trim() : sale.notes,
        };
        salesStore.put(updatedSale);

        // Restore stock and record compensating movements
        for (const item of sale.items) {
          const prodReq = productsStore.get(item.productId);
          prodReq.onsuccess = () => {
            const product = prodReq.result as Product | undefined;
            if (product) {
              const restoredStock = product.stockQuantity + item.quantity;
              productsStore.put({
                ...product,
                stockQuantity: restoredStock,
                updatedDate: new Date().toISOString(),
              });

              // Add compensating inventory movement
              const movement: InventoryMovement = {
                id: generateId('mov'),
                productId: product.id,
                productName: product.name,
                quantityChange: item.quantity,
                movementReason: 'return',
                associatedSaleId: sale.id,
                notes: reason || `Reversal of bill #${sale.saleNumber}`,
                timestamp: new Date().toISOString(),
                isDemoData: sale.isDemoData,
              };
              movementsStore.put(movement);
            }
          };
        }
      };

      saleReq.onerror = () => {
        tx.abort();
        reject(saleReq.error || new Error('Failed to find transaction for reversal.'));
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error('Transaction aborted during sale reversal.'));
    });
  }

  /**
   * Get all inventory movements
   */
  public async getInventoryMovements(): Promise<InventoryMovement[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.MOVEMENTS, 'readonly');
      const store = tx.objectStore(STORES.MOVEMENTS);
      const req = store.getAll();

      req.onsuccess = () => {
        const sorted = (req.result || []).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        resolve(sorted);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Record a manual inventory movement (e.g. restock, damage, adjustment)
   */
  public async recordMovement(
    movement: InventoryMovement,
    updateProductStock = true
  ): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.MOVEMENTS, STORES.PRODUCTS], 'readwrite');
      const movStore = tx.objectStore(STORES.MOVEMENTS);
      const prodStore = tx.objectStore(STORES.PRODUCTS);

      movStore.put(movement);

      if (updateProductStock) {
        const prodReq = prodStore.get(movement.productId);
        prodReq.onsuccess = () => {
          const product = prodReq.result as Product | undefined;
          if (product) {
            const updatedStock = Math.max(0, product.stockQuantity + movement.quantityChange);
            prodStore.put({
              ...product,
              stockQuantity: updatedStock,
              updatedDate: new Date().toISOString(),
            });
          }
        };
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Reset the entire database to the initial realistic demo data
   */
  public async resetToDemoData(): Promise<void> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        [STORES.SETTINGS, STORES.PRODUCTS, STORES.SALES, STORES.MOVEMENTS, STORES.METADATA],
        'readwrite'
      );

      // Clear all stores
      tx.objectStore(STORES.SETTINGS).clear();
      tx.objectStore(STORES.PRODUCTS).clear();
      tx.objectStore(STORES.SALES).clear();
      tx.objectStore(STORES.MOVEMENTS).clear();
      tx.objectStore(STORES.METADATA).clear();

      // Repopulate with demo data
      const settingsStore = tx.objectStore(STORES.SETTINGS);
      const productsStore = tx.objectStore(STORES.PRODUCTS);
      const salesStore = tx.objectStore(STORES.SALES);
      const movementsStore = tx.objectStore(STORES.MOVEMENTS);
      const metaStore = tx.objectStore(STORES.METADATA);

      settingsStore.put(DEMO_SHOP_SETTINGS);

      for (const prod of DEMO_PRODUCTS) {
        productsStore.put(prod);
      }
      for (const sale of DEMO_SALES) {
        salesStore.put(sale);
      }
      for (const mov of DEMO_INVENTORY_MOVEMENTS) {
        movementsStore.put(mov);
      }

      metaStore.put({
        key: 'schema_version',
        schemaVersion: CURRENT_SCHEMA_VERSION,
        resetAt: new Date().toISOString(),
        isDemoData: true,
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Export all data to a structured, versioned BackupPayload
   */
  public async exportAllData(): Promise<BackupPayload> {
    const settings = await this.getSettings();
    const products = await this.getProducts();
    const sales = await this.getSales();
    const inventoryMovements = await this.getInventoryMovements();

    const isDemo =
      Boolean(settings.isDemoData) ||
      products.some((p) => p.isDemoData) ||
      sales.some((s) => s.isDemoData);

    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appIdentifier: 'DukaanVikaas',
      shopSettings: settings,
      products,
      sales,
      inventoryMovements,
      meta: {
        isDemoData: isDemo,
        totalProducts: products.length,
        totalSales: sales.length,
        totalMovements: inventoryMovements.length,
      },
    };
  }

  /**
   * Atomically replace current database data with an imported BackupPayload
   */
  public async importAllData(payload: BackupPayload): Promise<void> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        [STORES.SETTINGS, STORES.PRODUCTS, STORES.SALES, STORES.MOVEMENTS, STORES.METADATA],
        'readwrite'
      );

      // Clear old data
      tx.objectStore(STORES.SETTINGS).clear();
      tx.objectStore(STORES.PRODUCTS).clear();
      tx.objectStore(STORES.SALES).clear();
      tx.objectStore(STORES.MOVEMENTS).clear();

      // Put new settings
      const settingsStore = tx.objectStore(STORES.SETTINGS);
      settingsStore.put(payload.shopSettings);

      // Put new products
      const productsStore = tx.objectStore(STORES.PRODUCTS);
      for (const prod of payload.products) {
        productsStore.put(prod);
      }

      // Put new sales
      const salesStore = tx.objectStore(STORES.SALES);
      for (const sale of payload.sales) {
        salesStore.put(sale);
      }

      // Put new inventory movements
      const movementsStore = tx.objectStore(STORES.MOVEMENTS);
      for (const mov of payload.inventoryMovements) {
        movementsStore.put(mov);
      }

      // Update metadata
      const metaStore = tx.objectStore(STORES.METADATA);
      metaStore.put({
        key: 'schema_version',
        schemaVersion: payload.schemaVersion,
        importedAt: new Date().toISOString(),
        originalExportAt: payload.exportedAt,
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error('Transaction aborted during import.'));
    });
  }
}

export const dbService = new StorageService();
