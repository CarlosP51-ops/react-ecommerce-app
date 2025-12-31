import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/common/UI/Loader';

const ProtectedRoute = ({ allowedRoles, redirectPath = '/login' }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Rediriger vers la page d'accueil appropriée selon le rôle
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === 'vendor') {
      return <Navigate to="/vendor" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;