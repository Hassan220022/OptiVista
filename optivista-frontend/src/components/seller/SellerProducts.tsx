import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  dateAdded: string;
  description: string;
  imageSrc: string;
}

const SellerProducts = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    description: '',
    status: 'active',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch products for this specific seller
        // Mock data for now
        setTimeout(() => {
          const mockProducts = [
            {
              id: '1',
              name: 'Wireless Headphones',
              price: 89.99,
              stock: 45,
              category: 'Electronics',
              status: 'active',
              dateAdded: '2023-01-15',
              description: 'High-quality wireless headphones with noise cancellation.',
              imageSrc: 'https://via.placeholder.com/150',
            },
            {
              id: '2',
              name: 'Smartphone Case',
              price: 19.99,
              stock: 120,
              category: 'Accessories',
              status: 'active',
              dateAdded: '2023-02-10',
              description: 'Durable smartphone case with drop protection.',
              imageSrc: 'https://via.placeholder.com/150',
            },
            {
              id: '3',
              name: 'Bluetooth Speaker',
              price: 59.99,
              stock: 30,
              category: 'Electronics',
              status: 'inactive',
              dateAdded: '2023-01-18',
              description: 'Portable Bluetooth speaker with 12-hour battery life.',
              imageSrc: 'https://via.placeholder.com/150',
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, send request to API
      // For now, just update local state
      const id = Math.random().toString(36).substr(2, 9);
      const now = new Date().toISOString().split('T')[0];
      
      const productToAdd: Product = {
        ...newProduct as any,
        id,
        dateAdded: now,
        imageSrc: 'https://via.placeholder.com/150'
      };
      
      setProducts([...products, productToAdd]);
      setNewProduct({
        name: '',
        price: 0,
        stock: 0,
        category: '',
        description: '',
        status: 'active',
      });
      setIsAddModalOpen(false);
    } catch (error) {
      setError('Failed to add product');
      console.error('Error adding product:', error);
    }
  };

  const filteredProducts = products
    .filter(product => {
      // Search by name
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
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
            <Link to="/seller-dashboard" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-xl font-bold text-blue-600">My Products</span>
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
            <h2 className="text-2xl font-bold">My Products</h2>
            
            <div className="flex flex-wrap gap-4">
              {/* Add Product Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Add New Product
              </button>
              
              {/* Search Input */}
              <div className="flex-grow min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search products..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full py-6 text-center text-gray-500">
                  No products found matching your criteria
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative pb-2/3">
                      <img 
                        src={product.imageSrc} 
                        alt={product.name} 
                        className="h-48 w-full object-cover"
                      />
                      <span 
                        className={`absolute top-2 right-2 py-1 px-3 rounded-full text-xs ${
                          product.status === 'active' 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{product.category}</span>
                        <span className="text-gray-500">Added: {new Date(product.dateAdded).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleStatusToggle(product.id, product.status)}
                          className={`py-1 px-3 rounded text-sm ${
                            product.status === 'active' 
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {product.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="py-1 px-3 rounded text-sm bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newProduct.status}
                  onChange={(e) => setNewProduct({...newProduct, status: e.target.value as 'active' | 'inactive'})}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts; 