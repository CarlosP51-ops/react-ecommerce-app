import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminAPI } from '../../../api/admin';
import { settingsSchema } from '../../../utils/validators';
import Card from '../../../components/common/UI/Card';
import Button from '../../../components/common/UI/Button';
import Input from '../../../components/common/Forms/Input';
import Loader from '../../../components/common/UI/Loader';
import {
  GlobeAltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const SiteSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminAPI.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: adminAPI.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-settings']);
      showMessage('Paramètres mis à jour avec succès', 'success');
    },
    onError: (error) => {
      showMessage(`Erreur: ${error.message}`, 'error');
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(settingsSchema),
    values: settings,
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: GlobeAltIcon },
    { id: 'finance', name: 'Finance', icon: CurrencyDollarIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'appearance', name: 'Apparence', icon: PhotoIcon },
    { id: 'advanced', name: 'Avancé', icon: Cog6ToothIcon },
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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Paramètres du site</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configurez les paramètres de la plateforme
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-lg p-4 ${
          messageType === 'success' ? 'bg-green-50 text-green-800' :
          messageType === 'error' ? 'bg-red-50 text-red-800' :
          'bg-blue-50 text-blue-800'
        }`}>
          {message}
        </div>
      )}

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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Paramètres généraux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nom du site"
                      {...register('siteName')}
                      error={errors.siteName?.message}
                      placeholder="DigitalMarket"
                    />
                    
                    <Input
                      label="Email de contact"
                      type="email"
                      {...register('contactEmail')}
                      error={errors.contactEmail?.message}
                      placeholder="contact@digitalmarket.com"
                    />
                    
                    <div className="md:col-span-2">
                      <Input
                        label="Description du site"
                        as="textarea"
                        rows={3}
                        {...register('siteDescription')}
                        error={errors.siteDescription?.message}
                        placeholder="La marketplace numérique de confiance..."
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('maintenanceMode')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Mode maintenance</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('allowRegistrations')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Autoriser les inscriptions</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('emailVerification')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Vérification email obligatoire</span>
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
                      min="0"
                      max="50"
                      {...register('commissionRate', { valueAsNumber: true })}
                      error={errors.commissionRate?.message}
                      helperText="Pourcentage prélevé sur chaque vente"
                    />
                    
                    <Input
                      label="Seuil de paiement minimum ($)"
                      type="number"
                      step="0.01"
                      {...register('payoutThreshold', { valueAsNumber: true })}
                      error={errors.payoutThreshold?.message}
                      helperText="Montant minimum pour demander un retrait"
                    />
                    
                    <Input
                      label="Délai de paiement (jours)"
                      type="number"
                      {...register('payoutDelay', { valueAsNumber: true })}
                      error={errors.payoutDelay?.message}
                      helperText="Délai avant traitement des paiements"
                    />
                    
                    <Input
                      label="Taxe par défaut (%)"
                      type="number"
                      step="0.1"
                      {...register('defaultTax', { valueAsNumber: true })}
                      error={errors.defaultTax?.message}
                      helperText="Taxe appliquée aux achats"
                    />
                    
                    <div className="md:col-span-2">
                      <Input
                        label="Devise"
                        {...register('currency')}
                        error={errors.currency?.message}
                        placeholder="USD"
                        helperText="Code devise (USD, EUR, GBP...)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Durée de session (heures)"
                      type="number"
                      {...register('sessionDuration', { valueAsNumber: true })}
                      error={errors.sessionDuration?.message}
                      helperText="Durée avant déconnexion automatique"
                    />
                    
                    <Input
                      label="Tentatives de connexion max"
                      type="number"
                      {...register('maxLoginAttempts', { valueAsNumber: true })}
                      error={errors.maxLoginAttempts?.message}
                      helperText="Nombre de tentatives avant blocage"
                    />
                    
                    <Input
                      label="Délai de blocage (minutes)"
                      type="number"
                      {...register('lockoutDuration', { valueAsNumber: true })}
                      error={errors.lockoutDuration?.message}
                      helperText="Durée du blocage après échecs"
                    />
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('twoFactorAuth')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">2FA pour admin</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('passwordHistory')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Historique des mots de passe</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('ipWhitelist')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Liste blanche IP (admin)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Apparence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Logo URL"
                      {...register('logoUrl')}
                      error={errors.logoUrl?.message}
                      placeholder="/logo.png"
                    />
                    
                    <Input
                      label="Favicon URL"
                      {...register('faviconUrl')}
                      error={errors.faviconUrl?.message}
                      placeholder="/favicon.ico"
                    />
                    
                    <Input
                      label="Couleur principale"
                      type="color"
                      {...register('primaryColor')}
                      error={errors.primaryColor?.message}
                      defaultValue="#3b82f6"
                    />
                    
                    <Input
                      label="Couleur secondaire"
                      type="color"
                      {...register('secondaryColor')}
                      error={errors.secondaryColor?.message}
                      defaultValue="#8b5cf6"
                    />
                    
                    <div className="md:col-span-2">
                      <Input
                        label="Meta description"
                        as="textarea"
                        rows={2}
                        {...register('metaDescription')}
                        error={errors.metaDescription?.message}
                        placeholder="Description pour les moteurs de recherche"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Input
                        label="Mots-clés"
                        {...register('keywords')}
                        error={errors.keywords?.message}
                        placeholder="digital, marketplace, templates, plugins"
                        helperText="Séparés par des virgules"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Paramètres avancés</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Taille max fichier (MB)"
                      type="number"
                      {...register('maxFileSize', { valueAsNumber: true })}
                      error={errors.maxFileSize?.message}
                      helperText="Taille maximum des fichiers uploadés"
                    />
                    
                    <Input
                      label="Types de fichiers autorisés"
                      {...register('allowedFileTypes')}
                      error={errors.allowedFileTypes?.message}
                      placeholder="zip,pdf,jpg,png,gif"
                      helperText="Extensions séparées par des virgules"
                    />
                    
                    <Input
                      label="Limite stockage vendeur (MB)"
                      type="number"
                      {...register('vendorStorageLimit', { valueAsNumber: true })}
                      error={errors.vendorStorageLimit?.message}
                      helperText="Stockage maximum par vendeur"
                    />
                    
                    <Input
                      label="Limite produits par vendeur"
                      type="number"
                      {...register('vendorProductLimit', { valueAsNumber: true })}
                      error={errors.vendorProductLimit?.message}
                      helperText="Nombre maximum de produits"
                    />
                    
                    <Input
                      label="Cache durée (secondes)"
                      type="number"
                      {...register('cacheDuration', { valueAsNumber: true })}
                      error={errors.cacheDuration?.message}
                      helperText="Durée du cache des pages"
                    />
                    
                    <Input
                      label="Limite API requêtes/minute"
                      type="number"
                      {...register('apiRateLimit', { valueAsNumber: true })}
                      error={errors.apiRateLimit?.message}
                      helperText="Limite de requêtes API"
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Restaurer les paramètres par défaut ?')) {
                        // Implémenter la restauration par défaut
                        showMessage('Paramètres restaurés par défaut', 'info');
                      }
                    }}
                  >
                    Restaurer par défaut
                  </Button>
                </div>
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

          {/* Danger Zone */}
          <Card className="p-6 mt-6 border-red-200 bg-red-50">
            <h3 className="text-lg font-medium text-red-900 mb-4">Zone de danger</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Effacer le cache</p>
                  <p className="text-sm text-gray-600">
                    Efface tous les fichiers en cache du site
                  </p>
                </div>
                <Button variant="danger" size="sm">
                  Effacer le cache
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Regénérer les images</p>
                  <p className="text-sm text-gray-600">
                    Recrée toutes les miniatures d'images
                  </p>
                </div>
                <Button variant="danger" size="sm">
                  Regénérer
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Exporter les paramètres</p>
                  <p className="text-sm text-gray-600">
                    Téléchargez un backup des paramètres
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Exporter
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;