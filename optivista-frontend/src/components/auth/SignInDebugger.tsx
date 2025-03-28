import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { API_BASE_URL } from '../../services/api';

// Simple component for debugging login issues
// Uses 'any' types to avoid TypeScript errors
const SignInDebugger = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  
  // Safely access the login function from auth context
  const auth: any = useAuth();
  const login = auth?.login || (async () => ({ success: false, error: 'Auth context not available' }));

  // Get and display API base URL for debugging
  useEffect(() => {
    setApiBaseUrl(API_BASE_URL);
    console.log('Debug: API_BASE_URL =', API_BASE_URL);

    // Check if token exists
    const existingToken = localStorage.getItem('token');
    console.log('Debug: Existing token found?', !!existingToken);
    
    // Check API health
    checkApiHealth();
  }, []);

  // API health check
  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Debug: API health check status:', response.status);
      if (response.ok) {
        addDebugInfo('✅ API server is reachable');
      } else {
        addDebugInfo(`❌ API server returned status ${response.status}`);
      }
    } catch (error: any) {
      console.error('Debug: API health check failed:', error);
      addDebugInfo(`❌ API server is not reachable: ${error?.message || String(error)}`);
    }
  };

  // Add debug information
  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => `${prev}\n${info}`);
    console.log('Debug:', info);
  };

  // Test direct API call
  const testDirectApiCall = async () => {
    addDebugInfo(`🔍 Testing direct API call to ${API_BASE_URL}/auth/login`);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
        addDebugInfo(`📊 API response status: ${response.status}`);
        addDebugInfo(`📊 API response data: ${JSON.stringify(responseData, null, 2)}`);
      } catch (e) {
        addDebugInfo(`📊 API response status: ${response.status}`);
        addDebugInfo(`📊 API response is not JSON: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`);
      }
      
      if (!response.ok) {
        addDebugInfo(`❌ API request failed with status ${response.status}`);
      } else {
        addDebugInfo(`✅ API request succeeded, has token: ${!!responseData?.token}, has user: ${!!responseData?.user}`);
      }
    } catch (error: any) {
      addDebugInfo(`❌ API request failed with error: ${error?.message || String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission using useAuth hook
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Reset error states
    setError('');
    setNetworkError(false);
    setLoading(true);
    addDebugInfo(`🔄 Starting login attempt for email: ${email}`);

    // Simple validation
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      addDebugInfo('❌ Validation failed: Email and password are required');
      return;
    }

    try {
      addDebugInfo('🔄 Calling login method from useAuth hook');
      const result = await login({ email, password });
      
      addDebugInfo(`📊 Login result: ${JSON.stringify(result)}`);
      
      if (!result.success) {
        if (result.error?.includes('Network error') || result.error?.includes('timed out')) {
          setNetworkError(true);
          setError(result.error);
          addDebugInfo(`❌ Network error: ${result.error}`);
        } else {
          setError(result.error || 'Invalid email or password');
          addDebugInfo(`❌ Login failed: ${result.error || 'Invalid email or password'}`);
        }
      } else {
        addDebugInfo('✅ Login successful');
      }
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      setError('An unexpected error occurred');
      addDebugInfo(`❌ Unexpected error: ${errorMessage}`);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = () => {
    setNetworkError(false);
    addDebugInfo('🔄 Retrying connection');
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6 font-bold text-center">Sign In (Debug Mode)</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            {networkError && (
              <div className="mt-2">
                <button 
                  onClick={retryConnection}
                  className="bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Retry Connection
                </button>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-2 mb-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded transition duration-200 flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
            
            <button
              type="button"
              onClick={testDirectApiCall}
              disabled={loading || !email || !password}
              className={`flex-1 ${loading || !email || !password ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white py-2 rounded transition duration-200`}
            >
              Test Direct API
            </button>
          </div>
        </form>
        
        {/* Debug Information Panel */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          
          <div className="bg-gray-100 p-4 rounded border border-gray-300">
            <p className="mb-2"><strong>API URL:</strong> {apiBaseUrl}</p>
            
            <div className="mb-4">
              <button 
                onClick={checkApiHealth}
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
              >
                Check API Health
              </button>
            </div>
            
            <div className="text-xs font-mono whitespace-pre-wrap bg-gray-800 text-green-400 p-4 rounded max-h-60 overflow-y-auto">
              {debugInfo || 'No debug information available yet.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInDebugger; 