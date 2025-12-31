import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';
import Card from '../../../components/common/UI/Card';
import Button from '../../../components/common/UI/Button';
import Input from '../../../components/common/Forms/Input';
import Badge from '../../../components/common/UI/Badge';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

const CommissionSettings = () => {
  const [commissionRate, setCommissionRate] = useState(15);
  const [categoryRates, setCategoryRates] = useState({
    templates: 15,
    plugins: 20,
    graphics: 10,
    courses: 25,
    ebooks: 15,
    software: 18,
  });
  
  const [tieredCommissions, setTieredCommissions] = useState([
    { min: 0, max: 1000, rate: 20 },
    { min: 1001, max: 5000, rate: 18 },
    { min: 5001, max: 10000, rate: 15 },
    { min: 10001, max: null, rate: 12 },
  ]);
  
  const [vendorLevels, setVendorLevels] = useState([
    { level: 'Bronze', sales: 0, rate: 20, benefits: 'Accès basique' },
    { level: 'Argent', sales: 5000, rate: 18, benefits: 'Support prioritaire' },
    { level: 'Or', sales: 20000, rate: 15, benefits: 'Promotion gratuite' },
    { level: 'Platine', sales: 50000, rate: 12, benefits: 'Tous les avantages' },
  ]);
  
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: (data) => adminAPI.updateCommissionSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-settings']);
      alert('Paramètres de commission mis à jour');
    },
  });

  const handleSubmit = () => {
    const data = {
      defaultRate: commissionRate,
      categoryRates,
      tieredCommissions,
      vendorLevels,
    };
    updateMutation.mutate(data);
  };

  const addTier = () => {
    setTieredCommissions([
      ...tieredCommissions,
      { min: 0, max: 0, rate: 15 }
    ]);
  };

  const removeTier = (index) => {
    const newTiers = tieredCommissions.filter((_, i) => i !== index);
    setTieredCommissions(newTiers);
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...tieredCommissions];
    newTiers[index][field] = value === '' ? null : Number(value);
    setTieredCommissions(newTiers);
  };

  return (
    <div className="space-y-6">
      {/* Default Commission */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <CurrencyDollarIcon className="h-6 w-6 text-gray-400 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Commission par défaut</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Taux de commission</p>
              <p className="text-sm text-gray-600">
                Pourcentage appliqué par défaut à toutes les ventes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">{commissionRate}%</span>
                <div className="text-sm text-gray-600">Par défaut</div>
              </div>
              <div className="w-48">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Specific Rates */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <TagIcon className="h-6 w-6 text-gray-400 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Commissions par catégorie</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryRates).map(([category, rate]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 capitalize">{category}</span>
                <Badge variant="info">{rate}%</Badge>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={rate}
                onChange={(e) => setCategoryRates({
                  ...categoryRates,
                  [category]: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tiered Commissions */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <ChartBarIcon className="h-6 w-6 text-gray-400 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Commissions échelonnées</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Définissez des taux de commission différents selon le volume de ventes
          </p>
          
          <div className="space-y-3">
            {tieredCommissions.map((tier, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum ($)
                      </label>
                      <Input
                        type="number"
                        value={tier.min}
                        onChange={(e) => updateTier(index, 'min', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum ($)
                      </label>
                      <Input
                        type="number"
                        value={tier.max === null ? '' : tier.max}
                        onChange={(e) => updateTier(index, 'max', e.target.value)}
                        placeholder="Illimité"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commission (%)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={tier.rate}
                        onChange={(e) => updateTier(index, 'rate', e.target.value)}
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>
                {tieredCommissions.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeTier(index)}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={addTier}
          >
            Ajouter un échelon
          </Button>
        </div>
      </Card>

      {/* Vendor Levels */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-400 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Niveaux de vendeurs</h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {vendorLevels.map((level, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 text-center">
                <div className="mb-3">
                  <Badge
                    variant={
                      level.level === 'Bronze' ? 'secondary' :
                      level.level === 'Argent' ? 'info' :
                      level.level === 'Or' ? 'warning' : 'success'
                    }
                    className="text-sm"
                  >
                    {level.level}
                  </Badge>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-gray-900">{level.rate}%</span>
                  <div className="text-xs text-gray-600">Commission</div>
                </div>
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-900">
                    À partir de ${level.sales.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Ventes cumulées</div>
                </div>
                <div className="text-xs text-gray-500">{level.benefits}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {vendorLevels.map((level, index) => (
                <div key={index} className="space-y-2">
                  <Input
                    label={`${level.level} - Commission (%)`}
                    type="number"
                    step="0.1"
                    value={level.rate}
                    onChange={(e) => {
                      const newLevels = [...vendorLevels];
                      newLevels[index].rate = parseFloat(e.target.value);
                      setVendorLevels(newLevels);
                    }}
                  />
                  <Input
                    label="Seuil de ventes ($)"
                    type="number"
                    value={level.sales}
                    onChange={(e) => {
                      const newLevels = [...vendorLevels];
                      newLevels[index].sales = parseInt(e.target.value);
                      setVendorLevels(newLevels);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Résumé des commissions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Taux par défaut: {commissionRate}% • Catégories: {Object.values(categoryRates).length} taux spécifiques
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setCommissionRate(15);
                setCategoryRates({
                  templates: 15,
                  plugins: 20,
                  graphics: 10,
                  courses: 25,
                  ebooks: 15,
                  software: 18,
                });
              }}
            >
              Réinitialiser
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={updateMutation.isLoading}
            >
              Enregistrer les commissions
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CommissionSettings;