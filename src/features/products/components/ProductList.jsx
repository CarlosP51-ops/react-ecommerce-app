import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../../../components/storefront/ProductCard';
import Loader from '../../../components/common/UI/Loader';
import Button from '../../../components/common/UI/Button';
import CategoryFilter from '../../../components/storefront/CategoryFilter';
import { FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

const ProductList = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'popular',
    viewMode: 'grid',
    minPrice: null,
    maxPrice: null,
  });

  const { data: products, isLoading, isError } = useProducts(filters);

  const handleCategoryChange = (category) => {
    setFilters({ ...filters, category });
  };

  const handleSortChange = (sortBy) => {
    setFilters({ ...filters, sortBy });
  };

  const handleViewModeChange = (mode) => {
    setFilters({ ...filters, viewMode: mode });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Erreur de chargement</h3>
        <p className="mt-2 text-gray-600">Impossible de charger les produits.</p>
        <Button variant="primary" className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filtres</span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={filters.viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </Button>
              <Button
                variant={filters.viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
              >
                <ListBulletIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="block w-48 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="popular">Les plus populaires</option>
              <option value="newest">Les plus récents</option>
              <option value="price_low">Prix croissant</option>
              <option value="price_high">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
            </select>

            <Button variant="outline" size="sm">
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <CategoryFilter
              selectedCategory={filters.category}
              onCategoryChange={handleCategoryChange}
            />

            {/* Price Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Prix</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min: ${filters.minPrice || 0}</span>
                  <span className="text-sm text-gray-600">Max: ${filters.maxPrice || 1000}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="lg:col-span-3">
          {products?.length > 0 ? (
            <div className={filters.viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={filters.viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
              <p className="mt-2 text-gray-600">Essayez de modifier vos filtres.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;