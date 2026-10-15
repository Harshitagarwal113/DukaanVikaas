# DukaanVikaas (दुकान विकास) 🛒🌾

[![Live Demo](https://img.shields.io/badge/Live%20Demo-dukaan--vikaas.vercel.app-065f46?style=for-the-badge&logo=vercel&logoColor=white)](https://dukaan-vikaas.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Storage](https://img.shields.io/badge/Database-IndexedDB%20(100%25%20Offline)-059669?style=for-the-badge&logo=sqlite&logoColor=white)](#-architecture--storage)

> **A minimal, high-performance, browser-native Kirana inventory and point-of-sale billing web application designed specifically for Indian neighborhood retail stores.**  
> Built with an offline-first architecture powered completely by client-side **IndexedDB**, deterministic **simulated natural-language transaction parsing**, and browser-native **JSON backups**.

🌐 **Live Application**: [https://dukaan-vikaas.vercel.app/](https://dukaan-vikaas.vercel.app/)  
📦 **GitHub Repository**: [https://github.com/Harshitagarwal113/DukaanVikaas](https://github.com/Harshitagarwal113/DukaanVikaas)

---

## 📖 Table of Contents

- [Core Philosophy](#-core-philosophy)
- [Key Features](#-key-features)
  - [1. Simulated AI Natural Language Entry](#1-simulated-ai-natural-language-entry)
  - [2. Real-Time Kirana Dashboard](#2-real-time-kirana-dashboard)
  - [3. Inventory & Low-Stock Management](#3-inventory--low-stock-management)
  - [4. Safe Point-of-Sale Billing & Reversal](#4-safe-point-of-sale-billing--reversal)
  - [5. Multilingual Vernacular Localization](#5-multilingual-vernacular-localization)
  - [6. Versioned JSON Backup & Restore](#6-versioned-json-backup--restore)
  - [7. Privacy & Local Storage Disclaimers](#7-privacy--local-storage-disclaimers)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Data Models & Schema](#-data-models--schema)
- [Automated Testing & Quality Assurance](#-automated-testing--quality-assurance)
- [Getting Started Locally](#-getting-started-locally)
- [Deployment](#-deployment)
- [License](#-license)

---

## 💡 Core Philosophy

Traditional retail SaaS platforms require continuous high-speed internet, monthly cloud subscription fees, complex authentication, and external databases that fail when network connectivity drops in rural or semi-urban areas.

**DukaanVikaas** is engineered around three non-negotiable principles:

1. **100% Client-Side & Zero-Cost**:
   - Runs entirely in the shopkeeper's browser.
   - **Zero backend server**, **zero cloud databases** (no Firebase/Supabase), **zero API keys**, and **zero external AI APIs**.
   - No recurring infrastructure costs.
2. **Deterministic & Trustworthy**:
   - Simulated AI assistant uses a 100% offline rule-based natural language parser.
   - **Never silently guesses** quantities or ambiguous items.
   - Strict audit trails for all stock movements and sale reversals.
3. **Optimized for Indian Retail (Kirana)**:
   - Designed for low-cost Android phones, tablets, and desktop POS screens.
   - Vernacular support for **हिन्दी (Hindi)**, **ગુજરાતી (Gujarati)**, **Hinglish**, and **English**.
   - Multilingual product aliases allow searching items by regional names (e.g., *मैगी*, *આટા*, *दूध*, *Desh Ka Namak*).

---

## ✨ Key Features

### 1. Simulated AI Natural Language Entry
Shopkeepers can speak or type everyday colloquial sale commands in their regional dialect:
- **Hindi / Hinglish**: `"5 packet Maggi bike"`, `"2 packet biscuit bech diye"`, `"Aaj 5 packet Maggi aur 3 cold drink bike"`
- **Gujarati**: `"3 Thums Up sell thai"`, `"tran packet Maggi vechya"`
- **English**: `"sold 4 bottles of milk"`, `"5 packets tea sold"`

#### How the Offline Parser Works:
1. **Conversational Cleaning**: Strips conversational prefixes (*aaj*, *bhaiya*, *please*, *sun*) and regional verb suffixes (*bike*, *bech diye*, *sell thai*, *vechya*).
2. **Number & Word Normalization**: Converts written number words across scripts (*teen*, *paanch*, *tran*, *દો*, *પાંચ*, *five*) and fractions (*half*, *aadha*) into numerical values.
3. **Compound Splitting**: Splits multi-item compound sentences via conjunctions (*aur*, *and*, *ane*, *तथा*, commas) into discrete transaction line items.
4. **Alias & Token Scoring**: Matches catalog items using product names, categories, and regional aliases.
5. **Ambiguity Guard**: If a term is ambiguous (e.g., general terms like *"cold drink"* or *"biscuit"* matching multiple items) or unrecognized, the parser marks it as `needs_clarification`, presents quick-pick candidate buttons, and **disables checkout until the user explicitly confirms the exact item**.

---

### 2. Real-Time Kirana Dashboard
- **Today's Revenue Metric**: Dynamically aggregates today's completed transactions (strictly excluding cancelled or refunded bills).
- **Units Sold Counter**: Total volume of units sold today across all payment receipts.
- **Low-Stock Alerts Card**: Instant alert counter highlighting active products at or below their restock threshold.
- **Best-Selling Products Widget**: Real-time ranking of top FMCG items sorted by units sold and generated revenue.
- **Quick Action Triggers**: Instant buttons for *+ New Sale*, *+ Add Product*, *AI Bill Entry*, and *JSON Backup*.

---

### 3. Inventory & Low-Stock Management
- **Full Catalog Control**: Manage product names, categories (Groceries, Dairy, Snacks, Beverages, Staples, Spices, Personal Care, Household), selling price, optional cost price, units, and custom alert thresholds.
- **Vernacular Aliases**: Attach multiple alternate names and scripts to each product for instant search discovery.
- **Stock Status Badges**: Dynamic visual indicators (`In Stock`, `Low Stock`, `Out of Stock`).
- **Dedicated Low-Stock Screen**: Focused view displaying out-of-stock items and items nearing depletion with one-click restock actions.
- **Inventory Movements History**: Every inventory adjustment (wholesale restock, adjustment, damage, sale, return) is logged with signed quantities, timestamps, and reason codes.

---

### 4. Safe Point-of-Sale Billing & Reversal
- **Live POS Modal**: Fast multi-item billing modal with quantity steppers, unit price display, and real-time subtotal calculations.
- **Negative-Stock Prevention**: Validates item quantities against stored inventory in IndexedDB prior to checkout; transactions exceeding available stock are strictly prevented.
- **Double-Submission Lock**: Buttons enter a disabled loading state immediately upon submission to prevent accidental duplicate bills.
- **Full Sale Reversal**:
  - Reversing a bill updates its status to `cancelled`.
  - Automatically replenishes the exact product stock quantities in IndexedDB.
  - Generates a compensating `InventoryMovement` entry with reason `'return'` and notes referencing the original bill ID.
  - Automatically recalculates all daily and weekly dashboard metrics.

---

### 5. Multilingual Vernacular Localization
- **Instant Language Switching**: Toggle between 4 languages with zero page reload:
  - **हिन्दी (Hindi)** — Standard Devanagari script for North & Central Indian shopkeepers.
  - **ગુજરાતી (Gujarati)** — Native Gujarati script for Western Indian retailers.
  - **Hinglish** — Conversational Hindi in Roman script for younger retailers.
  - **English** — Universal English interface.
- **Persistent Preference**: Language preference is preserved in both `localStorage` and IndexedDB shop settings, remaining active across browser sessions.

---

### 6. Versioned JSON Backup & Restore
- **One-Tap Export**: Generates and downloads a clean, timestamped `dukaan-vikaas-backup-YYYY-MM-DD.json` file using native browser `Blob` and download triggers.
- **Pre-Import Schema Validation**:
  - Validates `appIdentifier === 'DukaanVikaas'`.
  - Rejects unsupported future schema versions (`schemaVersion > CURRENT_SCHEMA_VERSION`).
  - Detects and rejects duplicate primary keys across products, sales, and movements.
  - Validates non-negative quantities, valid categories, and non-negative prices.
- **Two-Step Replacement Preview**: Displays a safety dialog showing shop name, export date, product count, and sale count before overwriting current browser data.

---

### 7. Privacy & Local Storage Disclaimers
Transparently communicated within the Settings view:
- **100% Local Storage**: All records reside solely within the current browser's IndexedDB. No external servers or cloud services have access to your sales figures.
- **No Automatic Device Sync**: Records are not automatically synchronized between multiple phones or PCs.
- **Cache Clearing Warning**: Clearing browser data or using private/incognito mode can erase records.
- **Regular Backup Reminder**: Users are advised to regularly export their `data.json` file to safe offline storage.
- **Downloadable File Notice**: Clarifies that backups are downloadable files saved to your device, not a continuous filesystem background sync.

---

## 🏛️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
├─────────────────────────────────────────────────────────────┤
│   Next.js 16 (App Router)  │  React 19  │  Tailwind CSS v4  │
├─────────────────────────────────────────────────────────────┤
│  LanguageContext (i18n)    │  Simulated NLP Rule Parser     │
├─────────────────────────────────────────────────────────────┤
│                  Storage Layer (dbService)                  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             IndexedDB (dukaan_vikaas_db)              │  │
│  │                                                       │  │
│  │  • products            (FMCG Catalog & Stock)         │  │
│  │  • sales               (Completed & Cancelled Bills)  │  │
│  │  • inventoryMovements  (Signed Audit Trail)           │  │
│  │  • settings            (Store Profile & Currency)     │  │
│  │  • metadata            (Schema Versioning)            │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                              │
│                      Browser Native API                     │
│               [Blob Download / File Input]                  │
│                              │                              │
│                     ┌────────────────┐                      │
│                     │   data.json    │                      │
│                     └────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.4.1** (Turbopack) | Fast React client-side routing, static prerendering, and optimized component hydration. |
| **UI Library** | **React 19** | Component-driven declarative interface with hooks (`useMemo`, `useCallback`, `useContext`). |
| **Language** | **TypeScript 5 (Strict)** | End-to-end type safety across domain entities, parser tokens, and validation schemas. |
| **Styling** | **Tailwind CSS v4** | Clean Forest Green retail SaaS aesthetics (`#065f46`), warm stone backgrounds, and high-contrast typography. |
| **Icons** | **Lucide React** | Consistent, lightweight SVG iconography. |
| **Persistence** | **Browser IndexedDB** | Structured, multi-store transactional client-side database. |
| **Deployment** | **Vercel** | Global edge hosting with zero-config Next.js continuous deployment. |

---

## 📊 Data Models & Schema

```typescript
// Core Product Model
export interface Product {
  id: string;
  name: string;
  altNames: string[];        // Regional vernacular aliases: ["मैगी", "Maggie"]
  category: ProductCategory; // groceries, dairy, snacks, beverages, staples, etc.
  unit: ProductUnit;         // packet, piece, kg, gm, liter, ml, bottle, box
  sellingPrice: number;      // Price charged to customer (₹)
  purchasePrice?: number;    // Wholesale acquisition cost (₹)
  stockQuantity: number;     // Current inventory count
  lowStockThreshold: number; // Alert threshold limit
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
  isDemoData?: boolean;
}

// Transaction Billing Record
export interface Sale {
  id: string;
  saleNumber: string;        // Formatted bill code (BILL-20261015-101)
  dateTime: string;
  items: SaleItem[];
  totalQuantity: number;
  totalAmount: number;
  inputMethod: 'quick_sale' | 'barcode' | 'manual_entry' | 'voice';
  status: 'completed' | 'cancelled' | 'refunded';
  paymentMode: 'cash' | 'upi' | 'credit';
  customerName?: string;
  notes?: string;
  isDemoData?: boolean;
}

// Signed Inventory Movement Audit Trail
export interface InventoryMovement {
  id: string;
  productId: string;
  quantityChange: number;    // Negative for sales, positive for restocks
  movementReason: 'sale' | 'restock' | 'adjustment' | 'damage' | 'initial_stock' | 'return';
  associatedSaleId?: string;
  notes?: string;
  timestamp: string;
}
```

---

## 🧪 Automated Testing & Quality Assurance

DukaanVikaas features a standalone automated test runner validating data integrity, rule parsing, and backup validation:

```bash
npm test
```

### Verified Test Categories (45/45 Passed):
1. **Rule-Based NLP Parser Tests**:
   - Extraction of quantities, units, and products from conversational commands.
   - Devanagari and Gujarati numeral/word parsing (*teen*, *paanch*, *tran*, *દો*, *પાંચ*).
   - Multi-item compound sentence splitting via conjunctions.
   - Ambiguity & unknown item handling (confirming it **never silently guesses**).
   - Empty and pure verb input rejection with zero confidence.
   - Low-stock warnings generated when requested quantities exceed available inventory.
2. **Data Integrity & Validation Tests**:
   - Product creation validation (empty names, negative stock, and negative prices rejected).
   - Sales record validation (empty items and negative quantities rejected).
   - Prevention of negative stock upon checkout.
3. **Business Logic & Metric Tests**:
   - Dashboard revenue strictly excludes cancelled or reversed sales.
   - Accurate low-stock threshold calculations across catalog items.
4. **JSON Backup & Schema Tests**:
   - Schema version validation (`schemaVersion <= CURRENT_SCHEMA_VERSION`).
   - Duplicate ID detection across collections.
   - Corrupted or non-object payload rejection.
   - Export-import JSON round-trip data preservation.

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm**: v9+ (or pnpm / yarn)

### 1. Clone the Repository
```bash
git clone https://github.com/Harshitagarwal113/DukaanVikaas.git
cd DukaanVikaas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Build for Production
```bash
npm run lint
npm run build
npm start
```

---

## 🚢 Deployment

The project is pre-configured for zero-configuration deployment to [Vercel](https://vercel.com).

1. Import your GitHub repository into Vercel.
2. Vercel automatically detects Next.js and configures the build settings.
3. **No Environment Variables are needed** — leave the environment variables section empty.
4. Click **Deploy**.

Production URL: **[https://dukaan-vikaas.vercel.app/](https://dukaan-vikaas.vercel.app/)**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built for empowering Indian retail shopkeepers with modern, accessible, and completely offline software.
