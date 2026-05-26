import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

type CartProductRow = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency_code: string | null;
  brand: string | null;
  frame_color: string | null;
  frame_material: string | null;
  frame_type: string | null;
  thumbnail_url: string | null;
  ar_enabled: boolean | null;
  avg_rating: number | string | null;
};

type CartItemRow = {
  id: string;
  quantity: number;
  products: CartProductRow | null;
};

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

function toProduct(row: CartProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: row.price_cents,
    currency: row.currency_code ?? 'USD',
    brand: row.brand ?? '',
    model_number: '',
    frame_color: row.frame_color ?? '',
    lens_color: '',
    frame_material: row.frame_material ?? '',
    style: row.frame_type ?? '',
    gender: '',
    face_shape: '',
    images: row.thumbnail_url ? [row.thumbnail_url] : [],
    is_virtual_try_on_enabled: Boolean(row.ar_enabled),
    rating: Number(row.avg_rating ?? 0),
    review_count: 0,
  };
}

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user?.id ?? null;
}

async function getOrCreateActiveCart(userId: string) {
  const { data: existingCart, error: existingError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingCart?.id) return existingCart.id as string;

  const { data: newCart, error: createError } = await supabase
    .from('carts')
    .insert({ user_id: userId, status: 'active' } as never)
    .select('id')
    .single();

  if (createError) throw createError;
  return (newCart as { id: string }).id;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        set({ items: [], isLoading: false, error: null });
        return;
      }

      const cartId = await getOrCreateActiveCart(userId);
      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, products:product_id(*)')
        .eq('cart_id', cartId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const items = ((data ?? []) as unknown as CartItemRow[])
        .filter((item) => item.products)
        .map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product: toProduct(item.products!),
        }));

      set({ items, isLoading: false, error: null });
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const prev = get().items;
    try {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('Please sign in to add items to your cart');

      const cartId = await getOrCreateActiveCart(userId);
      const { data: existingItem, error: existingError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .limit(1)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: ((existingItem as { quantity: number }).quantity ?? 0) + quantity } as never)
          .eq('id', (existingItem as { id: string }).id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cartId,
            product_id: productId,
            quantity,
          } as never);
        if (error) throw error;
      }

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
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) throw error;
    } catch {
      set({ items: prev });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    const prev = get().items;
    set({ items: prev.map(i => i.id === itemId ? { ...i, quantity } : i) });
    try {
      if (quantity <= 0) {
        const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity } as never)
          .eq('id', itemId);
        if (error) throw error;
      }
    } catch {
      set({ items: prev });
    }
  },

  clearCart: async () => {
    const prev = get().items;
    set({ items: [] });
    try {
      const userId = await getCurrentUserId();
      if (!userId) return;
      const cartId = await getOrCreateActiveCart(userId);
      const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId);
      if (error) throw error;
    } catch {
      set({ items: prev });
    }
  },

  getSubtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
