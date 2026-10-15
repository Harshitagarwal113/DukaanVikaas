'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DailySummaryCards } from '@/components/dashboard/DailySummaryCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { LowStockBanner } from '@/components/dashboard/LowStockBanner';
import { BestSellingProducts } from '@/components/dashboard/BestSellingProducts';
import { ProductList } from '@/components/inventory/ProductList';
import { LowStockManagementView } from '@/components/inventory/LowStockManagementView';
import { ProductModal } from '@/components/inventory/ProductModal';
import { RestockModal } from '@/components/inventory/RestockModal';
import { RecentSalesList } from '@/components/sales/RecentSalesList';
import { SaleModal } from '@/components/sales/SaleModal';
import { SimulatedAiModal } from '@/components/sales/SimulatedAiModal';
import { BackupRestoreManager } from '@/components/settings/BackupRestoreManager';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { dbService } from '@/lib/storage';
import { useLanguage, LANGUAGE_STORAGE_KEY } from '@/lib/i18n';
import {
  Product,
  Sale,
  ShopSettings,
  ViewTab,
  InventoryMovement,
  LanguageCode,
} from '@/types';
import { DEMO_SHOP_SETTINGS } from '@/lib/data/sampleData';

export default function DukaanVikaasApp() {
  const { setLanguage } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [settings, setSettings] = useState<ShopSettings>(DEMO_SHOP_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isSimulatedAiModalOpen, setIsSimulatedAiModalOpen] = useState(false);

  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [productToRestock, setProductToRestock] = useState<Product | null>(null);

  // Load all records from IndexedDB
  const reloadData = async () => {
    try {
      setLoadError(null);
      await dbService.initDatabase();

      const [storedSettings, storedProducts, storedSales] = await Promise.all([
        dbService.getSettings(),
        dbService.getProducts(),
        dbService.getSales(),
      ]);

      setSettings(storedSettings);
      setProducts(storedProducts);
      setSales(storedSales);
    } catch (err: unknown) {
      console.error('Failed to load database:', err);
      const msg = err instanceof Error ? err.message : 'Database error';
      setLoadError(`Unable to load offline browser database: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        await dbService.initDatabase();
        const [storedSettings, storedProducts, storedSales] = await Promise.all([
          dbService.getSettings(),
          dbService.getProducts(),
          dbService.getSales(),
        ]);

        if (isMounted) {
          setSettings(storedSettings);
          setProducts(storedProducts);
          setSales(storedSales);
          // Only adopt storedSettings.preferredLanguage if user hasn't explicitly set a language preference
          const savedLang =
            typeof window !== 'undefined'
              ? (localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null)
              : null;
          if (!savedLang && storedSettings.preferredLanguage) {
            setLanguage(storedSettings.preferredLanguage);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Database error';
          setLoadError(`Unable to load offline browser database: ${msg}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [setLanguage]);

  // Handle Product Save (Add or Update)
  const handleSaveProduct = async (product: Product) => {
    await dbService.saveProduct(product);
    await reloadData();
  };

  // Handle Product Delete
  const handleDeleteProduct = async (productId: string) => {
    await dbService.deleteProduct(productId);
    await reloadData();
  };

  // Handle Record Sale
  const handleRecordSale = async (sale: Sale) => {
    await dbService.recordSale(sale, true);
    await reloadData();
  };

  // Handle Reversal of a Sale
  const handleReverseSale = async (saleId: string, reason?: string) => {
    await dbService.reverseSale(saleId, reason);
    await reloadData();
  };

  // Handle Restock
  const handleConfirmRestock = async (movement: InventoryMovement) => {
    await dbService.recordMovement(movement, true);
    await reloadData();
  };

  // Handle Settings Update
  const handleUpdateSettings = async (newSettings: ShopSettings) => {
    await dbService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Handle Reset to Demo Data
  const handleResetToDemo = async () => {
    await dbService.resetToDemoData();
    await reloadData();
  };

  // Derived low stock items
  const lowStockProducts = products.filter(
    (p) => p.isActive && p.stockQuantity <= p.lowStockThreshold
  );

  const isDemo =
    Boolean(settings.isDemoData) ||
    products.some((p) => p.isDemoData) ||
    sales.some((s) => s.isDemoData);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <LoadingSpinner message="Opening DukaanVikaas offline database..." />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="danger" title="Storage Error">
            {loadError}
          </Alert>
          <Button onClick={reloadData} variant="primary" className="w-full">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      settings={settings}
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      lowStockCount={lowStockProducts.length}
      isDemoData={isDemo}
    >
      {/* Tab 1: Dashboard View */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Daily metrics cards */}
          <DailySummaryCards
            sales={sales}
            products={products}
            lowStockProducts={lowStockProducts}
            onNavigateToLowStock={() => setCurrentTab('low-stock')}
          />

          {/* Quick action buttons */}
          <QuickActions
            onNewSale={() => setIsSaleModalOpen(true)}
            onSimulatedAi={() => setIsSimulatedAiModalOpen(true)}
            onAddProduct={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            onViewLowStock={() => setCurrentTab('low-stock')}
            lowStockCount={lowStockProducts.length}
          />

          {/* Low Stock Warning Banner */}
          <LowStockBanner
            lowStockProducts={lowStockProducts}
            onViewAllInventory={() => setCurrentTab('low-stock')}
            onRestockProduct={(prod) => {
              setProductToRestock(prod);
              setIsRestockModalOpen(true);
            }}
          />

          {/* 2-Column Section: Best Sellers & Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <BestSellingProducts sales={sales} products={products} limit={5} />

            <RecentSalesList
              sales={sales}
              limit={5}
              onNewSale={() => setIsSaleModalOpen(true)}
              onReverseSale={handleReverseSale}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Management */}
      {currentTab === 'inventory' && (
        <div className="space-y-6">
          <ProductList
            products={products}
            onAddProduct={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(prod) => {
              setProductToEdit(prod);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onRestockProduct={(prod) => {
              setProductToRestock(prod);
              setIsRestockModalOpen(true);
            }}
          />
        </div>
      )}

      {/* Tab 3: Dedicated Low-Stock Management Screen */}
      {currentTab === 'low-stock' && (
        <div className="space-y-6">
          <LowStockManagementView
            products={products}
            onEditProduct={(prod) => {
              setProductToEdit(prod);
              setIsProductModalOpen(true);
            }}
            onRestockProduct={(prod) => {
              setProductToRestock(prod);
              setIsRestockModalOpen(true);
            }}
          />
        </div>
      )}

      {/* Tab 4: Sales History & Reversal Workflow */}
      {currentTab === 'sales' && (
        <div className="space-y-6">
          <RecentSalesList
            sales={sales}
            onNewSale={() => setIsSaleModalOpen(true)}
            onReverseSale={handleReverseSale}
          />
        </div>
      )}

      {/* Tab 5: Settings & Offline Storage */}
      {currentTab === 'settings' && (
        <div className="space-y-6">
          <BackupRestoreManager
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onReloadAllData={reloadData}
            onResetToDemo={handleResetToDemo}
          />
        </div>
      )}

      {/* Modal: Add / Edit Product */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        existingProducts={products}
        onSave={handleSaveProduct}
      />

      {/* Modal: Record Sale */}
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        products={products.filter((p) => p.isActive)}
        onRecordSale={handleRecordSale}
      />

      {/* Modal: Simulated AI Sale Parser */}
      <SimulatedAiModal
        isOpen={isSimulatedAiModalOpen}
        onClose={() => setIsSimulatedAiModalOpen(false)}
        products={products}
        onConfirmSale={handleRecordSale}
      />

      {/* Modal: Quick Restock */}
      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setProductToRestock(null);
        }}
        product={productToRestock}
        onConfirmRestock={handleConfirmRestock}
      />
    </AppLayout>
  );
}
