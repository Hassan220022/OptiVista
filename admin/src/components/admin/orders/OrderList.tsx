import React, { useState } from 'react';
import { SearchInput } from '../../common/SearchInput';
import { OrderTable } from './OrderTable';
import type { Order } from '../../../types/order';

const initialOrders: Order[] = [
  {
    id: 1,
    productId: 1,
    quantity: 2,
    status: 'pending',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    total: 199.98,
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: 2,
    productId: 2,
    quantity: 1,
    status: 'shipped',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    total: 149.99,
    createdAt: '2024-03-09T15:30:00Z'
  }
];

export function OrderList() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (orderId: number, status: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      
      <div className="mb-6">
        <SearchInput
          placeholder="Search by customer name or email..."
          onSearch={setSearchTerm}
        />
      </div>

      <OrderTable 
        orders={filteredOrders}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}