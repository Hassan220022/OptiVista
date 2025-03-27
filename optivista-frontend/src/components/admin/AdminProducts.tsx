import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sellerId: string;
  sellerName: string;
  status: 'active' | 'inactive';
  dateAdded: string;
}

const AdminProducts = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for now
        setTimeout(() => {
          const mockProducts = [
            {
              id: '1',
              name: 'Wireless Headphones',
              price: 89.99,
              stock: 45,
              category: 'Electronics',
              sellerId: '1',
              sellerName: 'John Doe',
              status: 'active',
              dateAdded: '2023-01-15',
            },
            {
              id: '2',
              name: 'Smartphone Case',
              price: 19.99,
              stock: 120,
              category: 'Accessories',
              sellerId: '1',
              sellerName: 'John Doe',
              status: 'active',
              dateAdded: '2023-02-10',
            },
            {
              id: '3',
              name: 'Bluetooth Speaker',
              price: 59.99,
              stock: 30,
              category: 'Electronics',
              sellerId: '2',
              sellerName: 'Jane Smith',
              status: 'inactive',
              dateAdded: '2023-01-18',
            },
            {
              id: '4',
              name: 'Laptop Backpack',
              price: 49.99,
              stock: 78,
              category: 'Accessories',
              sellerId: '3',
              sellerName: 'Michael Johnson',
              status: 'active',
              dateAdded: '2023-03-05',
            },
            {
              id: '5',
              name: 'Smart Watch',
              price: 199.99,
              stock: 25,
              category: 'Electronics',
              sellerId: '4',
              sellerName: 'Sarah Williams',
              status: 'active',
              dateAdded: '2023-02-20',
            },
            {
              id: '6',
              name: 'Desk Lamp',
              price: 29.99,
              stock: 60,
              category: 'Home',
              sellerId: '2',
              sellerName: 'Jane Smith',
              status: 'active',
              dateAdded: '2023-03-12',
            },
          ] as Product[];
          setProducts(mockProducts);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setError('Failed to fetch products');
        setIsLoading(false);
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      // In a real app, send request to API
      // For now, just update local state
      setProducts(products.map(product => 
        product.id === id 
          ? { ...product, status: currentStatus === 'active' ? 'inactive' : 'active' } 
          : product
      ));
    } catch (error) {
      setError('Failed to update product status');
      console.error('Error updating product status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // In a real app, send request to API
        // For now, just update local state
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        setError('Failed to delete product');
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products
    .filter(product => {
      // Search by name
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

  // Extract unique categories for filter dropdown
  const categories = ['all', ...new Set(products.map(product => product.category))];

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
            <span className="text-xl font-bold text-blue-600">All Products</span>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">All Products</h2>
            
            <div className="flex flex-wrap gap-4">
              {/* Search Input */}
              <div className="flex-grow min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search products or sellers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Product</th>
                    <th className="py-3 px-6 text-right">Price</th>
                    <th className="py-3 px-6 text-center">Stock</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-left">Seller</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Date Added</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-gray-500">
                        No products found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">
                          {product.name}
                        </td>
                        <td className="py-3 px-6 text-right font-medium">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-6 text-center">
                          {product.stock}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {product.category}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {product.sellerName}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span 
                            className={`py-1 px-3 rounded-full text-xs ${
                              product.status === 'active' 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          {new Date(product.dateAdded).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center gap-2">
                            <button
                              onClick={() => handleStatusToggle(product.id, product.status)}
                              className={`transform hover:scale-110 ${
                                product.status === 'active' 
                                  ? 'text-orange-500 hover:text-orange-700' 
                                  : 'text-green-500 hover:text-green-700'
                              }`}
                            >
                              {product.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:text-red-700 transform hover:scale-110"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts; 