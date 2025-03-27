import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  icon: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStat[]>([
    { title: 'Total Sellers', value: 0, description: 'Active seller accounts', icon: '👥' },
    { title: 'Total Products', value: 0, description: 'Products in the system', icon: '📦' },
    { title: 'Total Orders', value: 0, description: 'Orders processed', icon: '🛒' },
    { title: 'Revenue', value: 0, description: 'Total revenue ($)', icon: '💰' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, fetch data from your API
        // For now, we'll use mock data
        setStats([
          { title: 'Total Sellers', value: 8, description: 'Active seller accounts', icon: '👥' },
          { title: 'Total Products', value: 145, description: 'Products in the system', icon: '📦' },
          { title: 'Total Orders', value: 278, description: 'Orders processed', icon: '🛒' },
          { title: 'Revenue', value: 12540, description: 'Total revenue ($)', icon: '💰' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.firstName} {user?.lastName}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <h3 className="text-xl font-bold">{stat.title}</h3>
              <div className="text-3xl font-bold text-blue-600 my-2">
                {stat.title === 'Revenue' ? `$${stat.value.toLocaleString()}` : stat.value.toLocaleString()}
              </div>
              <p className="text-gray-500 text-center">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/sellers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-blue-600">Manage Sellers</h3>
            <p className="text-gray-600 mb-4">View, add, and manage seller accounts.</p>
            <div className="text-blue-600 font-semibold">View Sellers →</div>
          </Link>

          <Link to="/admin/products" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-blue-600">Products</h3>
            <p className="text-gray-600 mb-4">View and manage all products in the system.</p>
            <div className="text-blue-600 font-semibold">View Products →</div>
          </Link>

          <Link to="/admin/orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-blue-600">Orders</h3>
            <p className="text-gray-600 mb-4">Track and manage all customer orders.</p>
            <div className="text-blue-600 font-semibold">View Orders →</div>
          </Link>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/register-user"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Register New Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 