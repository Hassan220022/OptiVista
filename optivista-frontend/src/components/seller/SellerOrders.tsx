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
  date: string;
}

const SellerOrders = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch orders for this specific seller by their ID
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
              date: '2023-03-15',
            },
            {
              id: 'ORD-006',
              customerName: 'Thomas Miller',
              customerEmail: 'thomas@example.com',
              total: 89.99,
              items: [
                {
                  productId: '1',
                  productName: 'Wireless Headphones',
                  quantity: 1,
                  price: 89.99,
                },
              ],
              status: 'pending',
              date: '2023-03-22',
            },
            {
              id: 'ORD-008',
              customerName: 'Jessica Adams',
              customerEmail: 'jessica@example.com',
              total: 139.98,
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
                  quantity: 2,
                  price: 19.99,
                },
                {
                  productId: '2',
                  productName: 'Screen Protector',
                  quantity: 1,
                  price: 9.99,
                },
              ],
              status: 'processing',
              date: '2023-03-21',
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
      
      return matchesSearch && matchesStatus;
    });

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

  // Count orders by status
  const orderStats = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    total: orders.length
  };

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
            <span className="text-xl font-bold text-blue-600">My Orders</span>
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
        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <div className="text-sm text-gray-500">Processing</div>
            <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <div className="text-sm text-gray-500">Shipped</div>
            <div className="text-2xl font-bold text-purple-600">{orderStats.shipped}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <div className="text-sm text-gray-500">Delivered</div>
            <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold">{orderStats.total}</div>
          </div>
        </div>

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
                    <th className="py-3 px-6 text-right">Total</th>
                    <th className="py-3 px-6 text-center">Items</th>
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
                        <td className="py-3 px-6 text-right font-medium">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-6 text-center">
                          {order.items.length}
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
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <>
                    {selectedOrder.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                        className="py-1 px-3 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Mark as Processing
                      </button>
                    )}
                    
                    {selectedOrder.status === 'processing' && (
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'shipped')}
                        className="py-1 px-3 rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    
                    {selectedOrder.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                        className="py-1 px-3 rounded bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                      className="py-1 px-3 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Cancel Order
                    </button>
                  </>
                )}
                
                {(selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled') && (
                  <div className="text-gray-600">
                    This order is {selectedOrder.status} and cannot be updated.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders; 