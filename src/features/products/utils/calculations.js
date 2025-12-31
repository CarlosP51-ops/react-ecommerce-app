export const calculateDiscountedPrice = (price, discount) => {
  return price - (price * discount / 100);
};

export const calculateCommission = (price, commissionRate) => {
  return price * commissionRate / 100;
};

export const calculateVendorEarnings = (price, commissionRate) => {
  const commission = calculateCommission(price, commissionRate);
  return price - commission;
};

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export const calculateSalesStats = (products) => {
  const stats = {
    totalSales: 0,
    totalRevenue: 0,
    averagePrice: 0,
    topProduct: null,
  };

  if (!products || products.length === 0) return stats;

  let totalPrice = 0;
  let maxSales = 0;

  products.forEach(product => {
    const sales = product.sales || 0;
    const revenue = sales * product.price;
    
    stats.totalSales += sales;
    stats.totalRevenue += revenue;
    totalPrice += product.price;

    if (sales > maxSales) {
      maxSales = sales;
      stats.topProduct = product;
    }
  });

  stats.averagePrice = totalPrice / products.length;

  return stats;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes || allowedTypes.length === 0) return true;
  
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const fileType = file.type.toLowerCase();
  
  return allowedTypes.some(type => {
    if (type.includes('*')) {
      const baseType = type.split('/')[0];
      return fileType.startsWith(baseType);
    }
    return fileType === type.toLowerCase() || 
           type.toLowerCase().endsWith(fileExtension);
  });
};