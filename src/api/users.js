import apiClient from './client';

export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  // Update user avatar
  updateAvatar: async (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post('/users/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  // Get user's purchase history
  getPurchaseHistory: async (params = {}) => {
    const response = await apiClient.get('/users/purchases', { params });
    return response.data;
  },

  // Get user's downloads
  getDownloads: async () => {
    const response = await apiClient.get('/users/downloads');
    return response.data;
  },

  // Download a purchased file
  downloadFile: async (purchaseId, fileId) => {
    const response = await apiClient.get(`/users/purchases/${purchaseId}/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get license key for a purchase
  getLicenseKey: async (purchaseId) => {
    const response = await apiClient.get(`/users/purchases/${purchaseId}/license`);
    return response.data;
  },

  // Get user's reviews
  getUserReviews: async () => {
    const response = await apiClient.get('/users/reviews');
    return response.data;
  },

  // Submit a review for a purchased product
  submitReview: async (purchaseId, reviewData) => {
    const response = await apiClient.post(`/users/purchases/${purchaseId}/review`, reviewData);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await apiClient.put(`/users/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await apiClient.delete(`/users/reviews/${reviewId}`);
    return response.data;
  },

  // Get user's wishlist
  getWishlist: async () => {
    const response = await apiClient.get('/users/wishlist');
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId) => {
    const response = await apiClient.post('/users/wishlist', { product_id: productId });
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    const response = await apiClient.delete(`/users/wishlist/${productId}`);
    return response.data;
  },

  // Get user's notifications
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/users/notifications', { params });
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    const response = await apiClient.patch(`/users/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    const response = await apiClient.patch('/users/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/users/notifications/${notificationId}`);
    return response.data;
  },

  // Get user's activity log
  getActivityLog: async (params = {}) => {
    const response = await apiClient.get('/users/activity', { params });
    return response.data;
  },

  // Get user's connected accounts
  getConnectedAccounts: async () => {
    const response = await apiClient.get('/users/connections');
    return response.data;
  },

  // Connect a social account
  connectSocialAccount: async (provider, code) => {
    const response = await apiClient.post('/users/connections', {
      provider,
      code,
    });
    return response.data;
  },

  // Disconnect a social account
  disconnectSocialAccount: async (provider) => {
    const response = await apiClient.delete(`/users/connections/${provider}`);
    return response.data;
  },

  // Get user's payment methods
  getPaymentMethods: async () => {
    const response = await apiClient.get('/users/payment-methods');
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (paymentMethodData) => {
    const response = await apiClient.post('/users/payment-methods', paymentMethodData);
    return response.data;
  },

  // Update payment method
  updatePaymentMethod: async (paymentMethodId, paymentMethodData) => {
    const response = await apiClient.put(`/users/payment-methods/${paymentMethodId}`, paymentMethodData);
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (paymentMethodId) => {
    const response = await apiClient.delete(`/users/payment-methods/${paymentMethodId}`);
    return response.data;
  },

  // Set default payment method
  setDefaultPaymentMethod: async (paymentMethodId) => {
    const response = await apiClient.patch(`/users/payment-methods/${paymentMethodId}/default`);
    return response.data;
  },

  // Get user's invoices
  getInvoices: async (params = {}) => {
    const response = await apiClient.get('/users/invoices', { params });
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (invoiceId) => {
    const response = await apiClient.get(`/users/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Request data export
  requestDataExport: async () => {
    const response = await apiClient.post('/users/data-export');
    return response.data;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await apiClient.delete('/users/account', {
      data: { password },
    });
    return response.data;
  },

  // Get account settings
  getSettings: async () => {
    const response = await apiClient.get('/users/settings');
    return response.data;
  },

  // Update account settings
  updateSettings: async (settings) => {
    const response = await apiClient.put('/users/settings', settings);
    return response.data;
  },

  // Get security log
  getSecurityLog: async () => {
    const response = await apiClient.get('/users/security-log');
    return response.data;
  },

  // Enable two-factor authentication
  enable2FA: async () => {
    const response = await apiClient.post('/users/two-factor/enable');
    return response.data;
  },

  // Disable two-factor authentication
  disable2FA: async (code) => {
    const response = await apiClient.post('/users/two-factor/disable', { code });
    return response.data;
  },

  // Verify two-factor authentication
  verify2FA: async (code) => {
    const response = await apiClient.post('/users/two-factor/verify', { code });
    return response.data;
  },

  // Get user's API keys (for developers)
  getApiKeys: async () => {
    const response = await apiClient.get('/users/api-keys');
    return response.data;
  },

  // Create API key
  createApiKey: async (name, permissions = []) => {
    const response = await apiClient.post('/users/api-keys', {
      name,
      permissions,
    });
    return response.data;
  },

  // Delete API key
  deleteApiKey: async (keyId) => {
    const response = await apiClient.delete(`/users/api-keys/${keyId}`);
    return response.data;
  },

  // Get user's referrals
  getReferrals: async () => {
    const response = await apiClient.get('/users/referrals');
    return response.data;
  },

  // Get referral statistics
  getReferralStats: async () => {
    const response = await apiClient.get('/users/referrals/stats');
    return response.data;
  },

  // Get referral link
  getReferralLink: async () => {
    const response = await apiClient.get('/users/referrals/link');
    return response.data;
  },
};