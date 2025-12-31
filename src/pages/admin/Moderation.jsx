import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin';
import Card from '../../components/common/UI/Card';
import Table from '../../components/common/UI/Table';
import Button from '../../components/common/UI/Button';
import Modal from '../../components/common/UI/Modal';
import Input from '../../components/common/Forms/Input';
import Loader from '../../components/common/UI/Loader';
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Moderation = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const queryClient = useQueryClient();

  const { data: pendingProducts, isLoading } = useQuery({
    queryKey: ['pending-products'],
    queryFn: () => adminAPI.getPendingProducts(),
  });

  const approveMutation = useMutation({
    mutationFn: (productId) => adminAPI.approveProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-products']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ productId, reason }) =>
      adminAPI.rejectProduct(productId, reason),
    onSuccess: () => {
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedProduct(null);
      queryClient.invalidateQueries(['pending-products']);
    },
  });

  const handleApprove = (productId) => {
    if (confirm('Approuver ce produit ?')) {
      approveMutation.mutate(productId);
    }
  };

  const handleReject = (product) => {
    setSelectedProduct(product);
    setRejectModalOpen(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      alert('Veuillez fournir une raison');
      return;
    }
    rejectMutation.mutate({
      productId: selectedProduct.id,
      reason: rejectReason,
    });
  };

  const columns = [
    {
      key: 'name',
      title: 'Nom du Produit',
      render: (value, product) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              className="h-10 w-10 rounded-lg"
              src={product.previewUrl || '/placeholder.png'}
              alt={product.name}
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'vendor',
      title: 'Vendeur',
      render: (value) => (
        <div className="text-sm text-gray-900">{value.name}</div>
      ),
    },
    {
      key: 'price',
      title: 'Prix',
      render: (value) => `$${value}`,
    },
    {
      key: 'createdAt',
      title: 'Soumis le',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, product) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/product/${product.id}/preview`, '_blank')}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => handleApprove(product.id)}
            loading={approveMutation.isLoading && approveMutation.variables === product.id}
          >
            <CheckCircleIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleReject(product)}
          >
            <XCircleIcon className="h-4 w-4" />
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
        <h1 className="text-2xl font-semibold text-gray-900">Modération</h1>
        <p className="mt-2 text-sm text-gray-600">
          Approuvez ou rejetez les nouveaux produits soumis par les vendeurs
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Produits en attente de validation
            </h2>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {pendingProducts?.length || 0} produits
          </span>
        </div>

        {pendingProducts?.length > 0 ? (
          <Table
            columns={columns}
            data={pendingProducts}
            className="mt-4"
          />
        ) : (
          <div className="text-center py-12">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun produit en attente
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tous les produits ont été validés.
            </p>
          </div>
        )}
      </Card>

      {/* Modal de rejet */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Rejeter le produit"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              Pourquoi rejetez-vous le produit "<strong>{selectedProduct?.name}</strong>" ?
            </p>
          </div>
          
          <Input
            label="Raison du rejet"
            as="textarea"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Ex: Contenu inapproprié, qualité insuffisante, droits d'auteur..."
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
            >
              Rejeter le produit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Moderation;