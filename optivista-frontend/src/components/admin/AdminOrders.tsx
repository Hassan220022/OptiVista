import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  sellerId: string;
  sellerName: string;
  date: string;
}

const AdminOrders = () => {
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for now
        setTimeout(() => {
          const mockOrders = [
            {
              id: 'ORD-001',
              customerName: 'Alex Johnson',
              customerEmail: 'alex@example.com',
              total: 109.98,
              items: [
                {
                  productId: '1',
                  productName: 'Wireless Headphones',
                  quantity: 1,
                  price: 89.99,
                },
                {
                  productId: '2',
                  productName: 'Smartphone Case',
                  quantity: 1,
                  price: 19.99,
                },
              ],
              status: 'delivered',
              sellerId: '1',
              sellerName: 'John Doe',
              date: '2023-03-15',
            },
            {
              id: 'ORD-002',
              customerName: 'Emily Parker',
              customerEmail: 'emily@example.com',
              total: 59.99,
              items: [
                {
                  productId: '3',
                  productName: 'Bluetooth Speaker',
                  quantity: 1,
                  price: 59.99,
                },
              ],
              status: 'shipped',
              sellerId: '2',
              sellerName: 'Jane Smith',
              date: '2023-03-18',
            },
            {
              id: 'ORD-003',
              customerName: 'Michael Brown',
              customerEmail: 'michael@example.com',
              total: 249.98,
              items: [
                {
                  productId: '5',
                  productName: 'Smart Watch',
                  quantity: 1,
                  price: 199.99,
                },
                {
                  productId: '6',
                  productName: 'Desk Lamp',
                  quantity: 1,
                  price: 29.99,
                },
                {
                  productId: '2',
                  productName: 'Smartphone Case',
                  quantity: 1,
                  price: 19.99,
                },
              ],
              status: 'pending',
              sellerId: '4',
              sellerName: 'Sarah Williams',
              date: '2023-03-20',
            },
            {
              id: 'ORD-004',
              customerName: 'David Wilson',
              customerEmail: 'david@example.com',
              total: 49.99,
              items: [
                {
                  productId: '4',
                  productName: 'Laptop Backpack',
                  quantity: 1,
                  price: 49.99,
                },
              ],
              status: 'processing',
              sellerId: '3',
              sellerName: 'Michael Johnson',
              date: '2023-03-21',
            },
            {
              id: 'ORD-005',
              customerName: 'Lisa Taylor',
              customerEmail: 'lisa@example.com',
              total: 109.98,
              items: [
                {
                  productId: '3',
                  productName: 'Bluetooth Speaker',
                  quantity: 1,
                  price: 59.99,
                },
                {
                  productId: '6',
                  productName: 'Desk Lamp',
                  quantity: 1,
                  price: 29.99,
                },
                {
                  productId: '2',
                  productName: 'Smartphone Case',
                  quantity: 1,
                  price: 19.99,
                },
              ],
              status: 'cancelled',
              sellerId: '2',
              sellerName: 'Jane Smith',
              date: '2023-03-17',
            },
          ] as Order[];
          setOrders(mockOrders);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setError('Failed to fetch orders');
        setIsLoading(false);
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      // In a real app, send request to API
      // For now, just update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
    } catch (error) {
      setError('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders
    .filter(order => {
      // Search by order ID, customer name, or customer email
      const matchesSearch = searchTerm === '' || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      // Filter by seller
      const matchesSeller = sellerFilter === 'all' || order.sellerId === sellerFilter;
      
      return matchesSearch && matchesStatus && matchesSeller;
    });

  // Extract unique sellers for filter dropdown
  const sellers = [
    { id: 'all', name: 'All Sellers' },
    ...orders.reduce((acc, order) => {
      if (!acc.find(seller => seller.id === order.sellerId)) {
        acc.push({ id: order.sellerId, name: order.sellerName });
      }
      return acc;
    }, [] as { id: string; name: string }[]),
  ];

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'processing': return 'bg-blue-200 text-blue-800';
      case 'shipped': return 'bg-purple-200 text-purple-800';
      case 'delivered': return 'bg-green-200 text-green-800';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
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
            <span className="text-xl font-bold text-blue-600">All Orders</span>
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
            <h2 className="text-2xl font-bold">Order Management</h2>
            
            <div className="flex flex-wrap gap-4">
              {/* Search Input */}
              <div className="flex-grow min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              {/* Seller Filter */}
              <select
                value={sellerFilter}
                onChange={(e) => setSellerFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                {sellers.map(seller => (
                  <option key={seller.id} value={seller.id}>{seller.name}</option>
                ))}
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
              <p className="mt-2">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Order ID</th>
                    <th className="py-3 px-6 text-left">Customer</th>
                    <th className="py-3 px-6 text-left">Seller</th>
                    <th className="py-3 px-6 text-right">Total</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-center">Date</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">
                        No orders found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left font-medium">
                          {order.id}
                        </td>
                        <td className="py-3 px-6 text-left">
                          <div>{order.customerName}</div>
                          <div className="text-xs text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="py-3 px-6 text-left">
                          {order.sellerName}
                        </td>
                        <td className="py-3 px-6 text-right font-medium">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span 
                            className={`py-1 px-3 rounded-full text-xs ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-500 hover:text-blue-700 transform hover:scale-110"
                            >
                              View
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Order Details: {selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Order Information</h3>
                <p><span className="font-medium">Date:</span> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 py-1 px-3 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><span className="font-medium">Seller:</span> {selectedOrder.sellerName}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4 text-left border">Product</th>
                    <th className="py-2 px-4 text-center border">Quantity</th>
                    <th className="py-2 px-4 text-right border">Price</th>
                    <th className="py-2 px-4 text-right border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4 border">{item.productName}</td>
                      <td className="py-2 px-4 text-center border">{item.quantity}</td>
                      <td className="py-2 px-4 text-right border">${item.price.toFixed(2)}</td>
                      <td className="py-2 px-4 text-right border">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="py-2 px-4 text-right font-medium border">Order Total:</td>
                    <td className="py-2 px-4 text-right font-bold border">${selectedOrder.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'pending')}
                  className={`py-1 px-3 rounded ${selectedOrder.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                  className={`py-1 px-3 rounded ${selectedOrder.status === 'processing' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-300'}`}
                >
                  Processing
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'shipped')}
                  className={`py-1 px-3 rounded ${selectedOrder.status === 'shipped' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800 hover:bg-purple-300'}`}
                >
                  Shipped
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                  className={`py-1 px-3 rounded ${selectedOrder.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800 hover:bg-green-300'}`}
                >
                  Delivered
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                  className={`py-1 px-3 rounded ${selectedOrder.status === 'cancelled' ? 'bg-red-600 text-white' : 'bg-red-200 text-red-800 hover:bg-red-300'}`}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 