import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../../utils/validators';
import Input from '../../../components/common/Forms/Input';
import Button from '../../../components/common/UI/Button';
import FileUpload from '../../../components/common/Forms/FileUpload';
import { CATEGORIES, LICENSE_TYPES } from '../../../utils/constants';

const ProductForm = ({ onSubmit, loading = false, initialData = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  const licenseType = watch('licenseType') || 'personal';

  const handleFileSelect = (files) => {
    if (files.length > 0) {
      setValue('mainFile', files[0]);
    }
  };

  const handlePreviewSelect = (files) => {
    if (files.length > 0) {
      setValue('previewImage', files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Informations de base</h3>
        
        <Input
          label="Nom du produit"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Template WordPress Premium"
          required
        />
        
        <Input
          label="Description"
          as="textarea"
          rows={4}
          {...register('description')}
          error={errors.description?.message}
          placeholder="Décrivez votre produit en détail..."
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Prix ($)"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            error={errors.price?.message}
            placeholder="29.99"
            required
          />
          
          <Input
            label="Catégorie"
            as="select"
            {...register('category')}
            error={errors.category?.message}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Input>
        </div>
      </div>

      {/* Files */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Fichiers</h3>
        
        <FileUpload
          label="Fichier principal"
          onFileSelect={handleFileSelect}
          accept={{
            'application/zip': ['.zip'],
            'application/pdf': ['.pdf'],
            'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
          }}
          maxFiles={1}
          helperText="Glissez-déposez le fichier principal (ZIP, PDF, images)"
        />
        
        <FileUpload
          label="Image de prévisualisation"
          onFileSelect={handlePreviewSelect}
          accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
          maxFiles={1}
          helperText="Image représentative de votre produit"
        />
      </div>

      {/* License & Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Licence et paramètres</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Type de licence
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(LICENSE_TYPES).map(([key, value]) => (
              <label
                key={key}
                className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  licenseType === value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  value={value}
                  {...register('licenseType')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900 capitalize">
                    {value}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {value === 'personal' ? 'Usage personnel uniquement' :
                     value === 'commercial' ? 'Usage commercial autorisé' :
                     'Distribution et revente autorisées'}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.licenseType?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.licenseType.message}</p>
          )}
        </div>

        <Input
          label="Tags (séparés par des virgules)"
          {...register('tags')}
          error={errors.tags?.message}
          placeholder="wordpress, template, responsive, modern"
          helperText="Maximum 10 tags"
        />
      </div>

      {/* Advanced Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Paramètres avancés</h3>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('featured')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">
              Mettre en avant ce produit
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('allowUpdates')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">
              Autoriser les mises à jour pour les acheteurs
            </span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('enableReviews')}
              defaultChecked
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">
              Autoriser les avis clients
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {initialData.id ? 'Mettre à jour' : 'Créer le produit'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;