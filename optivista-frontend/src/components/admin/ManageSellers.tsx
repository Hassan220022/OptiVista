import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SellerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'inactive';
  productsCount: number;
  totalSales: number;
  joinedDate: string;
}

const ManageSellers = () => {
  const { logout } = useAuth();
  const [sellers, setSellers] = useState<SellerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for now
        setTimeout(() => {
          setSellers([
            {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              status: 'active',
              productsCount: 24,
              totalSales: 4850,
              joinedDate: '2023-01-15',
            },
            {
              id: '2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com',
              status: 'active',
              productsCount: 16,
              totalSales: 3200,
              joinedDate: '2023-02-10',
            },
            {
              id: '3',
              firstName: 'Michael',
              lastName: 'Johnson',
              email: 'michael.j@example.com',
              status: 'inactive',
              productsCount: 8,
              totalSales: 1450,
              joinedDate: '2023-03-05',
            },
            {
              id: '4',
              firstName: 'Sarah',
              lastName: 'Williams',
              email: 'sarah.w@example.com',
              status: 'active',
              productsCount: 32,
              totalSales: 5780,
              joinedDate: '2023-01-20',
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setError('Failed to fetch sellers');
        setIsLoading(false);
        console.error('Error fetching sellers:', error);
      }
    };

    fetchSellers();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      // In a real app, send request to API
      // For now, just update local state
      setSellers(sellers.map(seller => 
        seller.id === id 
          ? { ...seller, status: currentStatus === 'active' ? 'inactive' : 'active' } 
          : seller
      ));
    } catch (error) {
      setError('Failed to update seller status');
      console.error('Error updating seller status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this seller? This action cannot be undone.')) {
      try {
        // In a real app, send request to API
        // For now, just update local state
        setSellers(sellers.filter(seller => seller.id !== id));
      } catch (error) {
        setError('Failed to delete seller');
        console.error('Error deleting seller:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/admin-dashboard" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-xl font-bold text-blue-600">Manage Sellers</span>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Seller Accounts</h2>
            <Link
              to="/admin/register-user"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Add New Seller
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2">Loading sellers...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Products</th>
                    <th className="py-3 px-6 text-center">Sales</th>
                    <th className="py-3 px-6 text-center">Joined</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {sellers.map((seller) => (
                    <tr key={seller.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {seller.firstName} {seller.lastName}
                      </td>
                      <td className="py-3 px-6 text-left">{seller.email}</td>
                      <td className="py-3 px-6 text-center">
                        <span 
                          className={`py-1 px-3 rounded-full text-xs ${
                            seller.status === 'active' 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {seller.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">{seller.productsCount}</td>
                      <td className="py-3 px-6 text-center">${seller.totalSales.toLocaleString()}</td>
                      <td className="py-3 px-6 text-center">{new Date(seller.joinedDate).toLocaleDateString()}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center gap-2">
                          <button
                            onClick={() => handleStatusToggle(seller.id, seller.status)}
                            className={`transform hover:scale-110 ${
                              seller.status === 'active' 
                                ? 'text-orange-500 hover:text-orange-700' 
                                : 'text-green-500 hover:text-green-700'
                            }`}
                          >
                            {seller.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(seller.id)}
                            className="text-red-500 hover:text-red-700 transform hover:scale-110"
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
      </div>
    </div>
  );
};

export default ManageSellers; 