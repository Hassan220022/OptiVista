import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  icon: string;
}

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStat[]>([
    { title: 'Products', value: 0, description: 'Your active products', icon: '📦' },
    { title: 'Orders', value: 0, description: 'Pending orders', icon: '🛒' },
    { title: 'Sales', value: 0, description: 'This month ($)', icon: '💰' },
    { title: 'Rating', value: 0, description: 'Customer satisfaction', icon: '⭐' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, fetch data from your API with seller's ID
        // For now, we'll use mock data
        setStats([
          { title: 'Products', value: 24, description: 'Your active products', icon: '📦' },
          { title: 'Orders', value: 12, description: 'Pending orders', icon: '🛒' },
          { title: 'Sales', value: 3200, description: 'This month ($)', icon: '💰' },
          { title: 'Rating', value: 4.7, description: 'Customer satisfaction', icon: '⭐' },
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
            <span className="text-xl font-bold text-blue-600">Seller Dashboard</span>
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
                {stat.title === 'Sales' ? `$${stat.value.toLocaleString()}` : 
                 stat.title === 'Rating' ? stat.value : stat.value.toLocaleString()}
              </div>
              <p className="text-gray-500 text-center">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/seller/products" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-blue-600">Manage Products</h3>
            <p className="text-gray-600 mb-4">Add, edit, and manage your product listings.</p>
            <div className="text-blue-600 font-semibold">View Products →</div>
          </Link>

          <Link to="/seller/orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-blue-600">Track Orders</h3>
            <p className="text-gray-600 mb-4">View and manage your customer orders.</p>
            <div className="text-blue-600 font-semibold">View Orders →</div>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-gray-500">Today, 10:30 AM</div>
              <div className="font-semibold">New order received</div>
              <div className="text-gray-600">Order #12345 - $120.00</div>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-500">Yesterday, 3:45 PM</div>
              <div className="font-semibold">Product stock low</div>
              <div className="text-gray-600">Product "Wireless Headphones" is running low on stock (2 left)</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm text-gray-500">Yesterday, 9:15 AM</div>
              <div className="font-semibold">New review received</div>
              <div className="text-gray-600">⭐⭐⭐⭐⭐ for "Smart Watch" - "Great quality and fast shipping!"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard; 