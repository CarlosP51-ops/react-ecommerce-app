import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, registerSchema } from '../../utils/validators';
import Input from '../../components/common/Forms/Input';
import Button from '../../components/common/UI/Button';
import Card from '../../components/common/UI/Card';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const result = await login(data);
        if (result.success) {
          navigate(from, { replace: true });
        } else {
          setError(result.error || 'Échec de la connexion');
        }
      } else {
        // Implémenter l'inscription
        console.log('Register:', data);
        setIsLogin(true);
        reset();
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                reset();
                setError('');
              }}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? 'Inscrivez-vous' : 'Connectez-vous'}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <Input
                label="Nom complet"
                {...register('name')}
                error={errors.name?.message}
                placeholder="John Doe"
              />
            )}
            
            <Input
              label="Adresse email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="vous@exemple.com"
            />
            
            <Input
              label="Mot de passe"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
            />
            
            {!isLogin && (
              <Input
                label="Confirmer le mot de passe"
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="••••••••"
              />
            )}

            {!isLogin && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Type de compte
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="client"
                      {...register('role')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      defaultChecked
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
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
            >
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ou continuez avec
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                GitHub
              </button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;