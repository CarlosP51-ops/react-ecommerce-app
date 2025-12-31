import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';
import { formatPrice, formatDate } from '../../../utils/helpers';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Card from '../../../components/common/UI/Card';
import Button from '../../../components/common/UI/Button';
import Badge from '../../../components/common/UI/Badge';
import Loader from '../../../components/common/UI/Loader';
import {
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CreditCardIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const FinancialOverview = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('revenue');

  const { data: financeData, isLoading } = useQuery({
    queryKey: ['admin-finance', timeRange],
    queryFn: adminAPI.getFinancialOverview,
  });

  // Données pour les graphiques
  const revenueData = financeData?.revenueChart || [
    { month: 'Jan', revenue: 4000, commission: 600 },
    { month: 'Feb', revenue: 3000, commission: 450 },
    { month: 'Mar', revenue: 5000, commission: 750 },
    { month: 'Apr', revenue: 2780, commission: 417 },
    { month: 'May', revenue: 1890, commission: 283 },
    { month: 'Jun', revenue: 2390, commission: 358 },
  ];

  const categoryRevenue = financeData?.categoryRevenue || [
    { name: 'Templates', value: 4000, color: '#3b82f6' },
    { name: 'Plugins', value: 3000, color: '#10b981' },
    { name: 'Graphismes', value: 2000, color: '#8b5cf6' },
    { name: 'Formations', value: 2780, color: '#f59e0b' },
    { name: 'Ebooks', value: 1890, color: '#ef4444' },
  ];

  const stats = [
    {
      name: 'Revenus totaux',
      value: formatPrice(financeData?.totalRevenue || 0),
      change: '+12.5%',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Commissions perçues',
      value: formatPrice(financeData?.totalCommissions || 0),
      change: '+8.2%',
      icon: BanknotesIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Paiements en attente',
      value: formatPrice(financeData?.pendingPayouts || 0),
      change: '-3.1%',
      icon: CreditCardIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Revenus nets',
      value: formatPrice(financeData?.netRevenue || 0),
      change: '+15.3%',
      icon: TrendingUpIcon,
      color: 'bg-purple-500',
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vue d'ensemble financière</h1>
          <p className="mt-2 text-sm text-gray-600">
            Analyse des revenus, commissions et performances financières
          </p>
        </div>
        <div className="flex space-x-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === 'day' ? 'Jour' :
               range === 'week' ? 'Semaine' :
               range === 'month' ? 'Mois' : 'Année'}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.change.startsWith('+') ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} vs période précédente
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Revenus & Commissions</h3>
            <div className="flex space-x-2">
              <Button
                variant={chartType === 'revenue' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('revenue')}
              >
                Revenus
              </Button>
              <Button
                variant={chartType === 'commission' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('commission')}
              >
                Commissions
              </Button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  formatter={(value) => [`$${value}`, '']}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenus" fill="#3b82f6" />
                <Bar dataKey="commission" name="Commissions" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Revenus par catégorie</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Revenus']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryRevenue.map((category) => (
              <div key={category.name} className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-700">{category.name}</span>
                <span className="ml-auto text-sm font-medium text-gray-900">
                  ${category.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Résumé financier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Products */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Top produits</h4>
            <div className="space-y-3">
              {financeData?.topProducts?.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-700 truncate">{product.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${product.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendors */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Top vendeurs</h4>
            <div className="space-y-3">
              {financeData?.topVendors?.map((vendor, index) => (
                <div key={vendor.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-gray-700">
                        {vendor.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{vendor.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${vendor.revenue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Transactions récentes</h4>
            <div className="space-y-3">
              {financeData?.recentTransactions?.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.date, { timeStyle: 'short' })}
                    </p>
                  </div>
                  <Badge
                    variant={transaction.type === 'income' ? 'success' : 'danger'}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialOverview;