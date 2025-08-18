import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye
} from 'lucide-react';
import Layout from '../../common/Layout';
import { dashboardApi } from '../../../services/apiService';

interface StatCard {
  title: string;
  value: string;
  icon: any;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatCard[]>([
    { title: 'Total Revenue', value: '$12,345', icon: DollarSign, change: '+12%', changeType: 'positive' },
    { title: 'Active Users', value: '1,234', icon: Users, change: '+3%', changeType: 'positive' },
    { title: 'Products', value: '345', icon: Package, change: '+5%', changeType: 'positive' },
    { title: 'Pending Orders', value: '23', icon: ShoppingCart, change: '-2%', changeType: 'negative' },
  ]);

  const [recentOrders] = useState([
    { id: 1, customer: 'John Doe', total: '$125.00', status: 'Completed', date: '2024-01-15' },
    { id: 2, customer: 'Jane Smith', total: '$89.50', status: 'Processing', date: '2024-01-15' },
    { id: 3, customer: 'Bob Johnson', total: '$220.00', status: 'Pending', date: '2024-01-14' },
  ]);

  const [topProducts] = useState([
    { id: 1, name: 'Classic Aviator', sales: 45, revenue: '$4,050', trend: 'up' },
    { id: 2, name: 'Modern Reader', sales: 38, revenue: '$1,748', trend: 'up' },
    { id: 3, name: 'Sport Pro', sales: 22, revenue: '$2,640', trend: 'down' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getAdminStats();
        if (response.data?.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const getChangeIcon = (changeType: string) => {
    return changeType === 'positive' ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getChangeIcon(stat.changeType)}
                        <span className="ml-1">{stat.change}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Orders
            </h3>
            <button
              onClick={() => navigate('/orders')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View all
            </button>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Top Products
            </h3>
            <button
              onClick={() => navigate('/products')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View all
            </button>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {topProducts.map((product) => (
                <li key={product.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Eye className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.sales} sales
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {product.revenue}
                      </div>
                      {product.trend === 'up' ? (
                        <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => navigate('/products/new')}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex-shrink-0">
              <Package className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Add Product</p>
              <p className="text-sm text-gray-500">Create new product listing</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/register')}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Add User</p>
              <p className="text-sm text-gray-500">Register new user</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex-shrink-0">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">View Orders</p>
              <p className="text-sm text-gray-500">Manage customer orders</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">View Reports</p>
              <p className="text-sm text-gray-500">Analytics & insights</p>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardView;