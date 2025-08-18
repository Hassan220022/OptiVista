import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import DashboardView from './components/admin/dashboard/DashboardView';
import UserDashboardView from './components/admin/dashboard/UserDashboardview';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterUser from './components/RegisterUser';
import { ProductList } from './components/admin/products/ProductList';
import { OrderList } from './components/admin/orders/OrderList';
import Layout from './components/common/Layout';

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<RegisterUser />} />

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" />
          }
        >
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/products" element={
            <Layout title="Products">
              <ProductList />
            </Layout>
          } />
          <Route path="/orders" element={
            <Layout title="Orders">
              <OrderList />
            </Layout>
          } />
          <Route path="/users" element={
            <Layout title="Users">
              <div>Users Management Coming Soon</div>
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout title="Settings">
              <div>Settings Coming Soon</div>
            </Layout>
          } />
        </Route>

        {/* Consultant Routes */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="consultant" />
          }
        >
          <Route path="/user-dashboard" element={<UserDashboardView />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;