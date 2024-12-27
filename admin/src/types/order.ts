export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  productId: number;
  quantity: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: string;
}