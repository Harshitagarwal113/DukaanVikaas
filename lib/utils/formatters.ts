import { LanguageCode } from '@/types';

/**
 * Format currency using Indian Lakhs & Thousands notation (₹ 1,500.00 / ₹ 1,50,000)
 */
export function formatCurrency(amount: number, showDecimals = false): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  });

  return formatter.format(amount);
}

/**
 * Format date in localized, friendly format for Indian shopkeepers
 */
export function formatDate(
  isoDateString: string,
  includeTime = false,
  lang: LanguageCode = 'en'
): string {
  if (!isoDateString) return '-';
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return isoDateString;

    const localeMap: Record<LanguageCode, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      gu: 'gu-IN',
      hinglish: 'en-IN',
    };

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime
        ? {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }
        : {}),
    };

    return new Intl.DateTimeFormat(localeMap[lang] || 'en-IN', options).format(date);
  } catch {
    return isoDateString;
  }
}

/**
 * Format relative time (e.g., 'Today', 'Yesterday', or 'X days ago')
 */
export function formatRelativeDate(isoDateString: string): string {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(isoDateString, false);
    }
  } catch {
    return isoDateString;
  }
}

/**
 * Helper to combine class names safely
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
