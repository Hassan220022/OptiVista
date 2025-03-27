import React, { useState, useEffect } from 'react';

interface LoaderProps {
  // Time in milliseconds before showing the error message
  timeout?: number;
}

const Loader = ({ timeout = 5000 }: LoaderProps) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
        <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        
        {showMessage && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mt-4 max-w-md mx-auto text-left">
            <p className="font-medium mb-2">Taking longer than expected</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>The API server may not be running</li>
              <li>Check your network connection</li>
              <li>Try refreshing the page</li>
              <li>Make sure the backend service is available at http://localhost:3000/api</li>
            </ul>
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader; 