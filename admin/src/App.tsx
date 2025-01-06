import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import DashboardView from './components/admin/dashboard/DashboardView';
import UserDashboardView from './components/admin/dashboard/UserDashboardview';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterUser from './components/RegisterUser';

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<RegisterUser />} />

        {/* Admin Dashboard */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" />
          }
        >
          <Route path="/dashboard" element={<DashboardView />} />
        </Route>

        {/* Seller Dashboard */}
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