export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: string;
  sellerId: string;
}

export default Order;