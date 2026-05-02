// ============================================
// USER & AUTH TYPES
// ============================================
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  outletId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  BILLER = 'BILLER',
  CAPTAIN = 'CAPTAIN',
  KITCHEN = 'KITCHEN',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// OUTLET / RESTAURANT TYPES
// ============================================
export interface Outlet {
  id: string;
  name: string;
  refId: string; // e.g., "A330747R" from screenshot
  address: string;
  phone: string;
  gstNumber: string;
  fssaiNumber: string;
  currency: string;
  timezone: string;
  isActive: boolean;
  settings: OutletSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutletSettings {
  display: DisplaySettings;
  calculations: CalculationSettings;
  print: PrintSettings;
  customer: CustomerSettings;
  onlineOrder: OnlineOrderSettings;
  billingSystem: BillingSystemSettings;
}

export interface DisplaySettings {
  showItemImage: boolean;
  showItemCode: boolean;
  gridColumns: number;
  theme: 'light' | 'dark';
}

export interface CalculationSettings {
  serviceChargePercent: number;
  roundingRule: 'none' | 'round' | 'ceil' | 'floor';
  taxInclusive: boolean;
}

export interface PrintSettings {
  autoPrintKOT: boolean;
  autoPrintBill: boolean;
  printerName: string;
  paperWidth: 58 | 80;
  showLogo: boolean;
  footerText: string;
}

export interface CustomerSettings {
  phoneValidation: boolean;
  mandatoryForDineIn: boolean;
  mandatoryForDelivery: boolean;
}

export interface OnlineOrderSettings {
  autoAccept: boolean;
  acceptTimeout: number; // minutes
  allowCancellation: boolean;
}

export interface BillingSystemSettings {
  syncInterval: number; // seconds
  offlineMode: boolean;
}

// ============================================
// MENU TYPES
// ============================================
export interface MenuCategory {
  id: string;
  name: string;
  outletId: string;
  sortOrder: number;
  isActive: boolean;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  outletId: string;
  shortCode: string;
  price: number;
  taxGroupId: string;
  foodType: FoodType;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  variants: MenuItemVariant[];
  addons: MenuItemAddon[];
  createdAt: Date;
  updatedAt: Date;
}

export enum FoodType {
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
  EGG = 'EGG',
}

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
  groupName: string;
  isRequired: boolean;
}

// ============================================
// TABLE & AREA TYPES
// ============================================
export interface Area {
  id: string;
  name: string; // "Nightindoor", "Outdoor" from screenshot
  outletId: string;
  sortOrder: number;
  isActive: boolean;
  tables: Table[];
}

export interface Table {
  id: string;
  number: number;
  areaId: string;
  capacity: number;
  status: TableStatus;
  currentOrderId: string | null;
  occupiedAt: Date | null;
  amount: number;
}

export enum TableStatus {
  BLANK = 'BLANK',
  RUNNING = 'RUNNING',
  PRINTED = 'PRINTED',
  PAID = 'PAID',
  RUNNING_KOT = 'RUNNING_KOT',
}

// ============================================
// ORDER TYPES
// ============================================
export interface Order {
  id: string;
  orderNumber: number; // e.g., 112, 113 from screenshot
  outletId: string;
  billNumber: number;
  orderType: OrderType;
  orderStatus: OrderStatus;
  tableId: string | null;
  areaType: string | null;
  customerId: string | null;
  billerName: string;
  items: OrderItem[];
  kots: KOT[];
  subtotal: number; // "My Amount" from screenshot
  discount: number;
  deliveryCharge: number;
  containerCharge: number;
  sgst: number;
  cgst: number;
  totalTax: number;
  total: number;
  tip: number;
  totalWithTip: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  reason: string | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  printedAt: Date | null;
  settledAt: Date | null;
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  DELIVERY = 'DELIVERY',
  PICK_UP = 'PICK_UP',
  ONLINE = 'ONLINE',
  OTHER = 'OTHER',
}

export enum OrderStatus {
  SAVED = 'SAVED',
  PRINTED = 'PRINTED',
  CANCELLED = 'CANCELLED',
  COMPLIMENTARY = 'COMPLIMENTARY',
  SALES_RETURN = 'SALES_RETURN',
}

export enum PaymentType {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  DUE = 'DUE',
  OTHER = 'OTHER',
  NOT_PAID = 'NOT_PAID',
  SPLIT = 'SPLIT',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  REFUNDED = 'REFUNDED',
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  taxAmount: number;
  notes: string;
  addons: OrderItemAddon[];
  kotId: string | null;
}

export interface OrderItemAddon {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// ============================================
// KOT (Kitchen Order Ticket) TYPES
// ============================================
export interface KOT {
  id: string;
  kotNumber: number;
  orderId: string;
  orderNumber: number;
  tableNumber: number | null;
  status: KOTStatus;
  items: KOTItem[];
  createdAt: Date;
  printedAt: Date | null;
  acceptedAt: Date | null;
  readyAt: Date | null;
}

export enum KOTStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface KOTItem {
  id: string;
  menuItemName: string;
  quantity: number;
  notes: string;
}

// ============================================
// TAX TYPES
// ============================================
export interface TaxGroup {
  id: string;
  name: string;
  outletId: string;
  taxes: Tax[];
  isActive: boolean;
}

export interface Tax {
  id: string;
  name: string; // "SGST", "CGST"
  rate: number; // e.g., 2.5 for 2.5%
  type: TaxType;
}

export enum TaxType {
  SGST = 'SGST',
  CGST = 'CGST',
  IGST = 'IGST',
  VAT = 'VAT',
  SERVICE_TAX = 'SERVICE_TAX',
}

// ============================================
// PAYMENT TYPES
// ============================================
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentType;
  transactionId: string | null;
  status: PaymentStatus;
  createdAt: Date;
}

// ============================================
// CUSTOMER TYPES
// ============================================
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  outletId: string;
  totalOrders: number;
  totalSpent: number;
  dueAmount: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// REPORT TYPES (matching your screenshots)
// ============================================

// Order Summary Report (Image 2)
export interface OrderSummaryReport {
  date: string;
  orderStatuses: {
    status: OrderStatus;
    myAmount: number;
    total: number;
    orders: number;
  }[];
  paymentBreakdown: {
    type: PaymentType;
    total: number;
  }[];
  grandTotal: {
    myAmount: number;
    total: number;
    orders: number;
  };
}

// Sales Report (Image 7)
export interface SalesReportRow {
  orderNo: number;
  date: string;
  paymentType: PaymentType;
  orderType: string;
  areaType: string;
  myAmount: number;
  discount: number;
  deliveryCharge: number;
  containerCharge: number;
  sgst: number;
  cgst: number;
  total: number;
  billerName: string;
  reason: string | null;
  totalWithTip: number;
}

// Category Report (Image 8)
export interface CategoryReportRow {
  category: string;
  orders: number;
  items: number;
  netAmount: number;
  totalDiscount: number;
  totalTax: number;
  totalSales: number;
  percentage: number;
}

// ============================================
// INVENTORY TYPES
// ============================================
export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  outletId: string;
  lastRestockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// EXPENSE TYPES
// ============================================
export interface Expense {
  id: string;
  outletId: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  createdBy: string;
  createdAt: Date;
}

// ============================================
// CASH FLOW TYPES
// ============================================
export interface CashFlow {
  id: string;
  outletId: string;
  type: 'TOP_UP' | 'WITHDRAWAL' | 'SALE' | 'EXPENSE';
  amount: number;
  description: string;
  balanceAfter: number;
  createdBy: string;
  createdAt: Date;
}

// ============================================
// API RESPONSE WRAPPER
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// SOCKET EVENT TYPES
// ============================================
export enum SocketEvents {
  // Order events
  ORDER_CREATED = 'order:created',
  ORDER_UPDATED = 'order:updated',
  ORDER_CANCELLED = 'order:cancelled',

  // KOT events
  KOT_CREATED = 'kot:created',
  KOT_STATUS_CHANGED = 'kot:statusChanged',

  // Table events
  TABLE_STATUS_CHANGED = 'table:statusChanged',
  TABLE_UPDATED = 'table:updated',

  // Online order events
  ONLINE_ORDER_RECEIVED = 'onlineOrder:received',
  ONLINE_ORDER_ACCEPTED = 'onlineOrder:accepted',
  ONLINE_ORDER_REJECTED = 'onlineOrder:rejected',

  // Notification events
  LOW_STOCK_ALERT = 'alert:lowStock',
  NEW_NOTIFICATION = 'notification:new',
}
