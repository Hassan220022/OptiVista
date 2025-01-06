export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  userId: number; // Added to match backend schema
  productId: number;
  quantity: number;
  status: OrderStatus;
  totalPrice: number; // Changed from `total` to match backend schema
  shippingAddress: string; // Added to match backend schema
  paymentMethod: string; // Added to match backend schema
  createdAt: string; // Matches backend schema
  updatedAt?: string; // Optional, matches backend schema
}