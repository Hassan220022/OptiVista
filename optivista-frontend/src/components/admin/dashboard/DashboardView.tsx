import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BarChart3, Users, Package, ShoppingCart } from 'lucide-react';
import { ProductList } from '../products/ProductList';
import { OrderList } from '../orders/OrderList';
import { sellersApi, statisticsApi } from '../../../services/api';

const initialStats = [
  { title: 'Total Sales', value: '$0', icon: BarChart3, change: '0%' },
  { title: 'Active Sellers', value: '0', icon: Users, change: '0%' },
  { title: 'Products', value: '0', icon: Package, change: '0%' },
  { title: 'Pending Orders', value: '0', icon: ShoppingCart, change: '0%' },
];

interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended';
  products: number;
  orders: number;
}

const DashboardView = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(initialStats);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'sellers'>('sellers');

  useEffect(() => {
    // Fetch sellers data and statistics on component mount
    fetchSellers();
    fetchStatistics();
    
    // Set active tab based on the current path
    const path = location.pathname;
    if (path.includes('/products')) {
      setActiveTab('products');
    } else if (path.includes('/orders')) {
      setActiveTab('orders');
    } else {
      setActiveTab('sellers');
    }
  }, [location.pathname]);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      // Real API call to get sellers from database
      const data = await sellersApi.getAll();
      setSellers(data);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Real API call to get statistics from database
      const data = await statisticsApi.getAdminStats();
      
      // Transform the data to match the statistics format
      setStatistics([
        { title: 'Total Sales', value: `$${data.totalSales.toFixed(2)}`, icon: BarChart3, change: `${data.salesChange}%` },
        { title: 'Active Sellers', value: data.activeSellers.toString(), icon: Users, change: `${data.sellersChange}%` },
        { title: 'Products', value: data.totalProducts.toString(), icon: Package, change: `${data.productsChange}%` },
        { title: 'Pending Orders', value: data.pendingOrders.toString(), icon: ShoppingCart, change: `${data.ordersChange}%` },
      ]);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleRegisterNewSeller = () => {
    navigate('/admin/register-seller');
  };

  const handleSellerStatusChange = async (sellerId: string, newStatus: 'active' | 'suspended') => {
    try {
      // Real API call to update seller status
      await sellersApi.updateStatus(sellerId, newStatus);
      
      // Update local state after success
      setSellers(sellers.map(seller => 
        seller.id === sellerId ? { ...seller, status: newStatus } : seller
      ));
      
      // Refresh statistics after status change
      fetchStatistics();
    } catch (error) {
      console.error('Error updating seller status:', error);
    }
  };

  const handleDeleteSeller = async (sellerId: string) => {
    if (!window.confirm('Are you sure you want to delete this seller? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Real API call to delete seller
      await sellersApi.delete(sellerId);
      
      // Update local state after success
      setSellers(sellers.filter(seller => seller.id !== sellerId));
      
      // Refresh statistics after deletion
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleTabChange = (tab: 'products' | 'orders' | 'sellers') => {
    setActiveTab(tab);
    const basePath = '/admin-dashboard';
    switch (tab) {
      case 'products':
        navigate(`${basePath}/products`);
        break;
      case 'orders':
        navigate(`${basePath}/orders`);
        break;
      case 'sellers':
      default:
        navigate(`${basePath}/sellers`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleRegisterNewSeller}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Register New Seller
            </button>
            <button
              onClick={handleSignOut}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="p-4">
        <h2 className="text-2xl">Welcome to the Admin Dashboard!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <div className="flex items-center">
                <stat.icon className="h-6 w-6 text-blue-500" />
                <div className="ml-2">
                  <h3 className="text-lg font-semibold">{stat.title}</h3>
                  <p className="text-xl">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                    {stat.change.startsWith('-') ? '' : '+'}{stat.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tab navigation */}
        <div className="mt-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => handleTabChange('sellers')}
              className={`py-4 px-1 ${activeTab === 'sellers' 
                ? 'border-b-2 border-blue-500 font-medium text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sellers
            </button>
            <button
              onClick={() => handleTabChange('products')}
              className={`py-4 px-1 ${activeTab === 'products' 
                ? 'border-b-2 border-blue-500 font-medium text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Products
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`py-4 px-1 ${activeTab === 'orders' 
                ? 'border-b-2 border-blue-500 font-medium text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Orders
            </button>
          </nav>
        </div>
        
        {/* Tab content using Routes */}
        <div className="mt-6">
          <Routes>
            <Route path="/" element={<Navigate to="sellers" replace />} />
            <Route path="sellers" element={
              <div>
                <h3 className="text-xl font-semibold mb-4">Manage Sellers</h3>
                {loading ? (
                  <p>Loading sellers...</p>
                ) : sellers.length === 0 ? (
                  <p>No sellers found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left">Name</th>
                          <th className="py-3 px-4 text-left">Email</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Products</th>
                          <th className="py-3 px-4 text-left">Orders</th>
                          <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellers.map((seller) => (
                          <tr key={seller.id} className="border-t border-gray-200">
                            <td className="py-3 px-4">{`${seller.firstName} ${seller.lastName}`}</td>
                            <td className="py-3 px-4">{seller.email}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                seller.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {seller.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{seller.products}</td>
                            <td className="py-3 px-4">{seller.orders}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSellerStatusChange(
                                    seller.id, 
                                    seller.status === 'active' ? 'suspended' : 'active'
                                  )}
                                  className={`text-xs px-2 py-1 rounded ${
                                    seller.status === 'active' 
                                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                                  }`}
                                >
                                  {seller.status === 'active' ? 'Suspend' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleDeleteSeller(seller.id)}
                                  className="bg-red-100 text-red-800 hover:bg-red-200 text-xs px-2 py-1 rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            } />
            <Route path="products" element={<ProductList />} />
            <Route path="orders" element={<OrderList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;