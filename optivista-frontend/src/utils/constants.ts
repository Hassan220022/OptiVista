// API URLs
export const API_BASE_URL = 'http://localhost:3000/api';
export const API_TIMEOUT = 30000; // 30 seconds

// API Endpoints
export const API_ENDPOINTS = {
  // Dashboard endpoints
  DASHBOARD_SUMMARY: '/dashboard/summary',
  DASHBOARD_ACTIVITY: '/dashboard/activity',
  DASHBOARD_TOP_PRODUCTS: '/dashboard/top-products',
  DASHBOARD_POPULAR_AR_MODELS: '/dashboard/popular-ar-models',
  DASHBOARD_SALES_CHART: '/dashboard/sales-chart',
  DASHBOARD_ORDERS_CHART: '/dashboard/orders-chart',
  
  // Auth endpoints
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_VALIDATE_TOKEN: '/auth/validate-token',
  
  // Product endpoints
  PRODUCTS_LIST: '/products',
  PRODUCTS_DETAIL: (id: string) => `/products/${id}`,
  
  // Health check endpoint
  HEALTH: '/health',
};

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy h:mm a';
export const SHORT_DATE_FORMAT = 'MM/dd/yyyy';
export const YEAR_MONTH_FORMAT = 'MMMM yyyy';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id: string) => `/products/${id}`,
  ORDERS: '/orders',
  ORDER_DETAILS: (id: string) => `/orders/${id}`,
  CUSTOMERS: '/customers',
  CUSTOMER_DETAILS: (id: string) => `/customers/${id}`,
  AR_MODELS: '/ar-models',
  AR_MODEL_DETAILS: (id: string) => `/ar-models/${id}`,
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// UI Constants
export const SIDEBAR_WIDTH = 280;
export const HEADER_HEIGHT = 64;
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

// File Upload
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];
export const ALLOWED_3D_MODEL_TYPES = [
  'model/gltf+json',
  'model/gltf-binary',
  'application/octet-stream',
];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  NETWORK: 'Network error. Please check your connection and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};

// App Settings
export const APP_NAME = 'OptiVista Admin';
export const APP_VERSION = '1.0.0';

// File size limits
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPTED_MODEL_TYPES = ['model/gltf-binary', 'model/gltf+json'];

// Notification durations
export const NOTIFICATION_DURATION = {
  INFO: 5000,
  SUCCESS: 3000,
  WARNING: 7000,
  ERROR: 10000,
}; 