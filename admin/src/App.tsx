//import React from 'react';
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
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} bypassAuth={true} />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/user-dashboard" element={<UserDashboardView />} />
        </Route>
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;