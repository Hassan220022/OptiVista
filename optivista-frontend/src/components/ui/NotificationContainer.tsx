import React from 'react';
import { useNotification } from '../../hooks/useNotification';

const NotificationContainer: React.FC = () => {
  const { notifications, hideNotification } = useNotification();
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-md">
      {notifications.map((notification) => {
        const { id, message, type } = notification;
        
        // Determine background and icon based on notification type
        let bgColor = 'bg-blue-100 border-blue-500 text-blue-800';
        let iconColor = 'text-blue-500';
        let icon = (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
        
        if (type === 'success') {
          bgColor = 'bg-green-100 border-green-500 text-green-800';
          iconColor = 'text-green-500';
          icon = (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        } else if (type === 'warning') {
          bgColor = 'bg-yellow-100 border-yellow-500 text-yellow-800';
          iconColor = 'text-yellow-500';
          icon = (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          );
        } else if (type === 'error') {
          bgColor = 'bg-red-100 border-red-500 text-red-800';
          iconColor = 'text-red-500';
          icon = (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        }
        
        return (
          <div
            key={id}
            className={`flex items-start p-4 rounded-lg border-l-4 shadow-md ${bgColor} animate-fade-in`}
            role="alert"
          >
            <div className={`flex-shrink-0 mr-3 ${iconColor}`}>
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={() => hideNotification(id)}
              className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationContainer; 