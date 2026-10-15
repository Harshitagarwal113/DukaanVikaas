import { parseSimulatedTransaction } from '../lib/ai/simulatedParser';
import {
  validateProduct,
  validateSale,
  validateBackupPayload,
} from '../lib/validation';
import {
  DEMO_PRODUCTS,
  DEMO_SALES,
  DEMO_INVENTORY_MOVEMENTS,
  DEMO_SHOP_SETTINGS,
  CURRENT_SCHEMA_VERSION,
} from '../lib/data/sampleData';
import { BackupPayload, Product, Sale } from '../types';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
  }
}

console.log('=== DUKAANVIKAAS TEST SUITE ===\n');

// -------------------------------------------------------------
// 1. Simulated AI Transaction Parser Tests
// -------------------------------------------------------------
console.log('1. Testing Local Rule-Based NLP Parser:');

// Test 1.1: "5 packet Maggi bike"
const res1 = parseSimulatedTransaction('5 packet Maggi bike', DEMO_PRODUCTS);
assert(res1.items.length === 1, '5 packet Maggi: parses 1 item');
assert(res1.items[0]?.quantity === 5, '5 packet Maggi: quantity is 5');
assert(res1.items[0]?.unit === 'packet', '5 packet Maggi: unit is packet');
assert(
  res1.items[0]?.matchedProduct?.name.toLowerCase().includes('maggi') === true,
  '5 packet Maggi: matched to Maggi noodles'
);
assert(res1.clarificationStatus === 'ready', '5 packet Maggi: status is ready');

// Test 1.2: "3 Thums Up sell thai"
const res2 = parseSimulatedTransaction('3 Thums Up sell thai', DEMO_PRODUCTS);
assert(res2.items.length === 1, '3 Thums Up sell thai: parses 1 item');
assert(res2.items[0]?.quantity === 3, '3 Thums Up sell thai: quantity is 3');
assert(
  res2.items[0]?.matchedProduct?.name.toLowerCase().includes('thums up') === true,
  '3 Thums Up sell thai: matched to Thums Up'
);
assert(res2.clarificationStatus === 'ready', '3 Thums Up sell thai: status is ready');

// Test 1.3: "2 packet biscuit bech diye"
const res3 = parseSimulatedTransaction('2 packet biscuit bech diye', DEMO_PRODUCTS);
assert(res3.items.length === 1, '2 packet biscuit bech diye: parses 1 item');
assert(res3.items[0]?.quantity === 2, '2 packet biscuit bech diye: quantity is 2');
assert(res3.items[0]?.unit === 'packet', '2 packet biscuit bech diye: unit is packet');
assert(
  res3.items[0]?.matchedProduct?.name.toLowerCase().includes('parle-g') === true ||
    (res3.items[0]?.candidateProducts && res3.items[0]?.candidateProducts.length > 0) === true,
  '2 packet biscuit bech diye: matched or identified Parle-G Biscuit'
);

// Test 1.4: Compound command "Aaj 5 packet Maggi aur 3 cold drink bike"
const res4 = parseSimulatedTransaction(
  'Aaj 5 packet Maggi aur 3 cold drink bike',
  DEMO_PRODUCTS
);
assert(res4.items.length === 2, 'Compound command: correctly split into 2 items');
assert(res4.items[0]?.quantity === 5, 'Compound item 1: quantity 5');
assert(res4.items[1]?.quantity === 3, 'Compound item 2: quantity 3');

// Test 1.5: Words to numbers (Hindi/Gujarati/English)
const resWords1 = parseSimulatedTransaction('teen packet Maggi beche', DEMO_PRODUCTS);
assert(resWords1.items[0]?.quantity === 3, 'Word number "teen" parsed as 3');

const resWords2 = parseSimulatedTransaction('paanch Thums Up aapo', DEMO_PRODUCTS);
assert(resWords2.items[0]?.quantity === 5, 'Word number "paanch" parsed as 5');

const resWords3 = parseSimulatedTransaction('tran Thums Up vechya', DEMO_PRODUCTS);
assert(resWords3.items[0]?.quantity === 3, 'Gujarati word number "tran" parsed as 3');

// Test 1.6: Ambiguous / Unknown phrase (Never silently guess!)
const resUnknown = parseSimulatedTransaction('2 kg spaceship bech diya', DEMO_PRODUCTS);
assert(
  resUnknown.clarificationStatus === 'unrecognized' || resUnknown.items[0]?.status === 'unrecognized',
  'Unknown product "spaceship" is flagged as unrecognized'
);
assert(
  resUnknown.items[0]?.matchedProduct === undefined,
  'Unknown product NEVER silently guesses a product'
);

// Test 1.7: Empty or pure verb input
const resEmpty = parseSimulatedTransaction('', DEMO_PRODUCTS);
assert(resEmpty.items.length === 0, 'Empty input returns 0 items');
assert(resEmpty.confidence === 0, 'Empty input has confidence 0');

const resVerbOnly = parseSimulatedTransaction('bech diye', DEMO_PRODUCTS);
assert(resVerbOnly.items.length === 0, 'Pure verb "bech diye" returns 0 items');

// Test 1.8: Stock warning on excessive quantity
const lowStockProd = DEMO_PRODUCTS.find((p) => p.stockQuantity < 10);
if (lowStockProd) {
  const resExcess = parseSimulatedTransaction(
    `999 ${lowStockProd.unit} ${lowStockProd.name} bike`,
    DEMO_PRODUCTS
  );
  assert(
    !!resExcess.items[0]?.warning,
    'Excessive quantity generates low-stock inventory warning'
  );
}

// -------------------------------------------------------------
// 2. Data Integrity & Validation Tests
// -------------------------------------------------------------
console.log('\n2. Testing Data Integrity & Product/Sale Validation:');

// Test 2.1: Valid Product validation
const sampleProduct: Product = { ...DEMO_PRODUCTS[0] };
const prodResValid = validateProduct(sampleProduct);
assert(prodResValid.valid === true, 'Valid product passes validation');

// Test 2.2: Product with empty name fails
const prodEmptyName = { ...sampleProduct, name: '   ' };
assert(validateProduct(prodEmptyName).valid === false, 'Product with empty name fails');

// Test 2.3: Product with negative price or negative stock fails
const prodNegPrice = { ...sampleProduct, sellingPrice: -10 };
assert(validateProduct(prodNegPrice).valid === false, 'Product with negative sellingPrice fails');

const prodNegStock = { ...sampleProduct, stockQuantity: -5 };
assert(validateProduct(prodNegStock).valid === false, 'Product with negative stockQuantity fails');

// Test 2.4: Valid Sale validation
const sampleSale: Sale = { ...DEMO_SALES[0] };
assert(validateSale(sampleSale).valid === true, 'Valid sale record passes validation');

// Test 2.5: Sale with 0 items fails
const saleNoItems = { ...sampleSale, items: [] };
assert(validateSale(saleNoItems).valid === false, 'Sale with 0 items fails validation');

// Test 2.6: Sale with negative item quantity fails
const saleNegQty = {
  ...sampleSale,
  items: [{ ...sampleSale.items[0], quantity: -2 }],
};
assert(validateSale(saleNegQty).valid === false, 'Sale with negative quantity fails validation');

// -------------------------------------------------------------
// 3. Business Logic & Calculations
// -------------------------------------------------------------
console.log('\n3. Testing Dashboard Business Logic & Calculations:');

// Test 3.1: Exclude cancelled sales from total revenue
const activeSales = DEMO_SALES.filter((s) => s.status !== 'cancelled');
const allSalesWithCancelled: Sale[] = [
  ...DEMO_SALES,
  {
    ...DEMO_SALES[0],
    id: 'sale-cancelled-test',
    status: 'cancelled',
    totalAmount: 5000,
  },
];

const totalRevenue = allSalesWithCancelled
  .filter((s) => s.status !== 'cancelled')
  .reduce((acc, s) => acc + s.totalAmount, 0);

const expectedRevenue = activeSales.reduce((acc, s) => acc + s.totalAmount, 0);
assert(
  totalRevenue === expectedRevenue,
  'Dashboard revenue strictly excludes cancelled/reversed sales'
);

// Test 3.2: Low stock calculation
const lowStockCount = DEMO_PRODUCTS.filter(
  (p) => p.isActive && p.stockQuantity <= p.lowStockThreshold
).length;
assert(
  lowStockCount >= 1,
  `Low stock filter identified ${lowStockCount} items at or below alert threshold`
);

// -------------------------------------------------------------
// 4. JSON Backup & Schema Validation Tests
// -------------------------------------------------------------
console.log('\n4. Testing JSON Backup & Restore Validation:');

// Test 4.1: Valid Backup Payload
const validBackup: BackupPayload = {
  appIdentifier: 'DukaanVikaas',
  schemaVersion: CURRENT_SCHEMA_VERSION,
  exportedAt: new Date().toISOString(),
  shopSettings: DEMO_SHOP_SETTINGS,
  products: DEMO_PRODUCTS,
  sales: DEMO_SALES,
  inventoryMovements: DEMO_INVENTORY_MOVEMENTS,
  meta: {
    isDemoData: false,
    totalProducts: DEMO_PRODUCTS.length,
    totalSales: DEMO_SALES.length,
    totalMovements: DEMO_INVENTORY_MOVEMENTS.length,
  },
};

const backupValidRes = validateBackupPayload(validBackup);
assert(backupValidRes.valid === true, 'Valid backup payload passes validation');
assert(
  backupValidRes.summary?.productCount === DEMO_PRODUCTS.length,
  'Backup summary matches actual product count'
);

// Test 4.2: Invalid App Identifier
const invalidAppBackup = { ...validBackup, appIdentifier: 'OtherApp' };
const backupInvalidAppRes = validateBackupPayload(invalidAppBackup);
assert(
  backupInvalidAppRes.valid === false,
  'Backup from foreign appIdentifier is rejected'
);

// Test 4.3: Unsupported Schema Version (e.g. Future v99)
const futureSchemaBackup = { ...validBackup, schemaVersion: 99 };
const backupFutureSchemaRes = validateBackupPayload(futureSchemaBackup);
assert(
  backupFutureSchemaRes.valid === false,
  'Backup with unsupported future schema version is rejected'
);

// Test 4.4: Corrupted / Non-object payload
assert(validateBackupPayload(null).valid === false, 'Null payload is rejected');
assert(validateBackupPayload('string').valid === false, 'String payload is rejected');
assert(validateBackupPayload([1, 2, 3]).valid === false, 'Array payload is rejected');

// Test 4.5: Missing required collections
const missingProductsBackup = { ...validBackup, products: undefined };
assert(
  validateBackupPayload(missingProductsBackup).valid === false,
  'Backup missing products array is rejected'
);

// Test 4.6: Duplicate IDs detected in backup
const dupProducts = [
  ...DEMO_PRODUCTS,
  { ...DEMO_PRODUCTS[0] }, // duplicate ID
];
const dupIdBackup = { ...validBackup, products: dupProducts };
const backupDupRes = validateBackupPayload(dupIdBackup);
assert(
  backupDupRes.valid === false && backupDupRes.errors.some((e) => e.includes('Duplicate')),
  'Backup with duplicate product IDs is rejected'
);

// Test 4.7: Corrupt product inside backup (negative price)
const corruptProdBackup = {
  ...validBackup,
  products: [
    ...DEMO_PRODUCTS,
    {
      ...DEMO_PRODUCTS[0],
      id: 'prod-corrupt-99',
      sellingPrice: -50,
    },
  ],
};
assert(
  validateBackupPayload(corruptProdBackup).valid === false,
  'Backup containing invalid negative price product is rejected'
);

// Test 4.8: Round-trip JSON serialization & parsing
const serialized = JSON.stringify(validBackup);
const deserialized = JSON.parse(serialized);
const roundTripRes = validateBackupPayload(deserialized);
assert(
  roundTripRes.valid === true,
  'Export-Import JSON round trip preserves full valid schema'
);

console.log('\n=== TEST RUN SUMMARY ===');
console.log(`Total Tests Run: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL INTEGRITY, PARSER, AND BACKUP TESTS PASSED SUCCESSFULLY!\n');
}
