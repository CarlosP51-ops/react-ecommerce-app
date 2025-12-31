import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import MainLayout from '../components/common/Layout/MainLayout';
import DashboardLayout from '../components/common/Layout/DashboardLayout';

// Pages Publiques
import HomePage from '../pages/public/HomePage';
import ProductPage from '../pages/public/ProductPage';
import AuthPage from '../pages/public/AuthPage';

// Pages Client
import MyPurchases from '../pages/client/MyPurchases';
import Downloads from '../pages/client/Downloads';

// Pages Vendeur
import VendorDashboard from '../pages/vendor/Dashboard';
import VendorProducts from '../pages/vendor/Products';
import VendorPayouts from '../pages/vendor/Payouts';

// Pages Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminModeration from '../pages/admin/Moderation';
import AdminUsers from '../pages/admin/Users';
import AdminFinance from '../pages/admin/Finance';
import AdminSettings from '../pages/admin/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes Publiques */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="auth" element={<AuthPage />} />
      </Route>

      {/* Routes Client */}
      <Route element={<ProtectedRoute allowedRoles={['client', 'admin', 'vendor']} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="purchases" element={<MyPurchases />} />
          <Route path="downloads/:id" element={<Downloads />} />
        </Route>
      </Route>

      {/* Routes Vendeur */}
      <Route element={<ProtectedRoute allowedRoles={['vendor', 'admin']} />}>
        <Route path="/vendor" element={<DashboardLayout />}>
          <Route index element={<VendorDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="payouts" element={<VendorPayouts />} />
        </Route>
      </Route>

      {/* Routes Admin - Accès strictement admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;