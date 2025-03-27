import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { checkApiHealth } from './services/api';
import Loader from './components/layout/Loader';

// Import existing components
import SignIn from './components/auth/SignIn';
import DashboardView from './components/admin/dashboard/DashboardView';
import UserDashboardView from './components/admin/dashboard/UserDashboardview';
import RegisterUser from './components/auth/RegisterUser';

// Define a fallback component for Suspense
const SuspenseFallback = () => <Loader />;

// Not found component
const NotFoundView = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="mb-6">The page you're looking for doesn't exist.</p>
    <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Return to Home
    </a>
  </div>
);

function App() {
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    // Check if API is healthy
    const checkHealth = async () => {
      try {
        const isHealthy = await checkApiHealth();
        setIsApiHealthy(isHealthy);
      } catch (error) {
        setIsApiHealthy(false);
        setApiError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    checkHealth();
  }, []);

  if (isApiHealthy === null) {
    return <Loader />;
  }

  if (isApiHealthy === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">API Connection Error</h1>
        <p className="text-gray-700 mb-4">
          Unable to connect to the API server. Please ensure the backend is running at <span className="font-mono">http://localhost:3000/api</span>.
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
          <li>The API server may not be running</li>
          <li>Check your network connection</li>
          <li>Ensure backend services are properly configured</li>
        </ul>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Retry Connection
        </button>
        {apiError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <p className="font-bold">Error details:</p>
            <p className="font-mono">{apiError}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<RegisterUser />} />
          <Route path="/admin-dashboard/*" element={<DashboardView />} />
          <Route path="/seller-dashboard/*" element={<UserDashboardView />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;