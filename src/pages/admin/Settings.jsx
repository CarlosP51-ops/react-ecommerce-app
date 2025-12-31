import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminAPI } from '../../api/admin';
import { settingsSchema } from '../../utils/validators';
import Card from '../../components/common/UI/Card';
import Button from '../../components/common/UI/Button';
import Input from '../../components/common/Forms/Input';
import Loader from '../../components/common/UI/Loader';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminAPI.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: adminAPI.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-settings']);
      alert('Paramètres mis à jour avec succès');
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(settingsSchema),
    values: settings,
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: Cog6ToothIcon },
    { id: 'finance', name: 'Finance', icon: CurrencyDollarIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'site', name: 'Site', icon: GlobeAltIcon },
    { id: 'files', name: 'Fichiers', icon: ServerIcon },
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
        <h1 className="text-2xl font-semibold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configurez les paramètres de la plateforme
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center w-full px-3 py-2 text-sm font-medium rounded-md
                    ${activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Paramètres généraux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nom du site"
                      {...register('siteName')}
                      error={errors.siteName?.message}
                    />
                    <Input
                      label="Email de contact"
                      type="email"
                      {...register('contactEmail')}
                      error={errors.contactEmail?.message}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Description du site"
                        as="textarea"
                        rows={3}
                        {...register('siteDescription')}
                        error={errors.siteDescription?.message}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('maintenanceMode')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Mode maintenance
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('allowRegistrations')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Autoriser les nouvelles inscriptions
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'finance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Paramètres financiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Taux de commission (%)"
                      type="number"
                      step="0.1"
                      {...register('commissionRate', { valueAsNumber: true })}
                      error={errors.commissionRate?.message}
                    />
                    <Input
                      label="Seuil de paiement minimum ($)"
                      type="number"
                      step="0.01"
                      {...register('payoutThreshold', { valueAsNumber: true })}
                      error={errors.payoutThreshold?.message}
                    />
                    <Input
                      label="Délai de paiement (jours)"
                      type="number"
                      {...register('payoutDelay', { valueAsNumber: true })}
                      error={errors.payoutDelay?.message}
                    />
                    <Input
                      label="Taxe par défaut (%)"
                      type="number"
                      step="0.1"
                      {...register('defaultTax', { valueAsNumber: true })}
                      error={errors.defaultTax?.message}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Paramètres des fichiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Taille maximale des fichiers (MB)"
                      type="number"
                      {...register('maxFileSize', { valueAsNumber: true })}
                      error={errors.maxFileSize?.message}
                    />
                    <Input
                      label="Types de fichiers autorisés"
                      {...register('allowedFileTypes')}
                      error={errors.allowedFileTypes?.message}
                      placeholder="zip,pdf,jpg,png,..."
                    />
                    <Input
                      label="Limite de stockage par vendeur (MB)"
                      type="number"
                      {...register('vendorStorageLimit', { valueAsNumber: true })}
                      error={errors.vendorStorageLimit?.message}
                    />
                    <Input
                      label="Limite de produits par vendeur"
                      type="number"
                      {...register('vendorProductLimit', { valueAsNumber: true })}
                      error={errors.vendorProductLimit?.message}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('requireEmailVerification')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Vérification email requise
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('twoFactorAuth')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        2FA pour les administrateurs
                      </label>
                    </div>
                    <Input
                      label="Durée de session (heures)"
                      type="number"
                      {...register('sessionDuration', { valueAsNumber: true })}
                      error={errors.sessionDuration?.message}
                    />
                    <Input
                      label="Tentatives de connexion max"
                      type="number"
                      {...register('maxLoginAttempts', { valueAsNumber: true })}
                      error={errors.maxLoginAttempts?.message}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'site' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Apparence du site</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Couleur principale"
                      type="color"
                      {...register('primaryColor')}
                      error={errors.primaryColor?.message}
                    />
                    <Input
                      label="Logo URL"
                      {...register('logoUrl')}
                      error={errors.logoUrl?.message}
                    />
                    <Input
                      label="Favicon URL"
                      {...register('faviconUrl')}
                      error={errors.faviconUrl?.message}
                    />
                    <Input
                      label="Meta description"
                      as="textarea"
                      rows={2}
                      {...register('metaDescription')}
                      error={errors.metaDescription?.message}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                >
                  Réinitialiser
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={updateMutation.isLoading}
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;