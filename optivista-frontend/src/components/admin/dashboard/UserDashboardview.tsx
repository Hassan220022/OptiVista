import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Plus } from 'lucide-react';
import { ProductList } from '../products/ProductList';
import { OrderList } from '../orders/OrderList';
import { ProductForm } from '../products/ProductForm';

const initialStats = [
  { title: 'My Sales', value: '$0', icon: BarChart3, change: '0%' },
  { title: 'My Products', value: '0', icon: Package, change: '0%' },
  { title: 'My Orders', value: '0', icon: ShoppingCart, change: '0%' },
];

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [statistics, setStatistics] = useState(initialStats);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'addProduct'>('products');
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    // Get seller info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setSeller(user);
        fetchSellerData(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Set active tab based on the current path
    const path = location.pathname;
    if (path.includes('/add-product')) {
      setActiveTab('addProduct');
    } else if (path.includes('/orders')) {
      setActiveTab('orders');
    } else {
      setActiveTab('products');
    }
  }, [location.pathname]);

  const fetchSellerData = async (sellerId: string) => {
    try {
      // Mock API call - replace with actual backend call
      // const response = await fetch(`http://localhost:3000/api/sellers/${sellerId}/statistics`);
      // const data = await response.json();
      
      // For now, use mock data
      setStatistics([
        { title: 'My Sales', value: '$4,325', icon: BarChart3, change: '+15%' },
        { title: 'My Products', value: '12', icon: Package, change: '+8%' },
        { title: 'My Orders', value: '45', icon: ShoppingCart, change: '+20%' },
      ]);
    } catch (error) {
      console.error('Error fetching seller statistics:', error);
    }
  };

  const handleTabChange = (tab: 'products' | 'orders' | 'addProduct') => {
    setActiveTab(tab);
    const basePath = '/seller-dashboard';
    switch (tab) {
      case 'addProduct':
        navigate(`${basePath}/add-product`);
        break;
      case 'orders':
        navigate(`${basePath}/orders`);
        break;
      case 'products':
      default:
        navigate(`${basePath}/products`);
        break;
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Seller Dashboard</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => handleTabChange('addProduct')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Product
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
        <h2 className="text-2xl">Welcome to your Seller Dashboard{seller && `, ${seller.firstName}`}!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <div className="flex items-center">
                <stat.icon className="h-6 w-6 text-blue-500" />
                <div className="ml-2">
                  <h3 className="text-lg font-semibold">{stat.title}</h3>
                  <p className="text-xl">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
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
              onClick={() => handleTabChange('products')}
              className={`py-4 px-1 ${activeTab === 'products' 
                ? 'border-b-2 border-blue-500 font-medium text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Products
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`py-4 px-1 ${activeTab === 'orders' 
                ? 'border-b-2 border-blue-500 font-medium text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Orders
            </button>
            <button
              onClick={() => handleTabChange('addProduct')}
              className={`py-4 px-1 ${activeTab === 'addProduct' 
                ? 'border-b-2 border-blue-500 font-medium text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Add New Product
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="mt-6">
          <Routes>
            <Route path="/" element={<Navigate to="products" replace />} />
            <Route path="products" element={
              <div>
                <h3 className="text-xl font-semibold mb-4">My Products</h3>
                <ProductList sellerId={seller?.id} />
              </div>
            } />
            <Route path="orders" element={
              <div>
                <h3 className="text-xl font-semibold mb-4">My Orders</h3>
                <OrderList sellerId={seller?.id} />
              </div>
            } />
            <Route path="add-product" element={
              <div>
                <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
                <ProductForm sellerId={seller?.id} onSubmitSuccess={() => handleTabChange('products')} />
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;