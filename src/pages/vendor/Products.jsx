import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productsAPI } from '../../api/products';
import { productSchema } from '../../utils/validators';
import Card from '../../components/common/UI/Card';
import Table from '../../components/common/UI/Table';
import Button from '../../components/common/UI/Button';
import Modal from '../../components/common/UI/Modal';
import Input from '../../components/common/Forms/Input';
import FileUpload from '../../components/common/Forms/FileUpload';
import Loader from '../../components/common/UI/Loader';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const VendorProducts = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const queryClient = useQueryClient();

  const { data: vendorProducts, isLoading } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: productsAPI.getVendorProducts,
  });

  const createMutation = useMutation({
    mutationFn: productsAPI.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor-products']);
      setIsCreateModalOpen(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productsAPI.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor-products']);
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleDelete = (productId) => {
    if (confirm('Supprimer ce produit ?')) {
      deleteMutation.mutate(productId);
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Produit',
      render: (value, product) => (
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-lg object-cover"
            src={product.previewUrl || '/placeholder.png'}
            alt={product.name}
          />
          <div className="ml-4">
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">
              {product.status === 'pending' ? (
                <span className="text-yellow-600">En attente</span>
              ) : product.status === 'approved' ? (
                <span className="text-green-600">Approuvé</span>
              ) : (
                <span className="text-red-600">Rejeté</span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      title: 'Prix',
      render: (price) => `$${price}`,
    },
    {
      key: 'sales',
      title: 'Ventes',
      render: (sales) => sales || 0,
    },
    {
      key: 'revenue',
      title: 'Revenu',
      render: (revenue) => `$${revenue || 0}`,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, product) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/product/${product.id}`, '_blank')}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProduct(product)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(product.id)}
            disabled={deleteMutation.isLoading}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Voir les stats')}
          >
            <ChartBarIcon className="h-4 w-4" />
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mes Produits</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gérez votre catalogue de produits numériques
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Produits actifs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {vendorProducts?.filter(p => p.status === 'approved').length || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <EyeIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {vendorProducts?.filter(p => p.status === 'pending').length || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <EyeIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventes totales</p>
              <p className="text-2xl font-semibold text-gray-900">
                {vendorProducts?.reduce((sum, p) => sum + (p.sales || 0), 0) || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${vendorProducts?.reduce((sum, p) => sum + (p.revenue || 0), 0) || 0}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Catalogue</h3>
        
        {vendorProducts?.length > 0 ? (
          <Table
            columns={columns}
            data={vendorProducts}
          />
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <PlusIcon />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter votre premier produit numérique.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Créer un produit
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Ajouter un produit"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom du produit"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Template WordPress Premium"
            />
            
            <Input
              label="Prix ($)"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
              placeholder="29.99"
            />
            
            <div className="md:col-span-2">
              <Input
                label="Description"
                as="textarea"
                rows={4}
                {...register('description')}
                error={errors.description?.message}
                placeholder="Décrivez votre produit en détail..."
              />
            </div>
            
            <Input
              label="Catégorie"
              {...register('category')}
              error={errors.category?.message}
              placeholder="Templates"
            />
            
            <Input
              label="Tags (séparés par des virgules)"
              {...register('tags')}
              error={errors.tags?.message}
              placeholder="wordpress, template, responsive"
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de licence
              </label>
              <div className="flex space-x-4">
                {['personal', 'commercial', 'extended'].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={type}
                      {...register('licenseType')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
              {errors.licenseType?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.licenseType.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <FileUpload
                label="Fichier du produit"
                onFileSelect={(files) => console.log(files)}
                accept={{
                  'application/zip': ['.zip'],
                  'application/pdf': ['.pdf'],
                  'image/*': ['.jpg', '.jpeg', '.png'],
                }}
                maxSize={100 * 1024 * 1024} // 100MB
                helperText="Glissez-déposez votre fichier ZIP, PDF ou images"
              />
            </div>
            
            <div className="md:col-span-2">
              <FileUpload
                label="Image de prévisualisation"
                onFileSelect={(files) => console.log(files)}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
                maxSize={10 * 1024 * 1024} // 10MB
                helperText="Image représentative de votre produit"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isLoading}
            >
              Créer le produit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VendorProducts;