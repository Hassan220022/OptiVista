import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  bypassAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, bypassAuth }) => {
  return bypassAuth || isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;