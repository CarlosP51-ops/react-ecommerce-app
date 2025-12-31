import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/20/solid';

const ProductStats = ({ product }) => {
  const stats = [
    {
      name: 'Vues',
      value: product.views || 0,
      change: product.viewChange || '+0%',
      trendingUp: true,
    },
    {
      name: 'Ajouts au panier',
      value: product.addsToCart || 0,
      change: product.cartChange || '+0%',
      trendingUp: true,
    },
    {
      name: 'Taux de conversion',
      value: `${product.conversionRate || 0}%`,
      change: product.conversionChange || '+0%',
      trendingUp: product.conversionChange?.startsWith('+'),
    },
    {
      name: 'Revenus',
      value: `$${product.revenue || 0}`,
      change: product.revenueChange || '+0%',
      trendingUp: product.revenueChange?.startsWith('+'),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-full ${stat.trendingUp ? 'bg-green-100' : 'bg-red-100'}`}>
              {stat.trendingUp ? (
                <TrendingUpIcon className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDownIcon className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm ${stat.trendingUp ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} vs mois dernier
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;