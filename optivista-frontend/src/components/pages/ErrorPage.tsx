import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { ROUTES } from '../../utils/constants';

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
  isApiError?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 500,
  title = 'An error occurred',
  message = 'Something went wrong. Please try again later.',
  isApiError = false,
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (isApiError) {
      // If it's an API error, reload the page to try again
      window.location.reload();
    } else {
      // Otherwise, navigate back to the previous page
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6">
          {statusCode === 404 ? (
            <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : isApiError ? (
            <svg className="w-24 h-24 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-24 h-24 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {statusCode === 404 ? '404 - Page Not Found' : title}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {statusCode === 404 ? 'The page you are looking for doesn\'t exist or has been moved.' : message}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Button variant="primary" onClick={handleRetry}>
            {isApiError ? 'Retry Connection' : statusCode === 404 ? 'Go to Homepage' : 'Try Again'}
          </Button>
          
          {!isApiError && statusCode !== 404 && (
            <Link to={ROUTES.HOME}>
              <Button variant="light">Go to Homepage</Button>
            </Link>
          )}
          
          {isApiError && (
            <Button 
              variant="light" 
              onClick={() => window.open('mailto:support@optivista.com', '_blank')}
            >
              Contact Support
            </Button>
          )}
        </div>
        
        {isApiError && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Connection Troubleshooting</h3>
            <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>Check your internet connection</li>
              <li>Verify that the backend services are running</li>
              <li>Check if the backend URL is correctly configured</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try accessing from a different browser or device</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage; 