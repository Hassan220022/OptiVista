import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  bypassAuth?: boolean;
  requiredRole?: 'admin' | 'consultant';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, bypassAuth, requiredRole }) => {
  const userRole = localStorage.getItem('userRole');

  if (bypassAuth || isAuthenticated) {
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to={userRole === 'admin' ? '/dashboard' : '/user-dashboard'} />;
    }
    return <Outlet />;
  }

  return <Navigate to="/signin" />;
};

export default ProtectedRoute;