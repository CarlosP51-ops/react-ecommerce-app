import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';

const VendorStats = ({ stats }) => {
  const statCards = [
    {
      name: 'Revenus totaux',
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      change: stats?.revenueChange || '+0%',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Ventes ce mois',
      value: stats?.monthlySales || 0,
      change: stats?.salesChange || '+0%',
      icon: ShoppingCartIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Taux de conversion',
      value: `${stats?.conversionRate || 0}%`,
      change: stats?.conversionChange || '+0%',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Clients actifs',
      value: stats?.activeCustomers || 0,
      change: stats?.customersChange || '+0%',
      icon: UserGroupIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
              <div className="flex items-center mt-1">
                {stat.change.startsWith('+') ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} vs mois dernier
                </span>
              </div>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorStats;