import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../../../api/products';

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsAPI.searchProducts('', filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProductById(id),
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: productsAPI.getFeaturedProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor-products']);
      queryClient.invalidateQueries(['products']);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => productsAPI.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['vendor-products']);
      queryClient.invalidateQueries(['product', variables.id]);
      queryClient.invalidateQueries(['products']);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor-products']);
      queryClient.invalidateQueries(['products']);
    },
  });
};

export const useProductReviews = (productId) => {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => productsAPI.getProductReviews(productId),
    enabled: !!productId,
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, review }) => productsAPI.addReview(productId, review),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['product-reviews', variables.productId]);
      queryClient.invalidateQueries(['product', variables.productId]);
    },
  });
};