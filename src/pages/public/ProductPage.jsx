import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, usersAPI } from '../../api';
import { formatPrice } from '../../utils/helpers';
import Card from '../../components/common/UI/Card';
import Button from '../../components/common/UI/Button';
import Loader from '../../components/common/UI/Loader';
import Badge from '../../components/common/UI/Badge';
import {
  StarIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShoppingCartIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const ProductPage = () => {
  const { id } = useParams();
  const [selectedLicense, setSelectedLicense] = useState('personal');
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProductById(id),
    enabled: !!id,
  });

  const { data: preview, isLoading: isLoadingPreview } = useQuery({
    queryKey: ['product-preview', id],
    queryFn: () => productsAPI.getProductPreview(id),
    enabled: !!id,
  });

  const purchaseMutation = useMutation({
    mutationFn: () => productsAPI.purchaseProduct(id, { license: selectedLicense, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-purchases']);
      alert('Achat réussi !');
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: () => usersAPI.addToWishlist(id),
    onSuccess: () => {
      alert('Ajouté à la liste de souhaits');
    },
  });

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Produit non trouvé</h2>
        <p className="mt-2 text-gray-600">Le produit que vous recherchez n'existe pas.</p>
      </div>
    );
  }

  const licensePrices = {
    personal: product.price,
    commercial: product.price * 2,
    extended: product.price * 3,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="text-gray-500 hover:text-gray-700">
              Accueil
            </a>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <a href={`/categories/${product.category}`} className="text-gray-500 hover:text-gray-700">
              {product.category}
            </a>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="text-gray-900 font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Product Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <Badge variant={product.isFeatured ? 'warning' : 'primary'}>
                {product.isFeatured ? 'Populaire' : 'Nouveau'}
              </Badge>
            </div>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu</h3>
            {isLoadingPreview ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <div className="text-center">
                  <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aperçu sécurisé du produit</p>
                  <Button variant="outline" className="mt-4">
                    Voir l'aperçu complet
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Features */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fonctionnalités</h3>
            <ul className="space-y-3">
              {product.features?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-5 w-5 text-green-500 mr-3">✓</div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Reviews */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Avis clients</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={`h-5 w-5 ${
                        rating < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviewCount} avis)
                </span>
              </div>
            </div>
            
            {/* Review List */}
            <div className="space-y-4">
              {product.reviews?.slice(0, 3).map((review) => (
                <div key={review.id} className="border-t pt-4">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">{review.user.name}</p>
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={`h-4 w-4 ${
                              rating < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            
            {product.reviews?.length > 3 && (
              <Button variant="outline" className="w-full mt-4">
                Voir tous les avis
              </Button>
            )}
          </Card>
        </div>

        {/* Right Column - Purchase Box */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(licensePrices[selectedLicense])}
                </span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discount && (
                <Badge variant="success" className="mt-2">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {/* License Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Type de licence</h4>
              <div className="space-y-2">
                {['personal', 'commercial', 'extended'].map((license) => (
                  <label
                    key={license}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                      selectedLicense === license
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="license"
                        value={license}
                        checked={selectedLicense === license}
                        onChange={(e) => setSelectedLicense(e.target.value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900 capitalize">
                          {license === 'personal' ? 'Usage personnel' :
                           license === 'commercial' ? 'Usage commercial' : 'Licence étendue'}
                        </span>
                        <p className="text-sm text-gray-500">
                          {license === 'personal' ? 'Pour projets personnels' :
                           license === 'commercial' ? 'Pour projets commerciaux' :
                           'Distribution et revente'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatPrice(licensePrices[license])}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quantité</h4>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-10 w-16 text-center border-t border-b border-gray-300"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => purchaseMutation.mutate()}
                loading={purchaseMutation.isLoading}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Acheter maintenant
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => addToWishlistMutation.mutate()}
                loading={addToWishlistMutation.isLoading}
              >
                Ajouter à la liste de souhaits
              </Button>
            </div>

            {/* Product Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                Dernière mise à jour: {new Date(product.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                {product.downloads} téléchargements
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UserGroupIcon className="h-4 w-4 mr-2" />
                {product.sales} ventes
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Garantie satisfait ou remboursé 30 jours
              </div>
            </div>
          </Card>

          {/* Vendor Info */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="font-semibold text-gray-700">
                  {product.vendor.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{product.vendor.name}</h4>
                <p className="text-sm text-gray-600">Vendeur vérifié</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Note vendeur</span>
                <span className="font-medium text-gray-900">{product.vendor.rating}/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Produits</span>
                <span className="font-medium text-gray-900">{product.vendor.productCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Clients</span>
                <span className="font-medium text-gray-900">{product.vendor.customerCount}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir le profil
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;