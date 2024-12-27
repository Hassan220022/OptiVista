import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Package, ShoppingCart } from 'lucide-react';
import { ProductList } from '../products/ProductList';
import { OrderList } from '../orders/OrderList';

const stats = [
  { title: 'Total Sales', value: '$12,345', icon: BarChart3, change: '+12%' },
  { title: 'Active Users', value: '1,234', icon: Users, change: '+3%' },
  { title: 'Products', value: '345', icon: Package, change: '+5%' },
  { title: 'Pending Orders', value: '23', icon: ShoppingCart, change: '-2%' },
];

const DashboardView: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterNewUser = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleRegisterNewUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Register New User
          </button>
        </div>
      </nav>
      <div className="p-4">
        <h2 className="text-2xl">Welcome to the Admin Dashboard!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {stats.map((stat, index) => (
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
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Orders</h3>
          <ProductList/>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Products</h3>
          <OrderList/>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;