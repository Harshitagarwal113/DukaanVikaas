import { LanguageCode } from '@/types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  demoDataBadge: string;
  demoDisclaimer: string;

  // Nav
  navDashboard: string;
  navInventory: string;
  navLowStock: string;
  navSales: string;
  navSettings: string;

  // Dashboard
  todaySales: string;
  itemsSoldToday: string;
  lowStockAlerts: string;
  totalProducts: string;
  quickActions: string;
  actionNewSale: string;
  actionAddProduct: string;
  actionExportBackup: string;
  recentSalesTitle: string;
  viewAllSales: string;
  lowStockItemsTitle: string;
  viewAllProducts: string;

  // Best Selling Products
  bestSellingTitle: string;
  unitsSold: string;
  revenueGenerated: string;
  noSalesRecordedYet: string;

  // Inventory
  searchPlaceholder: string;
  allCategories: string;
  allStockStatuses: string;
  statusInStock: string;
  statusLowStock: string;
  statusOutOfStock: string;
  colProduct: string;
  colCategory: string;
  colPrice: string;
  colStock: string;
  colStatus: string;
  colActions: string;
  unitsAvailable: string;
  thresholdNotice: string;
  addProductTitle: string;
  editProductTitle: string;
  productNameLabel: string;
  productNameHint: string;
  categoryLabel: string;
  unitLabel: string;
  sellingPriceLabel: string;
  purchasePriceLabel: string;
  stockQuantityLabel: string;
  thresholdLabel: string;
  aliasesLabel: string;
  aliasesHint: string;

  // Low Stock Screen
  lowStockScreenTitle: string;
  lowStockScreenDesc: string;
  criticalOutOfStock: string;
  needsRestockThreshold: string;
  healthyStockMessage: string;

  // Simulated AI Assistant
  simulatedAiTitle: string;
  simulatedAiDesc: string;
  simulatedAiBadge: string;
  simulatedAiDisclaimer: string;
  simulatedAiInputPlaceholder: string;
  simulatedAiParseButton: string;
  simulatedAiExamplesTitle: string;
  simulatedAiReviewTitle: string;
  simulatedAiConfirmSale: string;
  simulatedAiMapProduct: string;
  actionSimulatedAi: string;

  // Sales
  salesHistoryTitle: string;
  billNumber: string;
  saleDateTime: string;
  customerName: string;
  paymentMode: string;
  paymentCash: string;
  paymentUpi: string;
  paymentCredit: string;
  saleTotal: string;
  itemsCount: string;
  demoSaleRecord: string;
  saleDetailsTitle: string;

  // Reversal Workflow
  reverseSaleButton: string;
  reverseSaleConfirmTitle: string;
  reverseSaleConfirmDesc: string;
  reverseSaleReasonLabel: string;
  statusReversed: string;
  statusCompleted: string;
  reversedBadge: string;
  reversedNotice: string;
  reverseSuccessMessage: string;

  // Settings & Backup
  settingsTitle: string;
  shopProfileTitle: string;
  shopNameLabel: string;
  ownerNameLabel: string;
  languageSelectLabel: string;
  currencyLabel: string;
  saveSettingsButton: string;
  storageInfoTitle: string;
  storageInfoDesc: string;
  backupSectionTitle: string;
  backupSectionDesc: string;
  exportBackupButton: string;
  importBackupButton: string;
  importPreviewTitle: string;
  confirmImportButton: string;
  resetDemoTitle: string;
  resetDemoDesc: string;
  resetDemoButton: string;
  confirmResetButton: string;

  // Modals & General
  cancelButton: string;
  confirmButton: string;
  closeButton: string;
  saveButton: string;
  deleteButton: string;
  loading: string;
  noDataFound: string;
  successMessage: string;
  errorMessage: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'DukaanVikaas',
    appSubtitle: 'Kirana Inventory & Sales Manager',
    demoDataBadge: 'Demo Mode',
    demoDisclaimer:
      'Showing demonstration data. You can replace it with your own shop data or backup at any time.',

    navDashboard: 'Dashboard',
    navInventory: 'Inventory',
    navLowStock: 'Low Stock',
    navSales: 'Sales History',
    navSettings: 'Backup & Settings',

    todaySales: "Today's Sales",
    itemsSoldToday: 'Items Sold Today',
    lowStockAlerts: 'Low Stock Alerts',
    totalProducts: 'Active Items',
    quickActions: 'Quick Actions',
    actionNewSale: 'Record Sale',
    actionAddProduct: 'Add Product',
    actionExportBackup: 'Download Backup',
    recentSalesTitle: 'Recent Transactions',
    viewAllSales: 'View All Sales',
    lowStockItemsTitle: 'Needs Restock Soon',
    viewAllProducts: 'View All Inventory',

    bestSellingTitle: 'Top Selling Products',
    unitsSold: 'units sold',
    revenueGenerated: 'Revenue',
    noSalesRecordedYet: 'No completed sales yet to rank products.',

    searchPlaceholder: 'Search by item name (e.g., Maggi, Atta, Doodh)...',
    allCategories: 'All Categories',
    allStockStatuses: 'All Stock Levels',
    statusInStock: 'In Stock',
    statusLowStock: 'Low Stock',
    statusOutOfStock: 'Out of Stock',
    colProduct: 'Product',
    colCategory: 'Category',
    colPrice: 'Price',
    colStock: 'Current Stock',
    colStatus: 'Status',
    colActions: 'Action',
    unitsAvailable: 'in stock',
    thresholdNotice: 'Low stock limit',
    addProductTitle: 'Add New Product',
    editProductTitle: 'Edit Product',
    productNameLabel: 'Product Name',
    productNameHint: 'e.g. Parle-G Gold Biscuits (100g)',
    categoryLabel: 'Category',
    unitLabel: 'Unit',
    sellingPriceLabel: 'Selling Price (₹)',
    purchasePriceLabel: 'Purchase Price (Optional)',
    stockQuantityLabel: 'Current Stock Quantity',
    thresholdLabel: 'Low Stock Alert Threshold',
    aliasesLabel: 'Aliases & Local Names (comma separated)',
    aliasesHint: 'e.g. मैगी, Maggie, Parle-G, દૂધ',

    lowStockScreenTitle: 'Low Stock Inventory Alerts',
    lowStockScreenDesc:
      'Products currently at or below their configured reorder thresholds.',
    criticalOutOfStock: 'Critical: Out of Stock (0 units)',
    needsRestockThreshold: 'Below Minimum Threshold',
    healthyStockMessage:
      'All inventory levels are healthy! No items currently require urgent restocking.',

    simulatedAiTitle: 'Simulated AI Assistant',
    simulatedAiDesc:
      'Rule-Based Local NLP Parser for natural multilingual Kirana commands.',
    simulatedAiBadge: 'Rule-Based Simulation',
    simulatedAiDisclaimer:
      'This feature is a deterministic local parser running completely in your browser. No external AI model or cloud service is connected.',
    simulatedAiInputPlaceholder:
      'e.g. "5 packet Maggi bike" or "3 Thums Up sell thai" or "2 packet biscuit bech diye"',
    simulatedAiParseButton: 'Parse Command',
    simulatedAiExamplesTitle: 'Quick Example Commands:',
    simulatedAiReviewTitle: 'Parsed Proposal Review',
    simulatedAiConfirmSale: 'Confirm & Record Sale',
    simulatedAiMapProduct: 'Select matching inventory item',
    actionSimulatedAi: 'Simulated AI Sale',

    salesHistoryTitle: 'Sales & Receipts',
    billNumber: 'Bill / Receipt No.',
    saleDateTime: 'Date & Time',
    customerName: 'Customer',
    paymentMode: 'Payment',
    paymentCash: 'Cash (नकद)',
    paymentUpi: 'UPI (GPay/PhonePe)',
    paymentCredit: 'Khata / Udhar',
    saleTotal: 'Total Amount',
    itemsCount: 'items',
    demoSaleRecord: 'Demo Record',
    saleDetailsTitle: 'Bill Details',

    reverseSaleButton: 'Reverse Sale (Void Bill)',
    reverseSaleConfirmTitle: 'Reverse & Void This Transaction?',
    reverseSaleConfirmDesc:
      'This action will void bill #{billNumber}, restore all item quantities back to inventory, and record a compensating return entry.',
    reverseSaleReasonLabel: 'Reason for reversal (optional)',
    statusReversed: 'Reversed',
    statusCompleted: 'Completed',
    reversedBadge: 'Void / Reversed',
    reversedNotice: 'This transaction was cancelled and its inventory was safely returned.',
    reverseSuccessMessage: 'Transaction reversed and inventory stock restored.',

    settingsTitle: 'Settings & Offline Storage',
    shopProfileTitle: 'Shop Profile',
    shopNameLabel: 'Shop Name',
    ownerNameLabel: 'Shopkeeper Name',
    languageSelectLabel: 'Preferred Language',
    currencyLabel: 'Currency Symbol',
    saveSettingsButton: 'Save Shop Profile',
    storageInfoTitle: 'How Offline Storage Works',
    storageInfoDesc:
      'DukaanVikaas stores 100% of your records directly inside your browser database (IndexedDB). No external servers, no cloud fees, and no internet required. Your data remains on this device.',
    backupSectionTitle: 'JSON Backup & Restore',
    backupSectionDesc:
      'Download a data.json file periodically for safe keeping, or transfer it to another phone or computer by importing it here.',
    exportBackupButton: 'Export Backup (data.json)',
    importBackupButton: 'Import Backup File',
    importPreviewTitle: 'Review Backup Before Importing',
    confirmImportButton: 'Confirm & Replace All Data',
    resetDemoTitle: 'Reset to Sample Data',
    resetDemoDesc:
      'Wipe current database and reload the initial realistic Kirana demonstration data.',
    resetDemoButton: 'Reset to Demo Data',
    confirmResetButton: 'Yes, Reset Database',

    cancelButton: 'Cancel',
    confirmButton: 'Confirm',
    closeButton: 'Close',
    saveButton: 'Save',
    deleteButton: 'Delete',
    loading: 'Loading data...',
    noDataFound: 'No records found.',
    successMessage: 'Changes saved successfully!',
    errorMessage: 'An error occurred. Please try again.',
  },

  hi: {
    appName: 'दुकान विकास',
    appSubtitle: 'किराना दुकान इन्वेंटरी और बिक्री खाता',
    demoDataBadge: 'डेमो डेटा',
    demoDisclaimer:
      'यह केवल डेमो डेटा है। आप कभी भी अपनी दुकान का वास्तविक सामान और बिक्री इसमें जोड़ सकते हैं।',

    navDashboard: 'डैशबोर्ड',
    navInventory: 'इन्वेंटरी (सामान)',
    navLowStock: 'कम स्टॉक',
    navSales: 'बिक्री खाता',
    navSettings: 'बैकअप व सेटिंग्स',

    todaySales: 'आज की कुल बिक्री',
    itemsSoldToday: 'आज बिके कुल आइटम',
    lowStockAlerts: 'कम स्टॉक अलर्ट',
    totalProducts: 'दुकान में कुल सामान',
    quickActions: 'त्वरित कार्य (Quick Actions)',
    actionNewSale: 'नई बिक्री जोड़ें',
    actionAddProduct: 'नया सामान जोड़ें',
    actionExportBackup: 'बैकअप डाउनलोड करें',
    recentSalesTitle: 'हाल की बिक्री पर्चियां',
    viewAllSales: 'सभी बिक्री देखें',
    lowStockItemsTitle: 'खत्म होने वाला सामान (जल्दी मंगाएं)',
    viewAllProducts: 'पूरा स्टॉक देखें',

    bestSellingTitle: 'सर्वाधिक बिकने वाला सामान',
    unitsSold: 'यूनिट बिकी',
    revenueGenerated: 'कुल आमदनी',
    noSalesRecordedYet: 'अभी तक कोई बिक्री दर्ज नहीं हुई है।',

    searchPlaceholder: 'सामान खोजें (जैसे: मैगी, आटा, Parle, दूध)...',
    allCategories: 'सभी श्रेणियां',
    allStockStatuses: 'सभी स्टॉक स्तर',
    statusInStock: 'स्टॉक में उपलब्ध',
    statusLowStock: 'स्टॉक कम है',
    statusOutOfStock: 'खत्म हो गया',
    colProduct: 'सामान का नाम',
    colCategory: 'कैटेगरी',
    colPrice: 'बिक्री दर (₹)',
    colStock: 'उपलब्ध मात्रा',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    unitsAvailable: 'उपलब्ध',
    thresholdNotice: 'कम स्टॉक सीमा',
    addProductTitle: 'नया सामान जोड़ें',
    editProductTitle: 'सामान में बदलाव करें',
    productNameLabel: 'सामान का नाम',
    productNameHint: 'जैसे: पारले-जी बिस्कुट (100 ग्राम)',
    categoryLabel: 'कैटेगरी',
    unitLabel: 'इकाई (Unit)',
    sellingPriceLabel: 'बिक्री मूल्य (₹)',
    purchasePriceLabel: 'खरीद मूल्य (वैकल्पिक)',
    stockQuantityLabel: 'वर्तमान में उपलब्ध स्टॉक',
    thresholdLabel: 'कम स्टॉक की चेतावनी सीमा',
    aliasesLabel: 'अन्य नाम / उपनाम (कॉमा लगाकर लिखें)',
    aliasesHint: 'जैसे: मैगी, Maggie, Parle-G, आटा',

    lowStockScreenTitle: 'कम स्टॉक वाले उत्पाद',
    lowStockScreenDesc:
      'ऐसे सभी सामान जिनकी मात्रा न्यूनतम तय सीमा के बराबर या उससे कम हो चुकी है।',
    criticalOutOfStock: 'अति आवश्यक: स्टॉक समाप्त (0 यूनिट)',
    needsRestockThreshold: 'न्यूनतम सीमा से कम',
    healthyStockMessage:
      'सभी सामान का स्टॉक पर्याप्त है! फिलहाल किसी सामान को तत्काल मंगाने की आवश्यकता नहीं है।',

    simulatedAiTitle: 'सिम्युलेटेड एआई असिस्टेंट',
    simulatedAiDesc:
      'नियम-आधारित ऑफलाइन पार्सर जो बोलचाल की हिंदी/हिंग्लिश कमांड्स पहचानता है।',
    simulatedAiBadge: 'रूल-बेस्ड सिमुलेशन',
    simulatedAiDisclaimer:
      'यह एक स्थानीय नियम-आधारित पार्सर है जो पूरी तरह आपके ब्राउज़र में चलता है। कोई बाहरी एआई मॉडल या क्लाउड सर्वर कनेक्टेड नहीं है।',
    simulatedAiInputPlaceholder:
      'जैसे: "5 packet Maggi bike" या "2 packet biscuit bech diye" या "3 Thums Up sell thai"',
    simulatedAiParseButton: 'कमांड पार्स करें',
    simulatedAiExamplesTitle: 'नमूना कमांड्स:',
    simulatedAiReviewTitle: 'पहचाने गए सामान की जांच',
    simulatedAiConfirmSale: 'पुष्टि करें और बिल बनाएं',
    simulatedAiMapProduct: 'स्टॉक में से सही सामान चुनें',
    actionSimulatedAi: 'एआई बिल प्रविष्टि',

    salesHistoryTitle: 'बिक्री रसीदें और इतिहास',
    billNumber: 'बिल नंबर',
    saleDateTime: 'तारीख व समय',
    customerName: 'ग्राहक का नाम',
    paymentMode: 'भुगतान का तरीका',
    paymentCash: 'नकद (Cash)',
    paymentUpi: 'यूपीआई (PhonePe / GPay)',
    paymentCredit: 'उधार (खाता)',
    saleTotal: 'कुल रकम',
    itemsCount: 'आइटम',
    demoSaleRecord: 'डेमो पर्ची',
    saleDetailsTitle: 'बिल का विवरण',

    reverseSaleButton: 'बिक्री रद्द करें (रिवर्सल)',
    reverseSaleConfirmTitle: 'क्या आप यह बिल रद्द करना चाहते हैं?',
    reverseSaleConfirmDesc:
      'इस बिल #{billNumber} का सारा सामान वापस स्टॉक में जोड़ दिया जाएगा और रिटर्न मूवमेंट दर्ज हो जाएगी।',
    reverseSaleReasonLabel: 'रद्द करने का कारण (वैकल्पिक)',
    statusReversed: 'रद्द (Reversed)',
    statusCompleted: 'सफल (Completed)',
    reversedBadge: 'रद्द बिल',
    reversedNotice: 'यह बिक्री रद्द कर दी गई थी और इसका सामान स्टॉक में वापस आ चुका है।',
    reverseSuccessMessage: 'बिक्री रद्द कर दी गई और स्टॉक पुनः बहाल किया गया।',

    settingsTitle: 'दुकान सेटिंग्स और ऑफलाइन डेटा',
    shopProfileTitle: 'दुकान की जानकारी',
    shopNameLabel: 'दुकान का नाम',
    ownerNameLabel: 'दुकानदार का नाम',
    languageSelectLabel: 'पसंदीदा भाषा',
    currencyLabel: 'मुद्रा चिह्न',
    saveSettingsButton: 'दुकान की जानकारी सहेजें',
    storageInfoTitle: 'ऑफलाइन स्टोरेज कैसे काम करता है?',
    storageInfoDesc:
      'दुकान विकास आपकी सारी जानकारी बिना इंटरनेट के सीधे आपके ब्राउज़र के अंदर (IndexedDB) सुरक्षित रखता है। इसके लिए किसी सर्वर या इंटरनेट की जरूरत नहीं है।',
    backupSectionTitle: 'JSON बैकअप और रीस्टोर',
    backupSectionDesc:
      'समय-समय पर data.json फाइल डाउनलोड कर सुरक्षित रखें, या किसी दूसरे फोन / कंप्यूटर में यह फाइल अपलोड कर अपना डेटा ले जाएं।',
    exportBackupButton: 'बैकअप फाइल डाउनलोड करें (data.json)',
    importBackupButton: 'बैकअप फाइल अपलोड करें',
    importPreviewTitle: 'बैकअप फाइल की जांच करें',
    confirmImportButton: 'पुष्टि करें और डेटा बदलें',
    resetDemoTitle: 'डेमो डेटा दोबारा लोड करें',
    resetDemoDesc:
      'वर्तमान डेटा मिटाकर शुरूआती किराना स्टोर का नमूना डेटा दोबारा सेट करें।',
    resetDemoButton: 'डेमो डेटा पर रीसेट करें',
    confirmResetButton: 'हाँ, डेटा रीसेट करें',

    cancelButton: 'रद्द करें',
    confirmButton: 'पुष्टि करें',
    closeButton: 'बंद करें',
    saveButton: 'सहेजें',
    deleteButton: 'हटाएं',
    loading: 'डेटा लोड हो रहा है...',
    noDataFound: 'कोई रिकॉर्ड नहीं मिला।',
    successMessage: 'सफलतापूर्वक सहेजा गया!',
    errorMessage: 'कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।',
  },

  gu: {
    appName: 'દુકાન વિકાસ',
    appSubtitle: 'કરિયાણા દુકાન ઇન્વેન્ટરી અને વેચાણ ખાતું',
    demoDataBadge: 'ડેમો ડેટા',
    demoDisclaimer:
      'આ માત્ર ડેમો રેકોર્ડ્સ છે. તમે ગમે ત્યારે તમારી દુકાનનો સાચો સામાન અને હિસાબ ઉમેરી શકો છો.',

    navDashboard: 'ડેશબોર્ડ',
    navInventory: 'ઇન્વેન્ટરી (સામાન)',
    navLowStock: 'ઓછો સ્ટોક',
    navSales: 'વેચાણ ખાતું',
    navSettings: 'બેકઅપ અને સેટિંગ્સ',

    todaySales: 'આજનું કુલ વેચાણ',
    itemsSoldToday: 'આજે વેચાયેલ સામાન',
    lowStockAlerts: 'ઓછા સ્ટોકની ચેતવણી',
    totalProducts: 'દુકાનમાં કુલ સામાન',
    quickActions: 'ઝડપી કાર્યો (Quick Actions)',
    actionNewSale: 'નવું વેચાણ નોંધો',
    actionAddProduct: 'નવો સામાન ઉમેરો',
    actionExportBackup: 'બેકઅપ ડાઉનલોડ કરો',
    recentSalesTitle: 'તાજેતરની વેચાણ પાવતીઓ',
    viewAllSales: 'બધું વેચાણ જુઓ',
    lowStockItemsTitle: 'ખૂટી ગયેલો સામાન (જલ્દી મંગાવો)',
    viewAllProducts: 'તમામ સ્ટોક જુઓ',

    bestSellingTitle: 'સૌથી વધુ વેચાતો સામાન',
    unitsSold: 'યુનિટ વેચાયા',
    revenueGenerated: 'કુલ આવક',
    noSalesRecordedYet: 'હજુ સુધી કોઈ વેચાણ નોંધાયું નથી.',

    searchPlaceholder: 'સામાન શોધો (જેમ કે: મેગી, લોટ, દૂધ, તેલ)...',
    allCategories: 'તમામ કેટેગરી',
    allStockStatuses: 'બધા સ્ટોક સ્તર',
    statusInStock: 'સ્ટોકમાં હાજર',
    statusLowStock: 'સ્ટોક ઓછો છે',
    statusOutOfStock: 'ખલાસ થઈ ગયું',
    colProduct: 'સામાનનું નામ',
    colCategory: 'કેટેગરી',
    colPrice: 'વેચાણ ભાવ (₹)',
    colStock: 'હાજર સ્ટોક',
    colStatus: 'સ્થિતિ',
    colActions: 'ક્રિયા',
    unitsAvailable: 'હાજર',
    thresholdNotice: 'ઓછા સ્ટોકની સીમા',
    addProductTitle: 'નવો સામાન ઉમેરો',
    editProductTitle: 'સામાનમાં ફેરફાર કરો',
    productNameLabel: 'સામાનનું નામ',
    productNameHint: 'જેમ કે: પાર્લે-જી ગોલ્ડ બિસ્કિટ (100g)',
    categoryLabel: 'કેટેગરી',
    unitLabel: 'એકમ (Unit)',
    sellingPriceLabel: 'વેચાણ ભાવ (₹)',
    purchasePriceLabel: 'ખરીદ ભાવ (મરજિયાત)',
    stockQuantityLabel: 'હાલનો સ્ટોક જથ્થો',
    thresholdLabel: 'ઓછા સ્ટોકની ચેતવણી લિમિટ',
    aliasesLabel: 'અન્ય નામો (અલ્પવિરામ સાથે)',
    aliasesHint: 'જેમ કે: મેગી, Maggie, દૂધ, ચોખા',

    lowStockScreenTitle: 'ઓછા સ્ટોકની ચેતવણીઓ',
    lowStockScreenDesc:
      'ન્યૂનતમ લિમિટ કરતાં ઓછો થયેલો તમામ સામાન.',
    criticalOutOfStock: 'ગંભીર: સ્ટોક ખાલી (0 જથ્થો)',
    needsRestockThreshold: 'મર્યાદા કરતાં ઓછો સ્ટોક',
    healthyStockMessage:
      'તમામ સ્ટોક સુરક્ષિત છે! કોઈ સામાન તાત્કાલિક મંગાવવાની જરૂર નથી.',

    simulatedAiTitle: 'સિમ્યુલેટેડ AI આસિસ્ટન્ટ',
    simulatedAiDesc:
      'સ્થાનિક નિયમ-આધારિત પાર્સર જે ગુજરાતી/હિન્દી વેચાણ વાક્યો સમજે છે.',
    simulatedAiBadge: 'નિયમ-આધારિત સિમ્યુલેશન',
    simulatedAiDisclaimer:
      'આ સુવિધા તમારા બ્રાઉઝરમાં ચાલતું સ્થાનિક પાર્સર છે. કોઈ બાહ્ય AI મોડેલ કે સર્વર જોડાયેલ નથી.',
    simulatedAiInputPlaceholder:
      'જેમ કે: "3 Thums Up sell thai" અથવા "5 packet Maggi bike" અથવા "2 packet biscuit bech diye"',
    simulatedAiParseButton: 'વાક્ય પાર્સ કરો',
    simulatedAiExamplesTitle: 'ઉદાહરણ વાક્યો:',
    simulatedAiReviewTitle: 'ઓળખાયેલ સામાનની ચકાસણી',
    simulatedAiConfirmSale: 'ખાતરી કરો અને બિલ બનાવો',
    simulatedAiMapProduct: 'સ્ટોકમાંથી સાચો સામાન પસંદ કરો',
    actionSimulatedAi: 'AI વેચાણ નોંધણી',

    salesHistoryTitle: 'વેચાણ રસીદો અને ઇતિહાસ',
    billNumber: 'બિલ નંબર',
    saleDateTime: 'તારીખ અને સમય',
    customerName: 'ગ્રાહકનું નામ',
    paymentMode: 'ચૂકવણીની રીત',
    paymentCash: 'રોકડ (Cash)',
    paymentUpi: 'UPI (PhonePe / GPay)',
    paymentCredit: 'ઉધાર (ખાતું)',
    saleTotal: 'કુલ રકમ',
    itemsCount: 'આઇટમ',
    demoSaleRecord: 'ડેમો બિલ',
    saleDetailsTitle: 'બિલ વિગતો',

    reverseSaleButton: 'બિલ રદ કરો (રિવર્સલ)',
    reverseSaleConfirmTitle: 'શું તમે આ બિલ રદ કરવા માંગો છો?',
    reverseSaleConfirmDesc:
      'આ બિલ #{billNumber} નો તમામ સામાન સ્ટોકમાં પાછો ઉમેરાઈ જશે અને રિટર્ન નોંધણી થઈ જશે.',
    reverseSaleReasonLabel: 'રદ કરવાનું કારણ (મરજિયાત)',
    statusReversed: 'રદ કરેલ (Reversed)',
    statusCompleted: 'પૂર્ણ (Completed)',
    reversedBadge: 'રદ બિલ',
    reversedNotice: 'આ વેચાણ રદ કરવામાં આવ્યું હતું અને સ્ટોક સુરક્ષિત રીતે પરત મળ્યો છે.',
    reverseSuccessMessage: 'વેચાણ સફળતાપૂર્વક રદ થયું અને સ્ટોક પાછો આવ્યો.',

    settingsTitle: 'સેટિંગ્સ અને ઑફલાઇન સંગ્રહ',
    shopProfileTitle: 'દુકાનની વિગતો',
    shopNameLabel: 'દુકાનનું નામ',
    ownerNameLabel: 'દુકાનદારનું નામ',
    languageSelectLabel: 'પસંદગીની ભાષા',
    currencyLabel: 'ચલણ સંકેત',
    saveSettingsButton: 'વિગતો સાચવો',
    storageInfoTitle: 'ઑફલાઇન સ્ટોરેજ કેવી રીતે કામ કરે છે?',
    storageInfoDesc:
      'દુકાન વિકાસ તમારો તમામ ડેટા ઇન્ટરનેટ વગર બ્રાઉઝરની અંદર (IndexedDB) સુરક્ષિત રાખે છે. કોઈ સર્વર કે ઇન્ટરનેટની જરૂર નથી.',
    backupSectionTitle: 'JSON બેકઅપ અને પુનઃપ્રાપ્તિ',
    backupSectionDesc:
      'સમયાંતરે data.json ફાઇલ ડાઉનલોડ કરી સાચવી રાખો, અથવા અન્ય ફોનમાં આ ફાઇલ અપલોડ કરીને બધો ડેટા ટ્રાન્સફર કરો.',
    exportBackupButton: 'બેકઅપ ડાઉનલોડ કરો (data.json)',
    importBackupButton: 'બેકઅપ ફાઇલ અપલોડ કરો',
    importPreviewTitle: 'બેકઅપ ફાઇલ ચકાસો',
    confirmImportButton: 'ખાતરી કરો અને ડેટા બદલો',
    resetDemoTitle: 'નમૂના ડેટા ફરી સેટ કરો',
    resetDemoDesc:
      'હાલનો ડેટા સાફ કરી ફરીથી કરિયાણા દુકાનનો ડેમો ડેટા સેટ કરો.',
    resetDemoButton: 'ડેમો ડેટા રીસેટ કરો',
    confirmResetButton: 'હા, ડેટા રીસેટ કરો',

    cancelButton: 'રદ કરો',
    confirmButton: 'ખાતરી કરો',
    closeButton: 'બંધ કરો',
    saveButton: 'સાચવો',
    deleteButton: 'કાઢી નાખો',
    loading: 'ડેટા લોડ થઈ રહ્યો છે...',
    noDataFound: 'કોઈ રેકોર્ડ મળ્યો નથી.',
    successMessage: 'વિગતો સાચવી લેવાઈ!',
    errorMessage: 'કંઈક ભૂલ થઈ, કૃપા કરીને ફરી પ્રયાસ કરો.',
  },

  hinglish: {
    appName: 'DukaanVikaas',
    appSubtitle: 'Kirana Dukaan Ka Stock & Bikri Manager',
    demoDataBadge: 'Demo Mode',
    demoDisclaimer:
      'Yeh sample demo data hai. Aap apni dukaan ka real maal aur sales kabhi bhi add kar sakte hain.',

    navDashboard: 'Dashboard',
    navInventory: 'Maal / Stock',
    navLowStock: 'Kam Stock',
    navSales: 'Bikri Khata',
    navSettings: 'Backup & Settings',

    todaySales: 'Aaj Ki Kul Bikri',
    itemsSoldToday: 'Aaj Bika Hua Maal',
    lowStockAlerts: 'Kam Stock Alert',
    totalProducts: 'Total Items In Dukaan',
    quickActions: 'Quick Actions',
    actionNewSale: '+ Nayi Bikri (Bill)',
    actionAddProduct: '+ Naya Item Jodein',
    actionExportBackup: 'Backup Download',
    recentSalesTitle: 'Latest Bikri Parchi',
    viewAllSales: 'Puri Bikri Dekhein',
    lowStockItemsTitle: 'Khatam Hone Wala Maal (Jaldi Mangwayein)',
    viewAllProducts: 'Pura Stock Dekhein',

    bestSellingTitle: 'Sabse Zyada Bikne Wala Maal',
    unitsSold: 'units biki',
    revenueGenerated: 'Total Kamai',
    noSalesRecordedYet: 'Abhi tak koi bikri record nahi hui hai.',

    searchPlaceholder: 'Item search karein (e.g., Maggi, Atta, Doodh)...',
    allCategories: 'All Categories',
    allStockStatuses: 'All Stock Levels',
    statusInStock: 'Stock Mein Hai',
    statusLowStock: 'Stock Kam Hai',
    statusOutOfStock: 'Khatam Ho Gaya',
    colProduct: 'Item Ka Naam',
    colCategory: 'Category',
    colPrice: 'Bikri Rate (₹)',
    colStock: 'Kitna Bacha Hai',
    colStatus: 'Status',
    colActions: 'Action',
    unitsAvailable: 'bacha hai',
    thresholdNotice: 'Low stock limit',
    addProductTitle: 'Naya Maal Jodein',
    editProductTitle: 'Item Details Badlein',
    productNameLabel: 'Item Ka Naam',
    productNameHint: 'e.g. Parle-G Gold Biscuits (100g)',
    categoryLabel: 'Category',
    unitLabel: 'Unit (Packet, Kg, Piece)',
    sellingPriceLabel: 'Bikri Price (₹)',
    purchasePriceLabel: 'Kharid Price (Optional)',
    stockQuantityLabel: 'Abhi Kitna Maal Hai',
    thresholdLabel: 'Kam Stock Alert Limit',
    aliasesLabel: 'Dusre Naam / Aliases (comma se separate karein)',
    aliasesHint: 'e.g. मैगी, Maggie, Parle-G, Doodh',

    lowStockScreenTitle: 'Kam Stock Alert List',
    lowStockScreenDesc:
      'Woh saare items jo low stock alert limit se kam ya barabar bache hain.',
    criticalOutOfStock: 'Khatam Ho Chuka (0 Units)',
    needsRestockThreshold: 'Limit Se Kam Stock',
    healthyStockMessage:
      'Dukaan ka sara stock bilkul sahi hai! Kisi bhi item ko turant mangwane ki zaroorat nahi hai.',

    simulatedAiTitle: 'Simulated AI Assistant',
    simulatedAiDesc:
      'Rule-Based Local Parser jo Hinglish bolchaal commands ko bill mein convert karta hai.',
    simulatedAiBadge: 'Rule-Based Simulation',
    simulatedAiDisclaimer:
      'Yeh offline rule-based parser hai jo bina internet browser mein chalta hai. Koi real AI ya cloud server connected nahi hai.',
    simulatedAiInputPlaceholder:
      'e.g. "5 packet Maggi bike" ya "3 Thums Up sell thai" ya "2 packet biscuit bech diye"',
    simulatedAiParseButton: 'Command Parse Karein',
    simulatedAiExamplesTitle: 'Sample Commands:',
    simulatedAiReviewTitle: 'Parsed Proposal Check Karein',
    simulatedAiConfirmSale: 'Confirm & Bill Banayein',
    simulatedAiMapProduct: 'Inventory mein se sahi item chunein',
    actionSimulatedAi: 'AI Bill Entry',

    salesHistoryTitle: 'Bikri Parchi & Receipts',
    billNumber: 'Bill No.',
    saleDateTime: 'Date & Time',
    customerName: 'Grahak Ka Naam',
    paymentMode: 'Payment Mode',
    paymentCash: 'Cash (Nakad)',
    paymentUpi: 'UPI (PhonePe / GPay)',
    paymentCredit: 'Udhar (Khata)',
    saleTotal: 'Total Amount',
    itemsCount: 'items',
    demoSaleRecord: 'Demo Record',
    saleDetailsTitle: 'Parchi Details',

    reverseSaleButton: 'Bill Cancel Karein (Reverse)',
    reverseSaleConfirmTitle: 'Kya aap yeh bill reverse/cancel karna chahte hain?',
    reverseSaleConfirmDesc:
      'Bill #{billNumber} ka sara maal stock mein wapas add ho jayega aur return movement record ho jayegi.',
    reverseSaleReasonLabel: 'Cancel karne ka reason (optional)',
    statusReversed: 'Cancelled / Reversed',
    statusCompleted: 'Completed',
    reversedBadge: 'Cancelled Bill',
    reversedNotice: 'Yeh bill reverse ho chuka hai aur iska stock inventory mein laut chuka hai.',
    reverseSuccessMessage: 'Bill reverse ho gaya aur stock wapas add ho gaya.',

    settingsTitle: 'Dukaan Settings & Offline Data',
    shopProfileTitle: 'Dukaan Ki Details',
    shopNameLabel: 'Dukaan Ka Naam',
    ownerNameLabel: 'Dukaandaar Ka Naam',
    languageSelectLabel: 'Language Select Karein',
    currencyLabel: 'Currency Symbol',
    saveSettingsButton: 'Dukaan Details Save Karein',
    storageInfoTitle: 'Data Kahan Save Hota Hai?',
    storageInfoDesc:
      'DukaanVikaas aapka sara data aapke mobile / computer ke browser (IndexedDB) mein save karta hai. Internet na hone par bhi app 100% chalti hai.',
    backupSectionTitle: 'JSON Backup & Restore',
    backupSectionDesc:
      'Apne data ka data.json file download karke backup rakhein, ya kisi doosre mobile mein upload karke data transfer karein.',
    exportBackupButton: 'Download Backup (data.json)',
    importBackupButton: 'Upload Backup File',
    importPreviewTitle: 'Backup File Check Karein',
    confirmImportButton: 'Confirm & Replace Data',
    resetDemoTitle: 'Demo Data Reload Karein',
    resetDemoDesc:
      'Purana data hata kar shuruati Kirana store ka sample data wapas load karein.',
    resetDemoButton: 'Reset to Demo Data',
    confirmResetButton: 'Haan, Data Reset Karein',

    cancelButton: 'Cancel',
    confirmButton: 'Confirm',
    closeButton: 'Band Karein',
    saveButton: 'Save',
    deleteButton: 'Delete',
    loading: 'Data load ho raha hai...',
    noDataFound: 'Koi record nahi mila.',
    successMessage: 'Successfully save ho gaya!',
    errorMessage: 'Kuch error hua, kripya dobara try karein.',
  },
};
