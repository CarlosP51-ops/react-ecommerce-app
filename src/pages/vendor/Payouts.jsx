import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorAPI } from '../../api/vendor';
import { formatPrice, formatDate } from '../../utils/helpers';
import Card from '../../components/common/UI/Card';
import Table from '../../components/common/UI/Table';
import Button from '../../components/common/UI/Button';
import Modal from '../../components/common/UI/Modal';
import Input from '../../components/common/Forms/Input';
import Select from '../../components/common/Forms/Select';
import Badge from '../../components/common/UI/Badge';
import Loader from '../../components/common/UI/Loader';
import {
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const VendorPayouts = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const queryClient = useQueryClient();

  const { data: payoutsData, isLoading } = useQuery({
    queryKey: ['vendor-payouts'],
    queryFn: vendorAPI.getPayouts,
  });

  const requestPayoutMutation = useMutation({
    mutationFn: (data) => vendorAPI.requestPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor-payouts']);
      setIsRequestModalOpen(false);
      setRequestAmount('');
      alert('Demande de retrait envoyée avec succès');
    },
  });

  const handleRequestPayout = () => {
    const amount = parseFloat(requestAmount);
    if (!amount || amount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }
    
    if (amount > (payoutsData?.availableBalance || 0)) {
      alert('Montant supérieur au solde disponible');
      return;
    }

    requestPayoutMutation.mutate({
      amount,
      method: paymentMethod,
    });
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      render: (id) => <span className="font-mono text-sm">#{id.slice(0, 8)}</span>,
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
      key: 'requestedDate',
      title: 'Demandé le',
      render: (date) => formatDate(date),
    },
    {
      key: 'processedDate',
      title: 'Traité le',
      render: (date) => date ? formatDate(date) : '-',
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
        <h1 className="text-2xl font-semibold text-gray-900">Paiements</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérez vos retraits et consultez l'historique
        </p>
      </div>

      {/* Balance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solde disponible</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatPrice(payoutsData?.availableBalance || 0)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatPrice(payoutsData?.pendingAmount || 0)}
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
              <p className="text-sm font-medium text-gray-600">Total retiré</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatPrice(payoutsData?.totalWithdrawn || 0)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Request Payout */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Demander un retrait</h3>
            <p className="text-sm text-gray-600">
              Solde minimum requis: {formatPrice(payoutsData?.minimumPayout || 50)}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsRequestModalOpen(true)}
            disabled={(payoutsData?.availableBalance || 0) < (payoutsData?.minimumPayout || 50)}
          >
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Demander un retrait
          </Button>
        </div>
      </Card>

      {/* Payout History */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Historique des retraits</h3>
        
        {payoutsData?.payouts?.length > 0 ? (
          <Table
            columns={columns}
            data={payoutsData.payouts}
          />
        ) : (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun retrait</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun retrait n'a été effectué pour le moment.
            </p>
          </div>
        )}
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Méthodes de paiement</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">PayPal</p>
                <p className="text-sm text-gray-600">john.doe@example.com</p>
              </div>
            </div>
            <Badge variant="success">Par défaut</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Virement bancaire</p>
                <p className="text-sm text-gray-600">FR76 XXXX XXXX XXXX</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configurer
            </Button>
          </div>
        </div>
      </Card>

      {/* Request Payout Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Demander un retrait"
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600">
              Solde disponible: <span className="font-bold text-gray-900">
                {formatPrice(payoutsData?.availableBalance || 0)}
              </span>
            </p>
          </div>
          
          <Input
            label="Montant à retirer ($)"
            type="number"
            step="0.01"
            value={requestAmount}
            onChange={(e) => setRequestAmount(e.target.value)}
            placeholder="Entrez le montant"
          />
          
          <Select
            label="Méthode de paiement"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: 'paypal', label: 'PayPal' },
              { value: 'bank_transfer', label: 'Virement bancaire' },
              { value: 'stripe', label: 'Carte (Stripe)' },
            ]}
          />
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              ⏱️ Les paiements sont traités sous 2-3 jours ouvrables.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRequestModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleRequestPayout}
              loading={requestPayoutMutation.isLoading}
            >
              Confirmer la demande
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VendorPayouts;