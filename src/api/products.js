import apiClient from './client';

export const productsAPI = {
  // Storefront
  getFeaturedProducts: async () => {
    const response = await apiClient.get('/products/featured');
    return response.data;
  },

  searchProducts: async (query, filters = {}) => {
    const response = await apiClient.get('/products/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getProductPreview: async (id) => {
    const response = await apiClient.get(`/products/${id}/preview`);
    return response.data;
  },

  // Client actions
  purchaseProduct: async (productId, paymentMethod) => {
    const response = await apiClient.post(`/products/${productId}/purchase`, {
      payment_method: paymentMethod,
    });
    return response.data;
  },

  addReview: async (productId, review) => {
    const response = await apiClient.post(`/products/${productId}/reviews`, review);
    return response.data;
  },

  // Vendor actions
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

  uploadProductFile: async (productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(
      `/vendor/products/${id}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};