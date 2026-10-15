## What I Built

**DukaanVikaas (दुकान विकास)** is a 100% browser-native, offline-first inventory and point-of-sale (POS) billing application crafted specifically for India's 12+ million neighborhood Kirana stores and micro-retailers.

It enables shopkeepers to record sales using conversational, regional language commands (such as *"5 packet Maggi bike"*, *"3 Thums Up sell thai"*, *"2 packet biscuit bech diye"*, or compound sentences like *"Aaj 5 packet Maggi aur 3 cold drink bike"*). It tracks inventory levels atomically, warns against stockouts, generates dynamic revenue analytics, supports instant one-click bill reversals with compensating return audit logs, and allows offline versioned JSON backups—all running with zero latency directly within the merchant's browser.

### Who Would Pay For It & What Problem Does It Solve?
- **The Problem**: Small Indian Kirana stores operate on razor-thin margins in fast-paced retail environments, often in semi-urban or rural areas plagued by erratic power and intermittent internet. Traditional enterprise billing software (like Tally, Marg, or Vyapar) is expensive, hardware-dependent, clunky, and overwhelmingly English-first. Conversely, cloud-only SaaS apps crash when the internet drops in the middle of a rush-hour customer queue.
- **The Solution**: DukaanVikaas requires **zero server backend**, **zero cloud databases**, **zero API keys**, and **zero subscription fees**. It runs on any inexpensive Android smartphone, tablet, or desktop browser.
- **Who Pays / Economic Value**: Small retailers, FMCG distributors, and micro-merchants save thousands of rupees in monthly software subscriptions, hardware POS rentals, and lost revenue from network downtime.

---

## Demo

- 🌐 **Live Deployed Application**: [https://dukaan-vikaas.vercel.app/](https://dukaan-vikaas.vercel.app/)
- 💻 **GitHub Repository**: [https://github.com/Harshitagarwal113/DukaanVikaas](https://github.com/Harshitagarwal113/DukaanVikaas)

### Key Workflows to Explore in the Demo:
1. **Natural Language Assistant**: Tap **"AI Bill Entry"** on the dashboard. Click sample prompts like `"5 packet Maggi bike"` or `"3 Thums Up sell thai"`, parse the command, observe automatic price derivation and stock check, and explicitly confirm the sale.
2. **Ambiguity Safety Guard**: Try typing an ambiguous command like `"2 cold drink bike"`. Notice that the engine **never silently guesses**—it identifies candidates (*Thums Up*, etc.), prompts for exact confirmation, and disables checkout until verified.
3. **Instant Multilingual Switching**: Switch between **हिन्दी (Hindi)**, **ગુજરાતી (Gujarati)**, **Hinglish**, and **English** via the top header selector with zero page reload.
4. **Stock Integrity & Sale Reversal**: Navigate to **Sales History**, inspect any completed receipt, and click **Reverse Sale**. Watch the item atomically return to inventory stock, an audit trail movement generated with reason `'return'`, and today's revenue recalculate dynamically.
5. **JSON Backup & Restore**: Open **Settings**, download `dukaan-vikaas-backup.json`, inspect the schema validation, or preview before restoring.

---

## Code

{% embed https://github.com/Harshitagarwal113/DukaanVikaas %}

The entire codebase is open-source, strictly typed, and structured into clean, modular layers:
- [`lib/ai/simulatedParser.ts`](https://github.com/Harshitagarwal113/DukaanVikaas/blob/main/lib/ai/simulatedParser.ts): 100% offline deterministic rule-based natural language parser with multilingual tokenizers, phonetic alias matching, and candidate suggestion guards.
- [`lib/storage/db.ts`](https://github.com/Harshitagarwal113/DukaanVikaas/blob/main/lib/storage/db.ts): Client-side IndexedDB multi-store architecture with atomic transactional integrity and signed audit movement logs.
- [`lib/validation/index.ts`](https://github.com/Harshitagarwal113/DukaanVikaas/blob/main/lib/validation/index.ts): Pre-import backup validator preventing corrupt schemas, negative pricing, and duplicate IDs.
- [`lib/i18n/LanguageContext.tsx`](https://github.com/Harshitagarwal113/DukaanVikaas/blob/main/lib/i18n/LanguageContext.tsx): Persistent vernacular state engine with memoized synchronization across local storage and IndexedDB.
- [`tests/runUnitTests.ts`](https://github.com/Harshitagarwal113/DukaanVikaas/blob/main/tests/runUnitTests.ts): 45-point automated test suite validating the NLP parser, business math, and schema integrity.

---

## How I Built It

Rather than relying on heavy, black-box cloud LLM APIs—which charge per token, introduce latency, require internet access, and risk catastrophic hallucinations in financial accounting—DukaanVikaas was designed around an **open-source, client-side deterministic NLP engine and local-first architecture**:

### 1. Local Deterministic NLP Engine
- **Conversational Tokenizer**: Cleans regional conversational prefixes (*aaj*, *bhaiya*, *sethji*, *sun*, *please*) and verb suffixes (*bike*, *bika*, *bech diye*, *sell thai*, *vechya*, *aapi*).
- **Multilingual Numeral Normalization**: Maps written number words in Hindi, Gujarati, Devanagari, and English (*teen*, *paanch*, *tran*, *દો*, *પાંચ*, *five*) and fractional terms (*aadha*, *half*) to numbers.
- **Compound Sentence Parser**: Splits compound commands via regional conjunctions (*aur*, *and*, *ane*, *तथा*, commas) into separate transaction line items.
- **Fuzzy Catalog & Alias Scoring**: Matches items against product names, categories, and vernacular aliases (*मैगी*, *આટા*, *Desh Ka Namak*).
- **Zero-Guess Ambiguity Guard**: If an input is ambiguous (e.g. general terms like *"biscuit"* or *"cold drink"*), the engine classifies the item as `needs_clarification`, presents quick-pick buttons, and blocks checkout until the merchant explicitly confirms the item.

### 2. Browser-Native Storage & Tech Stack
- **Next.js 16 (App Router + Turbopack)** & **React 19**: Ultra-fast client rendering with sub-second hot reload and zero build bloat.
- **Tailwind CSS v4**: Minimalist Forest Green retail SaaS aesthetics (`#065f46`), high-contrast charcoal typography, neutral borders, and touch-optimized buttons ($\ge 44\text{px}$).
- **Browser-Native IndexedDB**: 5 transactional object stores (`products`, `sales`, `inventoryMovements`, `settings`, `metadata`) providing offline durability.
- **Native JSON Blob Backup**: Browser-triggered downloads without file system vulnerabilities or arbitrary disk access claims.

---

## Why Does Open Innovation Matter?

Open innovation is essential for the future of everyday computing, especially in developing economies:

1. **Digital Sovereignty & Absolute Privacy**:
   A shopkeeper's daily revenue, wholesale margins, customer credit (khata) records, and supplier relationships are their most confidential business data. Closed cloud platforms harvest and monetize this data. With DukaanVikaas's open client-native architecture, **100% of data stays inside the merchant's physical browser**—no server logs, no tracking, and zero leakage.
2. **Resilience Against the "Always-On" Myth**:
   Big tech software often assumes continuous gigabit fiber and reliable power. Real-world retail in emerging markets operates under brownouts and cellular dead zones. Open client-side architectures ensure technology adapts to human realities, rather than demanding costly infrastructure upgrades.
3. **Zero Financial Friction & True Democratization**:
   Closed AI services lock users into recurring token billing and subscription tiers. Open, browser-executable logic costs $0.00 to run. A micro-retailer in an Indian village has access to the exact same cutting-edge natural language billing efficiency as a luxury supermarket in a metropolitan hub.
4. **Predictability Over Hallucination**:
   Closed LLMs are probabilistic—they can miscalculate currency, hallucinate prices, or invent inventory items. In point-of-sale accounting, an error of ₹10 is a breach of customer trust. Open deterministic algorithms guarantee transparent, auditable math every single time.

---

## My Agent Session

This application was developed as a solo engineer using **paired agentic software engineering** with DeepMind's Antigravity IDE and DevRelay:
- **Test Automation**: Used subagents to perform end-to-end browser QA across mobile viewports (`390x844`), tablet screens, and desktop layouts.
- **Continuous Validation**: Executed automated unit tests (`45/45` passed), strict ESLint checks, and production builds with zero warnings.
- **Session Record**: The full autonomous workflow, code edits, browser verification runs, and Git commit trails were orchestrated and verified end-to-end locally.

---

## My First User

During development, DukaanVikaas was demonstrated to **Ramesh-ji**, an independent Kirana store owner operating a neighborhood provision shop:
- **The Reaction**: *"Ye to badiya hai! Padhne-likhne ki zarurat nahi, bas bolo '5 packet Maggi bike' aur bill ban gaya!"* (*"This is great! No need to search through complicated menus—just say '5 packet Maggi bike' and the bill is generated!"*).
- **Key Insight**: He particularly appreciated that the app worked in Hindi and Gujarati without lagging, and that he could back up his complete shop data to a `data.json` file on his phone whenever he wanted, giving him complete peace of mind that no cloud company could ever lock him out of his records.

---

## Prize Categories

**Participation**: Solo Developer (**Harshit Agarwal** / [`@Harshitagarwal113`](https://github.com/Harshitagarwal113))

- **Open Source AI / Local-First Innovation**: For building an offline, deterministic, zero-cloud natural language retail interface running 100% client-side in the browser.
- **Tech for Good & Social Impact**: For empowering unserved micro-retailers (Kirana stores) with free, localized, accessible billing software that requires no expensive hardware or subscriptions.
- **Web Applications / Edge Computing**: For showcasing Next.js 16, React 19, and IndexedDB with zero server dependency and sub-second performance.
