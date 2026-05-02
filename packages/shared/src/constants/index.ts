// ============================================
// TAX CONSTANTS (India GST)
// ============================================
export const GST_SLABS = {
  ZERO: { sgst: 0, cgst: 0, total: 0 },
  FIVE: { sgst: 2.5, cgst: 2.5, total: 5 },
  TWELVE: { sgst: 6, cgst: 6, total: 12 },
  EIGHTEEN: { sgst: 9, cgst: 9, total: 18 },
  TWENTY_EIGHT: { sgst: 14, cgst: 14, total: 28 },
} as const;

// Restaurant food typically falls under 5% GST
export const DEFAULT_GST_SLAB = GST_SLABS.FIVE;

// ============================================
// ORDER CONSTANTS
// ============================================
export const ORDER_TYPE_LABELS = {
  DINE_IN: 'Dine In',
  DELIVERY: 'Delivery',
  PICK_UP: 'Pick Up',
  ONLINE: 'Online',
  OTHER: 'Other',
} as const;

export const PAYMENT_TYPE_LABELS = {
  CASH: 'Cash',
  CARD: 'Card',
  UPI: 'UPI',
  DUE: 'Due',
  OTHER: 'Other',
  NOT_PAID: 'Not Paid',
  SPLIT: 'Split',
} as const;

// ============================================
// TABLE STATUS COLORS (from your screenshot)
// ============================================
export const TABLE_STATUS_COLORS = {
  BLANK: '#E5E7EB',      // Gray - empty table
  RUNNING: '#93C5FD',    // Blue - order in progress
  PRINTED: '#86EFAC',    // Green - bill printed
  PAID: '#FCD34D',       // Yellow-orange - paid
  RUNNING_KOT: '#FDE68A', // Yellow - KOT sent to kitchen
} as const;

// ============================================
// APP CONFIG
// ============================================
export const APP_CONFIG = {
  APP_NAME: 'Restaurant POS',
  VERSION: '1.0.0',
  DEFAULT_CURRENCY: '₹',
  DEFAULT_CURRENCY_CODE: 'INR',
  DEFAULT_TIMEZONE: 'Asia/Kolkata',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'hi', 'ar'],
  SYNC_INTERVAL_MS: 30000, // 30 seconds
  SESSION_TIMEOUT_MS: 8 * 60 * 60 * 1000, // 8 hours
  MAX_HOLD_ORDERS: 50,
  RECEIPT_PAPER_WIDTHS: [58, 80] as const,
} as const;

// ============================================
// API ENDPOINTS
// ============================================
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  MENU: {
    CATEGORIES: '/menu/categories',
    ITEMS: '/menu/items',
    TOGGLE_ITEM: '/menu/items/:id/toggle',
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: '/orders/:id',
    SETTLE: '/orders/:id/settle',
    CANCEL: '/orders/:id/cancel',
    HOLD: '/orders/:id/hold',
  },
  KOTS: {
    BASE: '/kots',
    BY_ID: '/kots/:id',
    STATUS: '/kots/:id/status',
  },
  TABLES: {
    BASE: '/tables',
    AREAS: '/tables/areas',
    BY_ID: '/tables/:id',
    MOVE: '/tables/move',
  },
  PAYMENTS: {
    BASE: '/payments',
    BY_ORDER: '/payments/order/:orderId',
  },
  REPORTS: {
    ORDER_SUMMARY: '/reports/order-summary',
    SALES: '/reports/sales',
    CATEGORY: '/reports/category',
    ITEM_SUMMARY: '/reports/item-summary',
    EMPLOYEE_SUMMARY: '/reports/employee-summary',
    PAYMENT_SUMMARY: '/reports/payment-summary',
  },
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: '/customers/:id',
    SEARCH: '/customers/search',
  },
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: '/inventory/:id',
    LOW_STOCK: '/inventory/low-stock',
  },
  SETTINGS: {
    OUTLET: '/settings/outlet',
    DISPLAY: '/settings/display',
    CALCULATIONS: '/settings/calculations',
    PRINT: '/settings/print',
  },
} as const;
