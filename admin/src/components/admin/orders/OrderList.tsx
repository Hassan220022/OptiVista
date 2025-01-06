import React, { useEffect, useState } from 'react';
import { SearchInput } from '../../common/SearchInput';
import { OrderTable } from './OrderTable';
import type { Order } from '../../../types/order';
import { orderApi } from '../../../services/apiService'; // Import the API service

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getOrders(); // Use the API service
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      <div className="mb-6">
        <SearchInput
          placeholder="Search by shipping address or payment method..."
          onSearch={setSearchTerm}
        />
      </div>
      <OrderTable orders={filteredOrders} />
    </div>
  );
};

export default OrderList;