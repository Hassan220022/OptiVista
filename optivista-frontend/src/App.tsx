import { useEffect, lazy, Suspense } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import Loading from './components/ui/Loading';
import { useNotification } from './hooks/useNotification';

// Lazy-loaded components for better performance
const Dashboard = lazy(() => import('./pages/dashboard/DashboardPage'));
const Products = lazy(() => import('./pages/products/ProductsPage'));
const ProductDetails = lazy(() => import('./pages/products/ProductDetailsPage'));
const Orders = lazy(() => import('./pages/orders/OrdersPage'));
const OrderDetails = lazy(() => import('./pages/orders/OrderDetailsPage'));
const Customers = lazy(() => import('./pages/customers/CustomersPage'));
const CustomerDetails = lazy(() => import('./pages/customers/CustomerDetailsPage'));
const ARModels = lazy(() => import('./pages/ar-models/ARModelsPage'));
const ARModelDetails = lazy(() => import('./pages/ar-models/ARModelDetailsPage'));
const Analytics = lazy(() => import('./pages/analytics/AnalyticsPage'));
const Settings = lazy(() => import('./pages/settings/SettingsPage'));
const Profile = lazy(() => import('./pages/profile/ProfilePage'));
const Login = lazy(() => import('./pages/auth/LoginPage'));
const NotFound = lazy(() => import('./components/pages/NotFound'));

function App() {
  const { isAuthenticated, loading: authLoading, checkAuth } = useAuth();
  const { showNotification } = useNotification();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Check for backend health and show notification if issues
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('/health');
        if (!response.ok) {
          showNotification('Backend service is experiencing issues. Some features may be unavailable.', 'warning');
        }
      } catch (error) {
        showNotification('Could not connect to backend services.', 'error');
      }
    };

    checkBackendHealth();
    // Set interval to check health periodically
    const interval = setInterval(checkBackendHealth, 300000); // check every 5 minutes
    
    return () => clearInterval(interval);
  }, [showNotification]);

  if (authLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loading size="large" /></div>;
  }

  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loading size="large" /></div>}>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" state={{ from: location }} replace />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="ar-models" element={<ARModels />} />
          <Route path="ar-models/:id" element={<ARModelDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;