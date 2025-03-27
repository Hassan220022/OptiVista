import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  allowedRoles?: string[];
  redirectPath?: string;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  isAuthenticated, 
  allowedRoles = [], 
  redirectPath = '/signin',
  children
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  // If no specific roles are required or we're not checking roles
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    // If we can't find the user object but they're authenticated,
    // something is wrong with the stored data
    localStorage.removeItem('isAuthenticated');
    return <Navigate to={redirectPath} />;
  }
  
  try {
    const user = JSON.parse(userStr);
    const userRole = user.role;
    
    // Check if user has permitted role
    if (allowedRoles.includes(userRole)) {
      return <>{children}</>;
    } else {
      // Redirect admin to admin dashboard and sellers to seller dashboard
      return <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/seller-dashboard'} />;
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    return <Navigate to={redirectPath} />;
  }
};

export default ProtectedRoute;