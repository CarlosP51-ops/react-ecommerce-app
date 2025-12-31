export const ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  CLIENT: 'client',
};

export const PRODUCT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DRAFT: 'draft',
};

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const LICENSE_TYPES = {
  PERSONAL: 'personal',
  COMMERCIAL: 'commercial',
  EXTENDED: 'extended',
};

export const PAYMENT_METHODS = {
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  BANK_TRANSFER: 'bank_transfer',
};

export const CATEGORIES = [
  'Templates',
  'Plugins',
  'Graphismes',
  'Polices',
  'Formations',
  'Ebooks',
  'Logiciels',
  'Scripts',
  'Assets',
  'Autres',
];

export const FILE_TYPES = {
  ZIP: 'application/zip',
  PDF: 'application/pdf',
  IMAGE: 'image/*',
  VIDEO: 'video/*',
  AUDIO: 'audio/*',
  TEXT: 'text/*',
};

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_PREVIEW_SIZE = 10 * 1024 * 1024; // 10MB

export const COMMISSION_RATE = 15; // 15%
export const MINIMUM_PAYOUT = 50; // $50

export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  PRODUCTS: {
    LIST: '/products',
    SEARCH: '/products/search',
    DETAIL: '/products/:id',
    PURCHASE: '/products/:id/purchase',
    REVIEWS: '/products/:id/reviews',
    FEATURED: '/products/featured',
  },
  VENDOR: {
    DASHBOARD: '/vendor/dashboard',
    PRODUCTS: '/vendor/products',
    PAYOUTS: '/vendor/payouts',
    ANALYTICS: '/vendor/analytics',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    MODERATION: '/admin/moderation',
    FINANCE: '/admin/finance',
    SETTINGS: '/admin/settings',
  },
};

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm',
};