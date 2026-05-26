import { create } from 'zustand';
import { api } from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';
import type { CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const items = await api.get<CartItem[]>(API_ENDPOINTS.cart.list);
      set({ items, isLoading: false, error: null });
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const prev = get().items;
    try {
      await api.post(API_ENDPOINTS.cart.addItem, { product_id: productId, quantity });
      await get().fetchCart();
    } catch {
      set({ items: prev });
      throw new Error('Failed to add to cart');
    }
  },

  removeFromCart: async (itemId) => {
    const prev = get().items;
    set({ items: prev.filter(i => i.id !== itemId) });
    try {
      await api.delete(API_ENDPOINTS.cart.removeItem(itemId));
    } catch {
      set({ items: prev });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    const prev = get().items;
    set({ items: prev.map(i => i.id === itemId ? { ...i, quantity } : i) });
    try {
      await api.put(API_ENDPOINTS.cart.updateItem(itemId), { quantity });
    } catch {
      set({ items: prev });
    }
  },

  clearCart: async () => {
    const prev = get().items;
    set({ items: [] });
    try {
      // Clear via API if endpoint exists
    } catch {
      set({ items: prev });
    }
  },

  getSubtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
