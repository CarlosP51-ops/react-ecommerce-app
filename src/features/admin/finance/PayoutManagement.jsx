import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';
import { formatPrice, formatDate } from '../../../utils/helpers';
import Card from '../../../components/common/UI/Card';
import Table from '../../../components/common/UI/Table';
import Button from '../../../components/common/UI/Button';
import Badge from '../../../components/common/UI/Badge';
import Modal from '../../../components/common/UI/Modal';
import Input from '../../../components/common/Forms/Input';
import Loader from '../../../components/common/UI/Loader';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const PayoutManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const queryClient = useQueryClient();

  const { data: payoutsData, isLoading } = useQuery({
    queryKey: ['admin-payouts', { search, statusFilter }],
    queryFn: () => adminAPI.getPayouts({ search, status: statusFilter !== 'all' ? statusFilter : undefined }),
  });

  const processMutation = useMutation({
    mutationFn: (payoutId) => adminAPI.processPayout(payoutId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-payouts']);
      queryClient.invalidateQueries(['admin-finance']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ payoutId, reason }) => adminAPI.rejectPayout(payoutId, reason),
    onSuccess: () => {
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedPayout(null);
      queryClient.invalidateQueries(['admin-payouts']);
      queryClient.invalidateQueries(['admin-finance']);
    },
  });

  const handleProcessPayout = (payoutId) => {
    if (confirm('Traiter ce paiement ?')) {
      processMutation.mutate(payoutId);
    }
  };

  const handleRejectPayout = (payout) => {
    setSelectedPayout(payout);
    setRejectModalOpen(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      alert('Veuillez fournir une raison');
      return;
    }
    rejectMutation.mutate({
      payoutId: selectedPayout.id,
      reason: rejectReason,
    });
  };

  const columns = [
    {
      key: 'vendor',
      title: 'Vendeur',
      render: (_, payout) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium text-gray-700">
                {payout.vendor.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{payout.vendor.name}</div>
            <div className="text-sm text-gray-500">{payout.vendor.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Montant',
      render: (amount) => formatPrice(amount),
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
      key: 'requestedDate',
      title: 'Demandé le',
      render: (date) => formatDate(date),
    },
    {
      key: 'status',
      title: 'Statut',
      render: (status) => (
        <Badge
          variant={
            status === 'pending' ? 'warning' :
            status === 'processed' ? 'success' :
            status === 'rejected' ? 'danger' : 'secondary'
          }
        >
          {status === 'pending' ? 'En attente' :
           status === 'processed' ? 'Traité' :
           status === 'rejected' ? 'Rejeté' : 'Annulé'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, payout) => (
        <div className="flex space-x-2">
          {payout.status === 'pending' && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleProcessPayout(payout.id)}
                loading={processMutation.isLoading && processMutation.variables === payout.id}
              >
                <CheckCircleIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRejectPayout(payout)}
              >
                <XCircleIcon className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedPayout(payout)}
          >
            Détails
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
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des Paiements</h1>
        <p className="mt-2 text-sm text-gray-600">
          Traitez et gérez les demandes de paiement des vendeurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {payoutsData?.pendingCount || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Traités ce mois</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {payoutsData?.processedCount || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Montant total</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {formatPrice(payoutsData?.totalAmount || 0)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejetés</p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {payoutsData?.rejectedCount || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Rechercher un vendeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 px-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processed">Traités</option>
            <option value="rejected">Rejetés</option>
          </select>
          
          <Button variant="outline" onClick={() => {
            setSearch('');
            setStatusFilter('all');
          }}>
            Réinitialiser
          </Button>
        </div>
      </Card>

      {/* Payouts Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Demandes de paiement ({payoutsData?.payouts?.length || 0})
          </h3>
          <Button variant="primary">
            Exporter CSV
          </Button>
        </div>

        {payoutsData?.payouts?.length > 0 ? (
          <Table
            columns={columns}
            data={payoutsData.payouts}
          />
        ) : (
          <div className="text-center py-12">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune demande de paiement
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tous les paiements ont été traités.
            </p>
          </div>
        )}
      </Card>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Rejeter le paiement"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              Pourquoi rejetez-vous le paiement de <strong>{selectedPayout?.vendor.name}</strong> ?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Montant: {formatPrice(selectedPayout?.amount || 0)}
            </p>
          </div>
          
          <Input
            label="Raison du rejet"
            as="textarea"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Ex: Informations bancaires invalides, montant incorrect..."
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setRejectModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={submitReject}
              loading={rejectMutation.isLoading}
              disabled={!rejectReason.trim()}
            >
              Rejeter le paiement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payout Details Modal */}
      <Modal
        isOpen={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
        title="Détails du paiement"
        size="lg"
      >
        {selectedPayout && (
          <div className="space-y-6">
            {/* Vendor Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Informations vendeur</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="font-medium">{selectedPayout.vendor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedPayout.vendor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Solde disponible</p>
                  <p className="font-medium">
                    {formatPrice(selectedPayout.vendor.availableBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total retiré</p>
                  <p className="font-medium">
                    {formatPrice(selectedPayout.vendor.totalWithdrawn)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payout Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Détails du paiement</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Montant</p>
                  <p className="text-xl font-bold">{formatPrice(selectedPayout.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Méthode</p>
                  <Badge variant="info" className="mt-1">
                    {selectedPayout.method === 'paypal' ? 'PayPal' :
                     selectedPayout.method === 'bank_transfer' ? 'Virement bancaire' : 'Carte'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Demandé le</p>
                  <p className="font-medium">{formatDate(selectedPayout.requestedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Statut</p>
                  <Badge
                    variant={
                      selectedPayout.status === 'pending' ? 'warning' :
                      selectedPayout.status === 'processed' ? 'success' : 'danger'
                    }
                    className="mt-1"
                  >
                    {selectedPayout.status === 'pending' ? 'En attente' :
                     selectedPayout.status === 'processed' ? 'Traité' : 'Rejeté'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Account Details */}
            {selectedPayout.accountDetails && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Informations de paiement</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedPayout.accountDetails}
                </pre>
              </div>
            )}

            {/* Actions */}
            {selectedPayout.status === 'pending' && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedPayout(null);
                    handleRejectPayout(selectedPayout);
                  }}
                >
                  Rejeter
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    handleProcessPayout(selectedPayout.id);
                    setSelectedPayout(null);
                  }}
                >
                  Traiter le paiement
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PayoutManagement;