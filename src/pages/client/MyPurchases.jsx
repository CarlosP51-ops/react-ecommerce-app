import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../../utils/helpers';
import Card from '../../components/common/UI/Card';
import Table from '../../components/common/UI/Table';
import Button from '../../components/common/UI/Button';
import Loader from '../../components/common/UI/Loader';
import { 
  ArrowDownTrayIcon, 
  EyeIcon, 
  ReceiptRefundIcon,
  StarIcon 
} from '@heroicons/react/24/outline';

const MyPurchases = () => {
  const [activeTab, setActiveTab] = useState('all');

  const { data: purchases, isLoading } = useQuery({
    queryKey: ['user-purchases'],
    queryFn: () => Promise.resolve([]), // À remplacer avec l'API réelle
  });

  const tabs = [
    { key: 'all', name: 'Tous', count: purchases?.length || 0 },
    { key: 'downloaded', name: 'Téléchargés', count: 0 },
    { key: 'pending', name: 'En attente', count: 0 },
    { key: 'refunded', name: 'Remboursés', count: 0 },
  ];

  const columns = [
    {
      key: 'product',
      title: 'Produit',
      render: (_, purchase) => (
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-lg object-cover"
            src={purchase.product.image}
            alt={purchase.product.name}
          />
          <div className="ml-4">
            <div className="font-medium text-gray-900">{purchase.product.name}</div>
            <div className="text-sm text-gray-500">Par {purchase.vendor.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      title: 'Date d\'achat',
      render: (date) => formatDate(date, { dateStyle: 'medium' }),
    },
    {
      key: 'price',
      title: 'Prix',
      render: (price) => `$${price}`,
    },
    {
      key: 'license',
      title: 'Licence',
      render: (license) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {license}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, purchase) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/downloads/${purchase.id}`, '_blank')}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/product/${purchase.product.id}`, '_blank')}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Écrire un avis')}
          >
            <StarIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
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
        <h1 className="text-2xl font-semibold text-gray-900">Mes Achats</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérez vos produits achetés et téléchargements
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <ArrowDownTrayIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produits achetés</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <EyeIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <StarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avis écrits</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <ReceiptRefundIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Remboursés</p>
              <p className="text-2xl font-semibold text-gray-900">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Historique d'achats</h3>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              Exporter CSV
            </Button>
            <Button variant="primary" size="sm">
              Nouvel achat
            </Button>
          </div>
        </div>

        {purchases?.length > 0 ? (
          <Table
            columns={columns}
            data={purchases}
            onRowClick={(purchase) => window.open(`/downloads/${purchase.id}`, '_blank')}
          />
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <ArrowDownTrayIcon />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun achat</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par explorer notre catalogue de produits.
            </p>
            <div className="mt-6">
              <Button variant="primary">
                Parcourir les produits
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Support */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Besoin d'aide ?</h3>
            <p className="mt-1 text-sm text-gray-600">
              Des problèmes avec un téléchargement ? Contactez notre support.
            </p>
          </div>
          <Button variant="primary">
            Contacter le support
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MyPurchases;