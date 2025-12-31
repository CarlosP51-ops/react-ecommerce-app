import apiClient from './client';

export const vendorAPI = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get('/vendor/dashboard/stats');
    return response.data;
  },

  // Products
  getVendorProducts: async () => {
    const response = await apiClient.get('/vendor/products');
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await apiClient.post('/vendor/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/vendor/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/vendor/products/${id}`);
    return response.data;
  },

  // Payouts
  getPayouts: async () => {
    const response = await apiClient.get('/vendor/payouts');
    return response.data;
  },

  requestPayout: async (data) => {
    const response = await apiClient.post('/vendor/payouts/request', data);
    return response.data;
  },

  // Analytics
  getAnalytics: async (period = 'month') => {
    const response = await apiClient.get('/vendor/analytics', {
      params: { period },
    });
    return response.data;
  },

  // Reviews
  getProductReviews: async (productId) => {
    const response = await apiClient.get(`/vendor/products/${productId}/reviews`);
    return response.data;
  },

  respondToReview: async (reviewId, responseText) => {
    const response = await apiClient.post(`/vendor/reviews/${reviewId}/respond`, {
      response: responseText,
    });
    return response.data;
  },
};