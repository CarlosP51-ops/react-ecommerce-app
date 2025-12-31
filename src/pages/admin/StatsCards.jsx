import {
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const StatsCards = ({ data }) => {
  const stats = [
    {
      name: 'Utilisateurs Totaux',
      value: data?.totalUsers || 0,
      change: '+12%',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Revenus Totaux',
      value: `$${data?.totalRevenue?.toLocaleString() || 0}`,
      change: '+24%',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Ventes du Mois',
      value: data?.monthlySales || 0,
      change: '+8%',
      icon: ShoppingCartIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Produits Actifs',
      value: data?.activeProducts || 0,
      change: '+5%',
      icon: CubeIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Taux de Conversion',
      value: `${data?.conversionRate || 0}%`,
      change: '+2.3%',
      icon: ArrowTrendingUpIcon,
      color: 'bg-indigo-500',
    },
    {
      name: 'Litiges Ouverts',
      value: data?.openDisputes || 0,
      change: '-3',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-2">
            <div className="text-sm">
              <span className="font-medium text-green-600">{stat.change}</span>{' '}
              <span className="text-gray-500">vs mois dernier</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;