import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export interface TableOrder {
  tableNumber: number;
  areaName: string;
  orderType: 'dineIn' | 'delivery' | 'pickUp';
  items: CartItem[];
  total: number;
  status: 'RUNNING' | 'PRINTED' | 'PAID' | 'RUNNING_KOT';
  startedAt: Date;
}

export interface CompletedOrder {
  id: string;
  orderNumber: number;
  tableNumber: number;
  areaName: string;
  orderType: 'dineIn' | 'delivery' | 'pickUp';
  items: CartItem[];
  subtotal: number;
  sgst: number;
  cgst: number;
  total: number;
  paymentMethod: string;
  billerName: string;
  createdAt: Date;
  settledAt: Date;
}

let nextOrderNumber = 100;

function generateOrderId(): string {
  return 'ORD-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function calculateTax(subtotal: number) {
  const sgst = Math.round((subtotal * 2.5) / 100 * 100) / 100;
  const cgst = Math.round((subtotal * 2.5) / 100 * 100) / 100;
  return { sgst, cgst, total: Math.round((subtotal + sgst + cgst) * 100) / 100 };
}

interface OrderState {
  tableOrders: Record<number, TableOrder>;
  completedOrders: CompletedOrder[];
  pendingOrders: TableOrder[];

  addItemToTable: (tableNumber: number, areaName: string, item: { name: string; price: number }) => void;
  updateItemQuantity: (tableNumber: number, itemName: string, delta: number) => void;
  removeItemFromTable: (tableNumber: number, itemName: string) => void;
  clearTable: (tableNumber: number) => void;
  settleTable: (tableNumber: number, paymentMethod: string) => CompletedOrder | null;
  setTableStatus: (tableNumber: number, status: TableOrder['status']) => void;
  getTableOrder: (tableNumber: number) => TableOrder | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
  tableOrders: {},
  completedOrders: [],
  pendingOrders: [],

  addItemToTable: (tableNumber, areaName, item) => {
    set((state) => {
      const existing = state.tableOrders[tableNumber];

      if (existing) {
        const existingItem = existing.items.find((i) => i.name === item.name);
        let updatedItems: CartItem[];

        if (existingItem) {
          updatedItems = existing.items.map((i) =>
            i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i,
          );
        } else {
          updatedItems = [...existing.items, { ...item, quantity: 1 }];
        }

        const total = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        return {
          tableOrders: {
            ...state.tableOrders,
            [tableNumber]: { ...existing, items: updatedItems, total },
          },
        };
      } else {
        const newOrder: TableOrder = {
          tableNumber,
          areaName,
          orderType: 'dineIn',
          items: [{ ...item, quantity: 1 }],
          total: item.price,
          status: 'RUNNING',
          startedAt: new Date(),
        };

        return {
          tableOrders: { ...state.tableOrders, [tableNumber]: newOrder },
        };
      }
    });
  },

  updateItemQuantity: (tableNumber, itemName, delta) => {
    set((state) => {
      const order = state.tableOrders[tableNumber];
      if (!order) return state;

      const updatedItems = order.items
        .map((i) => (i.name === itemName ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);

      if (updatedItems.length === 0) {
        const { [tableNumber]: _, ...rest } = state.tableOrders;
        return { tableOrders: rest };
      }

      const total = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return {
        tableOrders: {
          ...state.tableOrders,
          [tableNumber]: { ...order, items: updatedItems, total },
        },
      };
    });
  },

  removeItemFromTable: (tableNumber, itemName) => {
    set((state) => {
      const order = state.tableOrders[tableNumber];
      if (!order) return state;

      const updatedItems = order.items.filter((i) => i.name !== itemName);

      if (updatedItems.length === 0) {
        const { [tableNumber]: _, ...rest } = state.tableOrders;
        return { tableOrders: rest };
      }

      const total = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return {
        tableOrders: {
          ...state.tableOrders,
          [tableNumber]: { ...order, items: updatedItems, total },
        },
      };
    });
  },

  clearTable: (tableNumber) => {
    set((state) => {
      const { [tableNumber]: _, ...rest } = state.tableOrders;
      return { tableOrders: rest };
    });
  },

  settleTable: (tableNumber, paymentMethod) => {
    const state = get();
    const order = state.tableOrders[tableNumber];
    if (!order || order.items.length === 0) return null;

    const subtotal = order.total;
    const tax = calculateTax(subtotal);

    const completedOrder: CompletedOrder = {
      id: generateOrderId(),
      orderNumber: ++nextOrderNumber,
      tableNumber: order.tableNumber,
      areaName: order.areaName,
      orderType: order.orderType,
      items: [...order.items],
      subtotal,
      sgst: tax.sgst,
      cgst: tax.cgst,
      total: tax.total,
      paymentMethod,
      billerName: 'biller',
      createdAt: order.startedAt,
      settledAt: new Date(),
    };

    set((state) => {
      const { [tableNumber]: _, ...restTables } = state.tableOrders;
      return {
        tableOrders: restTables,
        completedOrders: [completedOrder, ...state.completedOrders],
      };
    });

    return completedOrder;
  },

  setTableStatus: (tableNumber, status) => {
    set((state) => {
      const order = state.tableOrders[tableNumber];
      if (!order) return state;

      return {
        tableOrders: {
          ...state.tableOrders,
          [tableNumber]: { ...order, status },
        },
      };
    });
  },

  getTableOrder: (tableNumber) => {
    return get().tableOrders[tableNumber];
  },
}),
    {
      name: 'pos-orders',
    },
  ),
);