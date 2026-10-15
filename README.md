# DukaanVikaas (दुकान विकास)

> Simple, mobile-first inventory and sales billing management web application tailored for Indian kirana stores and small retailers.

---

## 🌟 Highlights & Philosophy

1. **100% Local & In-Browser**:
   - Built to run completely client-side using browser-native **IndexedDB** (`dukaan_vikaas_db`).
   - Zero external databases, zero cloud dependencies, zero external AI APIs, zero external authentication services.
   - Works fully offline—ideal for rural and semi-urban Kirana shops with intermittent internet.

2. **Multilingual for Indian Shopkeepers**:
   - Out-of-the-box support for:
     - **हिन्दी (Hindi)** (Default)
     - **ગુજરાતી (Gujarati)**
     - **Hinglish** (Everyday Hindi in English script for younger shopkeepers)
     - **English**
   - Multilingual product aliases allow searching products by vernacular names (e.g. searching "मैगी", "पारले जी", "આટા", or "दूध").

3. **Realistic Indian Kirana Sample Dataset**:
   - Preloaded with 10 realistic Kirana FMCG items:
     - Maggi 2-Minute Noodles (70g)
     - Parle-G Gold Biscuits (100g)
     - Amul Taaza Toned Milk (500ml) *(Low Stock)*
     - Thums Up Soft Drink Can (250ml)
     - Tata Salt Vacuum Evaporated (1kg)
     - Aashirvaad Shudh Chakki Atta (5kg) *(Low Stock)*
     - Madhur Pure Refined Sugar (1kg)
     - India Gate Basmati Rice Rozzana (1kg)
     - Wagh Bakri Premium CTC Tea (250g) *(Low Stock)*
     - Fortune Sunlite Refined Sunflower Oil (1L)
   - Clearly tagged with `isDemoData: true` and a transparent demo mode banner to prevent mistaking demonstration records for real finances.

4. **Versioned JSON Backup & Restore**:
   - Export full database into `data.json` with a single tap using native browser `Blob` and download triggers.
   - Import previously saved backups with pre-validation and interactive preview (showing product count, transaction count, export timestamp, and confirmation before overwrite).

5. **Atomic Transactional Billing**:
   - Recording a bill decrements product inventory and appends an `InventoryMovement` entry atomically in a single IndexedDB transaction.

---

## 🏗️ Architecture & Project Structure

```text
DukaanVikaas/
├── app/
│   ├── globals.css           # Tailwind CSS directives & mobile touch optimizations
│   ├── layout.tsx            # Root layout with SEO metadata & viewport settings
│   └── page.tsx              # Main application view with reactive IndexedDB state
├── components/
│   ├── Providers.tsx         # Context providers (LanguageProvider)
│   ├── layout/
│   │   ├── AppLayout.tsx     # Shell with top demo banner, sidebar, header, and mobile bar
│   │   ├── Header.tsx        # Store name, offline status indicator, language selector, backup button
│   │   ├── Sidebar.tsx       # Desktop navigation bar with low-stock badges
│   │   ├── MobileNav.tsx     # Mobile bottom navigation with touch targets
│   │   └── LanguageSelector.tsx # Dropdown language switcher (Hindi, Gujarati, Hinglish, English)
│   ├── dashboard/
│   │   ├── DailySummaryCards.tsx # Today's sales (₹), items sold, low stock, active items
│   │   ├── QuickActions.tsx  # Fast triggers: + New Sale, + Add Item, Low Stock, Backup
│   │   └── LowStockBanner.tsx # Urgent restock alert banner with +Stock action
│   ├── inventory/
│   │   ├── ProductList.tsx   # Product catalogue (table on desktop, cards on mobile)
│   │   ├── ProductModal.tsx  # Add / Edit product dialog
│   │   └── RestockModal.tsx  # Quick inventory adjustment / wholesale restock modal
│   ├── sales/
│   │   ├── RecentSalesList.tsx # Billing records, line items, and payment mode badges
│   │   └── SaleModal.tsx     # Point-of-sale checkout modal with auto stock deduction
│   ├── settings/
│   │   └── BackupRestoreManager.tsx # Profile, JSON export/import preview, reset to demo
│   └── ui/
│       ├── Alert.tsx         # Notification banners (info, warning, success, danger)
│       ├── Badge.tsx         # Stock status & demo indicator badges
│       ├── Button.tsx        # Touch-friendly button variants (min-h-[44px])
│       ├── Card.tsx          # Reusable Card container components
│       ├── EmptyState.tsx    # Empty data visual fallback
│       ├── Input.tsx         # Accessible input with label, prefix, suffix, and error states
│       ├── LoadingSpinner.tsx# Accessible loading indicator
│       ├── Modal.tsx         # Accessible modal dialog with backdrop blur & Escape handling
│       └── Select.tsx        # Styled form dropdown
├── lib/
│   ├── data/
│   │   └── sampleData.ts     # Realistic demo FMCG products, sales, and settings
│   ├── i18n/
│   │   ├── translations.ts   # Complete dictionary for en, hi, gu, hinglish
│   │   ├── LanguageContext.tsx # Context with localStorage persistence
│   │   └── index.ts
│   ├── storage/
│   │   ├── db.ts             # Native IndexedDB service with atomic transactions
│   │   └── index.ts          # JSON Blob export & import inspection utilities
│   ├── utils/
│   │   ├── formatters.ts     # Indian Lakhs currency format (₹) and localized dates
│   │   └── id.ts             # Collision-resistant browser-native ID generator
│   └── validation/
│       └── index.ts          # Strict schema validation for backups and entities
└── types/
    └── index.ts              # Strict TypeScript domain interfaces
```

---

## 📊 Data Models

### 1. `Product`
- `id`: Unique identifier (e.g. `prod_amul_milk_500ml`)
- `name`: Product name
- `altNames`: String array for localized Hindi, Gujarati, or colloquial aliases
- `category`: `'groceries' | 'dairy' | 'snacks' | 'beverages' | 'spices' | 'staples' | 'personal_care' | 'household' | 'other'`
- `unit`: `'packet' | 'piece' | 'kg' | 'gm' | 'liter' | 'ml' | 'bottle' | 'box'`
- `sellingPrice`: Selling price in ₹
- `purchasePrice`: Optional wholesale cost
- `stockQuantity`: Current quantity available
- `lowStockThreshold`: Alert trigger quantity
- `isActive`: Boolean status
- `createdDate` / `updatedDate`: ISO 8601 timestamps
- `isDemoData`: Boolean flag

### 2. `Sale`
- `id`: Unique identifier
- `saleNumber`: Customer bill number (e.g. `BILL-20261015-101`)
- `dateTime`: ISO 8601 timestamp
- `items`: Array of items sold with unit price, quantity, and subtotal
- `totalQuantity`: Total quantity across all items
- `totalAmount`: Final bill amount
- `inputMethod`: `'quick_sale' | 'barcode' | 'manual_entry' | 'voice'`
- `status`: `'completed' | 'cancelled' | 'refunded'`
- `paymentMode`: `'cash' | 'upi' | 'credit'` (Khata)
- `customerName`: Optional customer name
- `isDemoData`: Boolean flag

### 3. `InventoryMovement`
- `id`: Unique movement ID
- `productId`: Target product ID
- `quantityChange`: Signed integer (negative for sales, positive for restocks)
- `movementReason`: `'sale' | 'restock' | 'adjustment' | 'damage' | 'initial_stock' | 'return'`
- `associatedSaleId`: Linked bill ID (if triggered by a sale)
- `notes`: Description
- `timestamp`: ISO 8601 timestamp

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Linting
```bash
npm run lint
npm run build
npm start
```
