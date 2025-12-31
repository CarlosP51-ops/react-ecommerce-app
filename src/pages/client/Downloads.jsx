import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../../api/users';
import { formatDate } from '../../utils/helpers';
import Card from '../../components/common/UI/Card';
import Button from '../../components/common/UI/Button';
import Loader from '../../components/common/UI/Loader';
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  KeyIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Downloads = () => {
  const { id } = useParams();
  
  const { data: download, isLoading } = useQuery({
    queryKey: ['download', id],
    queryFn: () => Promise.resolve({}), // À remplacer avec l'API réelle
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Téléchargements</h1>
        <p className="mt-2 text-sm text-gray-600">
          Accédez à vos fichiers achetés et licences
        </p>
      </div>

      {/* Download Card */}
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowDownTrayIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Template Premium WordPress</h2>
          <p className="text-gray-600 mt-2">Acheté le {formatDate(new Date())}</p>
        </div>

        {/* Files */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-medium text-gray-900">Fichiers inclus</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">template-premium.zip</p>
                  <p className="text-sm text-gray-500">84.5 MB • Fichier principal</p>
                </div>
              </div>
              <Button variant="primary" size="sm">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">documentation.pdf</p>
                  <p className="text-sm text-gray-500">2.1 MB • Guide d'installation</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>

        {/* License Key */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-medium text-gray-900">Clé de licence</h3>
          <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-center">
            <div className="flex items-center justify-center mb-2">
              <KeyIcon className="h-5 w-5 mr-2" />
              <span>Clé de licence personnelle</span>
            </div>
            <div className="text-lg font-bold tracking-wider">
              XXXXX-XXXXX-XXXXX-XXXXX
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Valide jusqu'au 31/12/2024 • 1 site
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              Copier la clé
            </Button>
            <Button variant="outline" className="flex-1">
              Voir les détails
            </Button>
          </div>
        </div>

        {/* Support */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Support & Assistance</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Vous avez des questions ou besoin d'aide avec ce produit ? Notre équipe de support est là pour vous aider.
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              Contacter le vendeur
            </Button>
            <Button variant="outline" className="flex-1">
              Ouvrir un ticket
            </Button>
          </div>
        </div>
      </Card>

      {/* Usage Terms */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Conditions d'utilisation</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>• Cette licence vous permet d'utiliser le produit sur 1 site web personnel</p>
          <p>• La redistribution ou revente du produit est strictement interdite</p>
          <p>• Les mises à jour sont incluses pendant 1 an</p>
          <p>• Le support technique est disponible pendant 6 mois</p>
          <p>• Vous pouvez modifier le produit selon vos besoins</p>
        </div>
      </Card>

      {/* Back Button */}
      <div className="text-center">
        <Button variant="outline" onClick={() => window.history.back()}>
          Retour à mes achats
        </Button>
      </div>
    </div>
  );
};

export default Downloads;