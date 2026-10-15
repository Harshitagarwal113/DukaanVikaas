/**
 * Browser-native random ID generator without external dependencies.
 */
export function generateId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
    } catch {
      // fallback below
    }
  }

  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomSuffix}`;
}

export function generateSaleNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BILL-${year}${month}${day}-${random}`;
}
