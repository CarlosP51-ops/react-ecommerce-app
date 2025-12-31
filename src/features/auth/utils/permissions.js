export const PERMISSIONS = {
  // Admin permissions
  ADMIN: {
    VIEW_DASHBOARD: 'admin:view_dashboard',
    MANAGE_USERS: 'admin:manage_users',
    MANAGE_PRODUCTS: 'admin:manage_products',
    MANAGE_SETTINGS: 'admin:manage_settings',
    VIEW_FINANCE: 'admin:view_finance',
    PROCESS_PAYOUTS: 'admin:process_payouts',
  },
  
  // Vendor permissions
  VENDOR: {
    VIEW_DASHBOARD: 'vendor:view_dashboard',
    MANAGE_OWN_PRODUCTS: 'vendor:manage_own_products',
    VIEW_SALES: 'vendor:view_sales',
    REQUEST_PAYOUT: 'vendor:request_payout',
    VIEW_ANALYTICS: 'vendor:view_analytics',
  },
  
  // Client permissions
  CLIENT: {
    VIEW_PRODUCTS: 'client:view_products',
    PURCHASE_PRODUCTS: 'client:purchase_products',
    VIEW_PURCHASES: 'client:view_purchases',
    WRITE_REVIEWS: 'client:write_reviews',
    DOWNLOAD_PRODUCTS: 'client:download_products',
  },
};

export const ROLE_PERMISSIONS = {
  admin: [
    ...Object.values(PERMISSIONS.ADMIN),
    ...Object.values(PERMISSIONS.VENDOR),
    ...Object.values(PERMISSIONS.CLIENT),
  ],
  vendor: [
    ...Object.values(PERMISSIONS.VENDOR),
    ...Object.values(PERMISSIONS.CLIENT),
  ],
  client: Object.values(PERMISSIONS.CLIENT),
};

export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
};

export const hasAnyPermission = (user, permissions) => {
  return permissions.some(permission => hasPermission(user, permission));
};

export const hasAllPermissions = (user, permissions) => {
  return permissions.every(permission => hasPermission(user, permission));
};

// HOC for permission checking
export const withPermission = (permission) => (Component) => {
  return function WithPermissionWrapper(props) {
    const { user } = useAuth();
    
    if (!hasPermission(user, permission)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    return <Component {...props} />;
  };
};