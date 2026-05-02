import { DEFAULT_GST_SLAB, APP_CONFIG } from '../constants';

// ============================================
// TAX CALCULATIONS
// ============================================
export function calculateTax(
  amount: number,
  sgstRate: number = DEFAULT_GST_SLAB.sgst,
  cgstRate: number = DEFAULT_GST_SLAB.cgst,
) {
  const sgst = roundToTwo((amount * sgstRate) / 100);
  const cgst = roundToTwo((amount * cgstRate) / 100);
  return {
    sgst,
    cgst,
    totalTax: roundToTwo(sgst + cgst),
    totalWithTax: roundToTwo(amount + sgst + cgst),
  };
}

export function calculateTaxInclusive(
  totalWithTax: number,
  sgstRate: number = DEFAULT_GST_SLAB.sgst,
  cgstRate: number = DEFAULT_GST_SLAB.cgst,
) {
  const totalRate = sgstRate + cgstRate;
  const baseAmount = roundToTwo(totalWithTax / (1 + totalRate / 100));
  const sgst = roundToTwo((baseAmount * sgstRate) / 100);
  const cgst = roundToTwo((baseAmount * cgstRate) / 100);
  return { baseAmount, sgst, cgst, totalTax: roundToTwo(sgst + cgst) };
}

// ============================================
// NUMBER FORMATTING
// ============================================
export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(
  amount: number,
  currency: string = APP_CONFIG.DEFAULT_CURRENCY,
): string {
  return `${currency} ${amount.toFixed(2)}`;
}

export function formatNumber(num: number): string {
  // Indian number formatting: 1,00,000 instead of 100,000
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ============================================
// DATE FORMATTING
// ============================================
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

// ============================================
// ORDER HELPERS
// ============================================
export function generateOrderNumber(lastOrderNumber: number): number {
  return lastOrderNumber + 1;
}

export function calculateOrderTotal(items: { unitPrice: number; quantity: number }[]): number {
  return roundToTwo(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
}

export function calculateDiscount(amount: number, discountPercent: number): number {
  return roundToTwo((amount * discountPercent) / 100);
}

// ============================================
// TABLE HELPERS
// ============================================
export function getOccupiedDuration(occupiedAt: Date | string | null): string {
  if (!occupiedAt) return '';
  const now = new Date();
  const start = new Date(occupiedAt);
  const diffMs = now.getTime() - start.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes} Min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// ============================================
// VALIDATION HELPERS
// ============================================
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function isValidGST(gst: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
