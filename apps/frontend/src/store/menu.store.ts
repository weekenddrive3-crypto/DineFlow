import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MENU_DATA } from '@/data/menu';

export interface MenuItemData {
  id: string;
  name: string;
  price: number;
  halfPrice?: number;
  foodType: 'VEG' | 'NON_VEG' | 'EGG';
  isActive: boolean;
}

export interface CategoryData {
  id: string;
  name: string;
  items: MenuItemData[];
  isActive: boolean;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Convert the static menu data into store format with IDs
function initializeMenu(): CategoryData[] {
  return MENU_DATA.map((cat) => ({
    id: generateId(),
    name: cat.name,
    isActive: true,
    items: cat.items.map((item) => ({
      id: generateId(),
      name: item.name,
      price: item.price,
      halfPrice: item.halfPrice,
      foodType: item.foodType,
      isActive: true,
    })),
  }));
}

interface MenuState {
  categories: CategoryData[];
  initialized: boolean;

  // Category actions
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;

  // Item actions
  addItem: (categoryId: string, item: Omit<MenuItemData, 'id' | 'isActive'>) => void;
  updateItem: (categoryId: string, itemId: string, updates: Partial<MenuItemData>) => void;
  deleteItem: (categoryId: string, itemId: string) => void;
  toggleItem: (categoryId: string, itemId: string) => void;

  // Helpers
  getActiveCategories: () => CategoryData[];
  getItemsByCategory: (categoryName: string) => MenuItemData[];
  getCategoryNames: () => string[];

  // Reset
  resetToDefault: () => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      categories: initializeMenu(),
      initialized: true,

      // ---- Category Actions ----
      addCategory: (name) => {
        set((state) => ({
          categories: [
            ...state.categories,
            { id: generateId(), name, isActive: true, items: [] },
          ],
        }));
      },

      updateCategory: (id, name) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, name } : c,
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      toggleCategory: (id) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c,
          ),
        }));
      },

      // ---- Item Actions ----
      addItem: (categoryId, item) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? { ...c, items: [...c.items, { ...item, id: generateId(), isActive: true }] }
              : c,
          ),
        }));
      },

      updateItem: (categoryId, itemId, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  items: c.items.map((i) =>
                    i.id === itemId ? { ...i, ...updates } : i,
                  ),
                }
              : c,
          ),
        }));
      },

      deleteItem: (categoryId, itemId) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
              : c,
          ),
        }));
      },

      toggleItem: (categoryId, itemId) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  items: c.items.map((i) =>
                    i.id === itemId ? { ...i, isActive: !i.isActive } : i,
                  ),
                }
              : c,
          ),
        }));
      },

      // ---- Helpers ----
      getActiveCategories: () => {
        return get().categories.filter((c) => c.isActive);
      },

      getItemsByCategory: (categoryName) => {
        const cat = get().categories.find((c) => c.name === categoryName && c.isActive);
        return cat?.items.filter((i) => i.isActive) || [];
      },

      getCategoryNames: () => {
        return get().categories.filter((c) => c.isActive).map((c) => c.name);
      },

      resetToDefault: () => {
        set({ categories: initializeMenu() });
      },
    }),
    {
      name: 'pos-menu',
    },
  ),
);