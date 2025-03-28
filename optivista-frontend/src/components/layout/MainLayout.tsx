import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { NotificationContainer } from '../ui/Notification';
import { useNotification } from '../../hooks/useNotification';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications } = useNotification();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header component */}
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        
        {/* Main content */}
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 mx-auto sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Notification container */}
      <NotificationContainer>
        {notifications.map((notification) => (
          <notification.component key={notification.id} {...notification.props} />
        ))}
      </NotificationContainer>
    </div>
  );
};

export default MainLayout; 