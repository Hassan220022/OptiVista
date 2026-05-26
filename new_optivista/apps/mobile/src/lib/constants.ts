export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    me: '/users/me',
  },
  // Products
  products: {
    list: '/products/',
    detail: (id: string) => `/products/${id}`,
  },
  // Cart
  cart: {
    list: '/cart/',
    addItem: '/cart/items',
    updateItem: (id: string) => `/cart/items/${id}`,
    removeItem: (id: string) => `/cart/items/${id}`,
  },
  // Orders
  orders: {
    list: '/orders/',
    create: '/orders/',
    detail: (id: string) => `/orders/${id}`,
  },
  // Feedback
  feedback: {
    create: '/feedback/',
  },
} as const;

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const RADII = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;
