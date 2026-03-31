import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default menu items to bootstrap the application
const DEFAULT_MENU = [
  { id: 'm1', name: 'Grilled Salmon', category: 'Mains', price: 24.99, available: true },
  { id: 'm2', name: 'Steak Frites', category: 'Mains', price: 29.50, available: true },
  { id: 'm3', name: 'Chicken Alfredo', category: 'Mains', price: 18.00, available: true },
  { id: 's1', name: 'Caesar Salad', category: 'Salads', price: 12.00, available: true },
  { id: 's2', name: 'Greek Salad', category: 'Salads', price: 11.50, available: true },
  { id: 'd1', name: 'Lemonade', category: 'Drinks', price: 4.50, available: true },
  { id: 'd2', name: 'Craft Beer', category: 'Drinks', price: 6.00, available: true },
  { id: 'd3', name: 'Iced Tea', category: 'Drinks', price: 3.50, available: true }
];

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      orders: [],
      history: [],
      menu: DEFAULT_MENU,

      // --- Order Actions ---
      addOrder: (tableNumber, items, total) => {
        const newOrder = {
          id: `ord_${Date.now()}`,
          tableNumber,
          items,
          total,
          status: 'PENDING',
          timestamp: Date.now(),
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
      },

      updateOrderStatus: (id, newStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order
          ),
        }));
      },

      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }));
      },

      moveOrderToHistory: (id) => {
        set((state) => {
          const order = state.orders.find((o) => o.id === id);
          if (!order) return state;
          
          return {
            orders: state.orders.filter((o) => o.id !== id),
            history: [{ ...order, completedAt: Date.now() }, ...state.history],
          };
        });
      },

      resetOrders: () => set({ orders: [] }),
      clearHistory: () => set({ history: [] }),

      // --- Menu Actions ---
      addMenuItem: (item) => {
        set((state) => ({
          menu: [...state.menu, { ...item, id: `mi_${Date.now()}` }],
        }));
      },

      deleteMenuItem: (id) => {
        set((state) => ({
          menu: state.menu.filter((item) => item.id !== id),
        }));
      },

      toggleMenuItemAvailability: (id) => {
        set((state) => ({
          menu: state.menu.map((item) =>
            item.id === id ? { ...item, available: !item.available } : item
          ),
        }));
      },
    }),
    {
      name: 'restoflow-storage', // key in localStorage
    }
  )
);
