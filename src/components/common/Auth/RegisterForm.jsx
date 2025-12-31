import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../../utils/validators';
import Input from '../Forms/Input';
import Button from '../UI/Button';

const RegisterForm = ({ onSubmit, loading = false, error = '', onSwitchToLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Créer un compte</h2>
        <p className="mt-2 text-sm text-gray-600">
          Déjà un compte ?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Connectez-vous
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <Input
          label="Nom complet"
          type="text"
          autoComplete="name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="John Doe"
        />

        <Input
          label="Adresse email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="vous@exemple.com"
        />

        <Input
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="••••••••"
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          placeholder="••••••••"
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Type de compte
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="client"
                defaultChecked
                {...register('role')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Client</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="vendor"
                {...register('role')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Vendeur</span>
            </label>
          </div>
          {errors.role?.message && (
            <p className="text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            J'accepte les{' '}
            <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
              conditions d'utilisation
            </a>{' '}
            et la{' '}
            <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">
              politique de confidentialité
            </a>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          fullWidth
        >
          S'inscrire
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;