import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin';
import { formatPrice, formatDate } from '../../utils/helpers';
import Card from '../../components/common/UI/Card';
import Table from '../../components/common/UI/Table';
import Button from '../../components/common/UI/Button';
import Badge from '../../components/common/UI/Badge';
import Loader from '../../components/common/UI/Loader';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const AdminFinance = () => {
  const [timeRange, setTimeRange] = useState('month');
  const queryClient = useQueryClient();

  const { data: financeData, isLoading } = useQuery({
    queryKey: ['admin-finance', timeRange],
    queryFn: adminAPI.getFinancialOverview,
  });

  const processPayoutMutation = useMutation({
    mutationFn: adminAPI.processPayout,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-finance']);
    },
  });

  const handleProcessPayout = (payoutId) => {
    if (confirm('Traiter ce paiement ?')) {
      processPayoutMutation.mutate(payoutId);
    }
  };

  const stats = [
    {
      name: 'Revenus totaux',
      value: formatPrice(financeData?.totalRevenue || 0),
      change: '+12.5%',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Commissions',
      value: formatPrice(financeData?.totalCommissions || 0),
      change: '+8.2%',
      icon: ArrowTrendingUpIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Paiements en attente',
      value: formatPrice(financeData?.pendingPayouts || 0),
      change: '-3.1%',
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Revenus nets',
      value: formatPrice(financeData?.netRevenue || 0),
      change: '+15.3%',
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
    },
  ];

  const payoutColumns = [
    {
      key: 'vendor',
      title: 'Vendeur',
      render: (_, payout) => (
        <div className="font-medium text-gray-900">{payout.vendor.name}</div>
      ),
    },
    {
      key: 'amount',
      title: 'Montant',
      render: (amount) => formatPrice(amount),
    },
    {
      key: 'requestedDate',
      title: 'Demandé le',
      render: (date) => formatDate(date),
    },
    {
      key: 'method',
      title: 'Méthode',
      render: (method) => (
        <Badge variant="info">
          {method === 'paypal' ? 'PayPal' :
           method === 'bank_transfer' ? 'Virement' : 'Carte'}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Statut',
      render: (status) => (
        <Badge
          variant={
            status === 'pending' ? 'warning' :
            status === 'processed' ? 'success' : 'danger'
          }
        >
          {status === 'pending' ? 'En attente' :
           status === 'processed' ? 'Traité' : 'Échoué'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, payout) => (
        payout.status === 'pending' ? (
          <Button
            variant="success"
            size="sm"
            onClick={() => handleProcessPayout(payout.id)}
            loading={processPayoutMutation.isLoading}
          >
            <CheckCircleIcon className="h-4 w-4" />
          </Button>
        ) : null
      ),
    },
  ];

  const transactionColumns = [
    {
      key: 'id',
      title: 'ID Transaction',
      render: (id) => <span className="font-mono text-sm">{id.slice(0, 8)}...</span>,
    },
    {
      key: 'user',
      title: 'Client',
      render: (_, transaction) => transaction.user.name,
    },
    {
      key: 'amount',
      title: 'Montant',
      render: (amount) => formatPrice(amount),
    },
    {
      key: 'type',
      title: 'Type',
      render: (type) => (
        <Badge
          variant={
            type === 'purchase' ? 'success' :
            type === 'refund' ? 'danger' : 'warning'
          }
        >
          {type === 'purchase' ? 'Achat' :
           type === 'refund' ? 'Remboursement' : 'Commission'}
        </Badge>
      ),
    },
    {
      key: 'date',
      title: 'Date',
      render: (date) => formatDate(date, { timeStyle: 'short' }),
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Finance</h1>
          <p className="mt-2 text-sm text-gray-600">
            Vue d'ensemble financière et gestion des paiements
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} vs période précédente
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Payouts */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Paiements en attente</h3>
          <Badge variant="warning">
            {financeData?.pendingPayoutsCount || 0} en attente
          </Badge>
        </div>
        
        {financeData?.pendingPayouts?.length > 0 ? (
          <Table
            columns={payoutColumns}
            data={financeData.pendingPayouts}
          />
        ) : (
          <div className="text-center py-8">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun paiement en attente
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tous les paiements ont été traités.
            </p>
          </div>
        )}
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Transactions récentes
        </h3>
        
        {financeData?.recentTransactions?.length > 0 ? (
          <Table
            columns={transactionColumns}
            data={financeData.recentTransactions}
          />
        ) : (
          <div className="text-center py-8">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Aucune transaction récente</p>
          </div>
        )}
      </Card>

      {/* Commission Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Paramètres des commissions
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Taux de commission</p>
              <p className="text-sm text-gray-500">Pourcentage prélevé sur chaque vente</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {financeData?.commissionRate || 15}%
              </span>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Seuil de paiement</p>
              <p className="text-sm text-gray-500">Montant minimum pour retrait</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(financeData?.payoutThreshold || 50)}
              </span>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminFinance;