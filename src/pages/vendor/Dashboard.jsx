import { useQuery } from '@tanstack/react-query';
import { vendorAPI } from '../../api/vendor';
import { formatPrice } from '../../utils/helpers';
import Card from '../../components/common/UI/Card';
import Button from '../../components/common/UI/Button';
import Loader from '../../components/common/UI/Loader';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

const VendorDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['vendor-dashboard'],
    queryFn: vendorAPI.getDashboardStats,
  });

  const stats = [
    {
      name: 'Revenus totaux',
      value: formatPrice(dashboardData?.totalRevenue || 0),
      change: dashboardData?.revenueChange || '+0%',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Ventes ce mois',
      value: dashboardData?.monthlySales || 0,
      change: dashboardData?.salesChange || '+0%',
      icon: ShoppingCartIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Taux de conversion',
      value: `${dashboardData?.conversionRate || 0}%`,
      change: dashboardData?.conversionChange || '+0%',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Clients actifs',
      value: dashboardData?.activeCustomers || 0,
      change: dashboardData?.customersChange || '+0%',
      icon: UserGroupIcon,
      color: 'bg-yellow-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord Vendeur</h1>
        <p className="mt-2 text-sm text-gray-600">
          Vue d'ensemble de vos performances et ventes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
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
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un produit</h3>
          <p className="text-sm text-gray-600 mb-4">
            Publiez un nouveau produit numérique
          </p>
          <Button variant="primary" fullWidth>
            Créer un produit
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Demander un paiement</h3>
          <p className="text-sm text-gray-600 mb-4">
            Retirez vos gains disponibles
          </p>
          <Button variant="success" fullWidth>
            Demander un retrait
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Voir les statistiques</h3>
          <p className="text-sm text-gray-600 mb-4">
            Analyse détaillée de vos performances
          </p>
          <Button variant="outline" fullWidth>
            Voir les rapports
          </Button>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Ventes récentes</h3>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </div>
        
        {dashboardData?.recentSales?.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <ShoppingCartIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{sale.productName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(sale.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatPrice(sale.amount)}</div>
                  <div className="text-sm text-gray-500">Commission: {formatPrice(sale.commission)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune vente récente</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vos ventes apparaîtront ici.
            </p>
          </div>
        )}
      </Card>

      {/* Performance Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Résumé des performances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Top produits</h4>
            <div className="space-y-3">
              {dashboardData?.topProducts?.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{product.name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {product.sales} ventes
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Revenus par catégorie</h4>
            <div className="space-y-3">
              {dashboardData?.revenueByCategory?.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{category.name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(category.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VendorDashboard;