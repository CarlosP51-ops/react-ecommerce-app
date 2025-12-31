import apiClient from './client';

export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data;
  },

  // Moderation
  getPendingProducts: async (page = 1) => {
    const response = await apiClient.get('/admin/products/pending', {
      params: { page },
    });
    return response.data;
  },

  approveProduct: async (productId) => {
    const response = await apiClient.post(`/admin/products/${productId}/approve`);
    return response.data;
  },

  rejectProduct: async (productId, reason) => {
    const response = await apiClient.post(`/admin/products/${productId}/reject`, {
      reason,
    });
    return response.data;
  },

  // Users Management
  getUsers: async (params) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  banUser: async (userId, reason) => {
    const response = await apiClient.post(`/admin/users/${userId}/ban`, { reason });
    return response.data;
  },

  // Finance
  getFinancialOverview: async () => {
    const response = await apiClient.get('/admin/finance/overview');
    return response.data;
  },

  processPayout: async (payoutId) => {
    const response = await apiClient.post(`/admin/payouts/${payoutId}/process`);
    return response.data;
  },

  // Settings
  updateSettings: async (settings) => {
    const response = await apiClient.put('/admin/settings', settings);
    return response.data;
  },

  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },
};