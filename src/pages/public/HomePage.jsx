import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../../api/products';
import ProductCard from '../../components/public/ProductCard';
import Button from '../../components/common/UI/Button';
import Loader from '../../components/common/UI/Loader';
import {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: featuredProducts, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featured-products'],
    queryFn: productsAPI.getFeaturedProducts,
  });

  const { data: trendingProducts, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trending-products'],
    queryFn: () => productsAPI.searchProducts('', { sort: 'trending' }),
  });

  const categories = [
    { id: 'all', name: 'Toutes catégories' },
    { id: 'templates', name: 'Templates' },
    { id: 'plugins', name: 'Plugins' },
    { id: 'graphics', name: 'Graphismes' },
    { id: 'fonts', name: 'Polices' },
    { id: 'courses', name: 'Formations' },
    { id: 'ebooks', name: 'Ebooks' },
  ];

  const features = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Paiement sécurisé',
      description: 'Transactions 100% sécurisées avec cryptage SSL',
    },
    {
      icon: <RocketLaunchIcon className="h-8 w-8" />,
      title: 'Téléchargement instantané',
      description: 'Accès immédiat après paiement',
    },
    {
      icon: <CreditCardIcon className="h-8 w-8" />,
      title: 'Garantie satisfait ou remboursé',
      description: '30 jours pour tester vos produits',
    },
    {
      icon: <ArrowTrendingUpIcon className="h-8 w-8" />,
      title: 'Produits tendance',
      description: 'Sélection des meilleures créations',
    },
  ];

  if (isLoadingFeatured || isLoadingTrending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Votre marketplace de produits numériques
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Découvrez des milliers de produits digitaux de qualité : templates, plugins, graphismes et bien plus.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-4 border border-transparent rounded-lg shadow-sm text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                placeholder="Rechercher des produits, catégories, vendeurs..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Parcourir par catégorie</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border text-center transition-colors ${
                selectedCategory === category.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Produits en vedette</h2>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts?.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Pourquoi choisir DigitalMarket ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white text-indigo-600 mb-4 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tendances du moment</h2>
          <Button variant="outline" size="sm">
            Explorer
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts?.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Prêt à vendre vos créations ?</h2>
        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
          Rejoignez notre communauté de vendeurs et commencez à générer des revenus avec vos produits numériques.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="white" size="lg">
            Devenir vendeur
          </Button>
          <Button variant="outline-white" size="lg">
            En savoir plus
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;