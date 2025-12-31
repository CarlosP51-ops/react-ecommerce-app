import { useCallback } from 'react';
import { useAuth as useAuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();

  const loginWithRedirect = useCallback((from = '/') => {
    navigate('/auth', { state: { from } });
  }, [navigate]);

  const logoutWithRedirect = useCallback(async () => {
    await auth.logout();
    navigate('/');
  }, [auth, navigate]);

  const requireAuth = useCallback((requiredRole) => {
    if (!auth.isAuthenticated) {
      loginWithRedirect(window.location.pathname);
      return false;
    }

    if (requiredRole && !auth[`is${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)}`]) {
      navigate('/unauthorized');
      return false;
    }

    return true;
  }, [auth, loginWithRedirect, navigate]);

  return {
    ...auth,
    loginWithRedirect,
    logoutWithRedirect,
    requireAuth,
  };
};