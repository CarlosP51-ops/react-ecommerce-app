import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';
import { formatDate } from '../../../utils/helpers';
import Button from '../../../components/common/UI/Button';
import Badge from '../../../components/common/UI/Badge';
import Modal from '../../../components/common/UI/Modal';
import Input from '../../../components/common/Forms/Input';
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const ProductReview = ({ product }) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => adminAPI.approveProduct(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-products']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason) => adminAPI.rejectProduct(product.id, reason),
    onSuccess: () => {
      setIsRejectModalOpen(false);
      setRejectReason('');
      queryClient.invalidateQueries(['pending-products']);
    },
  });

  const handleApprove = () => {
    if (confirm(`Approuver le produit "${product.name}" ?`)) {
      approveMutation.mutate();
    }
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      alert('Veuillez fournir une raison');
      return;
    }
    rejectMutation.mutate(rejectReason);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* Product Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
              {product.previewUrl ? (
                <img
                  src={product.previewUrl}
                  alt={product.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <DocumentTextIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.category}</p>
              <div className="flex items-center mt-1 space-x-2">
                <Badge variant="warning">
                  ${product.price}
                </Badge>
                <Badge variant="info">
                  {product.fileType}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Soumis le</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(product.createdAt)}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-700 line-clamp-3">{product.description}</p>
        </div>

        {/* Vendor Info */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{product.vendor.name}</p>
              <p className="text-sm text-gray-600">{product.vendor.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Produits: {product.vendor.productCount}</p>
            <p className="text-sm text-gray-600">Note: {product.vendor.rating}/5</p>
          </div>
        </div>

        {/* File Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm font-medium text-gray-900">Fichier principal</p>
            <p className="text-sm text-gray-600 truncate">{product.mainFile}</p>
            <p className="text-xs text-gray-500">{product.fileSize}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm font-medium text-gray-900">Tags</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.tags?.map(tag => (
                <span key={tag} className="inline-block px-2 py-1 text-xs bg-gray-200 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          <Button
            variant="success"
            onClick={handleApprove}
            loading={approveMutation.isLoading}
          >
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Approuver
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            loading={rejectMutation.isLoading}
          >
            <XCircleIcon className="h-4 w-4 mr-2" />
            Rejeter
          </Button>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Rejeter le produit"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Pourquoi rejetez-vous le produit "<strong>{product.name}</strong>" ?
          </p>
          
          <Input
            label="Raison du rejet"
            as="textarea"
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Ex: Contenu inapproprié, qualité insuffisante, droits d'auteur..."
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={submitReject}
              loading={rejectMutation.isLoading}
              disabled={!rejectReason.trim()}
            >
              Rejeter le produit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Prévisualisation: ${product.name}`}
        size="xl"
      >
        <div className="space-y-6">
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aperçu sécurisé du produit</p>
              <p className="text-sm text-gray-500 mt-2">
                Les acheteurs verront cet aperçu avant l'achat
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Détails techniques</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Type: {product.fileType}</li>
                <li>Taille: {product.fileSize}</li>
                <li>Compatibilité: {product.compatibility}</li>
                <li>Mises à jour: {product.updatesIncluded ? 'Incluses' : 'Non incluses'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Support</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Documentation: {product.documentation ? 'Incluse' : 'Non incluse'}</li>
                <li>Support: {product.supportDuration} mois</li>
                <li>Mise à jour: {product.updatePolicy}</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductReview;