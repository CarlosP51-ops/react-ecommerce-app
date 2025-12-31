import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Button from '../common/UI/Button';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
      {/* Product Image/Preview */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-t-lg overflow-hidden">
        {product.previewUrl ? (
          <img
            src={product.previewUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <EyeIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Product Tags */}
        <div className="absolute top-2 left-2">
          {product.isNew && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
              Nouveau
            </span>
          )}
          {product.isFeatured && (
            <span className="ml-1 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
              Populaire
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
            {product.category}
          </span>
          <span className="text-sm text-gray-500">{product.fileType}</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <StarIcon
                key={rating}
                className={`h-4 w-4 ${
                  rating < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-600">
            {product.rating} ({product.reviewCount} avis)
          </span>
        </div>

        {/* Vendor & Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-gray-700">
                {product.vendorName?.[0] || 'V'}
              </span>
            </div>
            <span className="text-xs text-gray-600">{product.vendorName}</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="block text-xs text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" fullWidth>
              <EyeIcon className="h-4 w-4 mr-1" />
              Voir
            </Button>
          </Link>
          <Button variant="primary" size="sm" className="flex-1">
            <ShoppingCartIcon className="h-4 w-4 mr-1" />
            Acheter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;