import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import MainLayout from '@/layouts/MainLayout';
import LoginPage from '@/pages/LoginPage';
import BillingPage from '@/pages/BillingPage';
import TableViewPage from '@/pages/TableViewPage';
import OrdersPage from '@/pages/OrdersPage';
import ReportsPage from '@/pages/ReportsPage';
import OperationsPage from '@/pages/OperationsPage';
import SettingsPage from '@/pages/SettingsPage';
import MenuPage from '@/pages/MenuPage';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/billing" replace />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="tables" element={<TableViewPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="reports/*" element={<ReportsPage />} />
        <Route path="operations" element={<OperationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="menu" element={<MenuPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}