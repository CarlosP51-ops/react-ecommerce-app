import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin';
import Card from '../../components/common/UI/Card';
import Loader from '../../components/common/UI/Loader';
import StatsCards from '../../components/admin/dashboard/StatsCards';
import RecentActivities from '../../components/admin/dashboard/RecentActivities';
import PendingApprovals from '../../components/admin/dashboard/PendingApprovals';
import PlatformMetrics from '../../components/admin/dashboard/PlatformMetrics';

const AdminDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminAPI.getDashboardStats,
    refetchOnWindowFocus: false,
  });

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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Tableau de Bord Administrateur
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Vue d'ensemble de la plateforme et activités récentes
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards data={dashboardData?.stats} />

      {/* Charts & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Métriques de la Plateforme
          </h3>
          <PlatformMetrics metrics={dashboardData?.metrics} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Activités Récentes
          </h3>
          <RecentActivities activities={dashboardData?.recentActivities} />
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Produits en attente d'approbation
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {dashboardData?.pendingApprovals?.length || 0} en attente
          </span>
        </div>
        <PendingApprovals approvals={dashboardData?.pendingApprovals} />
      </Card>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Valider les Paiements
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Modérer les Avis
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Gérer les Litiges
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;